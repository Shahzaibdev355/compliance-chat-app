import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Search } from 'lucide-react';

interface PlusButtonProps {
  onAddDocument: () => void;
  onDeepSearch: () => void;
}

const PlusButton: React.FC<PlusButtonProps> = ({ onAddDocument, onDeepSearch }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPopup]);

  const handleOptionClick = (action: () => void) => {
    action();
    setShowPopup(false);
  };

  return (
    <div className="relative" ref={popupRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 rounded-lg"
        onClick={() => setShowPopup(!showPopup)}
      >
        <Plus className="h-4 w-4" />
      </Button>

      {showPopup && (
        <div className="absolute left-0 bottom-full mb-2 bg-popover border border-border rounded-lg shadow-lg py-2 min-w-48 animate-scale-in">
          <button
            onClick={() => handleOptionClick(onAddDocument)}
            className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-3"
          >
            <FileText className="h-4 w-4" />
            <span>Add Document</span>
          </button>
          <button
            onClick={() => handleOptionClick(onDeepSearch)}
            className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-3"
          >
            <Search className="h-4 w-4" />
            <span>Deep Search</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PlusButton;