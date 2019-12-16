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
  TextInput,
  Alert,
  Modal
} from 'react-native';
import globalStyles from '../../../assets/globalStyles';
import { Button, Divider, ListItem, List, Header, normalize } from 'react-native-elements';
import colors from '../../../assets/constants/colors';
import { height, width } from '../../../assets/constants/constants';
import TouchableItem from '../../../assets/components/TouchableItem'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from "./styles"
import momentA from 'moment'
import amalanwajib from '../../../dao/amalanwajib/amalanwajib'
import amalanshunnah from '../../../dao/amalanshunnah/amalanshunnah'
import amalanlist from '../../../dao/amalanlist/amalanlist'

export default class Home extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      refreshing: false,
      loading: false,
      updating: false,
      amalan: '',
      option:'shubuh'
    }

    this._refresh = this._refresh.bind(this);
  }

  componentDidMount(){
    this.getAlllist()
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
                this.props.navigation.goBack()
              }}
            >
              <View style={{ marginLeft:width*0.05, marginBottom: 15, marginTop:15, flexDirection: 'row', alignItems:'center' }} >
                  <MaterialCommunityIcons
                      name="chevron-left" 
                      color={colors.white}
                      size={normalize(35)}
                  />
                  <Text style={{color:colors.white}}>Kembali</Text>
              </View>
            </TouchableItem>
            <Text style={{color:colors.white, marginLeft:35, fontSize:18 }}>TAMBAH</Text>
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
          <View style={{backgroundColor:colors.gray1}}>
            <View style={{marginLeft:width*0.05, marginRight:width*0.05, marginTop:20, flexDirection:'row', alignItems:'center', backgroundColor:colors.white}}>
              <View style={{ marginLeft:width*0.05,  flexDirection: 'row', alignItems:'center' }} >
                <MaterialCommunityIcons
                    name={"pencil"} 
                    color={colors.gray4}
                    size={normalize(20)}
                />
              </View>
              <TextInput
                style={{color:colors.green2, fontWeight:'bold', width:'70%'}}
                value={this.state.amalan}
                placeholder='Nama amalan'
                onChangeText={(amalan)=>this.setState({amalan})}
              />
            </View>
            <View style={{marginLeft:width*0.05, marginRight:width*0.05, backgroundColor:colors.white}}>
              <View style={{borderTopWidth:1, marginLeft:width*0.05, marginRight:width*0.05}}>
                <Text style={{color:colors.green2, marginTop:15, marginBottom:15}}>Dikerjakan sebelum waktu</Text>
              </View>
            </View>
            <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
              <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:40, width:width*0.8, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{ marginTop:10}}>Shubuh</Text>
                <TouchableItem onPress={()=>{
                  this.setState({option:'shubuh'})
                  if(this.state.amalan != ''){
                    Alert.alert(
                      'Konfirmas!',
                      'Apakah Anda yakin ingin menambahkan amalan ini ?',
                      [{text: 'IYA', onPress: ()=>{
                        this.setState({updating:true})
                        amalanlist.instance.setAmalan(this.state.amalan, 'lainnya', 'false', this.state.option, 'shunnah')
                        .then((row)=>{
                          this.setState({updating:false})
                          this.props.navigation.goBack()
                        })
                      }},{text: 'TIDAK', onPress: ()=>{
                        // this.setState({pengaturan:false, delete:false})
                      }}],
                      {
                        cancelable:false
                    })
                  }
                }}>
                  <View style={{width:40, flexDirection: 'row', alignItems:'center', justifyContent:'center' }} >
                    <MaterialCommunityIcons
                        name={this.state.option === 'shubuh' ? "radiobox-marked":"radiobox-blank"}
                        color={colors.green2}
                        size={normalize(20)}
                    />
                  </View>
                </TouchableItem>
              </View>
            </View>
            <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
              <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:40, width:width*0.8, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{ marginTop:10}}>Fajar</Text>
                <TouchableItem onPress={()=>{
                  this.setState({option:'fajar'})
                  if(this.state.amalan != ''){
                    Alert.alert(
                      'Konfirmas!',
                      'Apakah Anda yakin ingin menambahkan amalan ini ?',
                      [{text: 'IYA', onPress: ()=>{
                        this.setState({updating:true})
                        amalanlist.instance.setAmalan(this.state.amalan, 'lainnya', 'false', this.state.option, 'shunnah')
                        .then((row)=>{
                          this.setState({updating:false})
                          this.props.navigation.goBack()
                        })
                      }},{text: 'TIDAK', onPress: ()=>{
                        // this.setState({pengaturan:false, delete:false})
                      }}],
                      {
                        cancelable:false
                    })
                  }
                  }}>
                  <View style={{ width:40, flexDirection: 'row', alignItems:'center', justifyContent:'center' }} >
                    <MaterialCommunityIcons
                        name={this.state.option === 'fajar' ? "radiobox-marked":"radiobox-blank"}
                        color={colors.green2}
                        size={normalize(20)}
                    />
                  </View>
                </TouchableItem>
              </View>
            </View>
            <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
              <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:40, width:width*0.8, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{ marginTop:10}}>Dzuhur</Text>
                <TouchableItem onPress={()=>{
                  this.setState({option:'dzuhur'})
                  if(this.state.amalan != ''){
                    Alert.alert(
                      'Konfirmas!',
                      'Apakah Anda yakin ingin menambahkan amalan ini ?',
                      [{text: 'IYA', onPress: ()=>{
                        this.setState({updating:true})
                        amalanlist.instance.setAmalan(this.state.amalan, 'lainnya', 'false', this.state.option, 'shunnah')
                        .then((row)=>{
                          this.setState({updating:false})
                          this.props.navigation.goBack()
                        })
                      }},{text: 'TIDAK', onPress: ()=>{
                        // this.setState({pengaturan:false, delete:false})
                      }}],
                      {
                        cancelable:false
                    })
                  }
                  }}>
                  <View style={{ width:40, flexDirection: 'row', alignItems:'center', justifyContent:'center' }} >
                    <MaterialCommunityIcons
                        name={this.state.option === 'dzuhur' ? "radiobox-marked":"radiobox-blank"}
                        color={colors.green2}
                        size={normalize(20)}
                    />
                  </View>
                </TouchableItem>
              </View>
            </View>
            <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
              <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:40, width:width*0.8, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{ marginTop:10}}>Ashar</Text>
                <TouchableItem onPress={()=>{
                  this.setState({option:'ashar'})
                  if(this.state.amalan != ''){
                    Alert.alert(
                      'Konfirmas!',
                      'Apakah Anda yakin ingin menambahkan amalan ini ?',
                      [{text: 'IYA', onPress: ()=>{
                        this.setState({updating:true})
                        amalanlist.instance.setAmalan(this.state.amalan, 'lainnya', 'false', this.state.option, 'shunnah')
                        .then((row)=>{
                          this.setState({updating:false})
                          this.props.navigation.goBack()
                        })
                      }},{text: 'TIDAK', onPress: ()=>{
                        // this.setState({pengaturan:false, delete:false})
                      }}],
                      {
                        cancelable:false
                    })
                  }
                  }}>
                  <View style={{ width:40, flexDirection: 'row', alignItems:'center', justifyContent:'center' }} >
                    <MaterialCommunityIcons
                        name={this.state.option === 'ashar' ? "radiobox-marked":"radiobox-blank"}
                        color={colors.green2}
                        size={normalize(20)}
                    />
                  </View>
                </TouchableItem>
              </View>
            </View>
            <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
              <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:40, width:width*0.8, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{ marginTop:10}}>Maghrib</Text>
                <TouchableItem onPress={()=>{
                  this.setState({option:'maghrib'})
                  if(this.state.amalan != ''){
                    Alert.alert(
                      'Konfirmas!',
                      'Apakah Anda yakin ingin menambahkan amalan ini ?',
                      [{text: 'IYA', onPress: ()=>{
                        this.setState({updating:true})
                        amalanlist.instance.setAmalan(this.state.amalan, 'lainnya', 'false', this.state.option, 'shunnah')
                        .then((row)=>{
                          this.setState({updating:false})
                          this.props.navigation.goBack()
                        })
                      }},{text: 'TIDAK', onPress: ()=>{
                        // this.setState({pengaturan:false, delete:false})
                      }}],
                      {
                        cancelable:false
                    })
                  }
                  }}>
                  <View style={{ width:40, flexDirection: 'row', alignItems:'center', justifyContent:'center' }} >
                    <MaterialCommunityIcons
                        name={this.state.option === 'maghrib' ? "radiobox-marked":"radiobox-blank"}
                        color={colors.green2}
                        size={normalize(20)}
                    />
                  </View>
                </TouchableItem>
              </View>
            </View>
            <View style={{marginLeft:width*0.05, marginRight:width*0.05, flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.white}}>
              <View style={{marginLeft:width*0.05, marginRight:width*0.05, height:40, width:width*0.8, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{ marginTop:10}}>Isya</Text>
                <TouchableItem onPress={()=>{
                  this.setState({option:'isya'})
                  if(this.state.amalan != ''){
                    Alert.alert(
                      'Konfirmas!',
                      'Apakah Anda yakin ingin menambahkan amalan ini ?',
                      [{text: 'IYA', onPress: ()=>{
                        this.setState({updating:true})
                        amalanlist.instance.setAmalan(this.state.amalan, 'lainnya', 'false', this.state.option, 'shunnah')
                        .then((row)=>{
                          this.setState({updating:false})
                          this.props.navigation.goBack()
                        })
                      }},{text: 'TIDAK', onPress: ()=>{
                        // this.setState({pengaturan:false, delete:false})
                      }}],
                      {
                        cancelable:false
                    })
                  }
                  }}>
                  <View style={{ width:40, flexDirection: 'row', alignItems:'center', justifyContent:'center' }} >
                   <MaterialCommunityIcons
                        name={this.state.option === 'isya' ? "radiobox-marked":"radiobox-blank"}
                        color={colors.green2}
                        size={normalize(20)}
                    />
                  </View>
                </TouchableItem>
              </View>
            </View>
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
