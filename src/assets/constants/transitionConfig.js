import {
  Easing,
  Animated,
  StatusBar,
  View,
} from "react-native";


export default transitionConfig = {
  slideHorizontal: () => {
    return {
      transitionSpec: {
        duration: 500,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: (sceneProps) => {
        const { layout, position, scene } = sceneProps;
        const sceneIndex = scene.index;
        const width = layout.initWidth;
        const translateX = position.interpolate({
          inputRange: [sceneIndex -1 , sceneIndex, sceneIndex + 1],
          outputRange: [width, 0, 0]
        })
        return { transform: [{ translateX }] }
      },
    }
  },
}