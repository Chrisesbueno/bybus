import { CustomButton } from "@/components";
import { welcome } from "@/utils/constants/welcome";
import styles from "@/utils/styles/Welcome.module.css";
import React from "react";
import { Image, Text, View } from "react-native";

const Welcome = ({ navigation, route }) => {
  const global = require('@/utils/styles/global.js');
  const { content, signin, register, intro } = welcome;

  return (
    <View style={[styles.container, global.mainBgColorSecond]}>
      <Image
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          resizeMode: "contain",
        }}
        source={require("@/utils/images/map.png")}
      />
      <View style={styles.content}>
        <View style={styles.text}>
          <View style={styles.name}>
            <Image
              style={{
                width: 200,
                height: 40,
                resizeMode: "cover",
                marginLeft: -20
              }}
              source={require("@/utils/images/icon.png")}
            />
            {/* <Text style={[styles.textName, global.black]}>{content.name}</Text> */}
          </View>
          <Text style={[styles.textTitle, global.mainColor]}>{content.title}</Text>
          <Text style={[styles.textSubtitle, global.white]}>{content.subtitle}</Text>
        </View>
        <View style={styles.buttons}>
          <CustomButton
            text={signin.button}
            handlePress={() => navigation.navigate(route.params.LOGIN)}
            textStyles={[styles.textSignIn, global.mainColor]}
            buttonStyles={[styles.signin, global.bgWhite]}
          />
          <CustomButton
            text={register.button}
            handlePress={() => navigation.navigate(route.params.REGISTER)}
            textStyles={[styles.textRegister, global.white]}
            buttonStyles={[styles.register, global.mainBgColor]}
          />
          {/* <CustomButton
            text={intro.button}
            handlePress={() => navigation.navigate("Welcome_Start")}
            textStyles={[styles.textContinue, global.midgray]}
            buttonStyles={styles.continueBtnn}
          /> */}
        </View>
      </View>
    </View>
  );
};

export default Welcome;
