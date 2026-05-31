import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AnalysisData, Flag } from "@/data/mockAnalysisData";
import { useToast } from "@/hooks/use-toast";

import {
  PdfHighlighter,
  Highlight,
  Popup,
  AreaHighlight,
} from "react-pdf-highlighter";

import AnnualReport from "../../assets/pdf/AnnualReport.pdf";

import * as pdfjsLib from "pdfjs-dist";

// import "pdfjs-dist/build/pdf.worker.entry";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  data: AnalysisData;
  selectedFlagId: string | null;
  onMarkerClick: (flagId: string) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({
  data,
  selectedFlagId,
  onMarkerClick,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierHeight, setMagnifierHeight] = useState(400);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sentenceHighlights] = useState([
    { id: "h1", x: 50, y: 120, width: 300, height: 20, color: "red", page: 1 },
    {
      id: "h2",
      x: 100,
      y: 180,
      width: 250,
      height: 20,
      color: "yellow",
      page: 1,
    },
    {
      id: "h3",
      x: 80,
      y: 240,
      width: 280,
      height: 20,
      color: "green",
      page: 1,
    },
  ]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // const [textItems, setTextItems] = useState<any[]>([]);
  // const [highlights, setHighlights] = useState<any[]>([]);

  // const onPageLoadSuccess = async (page: any) => {
  //   const textContent = await page.getTextContent();
  //   setTextItems(textContent.items);
  // };

  // console.log(textItems);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const fitWidth = () => setScale(1.0);
  const fitHeight = () => setScale(1.2);
  const resetZoom = () => setScale(1.0);

  const handleMarkerClick = (flag: Flag) => {
    onMarkerClick(flag.id);
    setPageNumber(flag.page);
    toast({
      title: "Flag Selected",
      description: `Viewing: ${flag.title}`,
      duration: 2000,
    });
  };

  const getMarkerColor = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-500 border-red-600";
      case "yellow":
        return "bg-yellow-500 border-yellow-600";
      case "green":
        return "bg-green-500 border-green-600";
      case "blue":
        return "bg-blue-500 border-blue-600";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  const currentPageFlags = data.flags.filter(
    (flag) => flag.page === pageNumber
  );

  // put this inside your PdfViewer component (assumes react-pdf is already set up)
  const dummyHighlights = [
    { text: "in preparing the financial statements", color: "red" },
    {
      text: "the audit or otherwise appears to be materially misstated.",
      color: "yellow",
    },
    {
      text: "the requirements of Companies Act, 2017 (XIX of 2017)",
      color: "green",
    },
    {
      text: "misstatement, whether due to fraud or error, and to issue an auditors’ report that includes our opinion.",
      color: "red",
    },

    {
      text: "Conclude on the appropriateness of management’s use of the going concern basis of accounting",
      color: "yellow",
    },
    {
      text: "Evaluate the overall presentation, structure and content of the financial statements",
      color: "green",
    },
    {
      text: "no zakat deductible at source under the Zakat and Ushr Ordinance, 1980 (XVIII of 1980)",
      color: "red",
    },
  ];

  function highlightText() {
    const bgFor = (color: string) => {
      switch (color) {
        case "red":
          return "hsl(0 84% 60% / 0.35)";
        case "yellow":
          return "rgb(234 179 8 / 0.35)";
        case "green":
          return "rgb(34 197 94 / 0.35)";
        default:
          return "rgba(255, 255, 0, 0.3)";
      }
    };

    const textLayers = document.querySelectorAll(
      ".react-pdf__Page__textContent"
    );
    if (!textLayers.length) return;

    textLayers.forEach((layer) => {
      const spans = Array.from(layer.querySelectorAll("span"));
      spans.forEach((span) => {
        if (!span.textContent || span.dataset.hlProcessed === "true") return;
        let spanText = span.textContent;

        dummyHighlights.forEach(({ text, color }) => {
          const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(escaped, "gi");
          if (regex.test(spanText)) {
            const replaced = spanText.replace(regex, (match) => {
              const bg = bgFor(color);
              return `<mark style="background:${bg}; color:inherit; padding:0 2px; border-radius:2px; mix-blend-mode:multiply; pointer-events:none;">${match}</mark>`;
            });
            span.innerHTML = replaced;
            span.dataset.hlProcessed = "true"; // prevent reapplying multiple times
            spanText = span.textContent || "";
          }
        });
      });
    });
  }

  // ✅ Reapply highlights after every PDF re-render (zoom, pan, resize)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Whenever React-PDF re-renders the text layer, rerun highlight logic
      highlightText();
    });

    // Watch all text layers for mutation (React-PDF replaces them on zoom)
    const container = document.querySelector(".react-pdf__Document");
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
      });
    }

    // Initial highlight on mount
    highlightText();

    return () => observer.disconnect();
  }, [pageNumber, scale]);

  return (
    <div className="h-full flex flex-col bg-muted/20">
      {/* Toolbar */}
      <div className="border-b border-border/20 p-3 flex items-center gap-2 bg-background/50">
        <Button
          variant="outline"
          size="sm"
          onClick={zoomIn}
          className="h-8 w-8 p-0"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={zoomOut}
          className="h-8 w-8 p-0"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        {/* <Button
          variant="outline"
          size="sm"
          onClick={fitWidth}
          className="h-8 px-3"
          title="Fit Width"
        >
          <Minimize className="h-4 w-4 mr-1" />
          Width
        </Button> */}
        {/* <Button
          variant="outline"
          size="sm"
          onClick={fitHeight}
          className="h-8 px-3"
          title="Fit Height"
        >
          <Maximize className="h-4 w-4 mr-1" />
          Height
        </Button> */}

        <Button
          variant="outline"
          size="sm"
          onClick={resetZoom}
          className="h-8 w-8 p-0"
          title="Reset Zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {/* <div className="w-px h-4 bg-border/20 mx-1" /> */}

        {/* <Button
          variant={showMagnifier ? "default" : "outline"}
          size="sm"
          onClick={() => setShowMagnifier(!showMagnifier)}
          className="h-8 w-8 p-0"
          title="Toggle Magnifier"
        >
          <Search className="h-4 w-4" />
        </Button> */}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(true)}
          className="h-8 w-8 p-0"
          title="Fullscreen View"
          style={{ border: "" }}
        >
          <Maximize className="h-4 w-4" />
        </Button>

        {/* Page Navigation */}
        {numPages && numPages > 1 && (
          // absolute bottom-4 left-1/2 transform -translate-x-1/2
          <div className="" style={{ border: "", marginLeft: "auto" }}>
            <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-border/20 rounded-lg px-3 py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                disabled={pageNumber <= 1}
                className="h-7 px-2"
              >
                ←
              </Button>
              <span className="text-sm font-medium min-w-[4rem] text-center">
                {pageNumber} / {numPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPageNumber((prev) => Math.min(prev + 1, numPages))
                }
                disabled={pageNumber >= numPages}
                className="h-7 px-2"
              >
                →
              </Button>
            </div>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <span>Scale: {Math.round(scale * 100)}%</span>
          {numPages && (
            <span>
              Page {pageNumber} of {numPages}
            </span>
          )}
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 relative">
        <ScrollArea className="flex-1 h-[calc(100vh-150px)]">
          <div
            className="p- flex justify-center overflow-auto"
            ref={containerRef}
          >
            <div className="relative inline-block" style={{ border: "" }}>
              <Document
                // file={data.annotatedPdfUrl}
                file={AnnualReport}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center h-64">
                    <div className="text-muted-foreground">Loading PDF...</div>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-64">
                    <div className="text-destructive">Failed to load PDF</div>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  // onLoadSuccess={onPageLoadSuccess}
                  className="shadow-lg border border-border/20"
                />
              </Document>

              {/* Sentence Highlights */}
              {/* {highlights
                .filter((h) => h.page === pageNumber)
                .map((highlight) => (
                  <div
                    key={highlight.id}
                    className={`absolute opacity-50 z-10 rounded-sm ${
                      highlight.color === "red"
                        ? "bg-red-500"
                        : highlight.color === "yellow"
                        ? "bg-yellow-400"
                        : "bg-green-400"
                    }`}
                    style={{
                      left: highlight.x * scale,
                      top: highlight.y * scale,
                      width: highlight.width * scale,
                      height: highlight.height * scale,
                    }}
                  />
                ))} */}

              {/* {sentenceHighlights.filter(h => h.page === pageNumber).map((highlight) => (
                <div
                  key={highlight.id}
                  className={`absolute border-2 opacity-60 z-5 ${
                    highlight.color === 'red' ? 'border-red-500' :
                    highlight.color === 'yellow' ? 'border-yellow-500' :
                    'border-green-500'
                  }`}
                  style={{
                    left: highlight.x * scale,
                    top: highlight.y * scale,
                    width: highlight.width * scale,
                    height: highlight.height * scale,
                  }}
                />
              ))} */}

              {/* Annotation Markers */}
              {/* {currentPageFlags.map((flag) => (
                <button
                  key={flag.id}
                  onClick={() => handleMarkerClick(flag)}
                  className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer z-10 animate-pulse
                    ${getMarkerColor(flag.color)}
                    ${selectedFlagId === flag.id ? 'ring-2 ring-primary ring-offset-2' : ''}
                    hover:scale-110 transition-transform duration-200`}
                  style={{
                    left: flag.x * scale,
                    top: flag.y * scale,
                  }}
                  title={flag.title}
                  aria-label={`Flag: ${flag.title} on page ${flag.page}`}
                />
              ))} */}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Magnifier Overlay */}
      {/* {showMagnifier && (
        <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-sm border-y border-border/20 z-20"
             style={{ height: magnifierHeight }}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-2 border-b border-border/20">
              <span className="text-sm font-medium">Magnifier View</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="200"
                  max="600"
                  value={magnifierHeight}
                  onChange={(e) => setMagnifierHeight(parseInt(e.target.value))}
                  className="w-20"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMagnifier(false)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 flex justify-center">
                <div className="relative inline-block">
                  <Document file={data.annotatedPdfUrl}>
                    <Page
                      pageNumber={pageNumber}
                      scale={scale * 1.5}
                      className="shadow-lg border border-border/20"
                    />
                  </Document>
                  
                  Magnifier Markers
                  {currentPageFlags.map((flag) => (
                    <button
                      key={`mag-${flag.id}`}
                      onClick={() => handleMarkerClick(flag)}
                      className={`absolute w-8 h-8 rounded-full border-2 cursor-pointer z-10
                        ${getMarkerColor(flag.color)}
                        ${selectedFlagId === flag.id ? 'ring-2 ring-primary ring-offset-2' : ''}
                        hover:scale-110 transition-transform duration-200`}
                      style={{
                        left: flag.x * scale * 1.5,
                        top: flag.y * scale * 1.5,
                      }}
                      title={flag.title}
                    />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )} */}

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="flex justify-center">
              <div className="relative inline-block">
                {/* <Document
                  // file={data.annotatedPdfUrl}
                  file={AnnualReport}
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={2.0}
                    className="shadow-lg"
                  />
                </Document> */}

                <Document
                  // file={data.annotatedPdfUrl}
                  file={AnnualReport}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center h-64">
                      <div className="text-muted-foreground">
                        Loading PDF...
                      </div>
                    </div>
                  }
                  error={
                    <div className="flex items-center justify-center h-64">
                      <div className="text-destructive">Failed to load PDF</div>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    // onLoadSuccess={onPageLoadSuccess}
                    className="shadow-lg border border-border/20"
                  />
                </Document>

                {/* Fullscreen Sentence Highlights */}
                {/* {sentenceHighlights
                  .filter((h) => h.page === pageNumber)
                  .map((highlight) => (
                    <div
                      key={`fs-${highlight.id}`}
                      className={`absolute border-2 opacity-60 z-5 ${
                        highlight.color === "red"
                          ? "border-red-500"
                          : highlight.color === "yellow"
                          ? "border-yellow-500"
                          : "border-green-500"
                      }`}
                      style={{
                        left: highlight.x * 2.0,
                        top: highlight.y * 2.0,
                        width: highlight.width * 2.0,
                        height: highlight.height * 2.0,
                      }}
                    />
                  ))} */}

                {/* Fullscreen Markers */}
                {/* {currentPageFlags.map((flag) => (
                  <button
                    key={`fs-${flag.id}`}
                    onClick={() => handleMarkerClick(flag)}
                    className={`absolute w-8 h-8 rounded-full border-2 cursor-pointer z-10
                      ${getMarkerColor(flag.color)}
                      ${
                        selectedFlagId === flag.id
                          ? "ring-2 ring-primary ring-offset-2"
                          : ""
                      }
                      hover:scale-110 transition-transform duration-200`}
                    style={{
                      left: flag.x * 2.0,
                      top: flag.y * 2.0,
                    }}
                    title={flag.title}
                  />
                ))} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
