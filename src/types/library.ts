// Types for the document library

export interface LibraryFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'other';
  size: string;
  uploadDate: Date;
  url: string; // Object URL for the file
  thumbnail?: string;
}
