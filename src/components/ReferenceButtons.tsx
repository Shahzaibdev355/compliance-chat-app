import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Download, FileCheck } from 'lucide-react';
import { ReferencePopup } from './ReferencePopup';
import { SummaryPopup } from './SummaryPopup';
import { RecommendationPopup } from './RecommendationPopup';
import { PDFDownloadPopup } from './PDFDownloadPopup';

interface Reference {
  id: string;
  title: string;
  provisionNumber: string;
  type: string;
  content: string;
}

interface ReferenceButtonsProps {
  references: Reference[];
  summary: string;
  recommendation: string;
  availablePDFs: { id: string; name: string; url: string }[];
}

export const ReferenceButtons: React.FC<ReferenceButtonsProps> = ({
  references,
  summary,
  recommendation,
  availablePDFs,
}) => {
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showPDFList, setShowPDFList] = useState(false);

  const handleReferenceClick = (reference: Reference) => {
    setSelectedReference(reference);
  };

  const handleSummaryClick = () => {
    setShowSummary(true);
  };

  const handleRecommendationClick = () => {
    setShowRecommendation(true);
  };

  const handlePDFClick = () => {
    setShowPDFList(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/20">
        {/* Reference Buttons - Show first 3 */}
        {references.slice(0, 3).map((reference) => (
          <Button
            key={reference.id}
            size="sm"
            variant="outline"
            onClick={() => handleReferenceClick(reference)}
            className="flex items-center gap-2 hover:bg-primary/5 transition-all duration-200"
            style={{border: ''}}
          >
            <BookOpen className="h-3 w-3" style={{color: 'white'}}/>
            <span className="text-xs" style={{color: 'white'}}>{reference.title}</span>
          </Button>
        ))}

        {/* Summary Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleSummaryClick}
          className="flex items-center gap-2 hover:bg-primary/5 transition-all duration-200"
        >
          <FileCheck className="h-3 w-3" style={{color: 'white'}}/>
          <span className="text-xs" style={{color: 'white'}}>Summary</span>
        </Button>


        {/* Recommendation Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleRecommendationClick}
          className="flex items-center gap-2 hover:bg-primary/5 transition-all duration-200"
        >
          <FileCheck className="h-3 w-3" style={{color: 'white'}}/>
          <span className="text-xs" style={{color: 'white'}}>Recommendation</span>
        </Button>

        {/* PDF Download Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={handlePDFClick}
          className="flex items-center gap-2 hover:bg-primary/5 transition-all duration-200"
        >
          <Download className="h-3 w-3" style={{color: 'white'}}/>
          <span className="text-xs" style={{color: 'white'}}>PDF</span>
        </Button>
      </div>

      {/* Reference Popup */}
      {selectedReference && (
        <ReferencePopup
          reference={selectedReference}
          isOpen={!!selectedReference}
          onClose={() => setSelectedReference(null)}
        />
      )}

      {/* Summary Popup */}
      <SummaryPopup
        summary={summary}
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
      />

      {/* Summary Popup */}
      <RecommendationPopup
        recommendation={recommendation}
        isOpen={showRecommendation}
        onClose={() => setShowRecommendation(false)}
      />

      {/* PDF Download Popup */}
      <PDFDownloadPopup
        pdfs={availablePDFs}
        isOpen={showPDFList}
        onClose={() => setShowPDFList(false)}
      />
    </>
  );
};