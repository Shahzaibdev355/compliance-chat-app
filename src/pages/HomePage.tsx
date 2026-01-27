import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import PlusButton from '@/components/PlusButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChatHistory } from '@/contexts/ChatHistoryContext';
import { ArrowLeft, Crown, Send, Mic, Plus, FileText, Search } from 'lucide-react';

import { askTaxGPT } from "@/api/taxApi";

// interface Message {
//   id: string;
//   type: 'user' | 'ai';
//   content: string;
//   timestamp: Date;
// }



interface Reference {
  title: string;
  content?: string;
  type?: string;
}

interface PDFDoc {
  Title: string;
  File: string;
  URL: string;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;

  isTyping?: boolean;

  isComplete?: boolean;

  //AI-only fields
  summary?: string;
  recommendation?: string;
  references?: Reference[];
  pdfs?: PDFDoc[];
}













interface HomePageProps {
  onAccessAgent: () => void;
  onAccessLibrary: () => void;
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAccessAgent, onAccessLibrary, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMode, setCurrentMode] = useState<'gpt' | 'agent' | 'chat'>('gpt');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [centeredInput, setCenteredInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const { addChatEntry, loadChat } = useChatHistory();

  const handleNewChat = () => {
    setMessages([]);
    setCurrentMode('chat');
    setCurrentChatId(null);
  };

  const handleAccessGPT = () => {
    setCurrentMode('gpt');
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleBackToWelcome = () => {
    setCurrentMode('gpt');
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleCenteredSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (centeredInput.trim()) {
      handleSendMessage(centeredInput.trim());
      setCenteredInput('');
      setCurrentMode('chat');
    }
  };

  const handleLoadChat = (chatId: string) => {
    const chatMessages = loadChat(chatId);
    if (chatMessages) {
      setMessages(chatMessages);
      setCurrentChatId(chatId);
      setCurrentMode('chat');
    }
  };

  // const handleSendMessage = (content: string) => {
  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     type: 'user',
  //     content,
  //     timestamp: new Date()
  //   };

  //   const updatedMessages = [...messages, userMessage];
  //   setMessages(updatedMessages);

  //   // Simulate AI response
  //   setTimeout(() => {
  //     const aiMessage: Message = {
  //       id: (Date.now() + 1).toString(),
  //       type: 'ai',
  //       content: `Thank you for your question: "${content}". As your AI tax advisor, I'm here to help with compliance matters, tax planning, and regulatory questions. This is a demo response - in a real implementation, this would be connected to a sophisticated AI model trained on tax law and regulations.`,
  //       timestamp: new Date()
  //     };
  //     const finalMessages = [...updatedMessages, aiMessage];
  //     setMessages(finalMessages);

  //     // Save to chat history only for new chats or first message
  //     if (!currentChatId || messages.length === 0) {
  //       addChatEntry(content, finalMessages);
  //       setCurrentChatId(Date.now().toString());
  //     }
  //   }, 1000);



  // };






  // const askTaxGPT = async (question: string) => {
  //  const res = await fetch('http://127.0.0.1:8000/ask', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ question }),
  //   });

  //   if (!res.ok) {
  //     throw new Error('Failed to fetch AI response');
  //   }

  //   return res.json();
  // };



  const addMessage = (message: Omit<Message, "timestamp">) => {
    setMessages(prev => [
      ...prev,
      {
        ...message,
        timestamp: new Date(),
      },
    ]);
  };


  const parseLegalReferences = (raw: string) => {
    if (!raw) return [];

    const blocks = raw.split("\n\n").filter(Boolean);

    console.log("Parsing legal references:", blocks);

    return blocks.map((block, index) => {
      const titleMatch = block.match(/\*\*Title:\*\*\s*(.*)/);
      const typeMatch = block.match(/\*\*Provision Type:\*\*\s*(.*)/);
      const numberMatch = block.match(/\*\*Provision Number:\*\*\s*(.*)/);
      const descMatch = block.match(/\*\*Short Description:\*\*\s*(.*)/);

     

      return {
        id: `${index + 1}`,
        title: titleMatch?.[1]?.trim() || "Legal Reference",
        provisionNumber: numberMatch?.[1]?.trim() || "Provision Number",
        type: typeMatch?.[1]?.trim() || "Provision Type",
        content: descMatch?.[1]?.trim() || "No description available",
      };
    });
  };



  const handleSendMessage = async (question: string) => {
    // 1️⃣ User message
    addMessage({
      id: crypto.randomUUID(),
      type: "user",
      content: question,
    });
  
    // 2️⃣ TEMP AI loader message
    const typingMessageId = crypto.randomUUID();
  
    addMessage({
      id: typingMessageId,
      type: "ai",
      content: "AI is generating response...",
      isTyping: true,
    });
  
    try {
      const data = await askTaxGPT(question);
  
      const parsedReferences = parseLegalReferences(
        data.Applicable_Legal_References
      );
  
      const parsedPDFs = (data.Source_Documents || []).map(
        (doc: any, index: number) => ({
          id: `${index + 1}`,
          name: doc.Title,
          url: doc.URL,
        })
      );
  
      // 3️⃣ Replace loader with real response
      setMessages(prev =>
        prev.map(msg =>
          msg.id === typingMessageId
            ? {
                ...msg,
                content: data.Answer,
                isTyping: false,
                isComplete: false, // ✅ REQUIRED
                summary: data.Summary,
                recommendation: data.Recommendation,
                references: parsedReferences,
                pdfs: parsedPDFs,
              }
            : msg
        )
      );
      // setMessages(prev =>
      //   prev.map(msg =>
      //     msg.id === typingMessageId
      //       ? {
      //           ...msg,
      //           content: data.Answer,
      //           isTyping: false,
      //           summary: data.Summary,
      //           recommendation: data.Recommendation,
      //           references: parsedReferences,
      //           pdfs: parsedPDFs,
      //         }
      //       : msg
      //   )
      // );
    } catch (error) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === typingMessageId
            ? {
                ...msg,
                content: "❌ Something went wrong while fetching the response.",
                isTyping: false,
              }
            : msg
        )
      );
    }
  };
  

  const markMessageComplete = (id: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id
          ? { ...msg, isComplete: true }
          : msg
      )
    );
  };
  






  // const handleSendMessage = async (question: string) => {
  //   // 1️⃣ user message
  //   addMessage({
  //     id: crypto.randomUUID(),
  //     type: "user",
  //     content: question,
  //   });

  //   try {
  //     // 2️⃣ API call
  //     const data = await askTaxGPT(question);

  //     const parsedReferences = parseLegalReferences(
  //       data.Applicable_Legal_References
  //     );

  //     const parsedPDFs = (data.Source_Documents || []).map(
  //       (doc: any, index: number) => ({
  //         id: `${index + 1}`,
  //         name: doc.Title,
  //         url: doc.URL,
  //       })
  //     );

  //     // 3️⃣ AI message
  //     addMessage({
  //       id: crypto.randomUUID(),
  //       type: "ai",
  //       content: data.Answer,
  //       summary: data.Summary,
  //       recommendation: data.Recommendation,
  //       references: parsedReferences,
  //       pdfs: parsedPDFs,
  //     });
  //   } catch (error) {
  //     addMessage({
  //       id: crypto.randomUUID(),
  //       type: "ai",
  //       content: "❌ Something went wrong while fetching the response.",
  //     });
  //   }
  // };



 


























  // Welcome Screen (First Load)
  if (currentMode === 'gpt' && messages.length === 0) {
    return (
      <div className="flex h-screen">
        <Sidebar
          onNewChat={handleNewChat}
          onAccessGPT={handleAccessGPT}
          onAccessAgent={onAccessAgent}
          onAccessLibrary={onAccessLibrary}
          onLogout={onLogout}
          currentMode={currentMode}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLoadChat={handleLoadChat}
        />
        <div className="flex-1 flex flex-col">
          {/* Upgrade Banner */}
          <div className="border-b border-border p-4">
            <Button
              variant="outline"
              className="w-full max-w-md mx-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
              onClick={() => console.log('Upgrade clicked')}
            >
              <Crown className="h-4 w-4 text-primary" />
              <span className="font-medium">Upgrade your plan</span>
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-6 md:space-y-8 max-w-2xl w-full px-4 md:px-6">
              <div className="space-y-3 md:space-y-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">What are you working on today?</h1>
                <p className="text-muted-foreground text-base md:text-lg">
                  Choose how you'd like to interact with our AI system
                </p>
              </div>

              {/* Centered Input */}
              <form onSubmit={handleCenteredSubmit} className="w-full max-w-2xl">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                    <PlusButton onAddDocument={() => console.log('Add document')} onDeepSearch={() => console.log('Deep search')} />
                  </div>
                  <Input
                    value={centeredInput}
                    onChange={(e) => setCenteredInput(e.target.value)}
                    placeholder="Ask me anything about tax compliance..."
                    className="w-full h-14 pl-14 pr-24 text-lg rounded-xl border-2 focus:border-primary transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => console.log('Voice input')}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="submit"
                      disabled={!centeredInput.trim()}
                      className="h-8 w-8 rounded-lg"
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>

              {/* Mode Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8">
                <button
                  onClick={handleAccessGPT}
                  className="p-4 md:p-6 bg-card border border-border rounded-xl hover:bg-muted hover:border-primary/20 transition-all duration-300 text-left group"
                >
                  <h3 className="font-semibold mb-1 md:mb-2 group-hover:text-primary transition-colors text-sm md:text-base">Access Normal GPT</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Standard chat Q&A mode for general tax questions and advice
                  </p>
                </button>
                <button
                  onClick={onAccessAgent}
                  className="p-4 md:p-6 bg-card border border-border rounded-xl hover:bg-muted hover:border-primary/20 transition-all duration-300 text-left group"
                >
                  <h3 className="font-semibold mb-1 md:mb-2 group-hover:text-primary transition-colors text-sm md:text-base">Access Agent Andrew</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Dedicated document compliance analysis with Income Tax law validation
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat Mode
  return (
    <div className="flex h-screen">
      <Sidebar
        onNewChat={handleNewChat}
        onAccessGPT={handleAccessGPT}
        onAccessAgent={onAccessAgent}
        onAccessLibrary={onAccessLibrary}
        onLogout={onLogout}
        currentMode={currentMode}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLoadChat={handleLoadChat}
      />
      <div className="flex-1 flex flex-col">
        {/* Upgrade Banner */}
        <div className="border-b border-border p-4">
          <Button
            variant="outline"
            className="w-full max-w-md mx-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
            onClick={() => console.log('Upgrade clicked')}
          >
            <Crown className="h-4 w-4 text-primary" />
            <span className="font-medium">Upgrade your plan</span>
          </Button>
        </div>

        {/* Chat Header with Model Dropdown and Back Button */}
        <div className="border-b border-border p-3 md:p-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToWelcome}
              className="flex items-center gap-1 md:gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-32 md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="custom">Custom Model</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          onTypingComplete={markMessageComplete}
        />
      </div>
    </div>
  );
};

export default HomePage;