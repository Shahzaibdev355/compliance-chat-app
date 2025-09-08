import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Download, FileCheck } from 'lucide-react';
import { ReferencePopup } from './ReferencePopup';
import { SummaryPopup } from './SummaryPopup';
import { PDFDownloadPopup } from './PDFDownloadPopup';

interface Reference {
  id: string;
  title: string;
  content: string;
  type: 'SRO' | 'Rule' | 'Section';
}

interface ReferenceButtonsProps {
  references: Reference[];
  summary: string;
  availablePDFs: { id: string; name: string; url: string }[];
}

export const ReferenceButtons: React.FC<ReferenceButtonsProps> = ({
  references,
  summary,
  availablePDFs,
}) => {
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showPDFList, setShowPDFList] = useState(false);

  const handleReferenceClick = (reference: Reference) => {
    setSelectedReference(reference);
  };

  const handleSummaryClick = () => {
    setShowSummary(true);
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
          >
            <BookOpen className="h-3 w-3" />
            <span className="text-xs">{reference.title}</span>
          </Button>
        ))}

        {/* Summary Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleSummaryClick}
          className="flex items-center gap-2 hover:bg-primary/5 transition-all duration-200"
        >
          <FileCheck className="h-3 w-3" />
          <span className="text-xs">Summary</span>
        </Button>

        {/* PDF Download Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={handlePDFClick}
          className="flex items-center gap-2 hover:bg-primary/5 transition-all duration-200"
        >
          <Download className="h-3 w-3" />
          <span className="text-xs">PDF</span>
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

      {/* PDF Download Popup */}
      <PDFDownloadPopup
        pdfs={availablePDFs}
        isOpen={showPDFList}
        onClose={() => setShowPDFList(false)}
      />
    </>
  );
};