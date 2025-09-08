import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, FileText } from 'lucide-react';

interface PDF {
  id: string;
  name: string;
  url: string;
}

interface PDFDownloadPopupProps {
  pdfs: PDF[];
  isOpen: boolean;
  onClose: () => void;
}

export const PDFDownloadPopup: React.FC<PDFDownloadPopupProps> = ({
  pdfs,
  isOpen,
  onClose,
}) => {
  const handleDownload = (pdf: PDF) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = pdf.url;
    link.download = pdf.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md animate-scale-in">
        <DialogHeader className="pb-4 border-b border-border/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-primary" />
              <DialogTitle className="text-lg font-semibold">
                Available Downloads
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-2 py-2">
          {pdfs.length > 0 ? (
            pdfs.map((pdf) => (
              <Button
                key={pdf.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-muted/50 transition-colors"
                onClick={() => handleDownload(pdf)}
              >
                <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium text-sm">{pdf.name}</div>
                </div>
                <Download className="h-3 w-3 ml-auto text-muted-foreground" />
              </Button>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No PDFs available for download</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};