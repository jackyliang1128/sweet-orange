export type PredictionJobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface PredictionResult {
  fruitType: string;
  sweetness: number;
  confidence: number;
  message?: string;
}

export interface PredictionJob {
  id: string;
  imageUri: string;
  status: PredictionJobStatus;
  submittedAt: number;
  completedAt?: number;
  result?: PredictionResult;
  error?: string;
}
