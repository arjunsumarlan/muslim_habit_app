import {
  createBottomTabNavigator, createStackNavigator
} from "react-navigation";
import {
  Image,
  Alert,
  Easing,
  Animated
} from 'react-native'
import {
  Home,
  Jadwal,
  TambahAmal,
  TambahAmalBaru,
  Grafik,
  Histori,
  Pengaturan
} from "../../screen";
import React from 'react';
import { height, width } from '../../assets/constants/constants'
import Axios from 'axios'

export default MainRoute = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        showLabel: false,
        tabBarIcon: ({ focused }) => focused ? 
          <Image 
            source={require('../../assets/images/icons/ic_home_green_24px.png')} 
            style={{ width: height * 0.035, height: height * 0.035}}
            resizeMethod='resize'
            resizeMode='contain'
          /> : 
          <Image 
            source={require('../../assets/images/icons/ic_home_24px.png')} 
            style={{ width: height * 0.035, height: height * 0.035}}
            resizeMethod='resize'
            resizeMode='contain'
          />
    }
  },
    Jadwal: {
      screen: Jadwal,
      navigationOptions: {
        showLabel: false,
        tabBarIcon: ({ focused }) => focused ? 
          <Image 
            source={require('../../assets/images/icons/ic_cal_green_24px.png')} 
            style={{ width: height * 0.035, height: height * 0.035}}
            resizeMethod='resize'
            resizeMode='contain'
          /> : 
          <Image 
            source={require('../../assets/images/icons/ic_cal_24px.png')} 
            style={{ width: height * 0.035, height: height * 0.035}}
            resizeMethod='resize'
            resizeMode='contain'
          />
    }
  },
    TambahAmal: {
      screen: createStackNavigator({
        TambahAmal: {
          screen: TambahAmal, 
          navigationOptions: {
            header: null
          }
        },
        TambahAmalBaru: {
          screen: TambahAmalBaru,
          navigationOptions: {
            header: null
          }
        },
      }, {
        transitionConfig: () => {
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
      }),
      navigationOptions: {
        showLabel: false,
        tabBarIcon: () => 
          <Image 
            source={require('../../assets/images/icons/ic_tambah_80px.png')}
            style={{ width: height * 0.065, height: height * 0.065}}
            resizeMethod='resize'
            resizeMode='contain' 
          />
    }
  },
    Grafik: {
      screen: createStackNavigator({
        Grafik: {
          screen: Grafik, 
          navigationOptions: {
            header: null
          }
        },
        Histori: {
          screen: Histori,
          navigationOptions: {
            header: null
          }
        },
      }, {
        transitionConfig: () => {
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
      }),
      navigationOptions: {
        showLabel: false,
        tabBarIcon: ({ focused }) => focused ? 
        <Image 
          source={require('../../assets/images/icons/ic_report_green_24px.png')}
          style={{ width: height * 0.035, height: height * 0.035}}
          resizeMethod='resize'
          resizeMode='contain' 
        /> : 
        <Image 
          source={require('../../assets/images/icons/ic_report_24px.png')} 
          style={{ width: height * 0.035, height: height * 0.035}}
          resizeMethod='resize'
          resizeMode='contain'
        />
    }
  },
    Pengaturan: {
      screen: Pengaturan,
      navigationOptions: {
        showLabel: false,
        tabBarIcon: ({ focused }) => focused ? 
        <Image 
          source={require('../../assets/images/icons/ic_setting_green_24px.png')} 
          style={{ width: height * 0.035, height: height * 0.035}}
          resizeMethod='resize'
          resizeMode='contain'
        /> : 
        <Image 
          source={require('../../assets/images/icons/ic_settings_24px.png')}
          style={{ width: height * 0.035, height: height * 0.035}}
          resizeMethod='resize'
          resizeMode='contain' 
        />
    }
  }
},{
  tabBarOptions: {
    showLabel: false
  },
})