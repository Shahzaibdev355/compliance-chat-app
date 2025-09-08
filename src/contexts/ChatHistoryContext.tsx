import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatEntry {
  id: string;
  title: string;
  query: string;
  timestamp: Date;
}

interface ChatHistoryContextType {
  chatHistory: ChatEntry[];
  addChatEntry: (query: string) => void;
  updateChatTitle: (id: string, newTitle: string) => void;
  deleteChatEntry: (id: string) => void;
  shareChatEntry: (id: string) => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
};

interface ChatHistoryProviderProps {
  children: ReactNode;
}

export const ChatHistoryProvider: React.FC<ChatHistoryProviderProps> = ({ children }) => {
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);

  const addChatEntry = (query: string) => {
    const newEntry: ChatEntry = {
      id: Date.now().toString(),
      title: query.slice(0, 30) + (query.length > 30 ? '...' : ''),
      query,
      timestamp: new Date(),
    };
    setChatHistory(prev => [newEntry, ...prev]);
  };

  const updateChatTitle = (id: string, newTitle: string) => {
    setChatHistory(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, title: newTitle } : entry
      )
    );
  };

  const deleteChatEntry = (id: string) => {
    setChatHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const shareChatEntry = (id: string) => {
    const entry = chatHistory.find(e => e.id === id);
    if (entry) {
      navigator.clipboard.writeText(entry.query);
      // Could show a toast notification here
    }
  };

  return (
    <ChatHistoryContext.Provider value={{
      chatHistory,
      addChatEntry,
      updateChatTitle,
      deleteChatEntry,
      shareChatEntry,
    }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};