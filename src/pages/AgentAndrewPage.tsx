import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  ArrowLeft
} from 'lucide-react';

interface AgentAndrewPageProps {
  onBack: () => void;
}

const AgentAndrewPage: React.FC<AgentAndrewPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleProceed = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          // Store uploaded file data for analysis result page
          localStorage.setItem('uploadedPdf', uploadedFile.name);
          localStorage.setItem('additionalQuery', query);
          // Navigate to analysis result page
          navigate('/analysis-result');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCancel = () => {
    setUploadedFile(null);
    setQuery('');
    setResults(null);
    setProgress(0);
    setIsProcessing(false);
  };

  const handleDownloadReport = () => {
    console.log('Downloading compliance report...');
    // TODO: Generate and download PDF report
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4 md:p-6">
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Agent Andrew</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              AI-powered document compliance analysis for Income Tax laws
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {!results ? (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* File Upload Area */}
            <Card>
              <CardContent className="p-8">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 md:p-12 text-center transition-colors ${
                    dragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-muted-foreground" />
                  <h3 className="text-base md:text-lg font-semibold mb-2">
                    Upload Documents for Analysis
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base mb-3 md:mb-4">
                    Drag & drop your PDF files or images here, or click to browse
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>

                {uploadedFile && (
                  <div className="mt-4 p-4 bg-muted rounded-lg fade-in">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{uploadedFile.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setUploadedFile(null)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Optional Query */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Additional Query (Optional)</h3>
                <Textarea
                  placeholder="Add specific questions or areas of focus for the compliance analysis..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-end">
              <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button 
                onClick={handleProceed}
                disabled={!uploadedFile || isProcessing}
                className="w-full sm:w-auto"
              >
                {isProcessing ? 'Processing...' : 'Proceed with Analysis'}
              </Button>
            </div>

            {/* Processing Progress */}
            {isProcessing && (
              <Card className="fade-in">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Analyzing Document...</span>
                      <span className="text-sm text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                    <p className="text-xs text-muted-foreground">
                      Checking compliance with current Income Tax regulations
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Results View */
          <div className="max-w-4xl mx-auto space-y-6 fade-in">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Compliance Analysis Report</h2>
              <Button onClick={handleDownloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF Report
              </Button>
            </div>

            {/* Red Flags */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-500">Critical Issues</h3>
                </div>
                <div className="space-y-3">
                  {results.redFlags.map((flag: string, index: number) => (
                    <div key={index} className="flex gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{flag}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Yellow Flags */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-yellow-500">Warnings</h3>
                </div>
                <div className="space-y-3">
                  {results.yellowFlags.map((flag: string, index: number) => (
                    <div key={index} className="flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{flag}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Green Flags */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-green-500">Compliant Items</h3>
                </div>
                <div className="space-y-3">
                  {results.greenFlags.map((flag: string, index: number) => (
                    <div key={index} className="flex gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{flag}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* New Analysis Button */}
            <div className="text-center">
              <Button variant="outline" onClick={handleCancel}>
                Start New Analysis
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentAndrewPage;