'use client';

import { useState } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { analyzeAttendanceTrends, AttendanceTrendAnalysisOutput } from '@/ai/flows/attendance-trend-analysis';
import { Skeleton } from '../ui/skeleton';

export function AiAnalysisCard() {
  const [analysis, setAnalysis] = useState<AttendanceTrendAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      // Add a small delay for a better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await analyzeAttendanceTrends({});
      setAnalysis(result);
    } catch (e) {
      setError('Failed to get analysis. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          AI-Powered Insights
        </CardTitle>
        <CardDescription>
          Use AI to analyze trends and get membership management recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : analysis ? (
          <div className="text-sm text-foreground space-y-2">
            <p className="font-semibold text-primary">Recommendations:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {analysis.recommendations.split('- ').filter(item => item.trim() !== '').map((item, index) => (
                    <li key={index}>{item.trim()}</li>
                ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click the button to generate insights based on current attendance data.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalysis} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
          {isLoading ? (
            'Analyzing...'
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze Attendance Trends
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
