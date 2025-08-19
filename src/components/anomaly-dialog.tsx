'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { Transaction } from '@/lib/types';
import { AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';

type AnomalyResult = {
  isAnomalous: boolean;
  explanation: string;
  riskScore: number;
};

interface AnomalyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  result: AnomalyResult | null;
  transaction: Transaction | null;
}

export function AnomalyDialog({ isOpen, onClose, isLoading, result, transaction }: AnomalyDialogProps) {
  const riskScorePercent = result ? Math.round(result.riskScore * 100) : 0;
  
  const getRiskColor = (score: number) => {
    if (score > 75) return 'bg-destructive';
    if (score > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <DialogTitle className="text-xl">Anomaly Detection Result</DialogTitle>
          </div>
          <DialogDescription>
            AI-powered analysis of transaction ID: {transaction?.id.substring(0, 8)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-8 w-1/2 mt-4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {result.isAnomalous ? (
                  <AlertCircle className="h-8 w-8 text-destructive" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                )}
                <h3 className={`text-2xl font-bold ${result.isAnomalous ? 'text-destructive' : 'text-green-600'}`}>
                  {result.isAnomalous ? 'Anomalous Transaction' : 'Normal Transaction'}
                </h3>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <p className="text-sm font-medium text-muted-foreground">AI Explanation</p>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{result.explanation}</p>
                </CardContent>
              </Card>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Risk Score</p>
                <div className="flex items-center gap-4">
                    <Progress value={riskScorePercent} className="w-full h-3" indicatorClassName={getRiskColor(riskScorePercent)} />
                    <span className="text-lg font-bold">{riskScorePercent}%</span>
                </div>
              </div>

            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
