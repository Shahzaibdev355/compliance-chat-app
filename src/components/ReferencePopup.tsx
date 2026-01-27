import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BookOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Reference {
  id: string;
  title: string;
  provisionNumber: string;
  type: string;
  content: string;
}

interface ReferencePopupProps {
  reference: Reference;
  isOpen: boolean;
  onClose: () => void;
}

export const ReferencePopup: React.FC<ReferencePopupProps> = ({
  reference,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="max-w-2xl max-h-[80vh] animate-scale-in" >
        <DialogHeader className="pb-4 border-b border-border/20" >
          <div className="flex items-center justify-between" >
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <DialogTitle className="text-lg font-semibold">
                  {reference.provisionNumber}
                </DialogTitle>
                <Badge variant="secondary" className="mt-1" style={{border: ''}}>
                  {reference.type}
                </Badge>
              </div>
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
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {reference.content}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};