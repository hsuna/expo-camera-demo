import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import {
  Alert,
  Button,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  message: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    width: 200,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  flipButton: {
    width: 150,
    backgroundColor: "#007AFF",
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 10,
  },
  recordButton: {
    width: 150,
    backgroundColor: "#27ae60",
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  preview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default function Index() {
  const [facing, setFacing] = useState("back");
  const cameraRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  // 开始录像
  const startRecording = async () => {
    if (cameraRef.current) {
      setRecording(true);
      cameraRef.current
        .recordAsync()
        .then((video) => {
          Alert.alert("Recording Successful", `Video URI: ${video.uri}`);
        })
        .catch((error) => {
          Alert.alert(
            "Recording Failed",
            error.message || "Recording failed, please try again"
          );
          setRecording(false);
        });
    }
  };

  // 停止录像
  const stopRecording = async () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setRecording(false);
    }
  };

  if (!cameraPermission || !microphonePermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Please allow the app to access your camera
        </Text>
        <Text style={styles.message}>
          Otherwise, you won't be able to record video
        </Text>
        <Button
          style={styles.button}
          onPress={requestCameraPermission}
          title="Grant Camera Permission"
        />
      </View>
    );
  }

  if (!microphonePermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Please allow the app to access your microphone
        </Text>
        <Text style={styles.message}>
          Otherwise, you won't be able to record video
        </Text>
        <Button
          style={styles.button}
          onPress={requestMicrophonePermission}
          title="Grant Microphone Permission"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={facing}
        mode={"video"}
        flash="off"
        mute={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        >
          <Text style={styles.text}>
            🔄 Switch to {facing === "back" ? "Front" : "Back"} Camera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={!recording ? startRecording : stopRecording}
        >
          <Text style={styles.text}>
            🔴 {recording ? "Recording..." : "Start Recording"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
