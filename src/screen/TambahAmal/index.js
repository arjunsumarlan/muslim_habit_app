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
import momentA from 'moment'
import amalanwajib from '../../dao/amalanwajib/amalanwajib'
import amalanshunnah from '../../dao/amalanshunnah/amalanshunnah'
import amalanlist from '../../dao/amalanlist/amalanlist'

export default class Home extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      refreshing: false,
      loading: false,
      updating: false,
      sholat: false,
      puasa: false,
      doadandzikir: false,
      lainnya: false,
      datalist: []
    }

    this._refresh = this._refresh.bind(this);
  }

  componentDidMount(){
    setInterval(()=>{
      this.getAlllist()
    }, 3000)
  }

  setAmalan(amalan, tanggal, refer, waktu, pause, kategori, telat){
    let date = tanggal.split('/')
    if(refer === 'wajib'){
      return amalanwajib.instance.setAmalan(amalan, date[0], date[1], date[2], tanggal, '0', refer, waktu, pause, kategori, telat)
    }else{
      return amalanshunnah.instance.setAmalan(amalan, date[0], date[1], date[2], tanggal, '0', refer, waktu, pause, kategori, telat)
    }
  }

  getAlllist(){
    var datalist = []
    amalanlist.instance.getamalan().then(row => {
      for(i=0; i<row.length; i++){
        datalist.push(row.item(i))
      }
      return this.setState({datalist})
    })
  }

  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  _refresh () {
    this.setState({refreshing: true})
    // you must return Promise everytime
    return new Promise((resolve) => {
      setTimeout(()=>{
        this.getAlllist()
        this.setState({refreshing: false})
        resolve(); 
      }, 2000)
    })
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
            <Text style={{color:colors.white, marginLeft:35, fontSize:18, marginBottom:15 }}>TAMBAH</Text>
          </View>
        </View>
        <ScrollView 
          style={styles.container} 
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              colors={['rgba(0, 150, 100, 0.85)']}
              onRefresh={this._refresh}
            />
          }
        >
          <View style={{backgroundColor:colors.gray1, justifyContent:'space-between'}}>
            {
              this.isEmpty(this.state.datalist) ?
                <View style={[globalStyles.centerContainer,{marginTop:height*0.3}]}>
                  <ActivityIndicator color={colors.green2} size='large' />
                  <Text style={{color:colors.green2}}>Updating data</Text>
                </View>
              :
                <View>
                  <View style={{marginLeft:width*0.05, marginRight:width*0.05, marginTop:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:colors.white}}>
                    <Text style={{marginLeft:20, marginTop:20, marginBottom:20}}>Tambah Sendiri</Text>
                    
                      <View style={{ marginRight:width*0.05, flexDirection: 'row', alignItems:'center' }} >
                        <MaterialCommunityIcons
                            name="information" 
                            style={{marginRight:20}}
                            size={normalize(20)}
                        />
                        {/* <TouchableItem onPress={()=>this.props.navigation.navigate('TambahAmalBaru')}> */}
                          <MaterialCommunityIcons
                              name="plus"
                              color='black'
                              size={normalize(28)}
                          />
                        {/* </TouchableItem> */}
                      </View>
                    
                  </View>
                  <View style={{marginLeft:width*0.05, marginRight:width*0.05, marginTop:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:colors.white}}>
                    <Text style={{marginLeft:20, marginTop:20, marginBottom:20, color:colors.green2, fontWeight:'bold'}}>Sholat</Text>
                    <TouchableItem onPress={()=>this.setState({sholat:!this.state.sholat})}>
                      <View style={{ marginRight:width*0.05, flexDirection: 'row', alignItems:'center' }} >
                        <MaterialCommunityIcons
                            name={this.state.sholat ? "arrow-up-drop-circle-outline" : "arrow-right-drop-circle-outline"} 
                            color={colors.green2}
                            size={normalize(28)}
                        />
                      </View>
                    </TouchableItem>
                  </View>
                  {
                    this.state.sholat ?
                    this.state.datalist.map((item)=>{
                      if(item.kategori === 'sholat'){
                        return(
                          <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
                            <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:70, width:width*0.8, borderTopWidth:1, flexDirection:'row', justifyContent:'space-between'}}>
                              <Text style={{marginBottom:20, marginTop:20}}>{item.amalan}</Text>
                              <TouchableItem >
                                <View style={{ marginRight:width*0.05, flexDirection: 'row', alignItems:'center' }} >
                                  <MaterialCommunityIcons
                                      name="information" 
                                      style={{marginRight:20}}
                                      size={normalize(20)}
                                  />
                                  {/* <TouchableItem onPress={()=>{
                                    var tanggal = momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY')
                                    if(item.show_home === 'false'){
                                      this.setState({updating:true})
                                      amalanlist.instance.updateAmalan(item.amalan, item.kategori, 'true', item.waktu, item.type)
                                      .then((row)=>{
                                        this.setAmalan(item.amalan, tanggal, item.type, item.waktu, 'false', item.kategori, 'false')
                                        .then((row)=>{
                                          this.setState({updating:false})
                                          Alert.alert('Berhasil!','Amalan Anda berhasil ditambahkan ke Home.')
                                        })
                                      })
                                    }
                                  }}> */}
                                    <MaterialCommunityIcons
                                        name="plus"
                                        color='black'
                                        size={normalize(28)}
                                    />
                                  {/* </TouchableItem> */}
                                </View>
                              </TouchableItem>
                            </View>
                          </View>
                        )
                      }
                    })
                    : null
                  }
                  <View style={{marginLeft:width*0.05, marginRight:width*0.05, marginTop:20, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
                    <Text style={{marginLeft:20, marginTop:20, marginBottom:20, color:colors.green2, fontWeight:'bold'}}>Puasa</Text>
                    {/* <TouchableItem onPress={()=>this.setState({puasa:!this.state.puasa})}> */}
                      <View style={{ marginRight:width*0.05, flexDirection: 'row', alignItems:'center' }} >
                        <MaterialCommunityIcons
                            name={this.state.puasa ? "arrow-up-drop-circle-outline" : "arrow-right-drop-circle-outline"} 
                            color={colors.green2}
                            size={normalize(28)}
                        />
                      </View>
                    {/* </TouchableItem> */}
                  </View>
                  {
                    this.state.puasa ?
                    this.state.datalist.map((item)=>{
                      if(item.kategori === 'puasa'){
                        return(
                          <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
                            <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:70, width:width*0.8, borderTopWidth:1, flexDirection:'row', justifyContent:'space-between'}}>
                              <Text style={{marginBottom:20, marginTop:20}}>{item.amalan}</Text>
                              <TouchableItem >
                                <View style={{ marginRight:width*0.05, flexDirection: 'row', alignItems:'center' }} >
                                  <MaterialCommunityIcons
                                      name="information" 
                                      style={{marginRight:20}}
                                      size={normalize(20)}
                                  />
                                  {/* <TouchableItem onPress={()=>{
                                    var tanggal = momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY')
                                    if(item.show_home === 'false'){
                                      this.setState({updating:true})
                                      amalanlist.instance.updateAmalan(item.amalan, item.kategori, 'true', item.waktu, item.type)
                                      .then((row)=>{
                                        this.setAmalan(item.amalan, tanggal, item.type, item.waktu, 'false', item.kategori, 'false')
                                        .then((row)=>{
                                          this.setState({updating:false})
                                          Alert.alert('Berhasil!','Amalan Anda berhasil ditambahkan ke Home.')
                                        })
                                      })
                                    }
                                  }}> */}
                                    <MaterialCommunityIcons
                                        name="plus"
                                        color='black'
                                        size={normalize(28)}
                                    />
                                  {/* </TouchableItem> */}
                                </View>
                              </TouchableItem>
                            </View>
                          </View>
                        )
                      }
                    })
                    : null
                  }
                  <View style={{marginLeft:width*0.05, marginRight:width*0.05, marginTop:20, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
                    <Text style={{marginLeft:20, marginTop:20, marginBottom:20, color:colors.green2, fontWeight:'bold'}}>Doa dan dzikir</Text>
                    {/* <TouchableItem onPress={()=>this.setState({doadandzikir:!this.state.doadandzikir})}> */}
                      <View style={{ marginRight:width*0.05, flexDirection: 'row', alignItems:'center' }} >
                        <MaterialCommunityIcons
                            name={this.state.doadandzikir ? "arrow-up-drop-circle-outline" : "arrow-right-drop-circle-outline"} 
                            color={colors.green2}
                            size={normalize(28)}
                        />
                      </View>
                    {/* </TouchableItem> */}
                  </View>
                  {
                    this.state.doadandzikir ?
                    this.state.datalist.map((item)=>{
                      if(item.kategori === 'doadandzikir'){
                        return(
                          <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
                            <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:70, width:width*0.8, borderTopWidth:1, flexDirection:'row', justifyContent:'space-between'}}>
                              <Text style={{marginBottom:20, marginTop:20}}>{item.amalan}</Text>
                              <TouchableItem >
                                <View style={{ marginRight:width*0.05, flexDirection: 'row', alignItems:'center' }} >
                                  <MaterialCommunityIcons
                                      name="information" 
                                      style={{marginRight:20}}
                                      size={normalize(20)}
                                  />
                                  {/* <TouchableItem onPress={()=>{
                                    var tanggal = momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY')
                                    if(item.show_home === 'false'){
                                      this.setState({updating:true})
                                      amalanlist.instance.updateAmalan(item.amalan, item.kategori, 'true', item.waktu, item.type)
                                      .then((row)=>{
                                        this.setAmalan(item.amalan, tanggal, item.type, item.waktu, 'false', item.kategori, 'false')
                                        .then((row)=>{
                                          this.setState({updating:false})
                                          Alert.alert('Berhasil!','Amalan Anda berhasil ditambahkan ke Home.')
                                        })
                                      })
                                    }
                                  }}> */}
                                    <MaterialCommunityIcons
                                        name="plus"
                                        color='black'
                                        size={normalize(28)}
                                    />
                                  {/* </TouchableItem> */}
                                </View>
                              </TouchableItem>
                            </View>
                          </View>
                        )
                      }
                    })
                    : null
                  }
                  <View style={{marginLeft:width*0.05, marginRight:width*0.05, marginTop:20, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
                    <Text style={{marginLeft:20, marginTop:20, marginBottom:20, color:colors.green2, fontWeight:'bold'}}>Lainnya</Text>
                    {/* <TouchableItem onPress={()=>this.setState({lainnya:!this.state.lainnya})}> */}
                      <View style={{ marginRight:width*0.05, flexDirection: 'row', alignItems:'center' }} >
                        <MaterialCommunityIcons
                            name={this.state.lainnya ? "arrow-up-drop-circle-outline" : "arrow-right-drop-circle-outline"} 
                            color={colors.green2}
                            size={normalize(28)}
                        />
                      </View>
                    {/* </TouchableItem> */}
                  </View>
                  {
                    this.state.lainnya ?
                    this.state.datalist.map((item)=>{
                      if(item.kategori === 'lainnya'){
                        return(
                          <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
                            <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:70, width:width*0.8, borderTopWidth:1, flexDirection:'row', justifyContent:'space-between'}}>
                              <Text style={{marginBottom:20, marginTop:20}}>{item.amalan}</Text>
                              <TouchableItem >
                                <View style={{ marginRight:width*0.05, flexDirection: 'row', alignItems:'center' }} >
                                  <MaterialCommunityIcons
                                      name="information" 
                                      style={{marginRight:20}}
                                      size={normalize(20)}
                                  />
                                  {/* <TouchableItem onPress={()=>{
                                    var tanggal = momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY')
                                    if(item.show_home === 'false'){
                                      this.setState({updating:true})
                                      amalanlist.instance.updateAmalan(item.amalan, item.kategori, 'true', item.waktu, item.type)
                                      .then((row)=>{
                                        this.setAmalan(item.amalan, tanggal, item.type, item.waktu, 'false', item.kategori, 'false')
                                        .then((row)=>{
                                          this.setState({updating:false})
                                          Alert.alert('Berhasil!','Amalan Anda berhasil ditambahkan ke Home.')
                                        })
                                      })
                                    }
                                  }}> */}
                                    <MaterialCommunityIcons
                                        name="plus"
                                        color='black'
                                        size={normalize(28)}
                                    />
                                  {/* </TouchableItem> */}
                                </View>
                              </TouchableItem>
                            </View>
                          </View>
                        )
                      }
                    })
                    : null
                  }
                </View>
            }
          </View>
          <Modal
            visible={this.state.updating}
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
        </ScrollView>
      </View>
    )
}
}
