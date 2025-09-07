import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import SearchChatDialog from './SearchChatDialog';
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
  onAccessLibrary: () => void;
  onLogout: () => void;
  currentMode: 'gpt' | 'agent' | 'chat';
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onNewChat,
  onAccessGPT,
  onAccessAgent,
  onAccessLibrary,
  onLogout,
  currentMode,
  collapsed = false,
  onToggleCollapse
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  const handleSearchChat = () => {
    setShowSearchDialog(true);
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-sidebar-background border-r border-border flex flex-col h-full transition-all duration-300 ease-in-out transform`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && <h2 className="text-lg font-semibold animate-fade-in transition-opacity duration-300 ease-in-out delay-75">Taxtro AI</h2>}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="ml-auto transition-all duration-300 ease-in-out"
          >
            {collapsed ? <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-in-out" /> : <ChevronLeft className="h-4 w-4 transition-transform duration-300 ease-in-out" />}
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
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Theme Switcher */}
        <Button
          variant="ghost"
          className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} transition-all duration-300 ease-in-out`}
          onClick={toggleTheme}
          title={collapsed ? (theme === 'light' ? 'Dark Mode' : 'Light Mode') : undefined}
        >
          {theme === 'light' ? (
            <Moon className={`h-4 w-4 ${collapsed ? '' : 'mr-3'} transition-all duration-300 ease-in-out`} />
          ) : (
            <Sun className={`h-4 w-4 ${collapsed ? '' : 'mr-3'} transition-all duration-300 ease-in-out`} />
          )}
          {!collapsed && <span className="animate-fade-in transition-opacity duration-300 ease-in-out delay-100">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
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
          <div className="ml-7 text-sm text-muted-foreground space-y-1 animate-fade-in transition-all duration-300 ease-in-out">
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