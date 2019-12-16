import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";
import React from 'react'; 
import {
  Easing,
  Animated,
  StatusBar,
  View,
  Platform,
  Image,
  Alert
} from "react-native";
import {
  Home,
  Intro,
  Jadwal,
  TambahAmal,
  Grafik,
  Histori,
  Pengaturan,
  HomeList
} from "../../screen";
import DashboardTab from "./DashboardTab";
import DashboardTabList from "./DashboardTabList"
import Ionicons from 'react-native-vector-icons/Ionicons'
import TouchableItem from "../../assets/components/TouchableItem";
import { normalize } from "react-native-elements";
import transitionConfig from "../../assets/constants/transitionConfig";
import colors from "../../assets/constants/colors";
import Axios from "axios"
import { height,width } from "../../assets/constants/constants"

var click

var waktu = new Date().getHours()
var dzuhur
var ashar
var maghrib
var isya
var shubuh
var code = waktu >= 12 ? 'pm' : 'am';
waktu = waktu % 12;
waktu = waktu ? waktu : 0;

Axios.get('http://muslimsalat.com/indonesia/daily.json?key=e34c9db960a1e98bb427b7b3b8c97841&jsoncallback=?')
.then((res) => {
  var data = JSON.parse(res.data.substring(res.data.lastIndexOf("(") + 1,res.data.lastIndexOf(")"))).items[0]
  dzuhur = data.dhuhr
  dzuhur = dzuhur.length == 7 ? parseInt(dzuhur.charAt(0)) : parseInt(dzuhur.charAt(0)+dzuhur.charAt(1))
  ashar = data.asr
  ashar = ashar.length == 7 ? parseInt(ashar.charAt(0)) : parseInt(ashar.charAt(0)+ashar.charAt(1))
  maghrib = data.maghrib
  maghrib = maghrib.length == 7 ? parseInt(maghrib.charAt(0)) : parseInt(maghrib.charAt(0)+maghrib.charAt(1))
  isya = data.isha
  isya = isya.length == 7 ? parseInt(isya.charAt(0)) : parseInt(isya.charAt(0)+isya.charAt(1))
  shubuh = data.fajr
  shubuh = shubuh.length == 7 ? parseInt(shubuh.charAt(0)) : parseInt(shubuh.charAt(0)+shubuh.charAt(1))
}).catch((err)=> Alert.alert('Error',`${err.message}`,[{text: 'OK'}],{cancelable:false}))

const MainRoute = createStackNavigator({
  Dashboard: {
    screen: DashboardTab,
    params: {name:'Dashboard'},
    navigationOptions: {
      header: null
    }
  },
  Home: {
    screen: Home,
    params: {name: 'Home'}
  },
  HomeList: {
    screen: HomeList,
    params: {name:'HomeList'}
  },
  DashboardTabList: {
    screen: DashboardTabList,
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        height: StatusBar.currentHeight + (Platform.OS === "ios" ? 44 : 56),
        paddingTop: Platform.OS === "ios" ? 20 : StatusBar.currentHeight,           
      },
      headerRight:
        <View style={{ padding: 15, flexDirection: 'row' }} >
          <TouchableItem
            onPress={()=> {
              navigation.navigate('Dashboard')
            }}
          >
            <Image
              source={require('../../assets/images/icons/ic_timezone_view_40px.png')}
              style={{ width: height * 0.04, height: height * 0.04, marginRight: width*0.01}}
              resizeMethod='resize'
              resizeMode='contain'
            />
          </TouchableItem>
        </View>,
        headerLeft: null
    })
  },
  Jadwal: {
    screen:Jadwal,
    params:{name:'Jadwal'},
    navigationOptions: {
      header: null
    }
  },
  TambahAmal: {
    screen: TambahAmal,
    params:{name:'TambahAmal'},
    navigationOptions: {
      header: null
    }
  },
  Grafik: {
    screen: Grafik,
    params:{name:'Grafik'},
    navigationOptions: {
      header: null
    }
  },
  Histori: {
    screen: Histori,
    params:{name:'Histori'},
    navigationOptions: {
      header: null
    }
  },
  Pengaturan: {
    screen: Pengaturan,
    params:{name:'Pengaturan'},
    navigationOptions: {
      header: null
    }
  }
}, {
  initialRouteName: "Dashboard"
}, {
  transitionConfig : () => ({
    transitionSpec: {
      duration: 0,
      timing: Animated.timing,
      easing: Easing.step0,
    },
  }),
})

const App = createAppContainer(MainRoute);

export default App;