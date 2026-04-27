import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Eye, Download, Trash2 } from 'lucide-react';
import type { LibraryFile } from '@/types/library';

interface LibraryFileCardProps {
  file: LibraryFile;
  viewMode: 'grid' | 'list';
  onView: (file: LibraryFile) => void;
  onDownload: (file: LibraryFile) => void;
  onDelete: (file: LibraryFile) => void;
  deleting: boolean;
}

const formatDate = (date: Date) => {
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
};

const LibraryFileCard: React.FC<LibraryFileCardProps> = ({
  file,
  viewMode,
  onView,
  onDownload,
  onDelete,
  deleting
}) => {
  if (viewMode === 'list') {
    return (
      <div
        className="flex items-center gap-4 p-4 bg-card border rounded-lg hover:shadow-sm transition-all duration-200 group cursor-pointer"
      >
        <div className="flex-shrink-0">
          <FileText className="h-8 w-8 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          {/* <p className="font-medium text-sm truncate">{file.name}</p> */}

          <p className="font-medium text-sm truncate">
            {deleting ? "Deleting..." : file.name}
          </p>

          <p className="text-xs text-muted-foreground">
            {file.size} • {formatDate(file.uploadDate)}
          </p>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onView(file);
            }}
            title="View PDF"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(file);
            }}
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={deleting}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(file);
            }}
            title="Delete PDF"
          >
            {deleting ? (
              <div className="animate-spin h-4 w-4 border-2 rounded-full border-current border-t-transparent" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 group cursor-pointer">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <FileText className="h-8 w-8 text-red-500" />
            <div className="absolute -top-1 -right- opacity-0 group-hover:opacity-100 transition-opacity" style={{ right: '-7.25rem' }}>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(file);
                  }}
                  title="View PDF"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(file);
                  }}
                  title="Download PDF"
                >
                  <Download className="h-3 w-3" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  disabled={deleting}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(file);
                  }}
                  title="Delete PDF"
                >
                  {deleting ? (
                    <div className="animate-spin h-4 w-4 border-2 rounded-full border-current border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full">
            <p className="font-medium text-sm truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">{file.size}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(file.uploadDate)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LibraryFileCard;
