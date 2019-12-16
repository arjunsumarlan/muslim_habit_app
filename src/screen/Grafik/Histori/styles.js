import {
  StyleSheet
} from "react-native";
import {
  height,
  width
} from "../../../assets/constants/constants";
import colors from "../../../assets/constants/colors";

export default HomeStyles = StyleSheet.create({
  cardContentContainer :{
    width: '33%',
    justifyContent :'center',
    alignItems: 'center',
    height: height * 0.125
  },
  container: {
    flex: 1,
    backgroundColor: colors.white
  }
})