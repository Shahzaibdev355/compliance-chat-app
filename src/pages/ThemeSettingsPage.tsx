import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Monitor, Moon, Sun, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ThemeSettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const themes = [
    {
      id: 'dark' as const,
      name: 'Default Dark',
      description: 'Professional dark theme with lime accents',
      icon: Moon,
      colors: {
        primary: '#C9DF53',
        background: '#0D0D0D',
        card: '#111111',
      },
    },
    {
      id: 'light' as const,
      name: 'Light Mode',
      description: 'Clean light theme for daytime use',
      icon: Sun,
      colors: {
        primary: '#C9DF53',
        background: '#FAFAFA',
        card: '#FFFFFF',
      },
    },
    {
      id: 'pink' as const,
      name: 'Pink Mode',
      description: 'Modern pink theme with professional styling',
      icon: Heart,
      colors: {
        primary: '#E781A5',
        background: '#FFFFFF',
        card: '#F5CFD0',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="animate-fade-in delay-75">
            <h1 className="text-3xl font-bold">Theme Settings</h1>
            <p className="text-muted-foreground">Choose your preferred theme</p>
          </div>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((themeOption, index) => {
            const Icon = themeOption.icon;
            const isActive = theme === themeOption.id;
            
            return (
              <Card
                key={themeOption.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg animate-fade-in ${
                  isActive 
                    ? 'ring-2 ring-primary border-primary shadow-lg' 
                    : 'hover:border-muted-foreground/20'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setTheme(themeOption.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Icon className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    {isActive && (
                      <div className="w-3 h-3 bg-primary rounded-full animate-scale-in" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{themeOption.name}</CardTitle>
                  <CardDescription>{themeOption.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  {/* Theme Preview */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">Preview</div>
                    <div 
                      className="rounded-lg p-4 border transition-all duration-200"
                      style={{ backgroundColor: themeOption.colors.background }}
                    >
                      <div 
                        className="rounded-md p-3 mb-2"
                        style={{ backgroundColor: themeOption.colors.card }}
                      >
                        <div className="w-full h-2 rounded mb-2" style={{ backgroundColor: themeOption.colors.primary }} />
                        <div className="w-3/4 h-2 rounded bg-muted" />
                      </div>
                      <div className="flex gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: themeOption.colors.primary }} />
                        <div className="w-4 h-4 rounded bg-muted" />
                        <div className="w-4 h-4 rounded bg-muted" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <Card className="mt-8 animate-fade-in delay-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Theme Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Themes are automatically saved and will persist across sessions. 
                Your selected theme applies to all parts of the application.
              </p>
              <div className="flex items-center gap-2 text-primary">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="font-medium">Current theme: {themes.find(t => t.id === theme)?.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemeSettingsPage;