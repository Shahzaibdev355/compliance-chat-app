import React, { useState } from 'react';
import { Volume2, Languages, Copy, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flag } from '@/data/mockAnalysisData';
import { useToast } from '@/hooks/use-toast';
import TranslateModal from './TranslateModal';

interface TextFindingsProps {
  flags: Flag[];
  onFlagClick: (flagId: string) => void;
}

const TextFindings: React.FC<TextFindingsProps> = ({
  flags,
  onFlagClick,
}) => {
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [translateFlag, setTranslateFlag] = useState<Flag | null>(null);
  const { toast } = useToast();

  const handlePlay = (text: string, flagId: string) => {
    if ('speechSynthesis' in window) {
      if (playingText === flagId) {
        speechSynthesis.cancel();
        setPlayingText(null);
        return;
      }

      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.onstart = () => setPlayingText(flagId);
      utterance.onend = () => setPlayingText(null);
      utterance.onerror = () => setPlayingText(null);
      
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
        description: "Text snippet copied to clipboard",
        duration: 1500,
      });
    });
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'Red': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'Yellow': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'Green': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      case 'Blue': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950';
    }
  };

  const getColorDot = (color: string) => {
    switch (color) {
      case 'Red': return 'bg-red-500';
      case 'Yellow': return 'bg-yellow-500';
      case 'Green': return 'bg-green-500';
      case 'Blue': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full" style={{border: ''}}>
      <ScrollArea className="h-full p-4">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Extracted text snippets that triggered compliance flags
          </div>
          
          {flags.map((flag) => {
            const isPlaying = playingText === flag.id;

            return (
              <div
                key={flag.id}
                className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getColorClass(flag.flag)}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full mt-1 ${getColorDot(flag.flag)}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">{flag.reason}</h4>
                      {/* <Badge variant="outline" className="text-xs">
                        Page {flag.page}, Line {flag.lineNumber}
                      </Badge> */}
                    </div>
                    
                    <div 
                      className={`bg-background/50 border border-border/20 rounded p-3 mb-3 ${
                        isPlaying ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                    >
                      <p className="text-sm font-mono leading-relaxed">
                        "{flag.summary}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlay(flag.textSnippet, flag.id)}
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
                        onClick={() => handleCopy(flag.textSnippet)}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                      
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onFlagClick(flag.id)}
                        className="flex items-center gap-2 ml-auto"
                      >
                        <MapPin className="h-3 w-3" />
                        Locate in PDF
                      </Button> */}
                    </div>
                  </div>
                </div>
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

export default TextFindings;