import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    createPredictionJob,
    processPredictionJob,
} from "@/services/prediction-service";
import { PredictionJob } from "@/types/prediction";

const STORAGE_KEY = "sweet-orange:prediction-jobs";

interface PredictionJobsContextValue {
  jobs: PredictionJob[];
  submitPrediction: (imageUri: string) => void;
  clearJobs: () => void;
}

const PredictionJobsContext = createContext<PredictionJobsContextValue | null>(
  null,
);

export function PredictionJobsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [jobs, setJobs] = useState<PredictionJob[]>([]);
  const loaded = useRef(false);

  // Load persisted jobs on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setJobs(JSON.parse(raw));
        }
      } catch {
        // ignore read errors on first launch
      } finally {
        loaded.current = true;
      }
    })();
  }, []);

  // Persist whenever jobs change (after initial load)
  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(jobs)).catch(() => {});
  }, [jobs]);

  const updateJob = useCallback((updated: PredictionJob) => {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  }, []);

  const submitPrediction = useCallback(
    (imageUri: string) => {
      const job = createPredictionJob(imageUri);
      setJobs((prev) => [job, ...prev]);

      // Transition to processing, then resolve
      const processingJob: PredictionJob = { ...job, status: "processing" };
      setTimeout(() => updateJob(processingJob), 500);

      processPredictionJob(processingJob).then((resolved) => {
        updateJob(resolved);
      });
    },
    [updateJob],
  );

  const clearJobs = useCallback(() => {
    setJobs([]);
  }, []);

  return (
    <PredictionJobsContext.Provider
      value={{ jobs, submitPrediction, clearJobs }}
    >
      {children}
    </PredictionJobsContext.Provider>
  );
}

export function usePredictionJobs() {
  const ctx = useContext(PredictionJobsContext);
  if (!ctx) {
    throw new Error(
      "usePredictionJobs must be used within PredictionJobsProvider",
    );
  }
  return ctx;
}
