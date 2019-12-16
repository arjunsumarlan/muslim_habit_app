import React from "react";
import {
  View,
  Image,
  Text,
  Animated
} from "react-native";
import Ionicon from 'react-native-vector-icons/Ionicons'
import globalStyles from "../globalStyles";
import colors from "../constants/colors";
import TouchableItem from "../constants/Touchable";
import { Button } from "react-native-elements";
import { height } from "../constants/constants";


export default AbsoluteFooter = (props, otherProps) => (
  <View style={{ flex: 1, position: 'absolute', justifyContent: 'flex-end', height: height, width: '100%' }}>
    <Animated.View style={[globalStyles.absoluteFooter, { ...props.otherStyle }]} {...otherProps} >
      <Button
        title="Daftar Sekarang"
        buttonStyle={{ borderRadius: 5 }}
        {...props.buttonProps}
      />
    </Animated.View>
  </View>
)