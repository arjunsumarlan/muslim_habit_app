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
  ActivityIndicator
} from 'react-native';
import globalStyles from '../../../assets/globalStyles';
import { Button, Divider, ListItem, List, Header, normalize } from 'react-native-elements';
import colors from '../../../assets/constants/colors';
import { height, width } from '../../../assets/constants/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TouchableItem from '../../../assets/components/TouchableItem'
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
      fillwajib: 0,
      fillshunnah: 0,
      data: [],
      datalist: [],
      bulan: momentA().format('MMMM YYYY')
    }

    this._refresh = this._refresh.bind(this);
  }

  componentDidMount(){
    this.getAlllist()
    if(typeof this.props.navigation.state.params.fillwajib != 'undefined')this.setState({fillwajib:this.props.navigation.state.params.fillwajib})
    if(typeof this.props.navigation.state.params.fillshunnah != 'undefined')this.setState({fillshunnah:this.props.navigation.state.params.fillshunnah})
    this.getAll()
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

  getAll(){
    var data = []
      amalanwajib.instance.getamalan().then(row => {
        for(i=0; i<row.length; i++){
          data.push(row.item(i))
        }
        amalanshunnah.instance.getamalan().then(row => {
          for(i=0; i<row.length; i++){
            data.push(row.item(i))
          }
          return this.setState({data})
        })
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
        this.getAll()
        this.setState({refreshing: false})
        resolve(); 
      }, 2000)
    })
  }

  getDropdown(){
    var tanggals = []
    var prevState = ''
    this.state.data.map((item)=>{
      let tanggal = momentA(item.tanggal, 'DD/M/YYYY').format('MMMM YYYY')
      if(prevState != tanggal){
        tanggals.push(tanggal)
      }
      prevState = tanggal
    })

    let unique = {};
    tanggals.forEach((i) => {
      if(!unique[i]) {
        unique[i] = true;
      }
    });

    var items = []
    Object.keys(unique).map((item)=>{
      items.push(
        <Picker.Item label={' '+item} value={item} />
      )
    })
    return items
  }

  getMax(arr, prop) {
      var max;
      for (var i=0 ; i<arr.length ; i++) {
          if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
              max = arr[i];
      }
      return max;
  }

  getTerbaik(){
    var items = []
    var poin = []
    var results = []
    this.state.data.map((item)=>{
      let tanggalItem = momentA(item.tanggal, 'DD/M/YYYY').format('MMMM YYYY')
      if(tanggalItem === this.state.bulan){
        poin.push(
          {amalan:item.amalan, nilai:item.nilai, tanggal:item.tanggal, type:item.type}
        )
      }
    })

    if(!this.isEmpty(poin) && !this.isEmpty(this.state.datalist)){
      this.state.datalist.map((item)=>{
        var nilai = 0
        var count = 0
        poin.map((element)=>{
          if(item.amalan === element.amalan){
            count = count + 1
            nilai = nilai + parseInt(element.nilai)
          }
        })
        results.push(
          {amalan:item.amalan, nilai:nilai, count:count}
        )
      })
    }

    if(!this.isEmpty(results)){
      var max = this.getMax(results,'nilai')
      var nilai = (max.nilai/max.count)*100
      nilai = Number(nilai).toFixed(0)
      items.push(
        <View style={{marginRight:width*0.05}}>
          <Text style={{fontWeight:'bold', justifyContent:'flex-end'}}>{max.amalan}</Text>
          <Text style={{color:colors.greenOverview, fontWeight:'bold', justifyContent:'flex-end'}}>{nilai}%</Text>
        </View>
      )
    }

    return items
  }

  getMin(arr, prop) {
    var min;
    for (var i=0 ; i<arr.length ; i++) {
        if (!min || parseInt(arr[i][prop]) < parseInt(min[prop]))
            min = arr[i];
    }
    return min;
}

  getTerburuk(){
    var items = []
    var poin = []
    var results = []
    this.state.data.map((item)=>{
      let tanggalItem = momentA(item.tanggal, 'DD/M/YYYY').format('MMMM YYYY')
      if(tanggalItem === this.state.bulan){
        poin.push(
          {amalan:item.amalan, nilai:item.nilai, tanggal:item.tanggal, type:item.type}
        )
      }
    })

    if(!this.isEmpty(poin) && !this.isEmpty(this.state.datalist)){
      this.state.datalist.map((item)=>{
        var nilai = 0
        var count = 0
        poin.map((element)=>{
          if(item.amalan === element.amalan){
            count = count + 1
            nilai = nilai + parseInt(element.nilai)
          }
        })
        results.push(
          {amalan:item.amalan, nilai:nilai, count:count}
        )
      })
    }

    if(!this.isEmpty(results)){
      var min = this.getMin(results,'nilai')
      var nilai = (min.nilai/min.count)*100
      nilai = Number(nilai).toFixed(0)
      items.push(
        <View style={{marginRight:width*0.05}}>
          <Text style={{fontWeight:'bold', justifyContent:'flex-end'}}>{min.amalan}</Text>
          <Text style={{color:colors.red, fontWeight:'bold', justifyContent:'flex-end'}}>{nilai}%</Text>
        </View>
      )
    }

    return items
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
            <Text style={{color:colors.white, marginLeft:35, fontSize:18 }}>HISTORI</Text>
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
        {
          this.isEmpty(this.state.data) ?
          <View style={[globalStyles.centerContainer,{backgroundColor:colors.white, height:100}]}>
            <ActivityIndicator color={colors.green2} size='large' />
            <Text style={{color:colors.green2}}>Updating data</Text>
          </View>
          : 
          <View>
              <View style={{backgroundColor:colors.white, borderBottomWidth:5, borderBottomColor:colors.gray1}}>
                <View style={{flexDirection:'row', marginBottom:10, marginTop:10, marginLeft:width*0.05}}>
                  <View style={{height:40, width:160, borderRadius:15, borderColor:colors.green2, borderWidth:1.5}}>
                    <Picker
                      selectedValue={this.state.bulan}
                      style={{height: 40, width: 160}}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({bulan: itemValue})
                      }
                      mode='dropdown'
                    >
                      {
                        this.getDropdown()
                      }
                    </Picker>
                  </View>
                </View>
              </View>
              <View style={{backgroundColor:colors.white}}>
                  <View style={{borderBottomWidth:1, height:80, borderBottomColor:colors.gray1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                      <Text style={{marginLeft:width*0.05, color:colors.gray4}}>Total skor seluruh amalan wajib:</Text>
                      <Text style={{color:colors.greenOverview, fontWeight:'bold', marginRight:width*0.05}}>{this.state.fillwajib}%</Text>
                  </View>
                  <View style={{borderBottomWidth:1, height:80, borderBottomColor:colors.gray1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                      <Text style={{marginLeft:width*0.05, color:colors.gray4}}>Total skor seluruh amalan shunnah:</Text>
                      <Text style={{color:colors.greenOverview, fontWeight:'bold', marginRight:width*0.05}}>{this.state.fillshunnah}%</Text>
                  </View>
                  <View style={{borderBottomWidth:1, height:80, borderBottomColor:colors.gray1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                      <Text style={{marginLeft:width*0.05, color:colors.gray4}}>Skor terbaik:</Text>
                      <View>{this.getTerbaik()}</View>
                  </View>
                  <View style={{borderBottomWidth:1, height:80, borderBottomColor:colors.gray1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                      <Text style={{marginLeft:width*0.05, color:colors.gray4}}>Skor terburuk:</Text>
                      {this.getTerburuk()}
                  </View>
              </View>
            </View>
        }
        </ScrollView>
      </View>
    )
}
}
