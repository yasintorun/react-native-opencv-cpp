import React, { useEffect } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const {width, height} = Dimensions.get('screen');

const App = () => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const device = useCameraDevices().back;

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  if (!device) {
    return <Text>Camera not found</Text>;
  }
  if(!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.root}>
      <Camera
        style={styles.camera}
        isActive={true}
        device={device}
      />
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  camera: {
    width,
    height,
  },
});
