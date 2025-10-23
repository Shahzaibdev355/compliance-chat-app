import React, { useState } from 'react';
import { Edit, Download, FileText, Share, Plus, Flag, BarChart3, MessageSquare, Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import FlagsList from './FlagsList';
import TextFindings from './TextFindings';
import Recommendations from './Recommendations';
import { AnalysisData } from '@/data/mockAnalysisData';
import { useToast } from '@/hooks/use-toast';

interface ResultsPanelProps {
  data: AnalysisData;
  selectedFlagId: string | null;
  filteredColor: string | null;
  onFlagClick: (flagId: string) => void;
  onPieSegmentClick: (color: string) => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  data,
  selectedFlagId,
  filteredColor,
  onFlagClick,
  onPieSegmentClick,
}) => {
  const [activeTab, setActiveTab] = useState('flags');
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'assistant', content: string}>>([]);
  const { toast } = useToast();

  // Calculate counts for pie chart
  const colorCounts = data.flags.reduce((acc, flag) => {
    acc[flag.color] = (acc[flag.color] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(colorCounts).map(([color, count]) => ({
    name: color.charAt(0).toUpperCase() + color.slice(1),
    value: count,
    color: color,
    percentage: ((count / data.flags.length) * 100).toFixed(1),
  }));

  const COLORS = {
    red: '#ef4444',
    yellow: '#eab308',
    green: '#22c55e',
    blue: '#3b82f6',
  };

  const handleDownloadAnnotated = () => {
    toast({
      title: "Download Started",
      description: "Annotated PDF download initiated",
      duration: 2000,
    });
    console.log('Downloading annotated PDF:', data.annotatedPdfUrl);
  };

  const handleExportReport = (format: 'pdf' | 'csv') => {
    toast({
      title: "Export Started",
      description: `Report export (${format.toUpperCase()}) initiated`,
      duration: 2000,
    });
    console.log('Exporting report as:', format);
  };

  const handleStartNewAnalysis = () => {
    toast({
      title: "New Analysis",
      description: "Starting new analysis...",
      duration: 2000,
    });
    console.log('Starting new analysis');
  };

  const handleShare = () => {
    toast({
      title: "Share Link Copied",
      description: "Analysis share link copied to clipboard",
      duration: 2000,
    });
    console.log('Sharing analysis');
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        content: newMessage
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'assistant' as const,
          content: getDummyResponse(newMessage)
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }, 1000);
      
      setNewMessage('');
      toast({
        title: "Query Sent",
        description: "Processing your question...",
        duration: 2000,
      });
    }
  };

  const getDummyResponse = (query: string): string => {
    const responses = [
      "Based on the document analysis, I found that this relates to compliance requirements. The relevant section shows that proper documentation is required for this matter.",
      "According to the tax regulations, this issue requires immediate attention. I recommend reviewing the specific clauses mentioned in pages 3-5 of your document.",
      "The analysis indicates that this falls under the yellow flag category. You should consult with a tax professional to ensure full compliance.",
      "This query relates to the compliance findings in your document. The relevant provisions suggest that corrective action may be needed within 30 days.",
      "Based on the uploaded document, this issue appears in multiple sections. I recommend prioritizing the red-flagged items first before addressing this concern."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
      toast({
        title: "Playing Audio",
        description: "Text-to-speech started",
        duration: 2000,
      });
    } else {
      console.log('Text-to-speech:', text);
      toast({
        title: "Audio Not Available",
        description: "Text-to-speech not supported",
        duration: 2000,
      });
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Text Copied",
      description: "Text copied to clipboard",
      duration: 1500,
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border/20 p-3 md:p-4 space-y-2 md:space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-foreground">{data.documentTitle}</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Processed on {data.timestamp}</p>
          </div>
        </div>
        
        {data.additionalQuery && (
          <div className="text-xs md:text-sm text-muted-foreground">
            Additional Query: {data.additionalQuery}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="m-3 md:m-4 mb-0 overflow-x-auto flex-wrap h-auto">
            <TabsTrigger value="flags" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Flag className="h-3 w-3" />
              <span className="hidden sm:inline">Flags</span>
            </TabsTrigger>
            <TabsTrigger value="findings" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <FileText className="h-3 w-3" />
              <span className="hidden sm:inline">Text Findings</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Plus className="h-3 w-3" />
              <span className="hidden sm:inline">Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="graph" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <BarChart3 className="h-3 w-3" />
              <span className="hidden sm:inline">Graph</span>
            </TabsTrigger>
            <TabsTrigger value="additional-query" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <MessageSquare className="h-3 w-3" />
              <span className="hidden sm:inline">Query</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="flags" className="h-full m-0">
              <FlagsList
                flags={data.flags}
                selectedFlagId={selectedFlagId}
                filteredColor={filteredColor}
                onFlagClick={onFlagClick}
              />
            </TabsContent>

            <TabsContent value="findings" className="h-full m-0">
              <TextFindings
                flags={data.flags}
                onFlagClick={onFlagClick}
              />
            </TabsContent>

            <TabsContent value="recommendations" className="h-full m-0">
              <Recommendations
                recommendations={data.recommendations}
              />
            </TabsContent>

            <TabsContent value="graph" className="h-full m-0">
              <div className="p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Analysis Overview</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onClick={(data) => onPieSegmentClick(data.color)}
                        className="cursor-pointer"
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[entry.color as keyof typeof COLORS]}
                            stroke={filteredColor === entry.color ? "#000" : "none"}
                            strokeWidth={filteredColor === entry.color ? 2 : 0}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value} (${props.payload.percentage}%)`,
                          props.payload.name
                        ]}
                      />
                      <Legend 
                        formatter={(value, entry: any) => (
                          <span className={`text-xs ${filteredColor === entry.payload?.color ? 'font-bold' : ''}`}>
                            {entry.payload?.name}: {entry.payload?.value} ({entry.payload?.percentage}%)
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional-query" className="h-full m-0">
              <div className="p-4 space-y-4 h-full flex flex-col">
                {/* Initial Query and Response - Show if there's an initial query */}
                {data.additionalQuery && (
                  <div className="space-y-4 pb-4 border-b border-border/20">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Your Question:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {data.additionalQuery}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground">Response:</h4>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSpeakText("Based on the analysis of your uploaded document, I found several key compliance points related to your query. The document shows proper tax calculation methods and adherence to current Income Tax regulations. However, there are a few areas that may need attention for complete compliance.")}
                            className="h-7 px-2"
                            title="Play Audio"
                          >
                            🔊
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyText("Based on the analysis of your uploaded document, I found several key compliance points related to your query. The document shows proper tax calculation methods and adherence to current Income Tax regulations. However, there are a few areas that may need attention for complete compliance.")}
                            className="h-7 px-2"
                            title="Copy"
                          >
                            📋
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        Based on the analysis of your uploaded document, I found several key compliance points related to your query. The document shows proper tax calculation methods and adherence to current Income Tax regulations. However, there are a few areas that may need attention for complete compliance.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-3">
                  {!data.additionalQuery && chatMessages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Start a conversation about your analysis</p>
                    </div>
                  )}
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-foreground'
                      }`}>
                        <p>{message.content}</p>
                        {message.type === 'assistant' && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSpeakText(message.content)}
                              className="h-6 px-2 text-xs"
                              title="Play Audio"
                            >
                              🔊
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyText(message.content)}
                              className="h-6 px-2 text-xs"
                              title="Copy"
                            >
                              📋
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Chat Input */}
                <div className="flex gap-2 pt-3 border-t border-border/20">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                  >
                    Send
                  </Button>
                  <Button variant="outline" size="sm">
                    🎤
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Bottom Action Bar - Only show for Flags tab */}
      {activeTab === 'flags' && (
        <div className="border-t border-border/20 p-3 md:p-4 bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAnnotated}
              className="flex items-center gap-2 text-xs"
            >
              <Download className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('pdf')}
              className="flex items-center gap-2 text-xs"
            >
              <FileText className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('csv')}
              className="flex items-center gap-2 text-xs"
            >
              <FileText className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">CSV</span>
            </Button>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2 text-xs"
            >
              <Share className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              size="sm"
              onClick={handleStartNewAnalysis}
              className="flex items-center gap-2 text-xs"
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">New Analysis</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;