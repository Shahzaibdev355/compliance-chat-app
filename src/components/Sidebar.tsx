import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
  MessageSquare,
  Search,
  FileText,
  User,
  LogOut,
  Sun,
  Moon,
  Bot,
  FileCheck
} from 'lucide-react';

interface SidebarProps {
  onNewChat: () => void;
  onAccessGPT: () => void;
  onAccessAgent: () => void;
  onLogout: () => void;
  currentMode: 'gpt' | 'agent' | 'chat';
}

const Sidebar: React.FC<SidebarProps> = ({
  onNewChat,
  onAccessGPT,
  onAccessAgent,
  onLogout,
  currentMode
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);

  const handleSearchChat = () => {
    console.log('Search chat clicked');
    // TODO: Open search modal
  };

  const handleLibrary = () => {
    console.log('Library clicked');
    // TODO: Open library modal
  };

  return (
    <div className="w-64 bg-sidebar-background border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Taxtro AI</h2>
      </div>

      {/* Main Actions */}
      <div className="flex-1 p-4 space-y-2">
        {/* Dual Mode Access */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            AI Modes
          </h3>
          <Button
            variant={currentMode === 'gpt' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={onAccessGPT}
          >
            <Bot className="mr-3 h-4 w-4" />
            Normal GPT
          </Button>
          <Button
            variant={currentMode === 'agent' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={onAccessAgent}
          >
            <FileCheck className="mr-3 h-4 w-4" />
            Agent Andrew
          </Button>
        </div>

        {/* Chat Actions */}
        {currentMode === 'chat' && (
          <div className="space-y-2 mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Chat
            </h3>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={onNewChat}
            >
              <MessageSquare className="mr-3 h-4 w-4" />
              New Chat
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleSearchChat}
            >
              <Search className="mr-3 h-4 w-4" />
              Search Chat
            </Button>
          </div>
        )}

        {/* Library */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Documents
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLibrary}
          >
            <FileText className="mr-3 h-4 w-4" />
            Library
          </Button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Theme Switcher */}
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <Moon className="mr-3 h-4 w-4" />
          ) : (
            <Sun className="mr-3 h-4 w-4" />
          )}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>

        {/* User Profile */}
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setShowProfile(!showProfile)}
        >
          <User className="mr-3 h-4 w-4" />
          Profile
        </Button>

        {showProfile && (
          <div className="ml-7 text-sm text-muted-foreground space-y-1 fade-in">
            <p>John Doe</p>
            <p>john@example.com</p>
            <p className="text-xs">Professional Plan</p>
          </div>
        )}

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;