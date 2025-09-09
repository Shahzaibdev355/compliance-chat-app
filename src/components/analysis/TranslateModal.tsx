import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Languages, Copy, X } from 'lucide-react';
import { Flag } from '@/data/mockAnalysisData';
import { useToast } from '@/hooks/use-toast';

interface TranslateModalProps {
  flag: Flag | null;
  isOpen: boolean;
  onClose: () => void;
}

const TranslateModal: React.FC<TranslateModalProps> = ({
  flag,
  isOpen,
  onClose,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur'>('ur');
  const [translatedText, setTranslatedText] = useState('');
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  ];

  // Mock translation function
  const mockTranslate = (text: string, toLang: 'en' | 'ur') => {
    if (toLang === 'ur') {
      // Simple mock translation to Urdu (reversed text with some modifications)
      return `یہ ${text.split('').reverse().join('')} کا ترجمہ ہے۔`;
    } else {
      // If already in English, return original
      return text;
    }
  };

  useEffect(() => {
    if (flag) {
      setTranslatedText(mockTranslate(flag.summary, selectedLanguage));
    }
  }, [flag, selectedLanguage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText).then(() => {
      toast({
        title: "Translation Copied",
        description: "Translated text copied to clipboard",
        duration: 1500,
      });
    });
  };

  if (!flag) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] animate-scale-in">
        <DialogHeader className="pb-4 border-b border-border/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-primary" />
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Translation
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {flag.title}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Language Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Translate to:</span>
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={selectedLanguage === lang.code ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(lang.code as 'en' | 'ur')}
                className="flex items-center gap-2"
              >
                <span className="text-sm">{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
          </div>

          {/* Original Text */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">Original Text</h4>
              <Badge variant="outline" className="text-xs">
                English
              </Badge>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <ScrollArea className="max-h-32">
                <p className="text-sm leading-relaxed">
                  {flag.summary}
                </p>
              </ScrollArea>
            </div>
          </div>

          {/* Translated Text */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">Translation</h4>
              <Badge variant="default" className="text-xs">
                {languages.find(l => l.code === selectedLanguage)?.name}
              </Badge>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <ScrollArea className="max-h-32">
                <p 
                  className={`text-sm leading-relaxed ${
                    selectedLanguage === 'ur' ? 'text-right' : 'text-left'
                  }`}
                  dir={selectedLanguage === 'ur' ? 'rtl' : 'ltr'}
                >
                  {translatedText}
                </p>
              </ScrollArea>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/20">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              <Copy className="h-3 w-3" />
              Copy Translation
            </Button>
            <div className="ml-auto">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground bg-muted/20 rounded p-2">
            <strong>Note:</strong> This is a mock translation for demonstration purposes. 
            In a production environment, this would integrate with a professional translation service.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TranslateModal;