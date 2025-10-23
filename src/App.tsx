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

const AppRoutes = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={
        <HomePage 
          onAccessAgent={() => navigate('/agent')} 
          onAccessLibrary={() => navigate('/library')}
          onLogout={onLogout} 
        />
      } />
      <Route path="/agent" element={<AgentAndrewPage onBack={() => navigate(-1)} />} />
      <Route path="/analysis-result" element={<AnalysisResultPage onBack={() => navigate(-1)} />} />
      <Route path="/library" element={<LibraryPage onBack={() => navigate(-1)} />} />
      <Route path="/theme-settings" element={<ThemeSettingsPage />} />
    </Routes>
  );
};

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
              <AppRoutes onLogout={handleLogout} />
            </TooltipProvider>
          </BrowserRouter>
        </ChatHistoryProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
