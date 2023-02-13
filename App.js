// React Native Text Recognition

import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Button,
} from 'react-native';

import TextRecognition from 'react-native-text-recognition';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';

const App = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);
  const [permissionResult, setPermissionResult] = useState(null);
  let options = {
    quality: 1,
    base64: true,
    exif: false
  };

  const pickImage = async () => {
    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
      .then((sonuc) => {
        console.log(sonuc)
        switch (sonuc) {
          case RESULTS.DENIED:
            alert("Permission denied...");
          case RESULTS.GRANTED:
            launchImageLibrary({
              mediaType: 'photo',
              quality: 1
            }).then(result => {
              if (result) {
                  (async () => {
                    const textRec = await TextRecognition.recognize(result.assets[0].uri);
                    console.log(textRec);
                    setText(textRec);
                  })();
              }

              if (!result.canceled) {
                setImage(result.assets[0].uri)
              }
            })
        }
      })

  };

  const openCamera = async () => {
    request(PERMISSIONS.ANDROID.CAMERA)
      .then((durum) => {
        console.log(durum);
        switch(durum) {
          case RESULTS.DENIED:
            alert("Permission denied...");
          case RESULTS.GRANTED:
            (async () => {
              let newPhoto = await launchCamera(options);
              const recText = await TextRecognition.recognize(newPhoto.assets[0].uri);
              console.log(recText);
              setText(recText);
              setImage(newPhoto);
           })();
        }
      })
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Camera App</Text>
        <TouchableHighlight
          onPress={openCamera}
          style={styles.buttonStyle}
        >
          <Text style={styles.buttonTextStyle}>Open Camera</Text>
        </TouchableHighlight>
        <Button title="Choose Image" onPress={pickImage}/>
        {/* {image && <Image source={{ uri: image }} style={{
          width: 100,
          height: 100,
          top: 200,
        }} />} */}
        <ScrollView style={styles.svStyle}>
          <Text style={{color:"black"}}>{text}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  svStyle: {
    maxHeight: 300,
    width: 300,
    height: 200,
    marginBottom: 20,
    top: 200,
    alignContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    top: 50
  },
  textStyle: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    marginTop: 16,
  },
  buttonStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    marginTop: 32,
    minWidth: 250,
    top: 130
  },
  buttonTextStyle: {
    padding: 5,
    color: 'white',
    textAlign: 'center',
  },
});