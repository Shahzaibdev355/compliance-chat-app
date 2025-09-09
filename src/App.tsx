import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatHistoryProvider } from "@/contexts/ChatHistoryContext";
import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AgentAndrewPage from "./pages/AgentAndrewPage";
import AnalysisResultPage from "./pages/AnalysisResultPage";
import LibraryPage from "./pages/LibraryPage";
import ThemeSettingsPage from "./pages/ThemeSettingsPage";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('taxtro-auth-token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('taxtro-auth-token', 'demo-token');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('taxtro-auth-token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthPage onLogin={handleLogin} />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ChatHistoryProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={
                  <HomePage 
                    onAccessAgent={() => window.location.href = '/agent'} 
                    onAccessLibrary={() => window.location.href = '/library'}
                    onLogout={handleLogout} 
                  />
                } />
                <Route path="/agent" element={<AgentAndrewPage onBack={() => window.history.back()} />} />
                <Route path="/analysis-result" element={<AnalysisResultPage onBack={() => window.history.back()} />} />
                <Route path="/library" element={<LibraryPage onBack={() => window.history.back()} />} />
                <Route path="/theme-settings" element={<ThemeSettingsPage />} />
              </Routes>
            </TooltipProvider>
          </BrowserRouter>
        </ChatHistoryProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
