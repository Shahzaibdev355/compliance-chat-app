import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useChatHistory } from '@/contexts/ChatHistoryContext';
import SearchChatDialog from './SearchChatDialog';
import ChatEntryPopup from './ChatEntryPopup';
import { useNavigate } from 'react-router-dom';
import taxtroLogo from '@/assets/taxtro-logo.png';
import taxtroIcon from '@/assets/taxtro-icon.png';
import {
  MessageSquare,
  Search,
  FileText,
  User,
  LogOut,
  Palette,
  Bot,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Edit3,
  History
} from 'lucide-react';

interface SidebarProps {
  onNewChat: () => void;
  onAccessGPT: () => void;
  onAccessAgent: () => void;
  onAccessLibrary: () => void;
  onLogout: () => void;
  currentMode: 'gpt' | 'agent' | 'chat';
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onLoadChat?: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onNewChat,
  onAccessGPT,
  onAccessAgent,
  onAccessLibrary,
  onLogout,
  currentMode,
  collapsed = false,
  onToggleCollapse,
  onLoadChat
}) => {
  const { theme } = useTheme();
  const { chatHistory } = useChatHistory();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  const handleSearchChat = () => {
    setShowSearchDialog(true);
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-sidebar-background border-r border-border flex flex-col h-full transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center flex-1 overflow-hidden">
          {collapsed ? (
            <img 
              src={taxtroIcon} 
              alt="TaxTro" 
              className="h-8 w-8 animate-fade-in transition-all duration-300 ease-in-out"
            />
          ) : (
            <img 
              src={taxtroLogo} 
              alt="TaxTro AI" 
              className="h-10 w-auto animate-fade-in transition-all duration-300 ease-in-out"
            />
          )}
        </div>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="ml-2 flex-shrink-0 transition-all duration-300 ease-in-out hover:bg-sidebar-hover"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-in-out" />
            ) : (
              <ChevronLeft className="h-4 w-4 transition-transform duration-300 ease-in-out" />
            )}
          </Button>
        )}
      </div>

      {/* Main Actions */}
      <div className="flex-1 p-4 space-y-2">
        {/* Dual Mode Access */}
        <div className="space-y-2 mb-6">
          {!collapsed && (
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide animate-fade-in transition-opacity duration-300 ease-in-out delay-75">
              AI Modes
            </h3>
          )}
          <Button
            variant={currentMode === 'gpt' ? 'default' : 'ghost'}
            className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} transition-all duration-300 ease-in-out`}
            onClick={onAccessGPT}
            title={collapsed ? "Normal GPT" : undefined}
          >
            <Bot className={`h-4 w-4 ${collapsed ? '' : 'mr-3'} transition-all duration-300 ease-in-out`} />
            {!collapsed && <span className="animate-fade-in transition-opacity duration-300 ease-in-out delay-100">Normal GPT</span>}
          </Button>
          <Button
            variant={currentMode === 'agent' ? 'default' : 'ghost'}
            className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} transition-all duration-300 ease-in-out`}
            onClick={onAccessAgent}
            title={collapsed ? "Agent Andrew" : undefined}
          >
            <FileCheck className={`h-4 w-4 ${collapsed ? '' : 'mr-3'} transition-all duration-300 ease-in-out`} />
            {!collapsed && <span className="animate-fade-in transition-opacity duration-300 ease-in-out delay-100">Agent Andrew</span>}
          </Button>
        </div>

        {/* Chat Actions - Always Visible */}
        <div className="space-y-2 mb-6">
          {!collapsed && (
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide animate-fade-in transition-opacity duration-300 ease-in-out">
              Chat
            </h3>
          )}
          {currentMode === 'chat' && (
            <Button
              variant="ghost"
              className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} transition-all duration-300 ease-in-out`}
              onClick={onNewChat}
              title={collapsed ? "New Chat" : undefined}
            >
              <MessageSquare className={`h-4 w-4 ${collapsed ? '' : 'mr-3'} transition-all duration-300 ease-in-out`} />
              {!collapsed && <span className="animate-fade-in transition-opacity duration-300 ease-in-out delay-100">New Chat</span>}
            </Button>
          )}
          <Button
            variant="ghost"
            className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} transition-all duration-300 ease-in-out`}
            onClick={handleSearchChat}
            title={collapsed ? "Search Chat" : undefined}
          >
            <Search className={`h-4 w-4 ${collapsed ? '' : 'mr-3'} transition-all duration-300 ease-in-out`} />
            {!collapsed && <span className="animate-fade-in transition-opacity duration-300 ease-in-out delay-100">Search Chat</span>}
          </Button>
        </div>

        {/* Library */}
        <div className="space-y-2 mb-6">
          {!collapsed && (
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide animate-fade-in transition-opacity duration-300 ease-in-out delay-75">
              Documents
            </h3>
          )}
          <Button
            variant="ghost"
            className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} transition-all duration-300 ease-in-out`}
            onClick={onAccessLibrary}
            title={collapsed ? "Library" : undefined}
          >
            <FileText className={`h-4 w-4 ${collapsed ? '' : 'mr-3'} transition-all duration-300 ease-in-out`} />
            {!collapsed && <span className="animate-fade-in transition-opacity duration-300 ease-in-out delay-100">Library</span>}
          </Button>
        </div>

        {/* Chat History */}
        {!collapsed && chatHistory.length > 0 && (
          <div className="space-y-2 mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide animate-fade-in transition-opacity duration-300 ease-in-out delay-75">
              Chat History
            </h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {chatHistory.slice(0, 5).map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-sidebar-hover transition-all duration-200 animate-slide-in group cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => onLoadChat?.(entry.id)}
                >
                  <History className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-foreground truncate flex-1">
                    {entry.title}
                  </span>
                  <ChatEntryPopup
                    chatId={entry.id}
                    currentTitle={entry.title}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </ChatEntryPopup>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Theme Settings */}
        <Button
          variant="ghost"
          className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} transition-all duration-300 ease-in-out`}
          onClick={() => navigate('/theme-settings')}
          title={collapsed ? "Theme Settings" : undefined}
        >
          <Palette className={`h-4 w-4 ${collapsed ? '' : 'mr-3'} transition-all duration-300 ease-in-out`} />
          {!collapsed && <span className="animate-fade-in transition-opacity duration-300 ease-in-out delay-100">Theme Settings</span>}
        </Button>

        {/* User Profile */}
        <Button
          variant="ghost"
          className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} transition-all duration-300 ease-in-out`}
          onClick={() => setShowProfile(!showProfile)}
          title={collapsed ? "Profile" : undefined}
        >
          <User className={`h-4 w-4 ${collapsed ? '' : 'mr-3'} transition-all duration-300 ease-in-out`} />
          {!collapsed && <span className="animate-fade-in transition-opacity duration-300 ease-in-out delay-100">Profile</span>}
        </Button>

        {showProfile && !collapsed && (
          <div className="ml-7 text-sm text-muted-foreground space-y-1 animate-fade-in transition-all duration-300 ease-in-out group">
            <p>John Doe</p>
            <p>john@example.com</p>
            <p className="text-xs">Professional Plan</p>
          </div>
        )}

        {/* Logout */}
        <Button
          variant="ghost"
          className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} text-destructive hover:text-destructive transition-all duration-300 ease-in-out`}
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className={`h-4 w-4 ${collapsed ? '' : 'mr-3'} transition-all duration-300 ease-in-out`} />
          {!collapsed && <span className="animate-fade-in transition-opacity duration-300 ease-in-out delay-100">Logout</span>}
        </Button>
      </div>

      {/* Search Chat Dialog */}
      <SearchChatDialog 
        open={showSearchDialog} 
        onOpenChange={setShowSearchDialog} 
      />
    </div>
  );
};

export default Sidebar;