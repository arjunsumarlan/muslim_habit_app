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
  ImageBackground,
  Linking,
  TouchableOpacity,
  Alert,
  NetInfo,
  ProgressBarAndroid,
  Animated,
  Platform,
  RefreshControl
} from 'react-native';
import globalStyles from '../../assets/globalStyles';
import { Button, Divider, ListItem, List, Header, normalize } from 'react-native-elements';
import colors from '../../assets/constants/colors';
import CustomCard from '../../assets/components/CustomCard';
import ToucableItem from '../../assets/components/TouchableItem'
import { height, width } from '../../assets/constants/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';
import { FormattedCurrency, FormattedNumber } from 'react-native-globalize';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import styles from "./styles"
import momentA from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'
import amalanwajib from '../../dao/amalanwajib/amalanwajib'
import amalanshunnah from '../../dao/amalanshunnah/amalanshunnah'

export default class Home extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      fillwajib: 0,
      fillshunnah: 0,
      refreshing: false,
      wajib:true,
      loading1:true,
      loading2:true,
      datawajib: [],
      datashunnah: [],
      pilih:false
    }

    this._refresh = this._refresh.bind(this);
  }

  componentDidMount(){
    this.timer = this.launchTimer();
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  launchTimer = () => {
    this.timer = setInterval(() => {
        this.getbyTanggal(momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY'), 'shunnah')
        this.getbyTanggal(momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY'), 'wajib')
    }, 10000);
  };

  deleteAmalan(amalan, tanggal, refer){
    if(refer === 'wajib') amalanwajib.instance.deleteAmalan(amalan, tanggal)
    else if(refer === 'shunnah') amalanshunnah.instance.deleteAmalan(amalan, tanggal)
  }

  setAmalan(amalan, tanggal, refer){
    let date = tanggal.split('/')
    if(refer === 'wajib') amalanwajib.instance.setAmalan(amalan, date[0], date[1], date[2], tanggal, '0', refer)
    else if(refer === 'shunnah') amalanshunnah.instance.setAmalan(amalan, date[0], date[1], date[2], tanggal, '0', refer)
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
        })
        this.setState({datawajib:data})
        var fillwajib = 0
        if(!this.isEmpty(this.state.datawajib)){
          this.state.datawajib.map((item)=>{
            fillwajib = fillwajib + parseInt(item.nilai)
          })
          fillwajib = (fillwajib / this.state.datawajib.length)*100
          fillwajib = Number(fillwajib).toFixed(0)
        }
        return this.setState({fillwajib})
      })
    }else if(refer === 'shunnah'){
      amalanshunnah.instance.setNilai(amalan, date[0], date[1], date[2], tanggal, nilai, refer).then(()=>{
        var data = []
        amalanshunnah.instance.getamalanbyTanggal(tanggal).then(row => {
          for(i=0; i<row.length; i++){
            data.push(row.item(i))
          }
        })
        this.setState({datashunnah:data})
        var fillshunnah = 0
        if(!this.isEmpty(this.state.datashunnah)){
          this.state.datashunnah.map((item)=>{
            fillshunnah = fillshunnah + parseInt(item.nilai)
          })
          fillshunnah = (fillshunnah / this.state.datashunnah.length)*100
          fillshunnah = Number(fillshunnah).toFixed(0)
        }
        return this.setState({fillshunnah})
      })
    }
  }

  getbyTanggal(tanggal, refer){
    if(refer === 'wajib'){
      amalanwajib.instance.getamalanbyTanggal(tanggal).then(row => {
        var data = []
        for(i=0; i<row.length; i++){
          data.push(row.item(i))
        }
        this.setState({datawajib:data})
        var fillwajib = 0
        if(!this.isEmpty(this.state.datawajib)){
          this.state.datawajib.map((item)=>{
            fillwajib = fillwajib + parseInt(item.nilai)
          })
          fillwajib = (fillwajib / this.state.datawajib.length)*100
          fillwajib = Number(fillwajib).toFixed(0)
        }
        return this.setState({fillwajib:fillwajib, loading1:false})
      })
    }else if(refer === 'shunnah'){
      amalanshunnah.instance.getamalanbyTanggal(tanggal).then(row => {
        var data = []
        for(i=0; i<row.length; i++){
          data.push(row.item(i))
        }
        this.setState({datashunnah:data})
        var fillshunnah = 0
        if(!this.isEmpty(this.state.datashunnah)){
          this.state.datashunnah.map((item)=>{
            fillshunnah = fillshunnah + parseInt(item.nilai)
          })
          fillshunnah = (fillshunnah / this.state.datashunnah.length)*100
          fillshunnah = Number(fillshunnah).toFixed(0)
        }

        return this.setState({fillshunnah:fillshunnah, loading2:false})
      })
    }
  }

  getAll(refer){
    var data = []
    if(refer === 'wajib'){
      amalanwajib.instance.getamalan().then(row => {
        for(i=0; i<row.length; i++){
          data.push(row.item(i))
        }
      })
      return this.setState({datawajib:data})
    }else if(refer === 'shunnah'){
      amalanshunnah.instance.getamalan().then(row => {
        for(i=0; i<row.length; i++){
          data.push(row.item(i))
        }
      })
      return this.setState({datashunnah:data})
    }
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
        this.getbyTanggal(momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY'), 'wajib')
        this.getbyTanggal(momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY'), 'shunnah')
        this.setState({refreshing: false})
        resolve(); 
      }, 2000)
    })
  }

  getWajib(){
    if(this.state.loading1){
      return(
          <View style={[globalStyles.centerContainer,{backgroundColor:colors.white, height:100}]}>
            <ActivityIndicator color={colors.green2} size='large' />
            <Text style={{color:colors.green2}}>Updating data</Text>
          </View>
      )
    }else{
      return(
        <FlatList
          data={this.state.datawajib}
          renderItem={({item})=>{
              return(<View style={{borderBottomWidth:0.25}}>
                <View style={{marginLeft:width*0.1, marginRight:width*0.1, marginTop:10, marginBottom:10}}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:5}}>
                    <Text style={{fontSize:12}}>{item.amalan}</Text>
                    <Text style={{fontSize:12, color:this.state.wajib?colors.red:'#01CA9E'}}>{parseInt(item.nilai)*100}%</Text>
                  </View>
                  <ProgressBarAndroid
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={parseInt(item.nilai)}
                    color={this.state.wajib?colors.red:'#01CA9E'}
                  />
                </View>
              </View>)
          }}
        />
      )
    }
  }

  getShunnah(){
    if(this.state.loading2){
      return(
          <View style={[globalStyles.centerContainer,{backgroundColor:colors.white, height:100}]}>
            <ActivityIndicator color={colors.green2} size='large' />
            <Text style={{color:colors.green2}}>Updating data</Text>
          </View>
      )
    }else{
      return(
        <FlatList
          data={this.state.datashunnah}
          renderItem={({item})=>{
              return(<View style={{borderBottomWidth:0.25}}>
                <View style={{marginLeft:width*0.1, marginRight:width*0.1, marginTop:10, marginBottom:10}}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:5}}>
                    <Text style={{fontSize:12}}>{item.amalan}</Text>
                    <Text style={{fontSize:12, color:this.state.wajib?colors.red:'#01CA9E'}}>{parseInt(item.nilai)*100}%</Text>
                  </View>
                  <ProgressBarAndroid
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={parseInt(item.nilai)}
                    color={this.state.wajib?colors.red:'#01CA9E'}
                  />
                </View>
              </View>)
          }}
        />
      )
    }
  }

  render() {
    return (
      <View style={[globalStyles.growContainer, {backgroundColor: colors.white}]}>
        <View style={{
          height: StatusBar.currentHeight + (Platform.OS === "ios" ? 44/1.2 : 56/1.2),
          paddingTop: Platform.OS === "ios" ? 5 : 10, 
        }}>
          <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
            <View style={{ padding: 15, flexDirection: 'row' }} >
              {/* <TouchableItem
                onPress={()=> {
                  this.props.navigation.navigate('Histori', {fillwajib:this.state.fillwajib, fillshunnah:this.state.fillshunnah})
                }}
              > */}
                <MaterialCommunityIcons
                    name="history" 
                    color={'#01CA9E'}
                    style={{marginRight:10}}
                    size={normalize(35)}
                />
              {/* </TouchableItem>
              <TouchableItem
                onPress={()=> this.setState({ pilih: true })}
              > */}
                <MaterialCommunityIcons
                    name="dots-horizontal" 
                    color={'#01CA9E'}
                    size={normalize(35)}
                />
              {/* </TouchableItem> */}
            </View>
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
          <View style={{flexDirection:'row'}}>
            <ToucableItem onPress={()=>this.setState({wajib:true})}>
              <View style={{width:width*0.5, height:50, alignItems:'center', justifyContent:'center', backgroundColor:this.state.wajib?'#01CA9E':'#D5F6EF'}}>
                <Text style={{color:this.state.wajib?colors.white:'black'}}>Wajib</Text>
              </View>
            </ToucableItem>
            <ToucableItem onPress={()=>this.setState({wajib:false})}>
              <View style={{width:width*0.5, height:50, alignItems:'center', justifyContent:'center', backgroundColor:!this.state.wajib?'#01CA9E':'#D5F6EF'}}>
                <Text style={{color:!this.state.wajib?colors.white:'black'}}>Sunnah</Text>
              </View>
            </ToucableItem>
          </View>
          <View style={{backgroundColor:colors.gray1}}>
            <View style={{flexDirection:'row', marginBottom:20, marginTop:20}}>
              <View style={{justifyContent:'center', width:200, height:100, marginRight:20}}>
                <Text style={{marginLeft:width*0.1, fontSize:14}}>
                  Total skor keberhasilan Anda dalam mengerjakan amalan {this.state.wajib?'wajib':'shunnah'} hari ini : 
                </Text>
              </View>
              <View style={{marginRight:width*0.1, backgroundColor:this.state.wajib?'rgba(255,0,0,0.08)':'#D5F6EF', height:110, width:110, borderRadius:60, alignItems:'center', justifyContent:'center'}}>
                <AnimatedCircularProgress
                  size={100}
                  width={8}
                  fill={this.state.wajib? this.state.fillwajib : this.state.fillshunnah}
                  tintColor={this.state.wajib?colors.red:'#01CA9E'}
                  backgroundColor={colors.white}>
                  {
                    (fill) => (
                      <Text style={{fontWeight:'bold', fontSize:24, color:this.state.wajib?colors.red:'#01CA9E'}}>
                        {this.state.wajib?this.state.fillwajib:this.state.fillshunnah}%
                      </Text>
                    )
                  }
                </AnimatedCircularProgress>
              </View>
            </View>
          </View>
          {
            this.state.wajib ?
            this.getWajib()
            :
            this.getShunnah()
          }
        </ScrollView>
        <Modal
          visible={this.state.pilih}
          onRequestClose={() => this.setState({ pilih: false })}
          transparent
          animationType='fade'
        >
          <ToucableItem onPress={()=>this.setState({ pilih: false })}>
            <View style={{ flex:1, backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
              <View style={{ flex:1, position:'absolute', marginTop:30, marginRight:40,  height: 150, width: 200, backgroundColor: colors.white, justifyContent:'space-between', alignItems:'center' }}>
                <View style={{width:'100%', height: 50, alignItems:'center', justifyContent:'center'}}><Text>Harian</Text></View>
                <Divider/>
                <View style={{width:'100%', height: 50, alignItems:'center', justifyContent:'center'}}><Text>Mingguan</Text></View>
                <Divider/>
                <View style={{width:'100%', height: 50, alignItems:'center', justifyContent:'center'}}><Text>Bulanan</Text></View>
              </View>
            </View>
          </ToucableItem>
        </Modal>
      </View>
    )
}
}
