import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PdfViewer from '@/components/analysis/PdfViewer';
import ResultsPanel from '@/components/analysis/ResultsPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { mockAnalysisData } from '@/data/mockAnalysisData';

interface AnalysisResultPageProps {
  onBack: () => void;
}

const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({ onBack }) => {
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [filteredColor, setFilteredColor] = useState<string | null>(null);

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
      <div className="flex-1 overflow-hidden">

        <ResizablePanelGroup direction="horizontal" className="h-full">


          {/* PDF Viewer */}
          <ResizablePanel defaultSize={42} minSize={30} style={{border: ''}}>
            <PdfViewer
              data={mockAnalysisData}
              selectedFlagId={selectedFlagId}
              onMarkerClick={handleMarkerClick}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Results Panel */}
          <ResizablePanel defaultSize={58} minSize={40}>
            <ResultsPanel
              data={mockAnalysisData}
              selectedFlagId={selectedFlagId}
              filteredColor={filteredColor}
              onFlagClick={handleFlagClick}
              onPieSegmentClick={handlePieSegmentClick}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default AnalysisResultPage;