import React, { useState } from 'react';
import { Edit, Download, FileText, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    // Mock download
    console.log('Downloading annotated PDF:', data.annotatedPdfUrl);
  };

  const handleExportReport = (format: 'pdf' | 'csv') => {
    toast({
      title: "Export Started",
      description: `Report export (${format.toUpperCase()}) initiated`,
      duration: 2000,
    });
    // Mock export
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

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border/20 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{data.documentTitle}</h2>
            <p className="text-sm text-muted-foreground">Processed on {data.timestamp}</p>
          </div>
        </div>
        
        {data.additionalQuery && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Additional Query: "{data.additionalQuery}"
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Pie Chart */}
      <div className="border-b border-border/20 p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Analysis Overview</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={60}
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

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="m-4 mb-0">
            <TabsTrigger value="flags" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Flags
            </TabsTrigger>
            <TabsTrigger value="findings" className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              Text Findings
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Plus className="h-3 w-3" />
              Recommendations
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
          </div>
        </Tabs>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-border/20 p-4 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAnnotated}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportReport('pdf')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportReport('csv')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export CSV
          </Button>
          <div className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button
            size="sm"
            onClick={handleStartNewAnalysis}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;