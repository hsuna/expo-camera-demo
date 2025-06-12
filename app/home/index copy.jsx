// ...imports and styles remain unchanged

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

  // Start recording
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

  // Stop recording
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
