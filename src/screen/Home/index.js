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
  UIManager,
  RefreshControl,
  Switch
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
import Ionicons from 'react-native-vector-icons/Ionicons'
import PTRView from 'react-native-pull-to-refresh'
import moment from 'moment-hijri'
import momentA from 'moment'
import amalanwajib from '../../dao/amalanwajib/amalanwajib'
import amalanshunnah from '../../dao/amalanshunnah/amalanshunnah'
import amalanlist from '../../dao/amalanlist/amalanlist'

moment.updateLocale('ar', {
  months : ["Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir", "Jumadal Ula", "Jumadal Akhira",
  "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhul Qa'ada", "Dhul Hijja"]
});

moment.updateLocale('id', {
  months : ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
});

const hadits = [
  {
    'hadits': '"Amalan yang paling dicintai oleh Allah Ta`ala adalah amalan yang kontinu walaupun itu sedikit.',
    'riwayat': 'HR. Muslim'
  },
  {
    'hadits': '"Sampaikanlah dariku walau satu ayat."',
    'riwayat': 'HR. Bukhari'
  },{
    'hadits': '"Katakanlah, ‘Aku beriman kepada Allah’, kemudian beristiqamahlah (berpegang teguh kepada ketaatan)."',
    'riwayat': 'HR. Muslim'
  },{
    'hadits': '"Menuntut ilmu itu wajib bagi setiap muslim."',
    'riwayat': 'HR. Ibnu Majah'
  }
] 

UIManager.setLayoutAnimationEnabledExperimental(true)

export default class Home extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      tanggal: '',
      shubuhTime: 0,
      dzuhurTime: 0,
      asharTime: 0,
      maghribTime: 0,
      isyaTime: 0,
      con1: true,
      con2: false,
      con3: false,
      con4: false,
      con5: false,
      con6: false,
      listView: false,
      submit: false,
      refreshing: false,
      pengaturan: false,
      amalan: '',
      type: '',
      kategori: '',
      waktu: '',
      delete: false,
      updating: false,
      option:'',
      done:false,
      date: momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY'),
      nilai: false,
      pause: false, //INI nanti gak diperlukan karena nanti di table amalan kasih field boolean pause
      hariID: moment().lang('id').format('DD MMMM YYYY'),
      hariAR: moment().lang('ar').format('iDD iMMMM iYYYY'),
      jam : moment().hour() < 10 ? '0' + moment().hour() : moment().hour(),
      menit : moment().minutes() < 10 ? '0' + moment().minutes() : moment().minutes(),
      reminder: 0,
      data: [],
      datalist: []
    }

    this._refresh = this._refresh.bind(this);
  }

  deleteAmalanShunnah(amalan, tanggal){
    amalanshunnah.instance.deleteAmalan(amalan, tanggal)
    return
  }

  deleteAmalanWajib(amalan, tanggal){
    amalanwajib.instance.deleteAmalan(amalan, tanggal)
    return
  }

  setAmalan(amalan, tanggal, refer, waktu, pause, kategori, telat){
    let date = tanggal.split('/')
    if(refer === 'wajib'){
      return amalanwajib.instance.setAmalan(amalan, date[0], date[1], date[2], tanggal, '0', refer, waktu, pause, kategori, telat)
    }else{
      return amalanshunnah.instance.setAmalan(amalan, date[0], date[1], date[2], tanggal, '0', refer, waktu, pause, kategori, telat)
    }
  }

  setNilai(amalan, tanggal, nilai, refer, waktu, pause, kategori, telat){
    let date = tanggal.split('/')
    if(refer === 'wajib'){
      amalanwajib.instance.setNilai(amalan, date[0], date[1], date[2], tanggal, nilai, refer, waktu, pause, kategori, telat).then(()=>{
        var data = []
        amalanwajib.instance.getamalanbyTanggal(tanggal).then(row => {
          for(i=0; i<row.length; i++){
            data.push(row.item(i))
          }
          amalanshunnah.instance.getamalanbyTanggal(tanggal).then(row => {
            for(i=0; i<row.length; i++){
              data.push(row.item(i))
            }
            return this.setState({data:data, nilai: false})
          })
        })
      })
    }else if(refer === 'shunnah'){
      amalanshunnah.instance.setNilai(amalan, date[0], date[1], date[2], tanggal, nilai, refer, waktu, pause, kategori, telat).then(()=>{
        var data = []
        amalanshunnah.instance.getamalanbyTanggal(tanggal).then(row => {
          for(i=0; i<row.length; i++){
            data.push(row.item(i))
          }
          amalanwajib.instance.getamalanbyTanggal(tanggal).then(row => {
            for(i=0; i<row.length; i++){
              data.push(row.item(i))
            }
          })
          return this.setState({data:data, nilai: false})
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

  getAlllist(){
    var datalist = []
    amalanlist.instance.getamalan().then(row => {
      for(i=0; i<row.length; i++){
        datalist.push(row.item(i))
      }
      return this.setState({datalist})
    })
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  launchTimer = () => {
    this.timer = setInterval(() => {
      let jam = moment().hour() < 10 ? '0' + moment().hour() : moment().hour()
      let menit = moment().minutes() < 10 ? '0' + moment().minutes() : moment().minutes()
      this.setState({hariID: moment().lang('id').format('DD MMMM YYYY'), hariAR: moment().lang('ar').format('iDD iMMMM iYYYY')})
      this.setState({jam})
      this.setState({menit})
      this.reminder()
    }, 1000);
  };

  componentDidMount(){
    this.getAlllist()
    var tanggal = momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY')
    var data = []
    amalanwajib.instance.getamalanbyTanggal(tanggal).then(row => {
      for(i=0; i<row.length; i++){
        data.push(row.item(i))
      }
      amalanshunnah.instance.getamalanbyTanggal(tanggal).then(row => {
        for(i=0; i<row.length; i++){
          data.push(row.item(i))
        }
        if(this.isEmpty(data)){
          this.state.datalist.map((item)=>{
            if(item.show_home === 'true'){
              this.setAmalan(item.amalan, tanggal, item.type, item.waktu, 'false', item.kategori, 'false')
            }
          })
        }else{
          this.setState({data})
        }
      })
    })

    setInterval(()=>{
      this.getbyTanggal(tanggal)
    }, 3000)

    this.timer = this.launchTimer();

    Axios.get('http://muslimsalat.com/jakarta/daily.json?key=e34c9db960a1e98bb427b7b3b8c97841&jsoncallback=?')
      .then((res) => {
        var data = JSON.parse(res.data.substring(res.data.lastIndexOf("(") + 1,res.data.lastIndexOf(")"))).items[0]
        this.setState({tanggal: data.date_for})

        dzuhur = data.dhuhr
        if(dzuhur.split(' ')[1] === 'pm'){
          this.setState({dzuhurTime: `${parseInt(dzuhur.split(' ')[0].split(':')[0])+12}`+':'+dzuhur.split(' ')[0].split(':')[1]})
        }else{
          this.setState({dzuhurTime: dzuhur.split(' ')[0]})
        }

        ashar = data.asr
        if(ashar.split(' ')[1] === 'pm'){
          this.setState({asharTime: `${parseInt(ashar.split(' ')[0].split(':')[0])+12}`+':'+ashar.split(' ')[0].split(':')[1]})
        }else{
          this.setState({asharTime: ashar.split(' ')[0]})
        }

        maghrib = data.maghrib
        if(maghrib.split(' ')[1] === 'pm'){
          this.setState({maghribTime: `${parseInt(maghrib.split(' ')[0].split(':')[0])+12}`+':'+maghrib.split(' ')[0].split(':')[1]})
        }else{
          this.setState({maghribTime: maghrib.split(' ')[0]})
        }

        isya = data.isha
        if(isya.split(' ')[1] === 'pm'){
          this.setState({isyaTime: `${parseInt(isya.split(' ')[0].split(':')[0])+12}`+':'+isya.split(' ')[0].split(':')[1]})
        }else{
          this.setState({isyaTime: isya.split(' ')[0]})
        }

        shubuh = data.fajr
        if(shubuh.split(' ')[1] === 'pm'){
          this.setState({shubuhTime: `${parseInt(shubuh.split(' ')[0].split(':')[0])+12}`+':'+shubuh.split(' ')[0].split(':')[1]})
        }else{
          this.setState({shubuhTime: shubuh.split(' ')[0]})
        }
        
      }).catch((err)=> Alert.alert('Error',`${err.message}`,[{text: 'OK'}],{cancelable:false}))
  }

  _refresh () {
    this.setState({refreshing: true})
    // you must return Promise everytime
    return new Promise((resolve) => {
      setTimeout(()=>{
        this.getbyTanggal(momentA().format('DD')+'/'+momentA().format('M')+'/'+momentA().format('YYYY'))
        Axios.get('http://muslimsalat.com/jakarta/daily.json?key=e34c9db960a1e98bb427b7b3b8c97841&jsoncallback=?')
        .then((res) => {
          var data = JSON.parse(res.data.substring(res.data.lastIndexOf("(") + 1,res.data.lastIndexOf(")"))).items[0]
        this.setState({tanggal: data.date_for})

        dzuhur = data.dhuhr
        if(dzuhur.split(' ')[1] === 'pm'){
          this.setState({dzuhurTime: `${parseInt(dzuhur.split(' ')[0].split(':')[0])+12}`+':'+dzuhur.split(' ')[0].split(':')[1]})
        }else{
          this.setState({dzuhurTime: dzuhur.split(' ')[0]})
        }

        ashar = data.asr
        if(ashar.split(' ')[1] === 'pm'){
          this.setState({asharTime: `${parseInt(ashar.split(' ')[0].split(':')[0])+12}`+':'+ashar.split(' ')[0].split(':')[1]})
        }else{
          this.setState({asharTime: ashar.split(' ')[0]})
        }

        maghrib = data.maghrib
        if(maghrib.split(' ')[1] === 'pm'){
          this.setState({maghribTime: `${parseInt(maghrib.split(' ')[0].split(':')[0])+12}`+':'+maghrib.split(' ')[0].split(':')[1]})
        }else{
          this.setState({maghribTime: maghrib.split(' ')[0]})
        }

        isya = data.isha
        if(isya.split(' ')[1] === 'pm'){
          this.setState({isyaTime: `${parseInt(isya.split(' ')[0].split(':')[0])+12}`+':'+isya.split(' ')[0].split(':')[1]})
        }else{
          this.setState({isyaTime: isya.split(' ')[0]})
        }

        shubuh = data.fajr
        if(shubuh.split(' ')[1] === 'pm'){
          this.setState({shubuhTime: `${parseInt(shubuh.split(' ')[0].split(':')[0])+12}`+':'+shubuh.split(' ')[0].split(':')[1]})
        }else{
          this.setState({shubuhTime: shubuh.split(' ')[0]})
        }
          
          this.setState({refreshing: false})
        }).catch((err)=> Alert.alert('Error',`${err.message}`,[{text: 'OK'}],{cancelable:false}))
        resolve(); 
      }, 2000)
    })
  }

  renderSlider({item, index}){
    const margin = index === 0 ? 20 : 0
    return (
      <CustomCard
        key={index}
        moreStyle={{ padding: 0, marginLeft: margin, width: width * 0.9 * 0.9, marginRight: 15, marginBottom: 15, height: height * 0.4 * 0.5, backgroundColor: 'rgba(0, 150, 100, 0.85)'}}
      >
        <View style={{ justifyContent:'center', alignContent: 'center', marginLeft:'10%',marginRight:'10%',marginTop:'5%' }}>
          <Text style={{color: colors.white, marginBottom: '5%'}}>{item.hadits}</Text>
          <Text style={{color: colors.white}}>{item.riwayat}</Text>
        </View>
      </CustomCard>
    )
  }

  reminder(){
    if(this.state.shubuhTime != 0){
      var shubuh = momentA(`${parseInt(this.state.tanggal.split('-')[1]) < 10 ? this.state.tanggal.split('-')[0]+'-'+'0'+this.state.tanggal.split('-')[1]+'-'+(parseInt(this.state.tanggal.split('-')[2]) < 10 ? '0'+this.state.tanggal.split('-')[2] : this.state.tanggal.split('-')[2]) : this.state.tanggal}`+'T'+`${parseInt(this.state.shubuhTime.split(':')[0]) < 10 ? '0'+this.state.shubuhTime.split(':')[0]+':'+this.state.shubuhTime.split(':')[1] : this.state.shubuhTime}`+':00')
      var dzuhur = momentA(`${parseInt(this.state.tanggal.split('-')[1]) < 10 ? this.state.tanggal.split('-')[0]+'-'+'0'+this.state.tanggal.split('-')[1]+'-'+(parseInt(this.state.tanggal.split('-')[2]) < 10 ? '0'+this.state.tanggal.split('-')[2] : this.state.tanggal.split('-')[2]) : this.state.tanggal}`+'T'+`${parseInt(this.state.dzuhurTime.split(':')[0]) < 10 ? '0'+this.state.dzuhurTime.split(':')[0]+':'+this.state.dzuhurTime.split(':')[1] : this.state.dzuhurTime}`+':00')
      var ashar = momentA(`${parseInt(this.state.tanggal.split('-')[1]) < 10 ? this.state.tanggal.split('-')[0]+'-'+'0'+this.state.tanggal.split('-')[1]+'-'+(parseInt(this.state.tanggal.split('-')[2]) < 10 ? '0'+this.state.tanggal.split('-')[2] : this.state.tanggal.split('-')[2]) : this.state.tanggal}`+'T'+`${parseInt(this.state.asharTime.split(':')[0]) < 10 ? '0'+this.state.asharTime.split(':')[0]+':'+this.state.asharTime.split(':')[1] : this.state.asharTime}`+':00')
      var isya = momentA(`${parseInt(this.state.tanggal.split('-')[1]) < 10 ? this.state.tanggal.split('-')[0]+'-'+'0'+this.state.tanggal.split('-')[1]+'-'+(parseInt(this.state.tanggal.split('-')[2]) < 10 ? '0'+this.state.tanggal.split('-')[2] : this.state.tanggal.split('-')[2]) : this.state.tanggal}`+'T'+`${parseInt(this.state.isyaTime.split(':')[0]) < 10 ? '0'+this.state.isyaTime.split(':')[0]+':'+this.state.isyaTime.split(':')[1] : this.state.isyaTime}`+':00')
      var maghrib = momentA(`${parseInt(this.state.tanggal.split('-')[1]) < 10 ? this.state.tanggal.split('-')[0]+'-'+'0'+this.state.tanggal.split('-')[1]+'-'+(parseInt(this.state.tanggal.split('-')[2]) < 10 ? '0'+this.state.tanggal.split('-')[2] : this.state.tanggal.split('-')[2]) : this.state.tanggal}`+'T'+`${parseInt(this.state.maghribTime.split(':')[0]) < 10 ? '0'+this.state.maghribTime.split(':')[0]+':'+this.state.maghribTime.split(':')[1] : this.state.maghribTime}`+':00')

      // console.warn('now '+momentA().format('YYYY-MM-DD HH:mm:ss'))

      // console.warn('shubuh '+shubuh.format('YYYY-MM-DD HH:mm:ss'))
      // console.warn('dzuhur '+dzuhur.format('YYYY-MM-DD HH:mm:ss'))
      // console.warn('ashar '+ashar.format('YYYY-MM-DD HH:mm:ss'))
      // console.warn('isya '+isya.format('YYYY-MM-DD HH:mm:ss'))
      // console.warn('maghrib '+maghrib.format('YYYY-MM-DD HH:mm:ss'))

      if(shubuh.format('YYYY-MM-DD') != momentA().format('YYYY-MM-DD')) shubuh.add(24, 'hours')
      if(shubuh.format('YYYY-MM-DD') != momentA().format('YYYY-MM-DD')) shubuh.add(24, 'hours')
      if(dzuhur.format('YYYY-MM-DD') != momentA().format('YYYY-MM-DD')) dzuhur.add(24, 'hours')
      if(ashar.format('YYYY-MM-DD') != momentA().format('YYYY-MM-DD')) ashar.add(24, 'hours')
      if(isya.format('YYYY-MM-DD') != momentA().format('YYYY-MM-DD')) isya.add(24, 'hours')
      if(maghrib.format('YYYY-MM-DD') != momentA().format('YYYY-MM-DD')) maghrib.add(24, 'hours')

      // console.warn('shubuh22 '+shubuh.format('YYYY-MM-DD HH:mm:ss'))
      // console.warn('dzuhur22 '+dzuhur.format('YYYY-MM-DD HH:mm:ss'))
      // console.warn('ashar22 '+ashar.format('YYYY-MM-DD HH:mm:ss'))
      // console.warn('isya22 '+isya.format('YYYY-MM-DD HH:mm:ss'))
      // console.warn('maghrib22 '+maghrib.format('YYYY-MM-DD HH:mm:ss'))

      var duration
      if(momentA().isBefore(shubuh)){
        this.setState({con1:true,con2:false,con3:false,con4:false,con5:false,con6:false})
        duration = shubuh.diff(momentA(), 'minute', true);
      }else if(momentA().isBefore(dzuhur)){
        this.setState({con1:false,con2:true,con3:false,con4:false,con5:false,con6:false})
        if(dzuhur.format('hh:mm a') === '12:00 am'){
          duration = dzuhur.diff(momentA(), 'minute', true);
          duration = duration - (12*60)
        }else{
          duration = dzuhur.diff(momentA(), 'minute', true);
        }
      }else if(momentA().isBefore(ashar)){
        this.setState({con1:false,con2:false,con3:true,con4:false,con5:false,con6:false})
        duration = ashar.diff(momentA(), 'minute', true);
      }else if(momentA().isBefore(maghrib)){
        this.setState({con1:false,con2:false,con3:false,con4:true,con5:false,con6:false})
        duration = maghrib.diff(momentA(), 'minute', true);
      }else if(momentA().isBefore(isya)){
        this.setState({con1:false,con2:false,con3:false,con4:false,con5:true,con6:false})
        duration = isya.diff(momentA(), 'minute', true);
      }else{
        shubuh = shubuh.add(24, 'hours')
        duration = shubuh.diff(momentA(), 'minute', true);
        this.setState({con1:false,con2:false,con3:false,con4:false,con5:false,con6:true})
      }

      if(duration < 0) duration = Math.abs(duration)

      if(duration < 60) {
        duration = Number(duration).toFixed(0)
        this.setState({reminder: duration + ' menit'})
      }
      else {
        duration = Number(duration/60).toFixed(1)
        this.setState({reminder: duration + ' jam'})
      }
    }
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
    <View style={globalStyles.container}>
      <View style={{
        height: StatusBar.currentHeight + (Platform.OS === "ios" ? 44/1.2 : 56/1.2),
        paddingTop: Platform.OS === "ios" ? 5 : 10, 
      }}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View style={{ padding: 15, flexDirection: 'row' }} >
            <Image
              source={this.state.con2 ? require('../../assets/images/icons/ic_subuh_active_40px.png') : require('../../assets/images/icons/ic_subuh_deactive_40px.png')}
              style={{ width: height * 0.04, height: height * 0.04, marginRight: width*0.01}}
              resizeMethod='resize'
              resizeMode='contain'
            />
            <Image
              source={this.state.con3 ? require('../../assets/images/icons/ic_dzuhur_active_40px.png') : require('../../assets/images/icons/ic_dzuhur_deactive_40px.png')}
              style={{ width: height * 0.04, height: height * 0.04, marginRight: width*0.01}}
              resizeMethod='resize'
              resizeMode='contain'
            />
            <Image
              source={this.state.con4 ? require('../../assets/images/icons/ic_ashar_active_40px.png') : require('../../assets/images/icons/ic_ashar_deactive_40px.png')}
              style={{ width: height * 0.04, height: height * 0.04, marginRight: width*0.01}}
              resizeMethod='resize'
              resizeMode='contain'
            />
            <Image
              source={this.state.con5 ? require('../../assets/images/icons/ic_maghrib_active_40px.png') : require('../../assets/images/icons/ic_maghrib_deactive_40px.png')}
              style={{ width: height * 0.04, height: height * 0.04, marginRight: width*0.01}}
              resizeMethod='resize'
              resizeMode='contain'
            />
            <Image
              source={this.state.con1 || this.state.con6 ? require('../../assets/images/icons/ic_isya_active_40px.png') : require('../../assets/images/icons/ic_isya_deactive_40px.png')}
              style={{ width: height * 0.04, height: height * 0.04, marginRight: width*0.01}}
              resizeMethod='resize'
              resizeMode='contain'
            />
          </View>
          <View style={{ padding: 15, flexDirection: 'row' }} >
            <TouchableItem
              onPress={()=> {
                this.props.navigation.navigate('DashboardTabList')
              }}
            >
              <Image
                source={require('../../assets/images/icons/ic_list_view_40px.png')}
                style={{ width: height * 0.04, height: height * 0.04, marginRight: width*0.01}}
                resizeMethod='resize'
                resizeMode='contain'
              />
            </TouchableItem>
          </View>
        </View>
      </View>
        <ScrollView
          contentContainerStyle={globalStyles.growContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              colors={['rgba(0, 150, 100, 0.85)']}
              onRefresh={this._refresh}
            />
          }
        >
              <ImageBackground
                source={
                  this.state.con2 ? require('../../assets/images/illus-bakdasubuh.png') :
                  this.state.con3 ? require('../../assets/images/illus-bakdasubuh.png') :
                  this.state.con4 ? require('../../assets/images/illus-bakdaashar.png') :
                  this.state.con5 ? require('../../assets/images/illus-bakdaashar.png') :
                  this.state.con1 ? require('../../assets/images/illus-bakdaisya.jpeg') : 
                  this.state.con6 ? require('../../assets/images/illus-bakdaisya.jpeg') : 
                  require('../../assets/images/illustrasi-subuh.png')
                }
                style={{ width: width, height:height*0.25, marginBottom: 20 }}
              >
                <View style={{marginTop: height * 0.01, marginBottom: height * 0.02, marginLeft: width * 0.03}}>
                  <Text style={{color:colors.white, fontSize: 10}}>{this.state.hariID}</Text>
                  <Text style={{color:colors.white, fontSize: 10}}>{this.state.hariAR}</Text>
                </View>
                <View style={{marginBottom: height * 0.02, marginLeft: width * 0.03}}>
                  <Text style={{color:colors.white, fontSize: 28}}>{
                    this.state.con2 ? 'Shubuh' :
                    this.state.con3 ? 'Dzuhur' :
                    this.state.con4 ? 'Ashar' :
                    this.state.con5 ? 'Maghrib' :
                    this.state.con1 || this.state.con6 ? 'Isya' : 'Isya'
                  }</Text>
                  <Text style={{color:colors.white, fontSize: 20}}>{this.state.jam}:{this.state.menit}</Text>
                </View>
                <View style={{marginBottom: height * 0.01, marginLeft: width * 0.03}}>
                  <Text style={{color:colors.white, fontSize: 10}}>{this.state.reminder} menjelang {
                    this.state.con2 ? 'Dzuhur' :
                    this.state.con3 ? 'Ashar' :
                    this.state.con4 ? 'Maghrib' :
                    this.state.con5 ? 'Isya' :
                    this.state.con1 || this.state.con6 ? 'Shubuh' : 'Shubuh'
                  }</Text>
                </View>
              </ImageBackground>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={hadits}
                keyExtractor={(item, index) => item.riwayat}
                renderItem={this.renderSlider.bind(this)}
                snapToInterval={width * 0.75 + 20}
              />
              <View style={{ marginTop: height * 0.015, marginLeft: width * 0.05, marginRight: width * 0.05, marginBottom: height * 0.025}}>
                {
                  this.isEmpty(this.state.data) || this.state.nilai ?
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
                          {/* <TouchableItem onPress={()=>this.setState({pengaturan: true, amalan: item.amalan, type: item.type, date: item.tanggal, kategori: item.kategori, waktu: item.waktu})}> */}
                            <Image
                              source={require('../../assets/images/icons/ic_settings_24px.png')}
                              style={{ width: height * 0.035, height: height * 0.035}}
                              tintColor={colors.gray4}
                              resizeMethod='resize'
                              resizeMode='contain'
                            />
                          {/* </TouchableItem> */}
                          {/* <TouchableItem onPress={()=>{
                              this.setNilai(item.amalan, item.tanggal, '0', item.type, item.waktu, item.pause, item.kategori, item.telat)
                              this.setState({nilai: true})
                            // }
                          }}> */}
                            <View style={[styles.buttonCircleFull, {marginLeft: 10}]}>
                              <Ionicons
                                name="md-checkmark"
                                color="rgba(255, 255, 255, .9)"
                                size={24}
                                style={{ backgroundColor: 'transparent' }}
                              />
                            </View>
                          {/* </TouchableItem> */}
                        </View>
                        :
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                          {/* <TouchableItem onPress={()=>this.setState({pengaturan: true, amalan: item.amalan, type: item.type, date: item.tanggal, kategori: item.kategori, waktu: item.waktu})}> */}
                            <Image
                              source={require('../../assets/images/icons/ic_settings_24px.png')}
                              style={{ width: height * 0.035, height: height * 0.035}}
                              tintColor={colors.gray4}
                              resizeMethod='resize'
                              resizeMode='contain'
                            />
                          {/* </TouchableItem>
                          <TouchableItem onPress={()=>{
                              this.setNilai(item.amalan, item.tanggal, '1', item.type, item.waktu, item.pause, item.kategori, item.telat)
                              this.setState({submit: true, nilai: true})
                            // }
                          }}> */}
                            <View style={[styles.buttonCircle,{marginLeft:10}]}></View>
                          {/* </TouchableItem> */}
                        </View>
                      }
                    </View>
                  </CustomCard>
                  })
                }
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
            <Modal
              visible={this.state.pengaturan}
              onRequestClose={() => this.setState({ pengaturan: false })}
              transparent
              animationType='slide'
            >
              <View style={{ flex:1, justifyContent: 'center', alignItems:'center', backgroundColor: 'rgba(0, 225, 150, 0.5)'}}>
                <View style={{ backgroundColor: 'white', height: height * 0.4, width: width * 0.9, borderRadius:5, justifyContent:'space-between'}}>
                  <Text style={{marginLeft:'5%', marginTop:'2%', color:colors.green}}>Pengaturan</Text>
                  <Text style={{marginLeft:'5%', marginTop:'2%', fontSize:20}}>{this.state.amalan}</Text>
                  <View style={{marginLeft:'5%', marginRight:'5%', marginTop:'10%', marginBottom:'2%', flexDirection:'row', justifyContent:'space-between', borderBottomWidth:1}}>
                    <Text style={{marginBottom:'5%'}}>Pause</Text>
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                      <MaterialCommunityIcons
                          name="information" 
                          style={{marginRight:10}}
                          size={normalize(20)}
                      />
                      <Switch
                        trackColor={colors.green2}
                        value={this.state.pause}
                        onValueChange={()=>this.setState({pause:!this.state.pause})}
                        style={{marginBottom:'5%'}}
                      />
                    </View>
                  </View>
                  <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:'3%', marginLeft:'5%', marginRight:'5%', marginBottom:'10%'}}>
                    <TouchableItem onPress={()=>{
                      console.warn(this.state.type)
                      this.setState({delete:!this.state.delete})
                    }}>
                      <Text style={{fontSize:16, color:colors.red, fontWeight:this.state.delete ? 'bold' : 'normal'}}>HAPUS</Text>
                    </TouchableItem>
                    <Button
                      rounded
                      title="SIMPAN"
                      onPress={() => {
                        if(this.state.delete){
                          Alert.alert(
                            'Konfirmasi !',
                            'Apakah Anda yakin ingin menghapus amalan ini ?',
                            [{text: 'IYA', onPress: ()=>{
                              if(this.state.type === 'wajib'){
                                this.setState({updating:true})
                                this.deleteAmalanWajib(this.state.amalan, this.state.date)
                                amalanlist.instance.updateAmalan(this.state.amalan,this.state.kategori, 'false', this.state.waktu, this.state.type)
                                .then(row=>this.setState({updating:false, delete:false}))
                              }else{
                                this.setState({updating:true})
                                this.deleteAmalanShunnah(this.state.amalan, this.state.date)
                                amalanlist.instance.updateAmalan(this.state.amalan,this.state.kategori, 'false', this.state.waktu, this.state.type)
                                .then(row=>this.setState({updating:false, delete:false}))
                              }
                            }},{text: 'TIDAK', onPress: ()=>this.setState({pengaturan:false, delete:false})}],
                            {
                              cancelable:false
                          })
                        }
                        this.setState({pengaturan: false})
                      }}
                      buttonStyle={{width: 100, backgroundColor:colors.green }}
                      textStyle={{ color: colors.white, textAlign:'center', justifyContent:'center'}}
                    />
                  </View>
                </View>
              </View>
            </Modal>
            <Modal
              visible={this.state.updating}
              transparent
              animationType='slide'
            >
              <View style={{ flex:1, justifyContent: 'center', alignItems:'center', backgroundColor: 'rgba(0, 225, 150, 0.5)'}}>
                <View style={{ backgroundColor: 'white', height: height * 0.3, width: width * 0.6, justifyContent: 'center', alignItems:'center', borderRadius:30}}>
                  <ActivityIndicator color={colors.green2} size='large' />
                  <Text style={{color:colors.green2}}>Removing data...</Text>
                </View>
              </View>
            </Modal>
        </ScrollView>
    </View>
    )
  }
}
