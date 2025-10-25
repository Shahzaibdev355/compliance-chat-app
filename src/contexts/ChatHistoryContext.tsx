import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface ChatEntry {
  id: string;
  title: string;
  query: string;
  timestamp: Date;
  messages: Message[];
}

interface ChatHistoryContextType {
  chatHistory: ChatEntry[];
  addChatEntry: (query: string, messages: Message[]) => void;
  updateChatTitle: (id: string, newTitle: string) => void;
  deleteChatEntry: (id: string) => void;
  shareChatEntry: (id: string) => void;
  loadChat: (id: string) => Message[] | null;
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
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>(() => {
    // Load from session storage on init
    const stored = sessionStorage.getItem('chatHistory');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
          messages: entry.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      } catch (e) {
        console.error('Failed to parse chat history:', e);
        return [];
      }
    }
    return [];
  });

  // Save to session storage whenever chatHistory changes
  React.useEffect(() => {
    sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const addChatEntry = (query: string, messages: Message[]) => {
    const newEntry: ChatEntry = {
      id: Date.now().toString(),
      title: query.slice(0, 30) + (query.length > 30 ? '...' : ''),
      query,
      timestamp: new Date(),
      messages,
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

  const loadChat = (id: string): Message[] | null => {
    const entry = chatHistory.find(e => e.id === id);
    return entry ? entry.messages : null;
  };

  return (
    <ChatHistoryContext.Provider value={{
      chatHistory,
      addChatEntry,
      updateChatTitle,
      deleteChatEntry,
      shareChatEntry,
      loadChat,
    }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};