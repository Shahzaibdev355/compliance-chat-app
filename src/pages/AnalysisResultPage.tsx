import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PdfViewer from '@/components/analysis/PdfViewer';
import ResultsPanel from '@/components/analysis/ResultsPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { askAuditQuestion } from "@/api/taxApi";
import { mockAnalysisData } from '@/data/mockAnalysisData';


interface AnalysisResultPageProps {
  onBack: () => void;
}

const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({ onBack }) => {
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [filteredColor, setFilteredColor] = useState<string | null>(null);

  const [analysisData, setAnalysisData] = useState(null);
  const [showLoading, setShowLoading] = useState(true);

  const handleMarkerClick = (flagId: string) => {
    setSelectedFlagId(flagId);
  };

  const handleFlagClick = (flagId: string) => {
    setSelectedFlagId(flagId);
    // Scroll PDF to flag location would happen here
  };

  const handlePieSegmentClick = (color: string) => {
    setFilteredColor(filteredColor === color ? null : color);
  };


  // useEffect(() => {
  //   const data = localStorage.getItem("auditResults");

  //   const savedQuery = localStorage.getItem("additionalQuery");

  //   if (data) {
  //     const parsed = JSON.parse(data);
  //     parsed.additionalQuery = savedQuery || "";
  //     setAnalysisData(parsed);
  //   }

  //   const timer = setTimeout(() => {
  //     setShowLoading(false);
  //   }, 5000);

  //   return () => clearTimeout(timer);

  // }, []);


  useEffect(() => {

    const loadAnalysis = async () => {

      const data = localStorage.getItem("auditResults");
      const sessionId = localStorage.getItem("session_id");
      const savedQuery = localStorage.getItem("additionalQuery");

      if (!data) return;

      const parsed = JSON.parse(data);

      parsed.additionalQuery = savedQuery || "";

      // Auto ask AI if user entered query during upload
      if (savedQuery?.trim() && sessionId) {

        try {

          const response = await askAuditQuestion(
            sessionId,
            savedQuery
          );

          parsed.initialAnswer = response?.answer || "No answer was returned.";

        } catch (err) {
          console.error("Initial query failed", err);

          parsed.initialAnswer = "Failed to retrieve answer from the server.";

        }

      }

      setAnalysisData(parsed);
    };

    loadAnalysis();

    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 5000);

    return () => clearTimeout(timer);

  }, []);


  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/20 p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analysis
        </Button>
        <div className="h-4 w-px bg-border/20" />
        <h1 className="text-lg font-semibold text-foreground">Analysis Results</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">

        {/* Loading Blur Overlay */}
        {showLoading && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex items-center justify-center">
            <div className="bg-background rounded-2xl p-10 shadow-xl text-center">
              <div className="animate-pulse text-xl font-semibold mb-3">
                Analyzing Your PDF...
              </div>

              <p className="text-muted-foreground">
                Running compliance checks and extracting flags
              </p>
            </div>
          </div>
        )}


        {/* Only render panels once data exists */}
        {analysisData && (
          <ResizablePanelGroup direction="horizontal" className="h-full">

            {/* PDF SIDE */}
            <ResizablePanel
              defaultSize={42}
              minSize={30}
            >
              <PdfViewer
                data={analysisData}
                selectedFlagId={selectedFlagId}
                onMarkerClick={handleMarkerClick}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* RESULTS SIDE */}
            <ResizablePanel
              defaultSize={58}
              minSize={40}
            >
              <ResultsPanel
                data={analysisData}
                selectedFlagId={selectedFlagId}
                filteredColor={filteredColor}
                onFlagClick={handleFlagClick}
                onPieSegmentClick={handlePieSegmentClick}
              />
            </ResizablePanel>

          </ResizablePanelGroup>
        )}


        {/* <ResizablePanelGroup direction="horizontal" className="h-full">


          <ResizablePanel defaultSize={42} minSize={30} >
            <PdfViewer
              data={mockAnalysisData}
              selectedFlagId={selectedFlagId}
              onMarkerClick={handleMarkerClick}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />


          <ResizablePanel defaultSize={58} minSize={40}>
            <ResultsPanel
              data={mockAnalysisData}
              selectedFlagId={selectedFlagId}
              filteredColor={filteredColor}
              onFlagClick={handleFlagClick}
              onPieSegmentClick={handlePieSegmentClick}
            />
          </ResizablePanel>


        </ResizablePanelGroup> */}


      </div>
    </div>
  );
};

export default AnalysisResultPage;