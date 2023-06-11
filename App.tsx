import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, NativeModules } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
const { OpencvCpp } = NativeModules;
const { width, height } = Dimensions.get('screen');

const App = () => {
  const [message, setMessage] = useState("");
  const [hasPermission, setHasPermission] = React.useState(false);
  const device = useCameraDevices().back;

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
    console.log(OpencvCpp)
    OpencvCpp.createMessage('Hello World from Cpp').then(setMessage);
  }, []);

  // if (!hasPermission) {
  //   return <Text>No access to camera</Text>;
  // }

  // if (!device) {
  //   return <Text>Camera not found</Text>;
  // }

  return (
    <SafeAreaView style={styles.root}>
      <Text>{message}</Text>
      {/* <Camera
        style={styles.camera}
        isActive={true}
        device={device}
      /> */}
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  camera: {
    width,
    height,
  },
});
