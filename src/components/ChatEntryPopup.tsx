import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Edit3, Share, Trash2, Check, X } from 'lucide-react';
import { useChatHistory } from '@/contexts/ChatHistoryContext';

interface ChatEntryPopupProps {
  chatId: string;
  currentTitle: string;
  children: React.ReactNode;
}

const ChatEntryPopup: React.FC<ChatEntryPopupProps> = ({
  chatId,
  currentTitle,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(currentTitle);
  const { updateChatTitle, deleteChatEntry, shareChatEntry } = useChatHistory();

  const handleRename = () => {
    if (newTitle.trim()) {
      updateChatTitle(chatId, newTitle.trim());
      setIsRenaming(false);
      setIsOpen(false);
    }
  };

  const handleCancelRename = () => {
    setNewTitle(currentTitle);
    setIsRenaming(false);
  };

  const handleShare = () => {
    shareChatEntry(chatId);
    setIsOpen(false);
  };

  const handleDelete = () => {
    deleteChatEntry(chatId);
    setIsOpen(false);
  };

  if (isRenaming) {
    return (
      <div className="flex items-center gap-2 w-full animate-scale-in">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 h-8 text-sm"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename();
            if (e.key === 'Escape') handleCancelRename();
          }}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRename}
          className="h-8 w-8 p-0"
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancelRename}
          className="h-8 w-8 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 animate-scale-in" align="start">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 text-sm"
            onClick={() => {
              setIsRenaming(true);
              setIsOpen(false);
            }}
          >
            <Edit3 className="h-3 w-3 mr-2" />
            Rename
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 text-sm"
            onClick={handleShare}
          >
            <Share className="h-3 w-3 mr-2" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 text-sm text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3 mr-2" />
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChatEntryPopup;