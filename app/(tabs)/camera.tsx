import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePredictionJobs } from "@/providers/prediction-jobs-provider";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(false);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const { submitPrediction } = usePredictionJobs();
  const router = useRouter();

  if (!permission) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading camera…</ThemedText>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText style={styles.permissionText}>
          Sweet Orange needs camera access to photograph oranges.
        </ThemedText>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={requestPermission}
        >
          <ThemedText style={styles.buttonText}>Grant Camera Access</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        setCapturedPhotoUri(photo.uri);
      }
    } finally {
      setCapturing(false);
    }
  };

  const handleRetake = () => {
    setCapturedPhotoUri(null);
  };

  const handleSubmit = () => {
    if (!capturedPhotoUri) return;
    submitPrediction(capturedPhotoUri);
    setCapturedPhotoUri(null);
    setLastSubmitted(true);
  };

  if (capturedPhotoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedPhotoUri }} style={styles.preview} />

        <View style={styles.previewOverlay}>
          <Pressable
            style={({ pressed }) => [
              styles.previewButton,
              styles.retakeButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleRetake}
          >
            <ThemedText style={styles.previewButtonText}>Retake</ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.previewButton,
              styles.submitButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSubmit}
          >
            <ThemedText style={styles.submitButtonText}>Submit</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.overlay}>
        {lastSubmitted && (
          <Pressable
            style={({ pressed }) => [
              styles.viewResultsButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/(tabs)/results")}
          >
            <ThemedText style={styles.viewResultsText}>View Results</ThemedText>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.captureButton,
            pressed && styles.captureButtonPressed,
            capturing && styles.captureButtonDisabled,
          ]}
          onPress={handleCapture}
          disabled={capturing}
        >
          <View style={styles.captureInner} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  permissionText: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 17,
    lineHeight: 24,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 48,
    alignItems: "center",
    gap: 16,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonPressed: {
    opacity: 0.7,
  },
  captureButtonDisabled: {
    opacity: 0.4,
  },
  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#F5920B",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  viewResultsButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  viewResultsText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  preview: {
    flex: 1,
  },
  previewOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 48,
    paddingHorizontal: 32,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  previewButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  retakeButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  submitButton: {
    backgroundColor: "#F5920B",
  },
  previewButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
});
