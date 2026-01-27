import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Mic,
  Plus,
  Send,
  Volume2,
  Copy,
  Languages,
  FileText,
  Search as SearchIcon,
  Loader2
} from 'lucide-react';
import { ReferenceButtons } from './ReferenceButtons';
import Typewriter from 'typewriter-effect';
import type { Message } from '@/types/chat';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onTypingComplete: (id: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onTypingComplete,
}) => {

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [documentMode, setDocumentMode] = useState(false);
  const [deepSearchMode, setDeepSearchMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    console.log('Voice recording:', !isRecording);
  };

  const handleAddDocument = () => {
    console.log('Add document clicked');
    setDocumentMode(!documentMode);
    setShowAddMenu(false);
  };

  const handleDeepSearch = () => {
    console.log('Deep search clicked');
    setDeepSearchMode(!deepSearchMode);
    setShowAddMenu(false);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    console.log('Copied to clipboard');
  };

  const handleSpeak = (content: string) => {
    console.log('Speaking:', content);
  };

  const handleTranslate = (content: string) => {
    console.log('Translate:', content);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Welcome to Taxtro AI</h3>
              <p className="text-muted-foreground">
                Your professional AI assistant for tax compliance and advisory.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
                  }`}
              >
                {message.type === "ai" ? (
                  message.isTyping ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        AI is generating response...
                      </span>
                    </div>
                  ) : (
                    <Typewriter
                    key={message.id}
                      options={{ cursor: "|" }}
                      onInit={(typewriter) => {
                        typewriter
                          .changeDelay(25)
                          .typeString(message.content)
                          .callFunction(() => {
                            onTypingComplete(message.id);
                          })
                          .start();
                      }}
                    />
                  )
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}

                {message.type === 'ai' && message.isComplete && (
                  <>
                    <div className="flex gap-2 mt-3 pt-2 border-t border-border/20">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSpeak(message.content)}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleTranslate(message.content)}
                      >
                        <Languages className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Reference Buttons */}
                    <ReferenceButtons
                      references={message.references || []}
                      summary={message.summary || ""}
                      recommendation={message.recommendation || ""}
                      availablePDFs={message.pdfs || []}
                    />
                  </>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 space-y-3">
        {/* Document Mode Toggle */}
        {documentMode && (
          <Card className="p-3 bg-muted fade-in">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              <span>Document analysis mode active</span>
              <Button size="sm" variant="ghost" onClick={() => setDocumentMode(false)}>
                ✕
              </Button>
            </div>
          </Card>
        )}

        {/* Deep Search Mode Toggle */}
        {deepSearchMode && (
          <Card className="p-3 bg-muted fade-in">
            <div className="flex items-center gap-2 text-sm">
              <SearchIcon className="h-4 w-4" />
              <span>Deep search mode active</span>
              <Button size="sm" variant="ghost" onClick={() => setDeepSearchMode(false)}>
                ✕
              </Button>
            </div>
          </Card>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-2 items-end">
            {/* Add Menu */}
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddMenu(!showAddMenu)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              {showAddMenu && (
                <div className="absolute bottom-full mb-2 left-0 bg-popover border border-border rounded-md shadow-lg p-2 space-y-1 min-w-48 fade-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleAddDocument}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Add Document
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleDeepSearch}
                  >
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Deep Search
                  </Button>
                </div>
              )}
            </div>

            {/* Text Input */}
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about tax compliance..."
                className="w-full"
              />
            </div>

            {/* Voice Recording */}
            <Button
              type="button"
              variant={isRecording ? 'default' : 'outline'}
              size="sm"
              onClick={handleVoiceRecord}
            >
              <Mic className={`h-4 w-4 ${isRecording ? 'text-red-500' : ''}`} />
            </Button>

            {/* Send Button */}
            <Button
              type="submit"
              disabled={!input.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
