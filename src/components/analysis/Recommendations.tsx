import React, { useState } from 'react';
import { CheckCircle, Download, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface Recommendation {
  title: string;
  items: string[];
  resolved: boolean;
}

interface RecommendationsProps {
  recommendations: Record<string, Recommendation>;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
}) => {
  const [resolvedItems, setResolvedItems] = useState<Set<string>>(new Set());
  const [resolvedCategories, setResolvedCategories] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleItemResolve = (category: string, itemIndex: number) => {
    const itemKey = `${category}-${itemIndex}`;
    const newResolved = new Set(resolvedItems);
    
    if (newResolved.has(itemKey)) {
      newResolved.delete(itemKey);
    } else {
      newResolved.add(itemKey);
    }
    
    setResolvedItems(newResolved);
    
    toast({
      title: newResolved.has(itemKey) ? "Item Resolved" : "Item Reopened",
      description: newResolved.has(itemKey) ? "Recommendation marked as completed" : "Recommendation marked as pending",
      duration: 2000,
    });
  };

  const handleCategoryResolve = (category: string) => {
    const newResolvedCategories = new Set(resolvedCategories);
    
    if (newResolvedCategories.has(category)) {
      newResolvedCategories.delete(category);
    } else {
      newResolvedCategories.add(category);
    }
    
    setResolvedCategories(newResolvedCategories);
    
    toast({
      title: newResolvedCategories.has(category) ? "Category Resolved" : "Category Reopened",
      description: `All ${category} recommendations ${newResolvedCategories.has(category) ? 'completed' : 'reopened'}`,
      duration: 2000,
    });
  };

  const handleExport = (category: string) => {
    const categoryData = recommendations[category];
    const csvContent = [
      ['Category', 'Recommendation', 'Status'],
      ...categoryData.items.map((item, index) => [
        categoryData.title,
        item,
        resolvedItems.has(`${category}-${index}`) ? 'Resolved' : 'Pending'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recommendations_${category}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${categoryData.title} recommendations exported to CSV`,
      duration: 2000,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'red':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'yellow':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'green':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryBorder = (category: string) => {
    switch (category) {
      case 'red':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'yellow':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'green':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
    }
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full p-4">
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground mb-4">
            Consolidated remediation steps organized by priority level
          </div>
          
          {Object.entries(recommendations).map(([category, recommendation]) => {
            const isCategoryResolved = resolvedCategories.has(category);
            const resolvedCount = recommendation.items.filter((_, index) => 
              resolvedItems.has(`${category}-${index}`)
            ).length;

            return (
              <div
                key={category}
                className={`border rounded-lg p-4 transition-all duration-200 ${getCategoryBorder(category)} ${
                  isCategoryResolved ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(category)}
                    <div>
                      <h3 className={`font-semibold ${isCategoryResolved ? 'line-through' : ''}`}>
                        {recommendation.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {resolvedCount} / {recommendation.items.length} completed
                        </Badge>
                        {resolvedCount === recommendation.items.length && (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                            All Complete
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(category)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-3 w-3" />
                      Export
                    </Button>
                    <Button
                      variant={isCategoryResolved ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryResolve(category)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {isCategoryResolved ? 'Resolved' : 'Mark All Resolved'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {recommendation.items.map((item, index) => {
                    const itemKey = `${category}-${index}`;
                    const isItemResolved = resolvedItems.has(itemKey);

                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 bg-background/50 border border-border/20 rounded-md transition-all duration-200 ${
                          isItemResolved ? 'opacity-60' : ''
                        }`}
                      >
                        <Checkbox
                          checked={isItemResolved}
                          onCheckedChange={() => handleItemResolve(category, index)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <p className={`text-sm leading-relaxed ${
                            isItemResolved ? 'line-through text-muted-foreground' : ''
                          }`}>
                            {item}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleItemResolve(category, index)}
                          className="h-6 px-2 text-xs"
                        >
                          {isItemResolved ? 'Reopen' : 'Resolve'}
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