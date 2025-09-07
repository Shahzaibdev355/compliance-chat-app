import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, Edit2 } from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface SearchChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchChatDialog: React.FC<SearchChatDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Mock chat data - organized by time
  const mockChats: Chat[] = [
    {
      id: '1',
      title: 'Tax deduction questions',
      lastMessage: 'What expenses can I deduct as a freelancer?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      title: 'Business incorporation advice',
      lastMessage: 'Should I incorporate my small business?',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: '3',
      title: 'Income tax calculations',
      lastMessage: 'Help me calculate my quarterly taxes',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '4',
      title: 'Property tax assessment',
      lastMessage: 'My property tax seems too high',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      id: '5',
      title: 'Retirement planning',
      lastMessage: 'IRA vs 401k tax implications',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
  ];

  const filteredChats = mockChats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupChatsByTime = (chats: Chat[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groups = {
      today: [] as Chat[],
      yesterday: [] as Chat[],
      lastWeek: [] as Chat[],
      older: [] as Chat[],
    };

    chats.forEach((chat) => {
      if (chat.timestamp >= today) {
        groups.today.push(chat);
      } else if (chat.timestamp >= yesterday) {
        groups.yesterday.push(chat);
      } else if (chat.timestamp >= lastWeek) {
        groups.lastWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  };

  const chatGroups = groupChatsByTime(filteredChats);

  const handleEditChat = (chatId: string, currentTitle: string) => {
    setEditingChat(chatId);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = () => {
    // Here you would update the chat title in your state/backend
    console.log('Saving chat title:', editTitle);
    setEditingChat(null);
    setEditTitle('');
  };

  const ChatGroup = ({ title, chats }: { title: string; chats: Chat[] }) => {
    if (chats.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          {title}
        </h3>
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer group transition-all duration-200"
            >
              <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {editingChat === chat.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') {
                          setEditingChat(null);
                          setEditTitle('');
                        }
                      }}
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-sm truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                  </>
                )}
              </div>
              {editingChat !== chat.id && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditChat(chat.id, chat.title);
                  }}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Chat History
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Chat Groups */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredChats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No chats found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              <>
                <ChatGroup title="Today" chats={chatGroups.today} />
                <ChatGroup title="Yesterday" chats={chatGroups.yesterday} />
                <ChatGroup title="Last 7 days" chats={chatGroups.lastWeek} />
                <ChatGroup title="Older archives" chats={chatGroups.older} />
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchChatDialog;