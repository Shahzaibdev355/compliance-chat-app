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
  FileCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  onNewChat: () => void;
  onAccessGPT: () => void;
  onAccessAgent: () => void;
  onLogout: () => void;
  currentMode: 'gpt' | 'agent' | 'chat';
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onNewChat,
  onAccessGPT,
  onAccessAgent,
  onLogout,
  currentMode,
  collapsed = false,
  onToggleCollapse
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
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-sidebar-background border-r border-border flex flex-col h-full transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && <h2 className="text-lg font-semibold transition-opacity duration-300 animate-fade-in">Taxtro AI</h2>}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Main Actions */}
      <div className="flex-1 p-4 space-y-2">
        {/* Dual Mode Access */}
        <div className="space-y-2 mb-6">
          {!collapsed && (
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide animate-fade-in">
              AI Modes
            </h3>
          )}
          <Button
            variant={currentMode === 'gpt' ? 'default' : 'ghost'}
            className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
            onClick={onAccessGPT}
            title={collapsed ? "Normal GPT" : undefined}
          >
            <Bot className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span className="animate-fade-in">Normal GPT</span>}
          </Button>
          <Button
            variant={currentMode === 'agent' ? 'default' : 'ghost'}
            className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
            onClick={onAccessAgent}
            title={collapsed ? "Agent Andrew" : undefined}
          >
            <FileCheck className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span className="animate-fade-in">Agent Andrew</span>}
          </Button>
        </div>

        {/* Chat Actions */}
        {currentMode === 'chat' && (
          <div className="space-y-2 mb-6">
            {!collapsed && (
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide animate-fade-in">
                Chat
              </h3>
            )}
            <Button
              variant="ghost"
              className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
              onClick={onNewChat}
              title={collapsed ? "New Chat" : undefined}
            >
              <MessageSquare className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && <span className="animate-fade-in">New Chat</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
              onClick={handleSearchChat}
              title={collapsed ? "Search Chat" : undefined}
            >
              <Search className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && <span className="animate-fade-in">Search Chat</span>}
            </Button>
          </div>
        )}

        {/* Library */}
        <div className="space-y-2 mb-6">
          {!collapsed && (
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide animate-fade-in">
              Documents
            </h3>
          )}
          <Button
            variant="ghost"
            className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
            onClick={handleLibrary}
            title={collapsed ? "Library" : undefined}
          >
            <FileText className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span className="animate-fade-in">Library</span>}
          </Button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Theme Switcher */}
        <Button
          variant="ghost"
          className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
          onClick={toggleTheme}
          title={collapsed ? (theme === 'light' ? 'Dark Mode' : 'Light Mode') : undefined}
        >
          {theme === 'light' ? (
            <Moon className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
          ) : (
            <Sun className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
          )}
          {!collapsed && <span className="animate-fade-in">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
        </Button>

        {/* User Profile */}
        <Button
          variant="ghost"
          className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
          onClick={() => setShowProfile(!showProfile)}
          title={collapsed ? "Profile" : undefined}
        >
          <User className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
          {!collapsed && <span className="animate-fade-in">Profile</span>}
        </Button>

        {showProfile && !collapsed && (
          <div className="ml-7 text-sm text-muted-foreground space-y-1 fade-in">
            <p>John Doe</p>
            <p>john@example.com</p>
            <p className="text-xs">Professional Plan</p>
          </div>
        )}

        {/* Logout */}
        <Button
          variant="ghost"
          className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} text-destructive hover:text-destructive`}
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
          {!collapsed && <span className="animate-fade-in">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;