import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatHistoryProvider } from "@/contexts/ChatHistoryContext";
import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AgentAndrewPage from "./pages/AgentAndrewPage";
import AnalysisResultPage from "./pages/AnalysisResultPage";
import LibraryPage from "./pages/LibraryPage";
import ThemeSettingsPage from "./pages/ThemeSettingsPage";

import { ClerkProvider, useAuth, useClerk } from '@clerk/clerk-react';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

import { pdfjs } from 'react-pdf';

// ✅ Vite-compatible: use new URL() to resolve path
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) return null; // wait for Clerk to load

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};





const AppRoutes = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />

      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />

      <Route path="/" element={
        <ProtectedRoute>
          <HomePage
            onAccessAgent={() => navigate('/agent')}
            onAccessLibrary={() => navigate('/library')}
            onLogout={() => signOut(() => navigate('/login'))}
          />
        </ProtectedRoute>
      } />
      <Route path="/agent" element={
        <ProtectedRoute>
          <AgentAndrewPage onBack={() => navigate(-1)} />
        </ProtectedRoute>
      } />
      <Route path="/analysis-result" element={
        <ProtectedRoute>
          <AnalysisResultPage onBack={() => navigate(-1)} />
        </ProtectedRoute>
      } />
      <Route path="/library" element={
        <ProtectedRoute>
          <LibraryPage onBack={() => navigate(-1)} />
        </ProtectedRoute>
      } />
      <Route path="/theme-settings" element={
        <ProtectedRoute>
          <ThemeSettingsPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Quick auth check on mount
    const token = localStorage.getItem('taxtro-auth-token');
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('taxtro-auth-token', 'demo-token');
  };

  const handleLogout = () => {
    localStorage.removeItem('taxtro-auth-token');
  };

  if (isLoading) {
    return null; // Prevent flash during initial load
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ChatHistoryProvider>
            <BrowserRouter>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <AppRoutes />  {/* remove onLogout/onLogin props */}
              </TooltipProvider>
            </BrowserRouter>
          </ChatHistoryProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;
