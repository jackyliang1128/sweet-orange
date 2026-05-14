import { PredictionJob, PredictionResult } from "@/types/prediction";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateMockResult(): PredictionResult {
  return {
    fruitType: "Orange",
    sweetness: randomBetween(1, 10),
    confidence: randomBetween(0.6, 0.99),
    message: "Mock prediction result",
  };
}

/**
 * Submits an image for sweetness prediction.
 * Returns a new job in "queued" status immediately.
 */
export function createPredictionJob(imageUri: string): PredictionJob {
  return {
    id: generateId(),
    imageUri,
    status: "queued",
    submittedAt: Date.now(),
  };
}

/**
 * Mock: simulates the backend processing a prediction job.
 * Resolves after a realistic delay with a completed or failed job.
 */
export function processPredictionJob(
  job: PredictionJob,
): Promise<PredictionJob> {
  const delayMs = 1000 + Math.random() * 1000; // 1-2 seconds
  const shouldFail = Math.random() < 0.1; // ~10% failure rate

  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ...job,
          status: "failed",
          completedAt: Date.now(),
          error: "Mock prediction failed — please try again.",
        });
      } else {
        resolve({
          ...job,
          status: "completed",
          completedAt: Date.now(),
          result: generateMockResult(),
        });
      }
    }, delayMs);
  });
}
