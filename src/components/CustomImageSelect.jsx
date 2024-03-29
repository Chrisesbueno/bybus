import React, { useState } from "react";
import { Image, View, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "./CustomButton";

// recoil
import { useRecoilValue } from 'recoil'
import { imageProfile } from '@/atoms/Modals'

const CustomImageSelect = ({ styled = {}, button, uriSelect }) => {
  const imgProfile = useRecoilValue(imageProfile)
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    ImagePicker.getPendingResultAsync
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      const { uri } = result.assets[0]
      uriSelect(uri)
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styled.container}>
      {image ? (
        <View style={styled.image}>
          <Image
            source={{ uri: image }}
            style={{
              width: 250,
              height: 250,
              resizeMode: "cover",
              borderRadius: 250,
            }}
          />
        </View>
      ) : imgProfile ? (
        <View style={styled.image}>
          <Image
            source={{ uri: imgProfile }}
            style={{
              width: 250,
              height: 250,
              resizeMode: "cover",
              borderRadius: 250,
            }}
          />
        </View>
      ) : (
        <TouchableOpacity onPress={pickImage} style={styled.defaultImage} />
      )}
      <View style={styled.buttons}>
        <CustomButton
          icon={{
            image: require('@/utils/images/capture.png')
          }}
          handlePress={pickImage}
          buttonStyles={styled.camera}
        />
        {button && (
          <CustomButton
            text="Seleccionar imagen"
            handlePress={pickImage}
            textStyles={styled.btnText}
            buttonStyles={styled.btnBg}
          />
        )}
      </View>
    </View>
  );
};

export default CustomImageSelect;
