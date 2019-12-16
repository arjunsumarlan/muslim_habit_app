/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { PureComponent } from 'react';
import {
  Image,
  TextInput,
  Text,
  View,
  ScrollView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Modal,
  Linking,
  TouchableOpacity,
  Alert,
  NetInfo,
  Animated,
  ImageBackground,
  Platform,
  UIManager
} from 'react-native';
import globalStyles from '../../assets/globalStyles';
import { Button, Divider, ListItem, List, Header, normalize } from 'react-native-elements';
import colors from '../../assets/constants/colors';
import CustomCard from '../../assets/components/CustomCard';
import TouchableItem from '../../assets/components/TouchableItem'
import { height, width } from '../../assets/constants/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';
import { FormattedCurrency, FormattedNumber } from 'react-native-globalize';
import Axios from "axios"
import styles from "./styles"
import momentA from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'
import amalanwajib from '../../dao/amalanwajib/amalanwajib'
import amalanshunnah from '../../dao/amalanshunnah/amalanshunnah'

export default class HomeList extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      ashar: 15,
      shubuh: 4,
      isya: 19,
      maghrib: 18,
      dzuhur: 12,
      check: false,
      submit: false,
      data: [],
      done: false, 
      option: ''
    }
  }

  componentDidMount(){
    if(this.isEmpty(this.state.data)){
      this.getbyTanggal(momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY'))
    }

    setTimeout(()=>{
      setInterval(() => {
        this.getbyTanggal(momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY'))
      }, 1000);
    }, 4000)
  }

  deleteAmalan(amalan, tanggal){
    amalanwajib.instance.deleteAmalan(amalan, tanggal)
  }

  setAmalan(amalan, tanggal, refer){
    let date = tanggal.split('/')
    return amalanwajib.instance.setAmalan(amalan, date[0], date[1], date[2], tanggal, '0', refer)
  }

  setNilai(amalan, tanggal, nilai, refer){
    let date = tanggal.split('/')
    if(refer === 'wajib'){
      amalanwajib.instance.setNilai(amalan, date[0], date[1], date[2], tanggal, nilai, refer).then(()=>{
        var data = []
        amalanwajib.instance.getamalanbyTanggal(tanggal).then(row => {
          for(i=0; i<row.length; i++){
            data.push(row.item(i))
          }
          amalanshunnah.instance.getamalanbyTanggal(tanggal).then(row => {
            for(i=0; i<row.length; i++){
              data.push(row.item(i))
            }
            return this.setState({data})
          })
        })
      })
    }else if(refer === 'shunnah'){
      amalanshunnah.instance.setNilai(amalan, date[0], date[1], date[2], tanggal, nilai, refer).then(()=>{
        var data = []
        amalanshunnah.instance.getamalanbyTanggal(tanggal).then(row => {
          for(i=0; i<row.length; i++){
            data.push(row.item(i))
          }
          amalanwajib.instance.getamalanbyTanggal(tanggal).then(row => {
            for(i=0; i<row.length; i++){
              data.push(row.item(i))
            }
            return this.setState({data})
          })
        })
      })
    }
  }

  getbyTanggal(tanggal){
    var data = []
    amalanwajib.instance.getamalanbyTanggal(tanggal).then(row => {
      for(i=0; i<row.length; i++){
        data.push(row.item(i))
      }
      amalanshunnah.instance.getamalanbyTanggal(tanggal).then(row => {
        for(i=0; i<row.length; i++){
          data.push(row.item(i))
        }
        return this.setState({data})
      })
    })
  }

  getAll(){
    var data = []
    amalanwajib.instance.getamalan().then(row => {
      for(i=0; i<row.length; i++){
        data.push(row.item(i))
      }
    })
    return this.setState({data})
  }

  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={globalStyles.growContainer}
      >
        <View style={[globalStyles.container,{backgroundColor:colors.white}]}>
          <View style={{ marginTop: height * 0.015, marginLeft: width * 0.05, marginRight: width * 0.05, marginBottom: height * 0.025}}>
            {
                  this.isEmpty(this.state.data) ?
                    <View style={[globalStyles.centerContainer,{backgroundColor:colors.white, height:100}]}>
                      <ActivityIndicator color={colors.green2} size='large' />
                      <Text style={{color:colors.green2}}>Updating data</Text>
                    </View>
                  :
                  this.state.data.map((item, index)=>{
                    return <CustomCard key={index} moreStyle={{marginBottom:10, justifyContent:'center', borderColor:item.nilai != '0' ? null : 'green', borderWidth: item.nilai != '0' ? 0 : 1, backgroundColor: item.nilai != '0' ? 'rgba(0, 200, 0, 0.1)':null}}>
                    <View style={{flexDirection: 'row', justifyContent:'space-between', alignContent: 'center', marginBottom: 5, marginTop: 5}}>
                      <Text style={{fontSize: 16}}>{item.amalan}</Text>
                      <View>
                        
                      </View>
                      {
                        item.nilai != '0' ?
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                          <Image
                            source={require('../../assets/images/icons/ic_settings_24px.png')}
                            style={{ width: height * 0.035, height: height * 0.035}}
                            tintColor={colors.gray4}
                            resizeMethod='resize'
                            resizeMode='contain'
                          />
                          <TouchableItem onPress={()=>{
                              this.setNilai(item.amalan, item.tanggal, '0', item.type)
                            // }
                          }}>
                            <View style={[styles.buttonCircleFull, {marginLeft: 10}]}>
                              <Ionicons
                                name="md-checkmark"
                                color="rgba(255, 255, 255, .9)"
                                size={24}
                                style={{ backgroundColor: 'transparent' }}
                              />
                            </View>
                          </TouchableItem>
                        </View>
                        :
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                          <Image
                            source={require('../../assets/images/icons/ic_settings_24px.png')}
                            style={{ width: height * 0.035, height: height * 0.035}}
                            tintColor={colors.gray4}
                            resizeMethod='resize'
                            resizeMode='contain'
                          />
                          <TouchableItem onPress={()=>{
                              this.setNilai(item.amalan, item.tanggal, '1', item.type)
                              this.setState({submit: true})
                            // }
                          }}>
                            <View style={[styles.buttonCircle,{marginLeft:10}]}></View>
                          </TouchableItem>
                        </View>
                      }
                    </View>
                  </CustomCard>
                  })
                }
          </View>
        </View>
        <Modal
              visible={this.state.done}
              onRequestClose={() => this.setState({ done: false, option: '', submit: false })}
              transparent
              animationType='slide'
            >
              <View style={{ flex:1, justifyContent: 'center', alignItems:'center', backgroundColor: 'rgba(0, 225, 150, 0.5)'}}>
                <View style={{ backgroundColor: 'white', height: height * 0.5, width: width * 0.9, justifyContent: 'center', alignItems:'center', borderRadius:30}}>
                  <Image
                    source={require('../../assets/images/illus-sukses.png')}
                    style={{ width: height * 0.25, height: height * 0.25, marginTop: '5%', marginBottom: '5%'}}
                    resizeMethod='resize'
                    resizeMode='contain'
                  />
                  <Text style={{fontSize:18}}>Semoga Allah menerima</Text>
                  <Text style={{fontSize:18, marginBottom: '3%'}}>amal shaleh kita.</Text>
                  <Button
                    rounded
                    title="AMIN"
                    onPress={() => {
                      this.setState({done: false, option: '', submit: false})
                    }}
                    buttonStyle={{width: width * 0.5, backgroundColor:colors.green }}
                    textStyle={{ color: colors.white, textAlign:'center', justifyContent:'center' }}
                  />
                </View>
              </View>
            </Modal>
            <Modal
              visible={this.state.submit}
              onRequestClose={() => this.setState({ submit: false })}
              transparent
              animationType='slide'
            >
              <View style={{ flex:1, justifyContent: 'center', alignItems:'center', backgroundColor: 'rgba(0, 225, 150, 0.5)'}}>
                <View style={{ backgroundColor: 'white', height: height * 0.4, width: width * 0.9, borderRadius:5, justifyContent:'space-between'}}>
                  <Text style={{marginLeft:'5%', marginTop:'2%', color:colors.green}}>Dikerjakan pada : </Text>
                  <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
                    <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:40, width:width*0.8, flexDirection:'row', justifyContent:'space-between'}}>
                      <Text style={{ marginBottom:10}}>Sebelum waktunya</Text>
                      <TouchableItem onPress={()=>{
                        this.setState({option:'sebelum waktunya', done: true})
                      }}>
                        <View style={{width:40, flexDirection: 'row', alignItems:'center', justifyContent:'center', marginRight: width * 0.05 }} >
                          <MaterialCommunityIcons
                              name={this.state.option === 'sebelum waktunya' ? "radiobox-marked":"radiobox-blank"}
                              color={colors.green2}
                              size={normalize(20)}
                              style={{ marginBottom:10}}
                          />
                        </View>
                      </TouchableItem>
                    </View>
                  </View>
                  <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
                    <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:40, width:width*0.8, flexDirection:'row', justifyContent:'space-between'}}>
                      <Text style={{ marginBottom:10}}>Tepat waktu</Text>
                      <TouchableItem onPress={()=>{
                        this.setState({option:'tepat waktu', done: true})
                      }}>
                        <View style={{ width:40, flexDirection: 'row', alignItems:'center', justifyContent:'center', marginRight: width * 0.05 }} >
                          <MaterialCommunityIcons
                              name={this.state.option === 'tepat waktu' ? "radiobox-marked":"radiobox-blank"}
                              color={colors.green2}
                              size={normalize(20)}
                              style={{ marginBottom:10}}
                          />
                        </View>
                      </TouchableItem>
                    </View>
                  </View>
                  <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
                    <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:40, width:width*0.8, flexDirection:'row', justifyContent:'space-between'}}>
                      <Text style={{ marginBottom:10}}>Hampir telat</Text>
                      <TouchableItem onPress={()=>{
                        this.setState({option:'hampir telat', done: true})
                      }}>
                        <View style={{ width:40, flexDirection: 'row', alignItems:'center', justifyContent:'center', marginRight: width * 0.05 }} >
                          <MaterialCommunityIcons
                              name={this.state.option === 'hampir telat' ? "radiobox-marked":"radiobox-blank"}
                              color={colors.green2}
                              size={normalize(20)}
                              style={{ marginBottom:10}}
                          />
                        </View>
                      </TouchableItem>
                    </View>
                  </View>
                  <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
                    <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:40, width:width*0.8, flexDirection:'row', justifyContent:'space-between'}}>
                      <Text style={{ marginBottom:10}}>Sangat telat</Text>
                      <TouchableItem onPress={()=>{
                        this.setState({option:'sangat telat', done: true})
                      }}>
                        <View style={{ width:40, flexDirection: 'row', alignItems:'center', justifyContent:'center', marginRight: width * 0.05 }} >
                          <MaterialCommunityIcons
                              name={this.state.option === 'sangat telat' ? "radiobox-marked":"radiobox-blank"}
                              color={colors.green2}
                              size={normalize(20)}
                              style={{ marginBottom:10}}
                          />
                        </View>
                      </TouchableItem>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
      </ScrollView>
    )
  }
}
