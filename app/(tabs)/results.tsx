import { Image } from "expo-image";
import { FlatList, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePredictionJobs } from "@/providers/prediction-jobs-provider";
import { PredictionJob } from "@/types/prediction";

function statusLabel(status: PredictionJob["status"]): string {
  switch (status) {
    case "queued":
      return "⏳ Queued";
    case "processing":
      return "⚙️ Processing";
    case "completed":
      return "✅ Completed";
    case "failed":
      return "❌ Failed";
  }
}

function statusColor(status: PredictionJob["status"]): string {
  switch (status) {
    case "queued":
      return "#A0A0A0";
    case "processing":
      return "#F5920B";
    case "completed":
      return "#34C759";
    case "failed":
      return "#FF3B30";
  }
}

function JobCard({ job }: { job: PredictionJob }) {
  return (
    <ThemedView style={styles.card}>
      <Image
        source={{ uri: job.imageUri }}
        style={styles.thumbnail}
        contentFit="cover"
      />
      <View style={styles.cardContent}>
        <View style={styles.statusRow}>
          <ThemedText
            style={[styles.statusText, { color: statusColor(job.status) }]}
          >
            {statusLabel(job.status)}
          </ThemedText>
          <ThemedText style={styles.timestamp}>
            {new Date(job.submittedAt).toLocaleTimeString()}
          </ThemedText>
        </View>

        {job.status === "completed" && job.result && (
          <View style={styles.resultRow}>
            <ThemedText style={styles.resultLabel}>
              Sweetness:{" "}
              <ThemedText type="defaultSemiBold">
                {job.result.sweetness}/10
              </ThemedText>
            </ThemedText>
            <ThemedText style={styles.resultLabel}>
              Confidence:{" "}
              <ThemedText type="defaultSemiBold">
                {Math.round(job.result.confidence * 100)}%
              </ThemedText>
            </ThemedText>
          </View>
        )}

        {job.status === "failed" && job.error && (
          <ThemedText style={styles.errorText}>{job.error}</ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

export default function ResultsScreen() {
  const { jobs } = usePredictionJobs();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Results
      </ThemedText>

      {jobs.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            No predictions yet. Take a photo to get started!
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(job) => job.id}
          renderItem={({ item }) => <JobCard job={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  title: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    padding: 12,
    gap: 12,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: {
    fontWeight: "600",
    fontSize: 15,
  },
  timestamp: {
    fontSize: 13,
    opacity: 0.5,
  },
  resultRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  resultLabel: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.5,
    fontSize: 16,
    lineHeight: 24,
  },
});
