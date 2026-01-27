import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendationPopupProps {
  recommendation: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RecommendationPopup: React.FC<RecommendationPopupProps> = ({
  recommendation,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] animate-scale-in">
        <DialogHeader className="pb-4 border-b border-border/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCheck className="h-5 w-5 text-primary" />
              <DialogTitle className="text-lg font-semibold">
                Recommendation
              </DialogTitle>
            </div>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-primary">Key Points</h4>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {recommendation}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};