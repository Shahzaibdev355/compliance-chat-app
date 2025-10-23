import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Grid3X3,
  List,
  Search,
  FileText,
  Image,
  File,
  Download,
  Trash2,
  Eye,
  Upload,
} from 'lucide-react';

interface LibraryFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'other';
  size: string;
  uploadDate: Date;
  thumbnail?: string;
}

interface LibraryPageProps {
  onBack: () => void;
}

const LibraryPage: React.FC<LibraryPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock file data
  const mockFiles: LibraryFile[] = [
    {
      id: '1',
      name: 'Tax Return 2023.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Business License.jpg',
      type: 'image',
      size: '856 KB',
      uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Financial Statement Q4.docx',
      type: 'document',
      size: '1.2 MB',
      uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      name: 'Receipt Collection.pdf',
      type: 'pdf',
      size: '3.8 MB',
      uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: '5',
      name: 'Bank Statement.pdf',
      type: 'pdf',
      size: '1.9 MB',
      uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: '6',
      name: 'Property Deed.jpg',
      type: 'image',
      size: '2.1 MB',
      uploadDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
  ];

  const filteredFiles = mockFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: LibraryFile['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'image':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'document':
        return <File className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

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

  const handleFileAction = (action: string, fileId: string) => {
    console.log(`${action} file:`, fileId);
    // Implement file actions here
  };

  const FileGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredFiles.map((file) => (
        <div
          key={file.id}
          className="bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-200 group cursor-pointer"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              {getFileIcon(file.type)}
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileAction('view', file.id);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileAction('download', file.id);
                    }}
                  >
                    <Download className="h-3 w-3" />
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
        </div>
      ))}
    </div>
  );

  const FileListView = () => (
    <div className="space-y-2">
      {filteredFiles.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-4 p-4 bg-card border rounded-lg hover:shadow-sm transition-all duration-200 group cursor-pointer"
        >
          <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{file.name}</p>
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
                handleFileAction('view', file.id);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleFileAction('download', file.id);
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleFileAction('delete', file.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
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
                  Manage your uploaded files and documents
                </p>
              </div>
            </div>
            <Button className="w-full sm:w-auto">
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
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
              placeholder="Search files..."
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

        {/* File Display */}
        <div className="animate-fade-in">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                {searchQuery ? (
                  <Search className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                ) : (
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                )}
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No files found' : 'No files uploaded'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Upload your first document to get started'}
              </p>
              {!searchQuery && (
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} found
                </p>
              </div>
              {viewMode === 'grid' ? <FileGridView /> : <FileListView />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;