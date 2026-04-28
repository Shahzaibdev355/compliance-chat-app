import React, { useState } from 'react';
import { CheckCircle, Download, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface RecommendationsProps {
  flags: any[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ flags }) => {

  console.log("FLAGS RECEIVED:", flags);

  const [resolvedItems, setResolvedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  if (!flags || flags.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No recommendations available.
      </div>
    );
  }

  // Group flags by color
  const grouped: Record<string, any[]> = { Red: [], Yellow: [], Green: [] };
  flags.forEach(flag => {
    if (grouped[flag.flag]) grouped[flag.flag].push(flag);
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Red': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'Yellow': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'Green': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default: return <CheckCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryBorder = (category: string) => {
    switch (category) {
      case 'Red': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'Yellow': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'Green': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      default: return 'border-border';
    }
  };

  const handleResolve = (key: string) => {
    const newResolved = new Set(resolvedItems);
    if (newResolved.has(key)) {
      newResolved.delete(key);
    } else {
      newResolved.add(key);
    }
    setResolvedItems(newResolved);
    toast({
      title: newResolved.has(key) ? "Resolved" : "Reopened",
      duration: 1500,
    });
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full p-4">
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Remediation steps organized by priority level
          </p>

          {Object.entries(grouped)
            .filter(([_, items]) => items.length > 0)
            .map(([category, items]) => {
              const resolvedCount = items.filter((_, i) =>
                resolvedItems.has(`${category}-${i}`)
              ).length;

              return (
                <div
                  key={category}
                  className={`border rounded-lg p-4 ${getCategoryBorder(category)}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {getCategoryIcon(category)}
                    <div>
                      <h3 className="font-semibold">{category} Flags</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {resolvedCount} / {items.length} resolved
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {items.map((flag, index) => {
                      const key = `${category}-${index}`;
                      const isResolved = resolvedItems.has(key);

                      return (
                        <div
                          key={index}
                          className={`flex items-start gap-3 p-3 bg-background/50 border border-border/20 rounded-md ${isResolved ? 'opacity-60' : ''}`}
                        >
                          <Checkbox
                            checked={isResolved}
                            onCheckedChange={() => handleResolve(key)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 space-y-1">
                            <p className={`text-sm font-medium ${isResolved ? 'line-through text-muted-foreground' : ''}`}>
                              {flag.summary}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {flag.recommendation}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResolve(key)}
                            className="h-6 px-2 text-xs"
                          >
                            {isResolved ? 'Reopen' : 'Resolve'}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Recommendations;