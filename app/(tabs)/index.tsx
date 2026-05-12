import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePredictionJobs } from "@/providers/prediction-jobs-provider";

export default function HomeScreen() {
  const router = useRouter();
  const { jobs } = usePredictionJobs();

  const pending = jobs.filter(
    (j) => j.status === "queued" || j.status === "processing",
  ).length;
  const completed = jobs.filter((j) => j.status === "completed").length;
  const failed = jobs.filter((j) => j.status === "failed").length;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        🍊 Sweet Orange
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Take a photo of an orange to predict its sweetness.
      </ThemedText>

      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statCard}>
          <ThemedText type="title">{pending}</ThemedText>
          <ThemedText>Pending</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statCard}>
          <ThemedText type="title">{completed}</ThemedText>
          <ThemedText>Completed</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statCard}>
          <ThemedText type="title">{failed}</ThemedText>
          <ThemedText>Failed</ThemedText>
        </ThemedView>
      </ThemedView>

      <Pressable
        style={({ pressed }) => [
          styles.ctaButton,
          pressed && styles.ctaButtonPressed,
        ]}
        onPress={() => router.push("/(tabs)/camera")}
      >
        <ThemedText style={styles.ctaText}>Start Scanning</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 40,
    fontSize: 17,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 48,
  },
  statCard: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 80,
  },
  ctaButton: {
    backgroundColor: "#F5920B",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 14,
  },
  ctaButtonPressed: {
    opacity: 0.8,
  },
  ctaText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
});
