/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { PureComponent } from 'react';
import {
  Text,
  View,
  ScrollView,
  StatusBar,
  Platform,
  RefreshControl,
  Picker,
  ActivityIndicator,
  Modal,
  Alert
} from 'react-native';
import globalStyles from '../../assets/globalStyles';
import { Button, Divider, ListItem, List, Header, normalize } from 'react-native-elements';
import colors from '../../assets/constants/colors';
import { height, width } from '../../assets/constants/constants';
import TouchableItem from '../../assets/components/TouchableItem'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from "./styles"

export default class Home extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      facebook: false,
      google: false
    }
  }

  render() {
    return ( 
      <View style={[globalStyles.growContainer, {backgroundColor: colors.green2}]}>
        <View style={{
          height: StatusBar.currentHeight + (Platform.OS === "ios" ? 44/1.2 : 56/1.2),
          paddingTop: Platform.OS === "ios" ? 5 : 10, 
        }}>
          <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
            <TouchableItem
              onPress={()=> {
                this.props.navigation.navigate('Home')
              }}
            >
              <View style={{ marginLeft:width*0.05, marginBottom: 15, marginTop:15, flexDirection: 'row', alignItems:'center' }} >
                  <MaterialCommunityIcons
                      name="chevron-left" 
                      color={colors.white}
                      size={normalize(35)}
                      style={{marginBottom:15}}
                  />
                  <Text style={{color:colors.white, marginBottom:15}}>Kembali</Text>
              </View>
            </TouchableItem>
            <Text style={{color:colors.white, marginLeft:35, fontSize:18, marginBottom:15 }}>PENGATURAN</Text>
          </View>
        </View>
          <View style={{flex:1, backgroundColor:colors.white}}>
              <View style={{ padding: 25, alignItems: 'center' }}>
                <Text style={{ paddingTop: 20, paddingBottom: 45, fontSize: 13 }}>Simpan dan amankan data Anda dengan melakukan login.</Text>
                <View style={{ borderRadius: 5, height: 70, width: width - 50, backgroundColor: '#3b5998', alignItems: 'center', marginBottom: 25, flexDirection: 'row' }}>
                  <MaterialCommunityIcons
                      name="facebook" 
                      color={colors.white}
                      size={normalize(25)}
                      style={{ marginLeft: 25, marginRight: 30 }}
                  />
                  <Text style={{ color: colors.white, fontSize: 18 }}>Login dengan Facebook</Text>
                </View>
                <View style={{ borderRadius: 5, height: 70, width: width - 50, backgroundColor: '#db3236', alignItems: 'center', flexDirection: 'row' }}>
                  <MaterialCommunityIcons
                      name="google" 
                      color={colors.white}
                      size={normalize(25)}
                      style={{ marginLeft: 25, marginRight: 30 }}
                  />
                  <Text style={{ color: colors.white, fontSize: 18 }}>Login dengan Google</Text>
                </View>
              </View>
          </View>
          <Modal
            visible={this.state.facebook}
            transparent
            animationType='slide'
          >
            <View style={{ flex:1, justifyContent: 'center', alignItems:'center', backgroundColor: 'rgba(0, 225, 150, 0.5)'}}>
              <View style={{ backgroundColor: 'white', height: height * 0.3, width: width * 0.6, justifyContent: 'center', alignItems:'center', borderRadius:30}}>
                <ActivityIndicator color={colors.green2} size='large' />
                <Text style={{color:colors.green2}}>Adding data...</Text>
              </View>
            </View>
          </Modal>
      </View>
    )
}
}
