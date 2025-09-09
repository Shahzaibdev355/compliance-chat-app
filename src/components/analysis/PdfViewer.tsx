import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut, Maximize, Minimize, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AnalysisData, Flag } from '@/data/mockAnalysisData';
import { useToast } from '@/hooks/use-toast';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
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
      case 'red': return 'bg-red-500 border-red-600';
      case 'yellow': return 'bg-yellow-500 border-yellow-600';
      case 'green': return 'bg-green-500 border-green-600';
      case 'blue': return 'bg-blue-500 border-blue-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const currentPageFlags = data.flags.filter(flag => flag.page === pageNumber);

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
        <Button
          variant="outline"
          size="sm"
          onClick={fitWidth}
          className="h-8 px-3"
          title="Fit Width"
        >
          <Minimize className="h-4 w-4 mr-1" />
          Width
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={fitHeight}
          className="h-8 px-3"
          title="Fit Height"
        >
          <Maximize className="h-4 w-4 mr-1" />
          Height
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetZoom}
          className="h-8 w-8 p-0"
          title="Reset Zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border/20 mx-1" />
        <Button
          variant={showMagnifier ? "default" : "outline"}
          size="sm"
          onClick={() => setShowMagnifier(!showMagnifier)}
          className="h-8 w-8 p-0"
          title="Toggle Magnifier"
        >
          <Search className="h-4 w-4" />
        </Button>
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <span>Scale: {Math.round(scale * 100)}%</span>
          {numPages && (
            <span>Page {pageNumber} of {numPages}</span>
          )}
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 relative">
        <ScrollArea className="h-full">
          <div className="p-4 flex justify-center" ref={containerRef}>
            <div className="relative inline-block">
              <Document
                file={data.annotatedPdfUrl}
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
                  className="shadow-lg border border-border/20"
                />
              </Document>
              
              {/* Annotation Markers */}
              {currentPageFlags.map((flag) => (
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
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Page Navigation */}
        {numPages && numPages > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-border/20 rounded-lg px-3 py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
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
                onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                disabled={pageNumber >= numPages}
                className="h-7 px-2"
              >
                →
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Magnifier Overlay */}
      {showMagnifier && (
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
                  
                  {/* Magnifier Markers */}
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
      )}
    </div>
  );
};

export default PdfViewer;