import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Grid3X3,
  List,
  Search,
  FileText,
  Upload,
} from 'lucide-react';
import type { LibraryFile } from '@/types/library';
import LibraryFileCard from '@/components/library/LibraryFileCard';
import PDFPreviewCard from '@/components/library/PDFPreviewCard';
import PDFViewerModal from '@/components/library/PDFViewerModal';

interface LibraryPageProps {
  onBack: () => void;
}

// Helper to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const STORAGE_KEY = 'library_pdfs';

const LibraryPage: React.FC<LibraryPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [pendingFile, setPendingFile] = useState<{ file: File; url: string } | null>(null);
  const [viewingPdf, setViewingPdf] = useState<LibraryFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFiles(parsed.map((f: any) => ({
          ...f,
          uploadDate: new Date(f.uploadDate),
        })));
      } catch (e) {
        console.error('Failed to parse stored files:', e);
      }
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    }
  }, [files]);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPendingFile({ file, url });
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (!pendingFile) return;

    const newFile: LibraryFile = {
      id: Date.now().toString(),
      name: pendingFile.file.name,
      type: 'pdf',
      size: formatFileSize(pendingFile.file.size),
      uploadDate: new Date(),
      url: pendingFile.url,
    };

    setFiles((prev) => [newFile, ...prev]);
    setPendingFile(null);
  };

  const handleCancel = () => {
    if (pendingFile) {
      URL.revokeObjectURL(pendingFile.url);
      setPendingFile(null);
    }
  };

  const handleView = (file: LibraryFile) => {
    setViewingPdf(file);
  };

  const handleDownload = (file: LibraryFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (file: LibraryFile) => {
    URL.revokeObjectURL(file.url);
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
    // Update localStorage
    const remaining = files.filter((f) => f.id !== file.id);
    if (remaining.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 md:gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold">Document Library</h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Manage your uploaded PDF documents
                </p>
              </div>
            </div>
            <Button className="w-full sm:w-auto" onClick={handleUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              Upload PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 md:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search PDFs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex-1 sm:flex-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex-1 sm:flex-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Pending File Preview */}
        {pendingFile && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">
              Pending Upload
            </h3>
            <div className="max-w-xs">
              <PDFPreviewCard
                fileName={pendingFile.file.name}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {/* File Display */}
        <div className="animate-fade-in">
          {filteredFiles.length === 0 && !pendingFile ? (
            <div className="text-center py-12">
              <div className="mb-4">
                {searchQuery ? (
                  <Search className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                ) : (
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                )}
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No PDFs found' : 'No PDFs uploaded'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Upload your first PDF document to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={handleUploadClick}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload PDF
                </Button>
              )}
            </div>
          ) : (
            <>
              {filteredFiles.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {filteredFiles.length} PDF{filteredFiles.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              )}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredFiles.map((file) => (
                    <LibraryFileCard
                      key={file.id}
                      file={file}
                      viewMode="grid"
                      onView={handleView}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <LibraryFileCard
                      key={file.id}
                      file={file}
                      viewMode="list"
                      onView={handleView}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <PDFViewerModal
          isOpen={!!viewingPdf}
          onClose={() => setViewingPdf(null)}
          pdfUrl={viewingPdf.url}
          pdfName={viewingPdf.name}
        />
      )}
    </div>
  );
};

export default LibraryPage;
