import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AgentAndrewPage from "./pages/AgentAndrewPage";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'agent'>('home');

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
    setCurrentPage('home');
  };

  const handleAccessAgent = () => {
    setCurrentPage('agent');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-background">
            {currentPage === 'home' ? (
              <HomePage 
                onAccessAgent={handleAccessAgent}
                onLogout={handleLogout}
              />
            ) : (
              <AgentAndrewPage onBack={handleBackToHome} />
            )}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
