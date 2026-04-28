import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Volume2, Languages, Copy, CheckCircle, UserPlus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flag } from '@/data/mockAnalysisData';
import { useToast } from '@/hooks/use-toast';
import TranslateModal from './TranslateModal';

interface FlagsListProps {
  flags: Flag[];
  selectedFlagId: string | null;
  filteredColor: string | null;
  onFlagClick: (flagId: string) => void;
}

const FlagsList: React.FC<FlagsListProps> = ({
  flags,
  selectedFlagId,
  filteredColor,
  onFlagClick,
}) => {
  const [expandedFlags, setExpandedFlags] = useState<Set<string>>(new Set());
  const [playingFlag, setPlayingFlag] = useState<string | null>(null);
  const [translateFlag, setTranslateFlag] = useState<Flag | null>(null);
  const [resolvedFlags, setResolvedFlags] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Filter and sort flags
  const filteredFlags = flags
    // .filter(flag => !filteredColor || flag.color === filteredColor)
    .filter(flag => !filteredColor || flag.flag === filteredColor)
    .sort((a, b) => a.severity - b.severity);

  const toggleExpanded = (flagId: string) => {
    const newExpanded = new Set(expandedFlags);
    if (newExpanded.has(flagId)) {
      newExpanded.delete(flagId);
    } else {
      newExpanded.add(flagId);
    }
    setExpandedFlags(newExpanded);
  };

  const handlePlay = (flag: Flag) => {
    if ('speechSynthesis' in window) {
      if (playingFlag === flag.id) {
        speechSynthesis.cancel();
        setPlayingFlag(null);
        return;
      }

      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(flag.summary);
      utterance.rate = 0.8;
      utterance.onstart = () => setPlayingFlag(flag.id);
      utterance.onend = () => setPlayingFlag(null);
      utterance.onerror = () => setPlayingFlag(null);
      
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-Speech Unavailable",
        description: "Your browser doesn't support text-to-speech",
        duration: 3000,
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Text Copied",
        description: "Flag summary copied to clipboard",
        duration: 1500,
      });
    });
  };

  const handleResolve = (flagId: string) => {
    const newResolved = new Set(resolvedFlags);
    if (newResolved.has(flagId)) {
      newResolved.delete(flagId);
    } else {
      newResolved.add(flagId);
    }
    setResolvedFlags(newResolved);
    
    toast({
      title: newResolved.has(flagId) ? "Flag Resolved" : "Flag Reopened",
      description: newResolved.has(flagId) ? "Flag marked as resolved" : "Flag marked as unresolved",
      duration: 2000,
    });
  };

  const handleAssign = () => {
    toast({
      title: "Assignment Feature",
      description: "Flag assignment functionality would be implemented here",
      duration: 2000,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Flag export functionality would be implemented here",
      duration: 2000,
    });
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'Red': return 'bg-red-500';
      case 'Yellow': return 'bg-yellow-500';
      case 'Green': return 'bg-green-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // const getSeverityLabel = (severity: number) => {
  //   if (severity <= 2) return 'Critical';
  //   if (severity <= 4) return 'Warning';
  //   return 'Info';
  // };

  const getSeverityLabel = (flag: string) => {
    if (flag === 'Red') return 'Critical';
    if (flag === 'Yellow') return 'Warning';
    return 'Info';
};

  return (
    <div className="h-full flex flex-col" style={{border: ''}}>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {filteredFlags.map((flag) => {
            const isExpanded = expandedFlags.has(flag.id);
            const isSelected = selectedFlagId === flag.id;
            const isResolved = resolvedFlags.has(flag.id);
            const isPlaying = playingFlag === flag.id;

            return (
              <div
                key={flag.id}
                className={`border border-border/20 rounded-lg transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                } ${isResolved ? 'opacity-60' : ''}`}
              >
                <div
                  className="p-3 cursor-pointer hover:bg-muted/20 transition-colors duration-200"
                  onClick={() => onFlagClick(flag.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getColorClass(flag.flag)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium text-sm ${isResolved ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {flag.reason}
                        </h4>
                        {/* <Badge variant="outline" className="text-xs">
                          Page {flag.page}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {flag.confidence}%
                        </Badge> */}
                        <Badge 
                           variant={flag.flag === 'Red' ? "destructive" : flag.flag === 'Yellow' ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {getSeverityLabel(flag.flag)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {flag.summary}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(flag.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border/20 p-3 space-y-3 animate-accordion-down">
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Summary</h5>
                      <p className={`text-sm leading-relaxed ${isPlaying ? 'bg-primary/10 rounded px-2 py-1' : ''}`}>
                        {flag.summary}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Recommendation</h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {flag.recommendation}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border/20">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlay(flag)}
                        className="flex items-center gap-2"
                        disabled={isPlaying}
                      >
                        <Volume2 className="h-3 w-3" />
                        {isPlaying ? 'Playing...' : 'Play'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTranslateFlag(flag)}
                        className="flex items-center gap-2"
                      >
                        <Languages className="h-3 w-3" />
                        Translate
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(flag.summary)}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                      
                      <Button
                        variant={isResolved ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleResolve(flag.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {isResolved ? 'Resolved' : 'Mark Resolved'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAssign}
                        className="flex items-center gap-2"
                      >
                        <UserPlus className="h-3 w-3" />
                        Assign
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-3 w-3" />
                        Export
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <TranslateModal
        flag={translateFlag}
        isOpen={!!translateFlag}
        onClose={() => setTranslateFlag(null)}
      />
    </div>
  );
};

export default FlagsList;