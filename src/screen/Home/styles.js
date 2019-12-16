import {
  StyleSheet
} from "react-native";
import {
  height,
  width
} from "../../assets/constants/constants";
import colors from "../../assets/constants/colors";

export default HomeStyles = StyleSheet.create({
  cardContentContainer :{
    width: '33%',
    justifyContent :'center',
    alignItems: 'center',
    height: height * 0.125
  },
  buttonCircle: {
    width: width*0.08,
    height: width*0.08,
    borderRadius: width*0.08/2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:'green', 
    borderWidth: 2
  },
  buttonCircleFull: {
    width: width*0.08,
    height: width*0.08,
    borderRadius: width*0.08/2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green'
  }
})