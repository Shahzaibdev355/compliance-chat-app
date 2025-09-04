import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface HomePageProps {
  onAccessAgent: () => void;
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAccessAgent, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMode, setCurrentMode] = useState<'gpt' | 'agent' | 'chat'>('gpt');

  const handleNewChat = () => {
    setMessages([]);
    setCurrentMode('chat');
  };

  const handleAccessGPT = () => {
    setCurrentMode('chat');
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'ai',
        content: 'Hello! I\'m your AI assistant for tax compliance and advisory. How can I help you today?',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Thank you for your question: "${content}". As your AI tax advisor, I'm here to help with compliance matters, tax planning, and regulatory questions. This is a demo response - in a real implementation, this would be connected to a sophisticated AI model trained on tax law and regulations.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  if (currentMode === 'gpt' && messages.length === 0) {
    return (
      <div className="flex h-screen">
        <Sidebar
          onNewChat={handleNewChat}
          onAccessGPT={handleAccessGPT}
          onAccessAgent={onAccessAgent}
          onLogout={onLogout}
          currentMode={currentMode}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md">
            <h2 className="text-3xl font-bold">Welcome to Taxtro AI</h2>
            <p className="text-muted-foreground text-lg">
              Choose how you'd like to interact with our AI system
            </p>
            <div className="space-y-4">
              <button
                onClick={handleAccessGPT}
                className="w-full p-6 bg-card border border-border rounded-xl hover:bg-muted transition-colors text-left"
              >
                <h3 className="font-semibold mb-2">Access Normal GPT</h3>
                <p className="text-sm text-muted-foreground">
                  Standard chat Q&A mode for general tax questions and advice
                </p>
              </button>
              <button
                onClick={onAccessAgent}
                className="w-full p-6 bg-card border border-border rounded-xl hover:bg-muted transition-colors text-left"
              >
                <h3 className="font-semibold mb-2">Access Agent Andrew</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated document compliance analysis with Income Tax law validation
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        onNewChat={handleNewChat}
        onAccessGPT={handleAccessGPT}
        onAccessAgent={onAccessAgent}
        onLogout={onLogout}
        currentMode={currentMode}
      />
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default HomePage;