// Shared types for chat functionality

export interface Reference {
  id: string;
  title: string;
  provisionNumber: string;
  type: string;
  content: string;
}

export interface PDFDoc {
  id: string;
  name: string;
  url: string;
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  isComplete?: boolean;
  summary?: string;
  recommendation?: string;
  references?: Reference[];
  pdfs?: PDFDoc[];
}
