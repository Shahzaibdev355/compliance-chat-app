import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Save, X } from 'lucide-react';

interface PDFPreviewCardProps {
  fileName: string;
  onSave: () => void;
  onCancel: () => void;
}

const PDFPreviewCard: React.FC<PDFPreviewCardProps> = ({
  fileName,
  onSave,
  onCancel,
}) => {
  return (
    <Card className="animate-scale-in border-2 border-dashed border-primary/50 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <FileText className="h-12 w-12 text-primary" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
              <span className="text-[10px] text-primary-foreground font-bold">!</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-sm truncate max-w-[200px]" title={fileName}>
              {fileName}
            </p>
            <p className="text-xs text-muted-foreground">Ready to save</p>
          </div>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onCancel}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={onSave}
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFPreviewCard;
