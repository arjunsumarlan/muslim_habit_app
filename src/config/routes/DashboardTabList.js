import {
  createBottomTabNavigator
} from "react-navigation";
import {
  Image,
  Alert
} from 'react-native'
import {
  HomeList,
  Jadwal,
  TambahAmal,
  Grafik,
  Pengaturan
} from "../../screen";
import React from 'react';
import { height, width } from '../../assets/constants/constants'
import Axios from 'axios'

export default MainRoute = createBottomTabNavigator(
  {
    HomeList: {
      screen: HomeList,
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
      screen: TambahAmal,
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
      screen: Grafik,
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