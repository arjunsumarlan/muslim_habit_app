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
  Animated,
  StyleSheet,
  RefreshControl
} from 'react-native';
import globalStyles from '../../assets/globalStyles';
import { Button, Divider, ListItem, List, Header, normalize } from 'react-native-elements';
import colors from '../../assets/constants/colors';
import CustomCard from '../../assets/components/CustomCard';
import { height, width } from '../../assets/constants/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';
import { FormattedCurrency, FormattedNumber } from 'react-native-globalize';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment-hijri'
import momentA from 'moment'
import TouchableItem from '../../assets/components/TouchableItem';
import color from './color'

export default class Home extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      selected: moment().format('YYYY-MM-DD'),
      press: false,
      loading: true,
      loadholiday: false,
      month: momentA().format('YYYY-MM'),
      holidays: {},
      items: [],
      data: {}
    }
  }

  componentDidMount(){
    axios.get('https://holidayapi.pl/v1/holidays?country=ID&year='+`${momentA().format('YYYY')}`)
      .then((row)=>{
        this.setState({holidays: row.data.holidays})
        return this.getAllHolidays()
      })
  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
  }

  onMonthChange(month){
    
  }

  getAllHolidays(){
    this.setState({loadholiday:true})
    var holidays = this.state.holidays
    var month = this.state.month
    var items = []
    Object.keys(holidays).forEach(function(key,index) {
      let monthkey = momentA(key, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM')
      if(monthkey === month){
        holidays[key].map((item)=>{
          item['color']=color[index]
          items.push(item)
        })
      }
    });
    var data = {}
    items.map((item)=>{
        var element = []
        element.push({key:item.name, color: item.color, selectedDotColor: item.color})
        data[item.date] = {dots: element}
    })
    this.setState({data})
    return this.setState({items:items, loadholiday:false})
  }

  calendar(){    
    if(this.state.press){
      LocaleConfig.locales['ar'] = {
        monthNames: ["Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir", "Jumadal Ula", "Jumadal Akhira",
        "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhul Qa'ada", "Dhul Hijja"],
        monthNamesShort: ["Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir", "Jumadal Ula", "Jumadal Akhira",
        "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhul Qa'ada", "Dhul Hijja"],
        dayNames: ['Ahad','Senin','Selasa','Rabu','Kamis','Jum`at','Sabtu'],
        dayNamesShort: ['Ahd','Sen','Sel','Rab','Kam','Jum','Sab']
      };
      LocaleConfig.defaultLocale = 'ar'
      if(!this.state.loadholiday){
        return(
          <Calendar
            style={styles.calendar}
            onDayPress={this.onDayPress.bind(this)}
            current={moment(this.state.selected).format('YYYY-MM-DD')}
            monthFormat={'MMMM '+ moment().format('iYYYY')}
            theme={{ 
              calendarBackground: colors.white,
              textSectionTitleColor: 'rgba(0, 150, 100, 0.85)',
              dayTextColor: colors.dark,
              todayTextColor: colors.green2,
              selectedDayTextColor: colors.white,
              monthTextColor: 'rgba(0, 150, 100, 0.85)',
              selectedDayBackgroundColor: colors.gray2,
              arrowColor: 'rgba(0, 150, 100, 0.85)',
              // textDisabledColor: 'red',
              'stylesheet.calendar.header': {
                week: {
                  color: 'rgba(0, 150, 100, 0.85)',
                  marginTop: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }
              }
            }}
            markedDates={{
              '2019-03-13': {dots: [{key:'vacation', color: colors.green2, selectedDotColor: colors.green2}]},
              '2019-03-14': {dots: [{key:'vacation', color: colors.green2, selectedDotColor: colors.green2}]},
              '2019-03-15': {dots: [{key:'vacation', color: colors.green2, selectedDotColor: colors.green2}]},
              '2019-03-10': {dots: [{key:'massage', color: colors.orange, selectedDotColor: colors.orange}]},
            }}
            markingType={'multi-dot'}
            hideArrows={false}
          />
        )
      }else{
        return(
          <View style={[globalStyles.centerContainer,{backgroundColor:colors.white, height:380}]}>
            <ActivityIndicator color={colors.green2} size='large' />
          </View>
        )
      }
    }else{
      LocaleConfig.locales['id'] = {
        monthNames: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
        monthNamesShort: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
        dayNames: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
        dayNamesShort: ['Min','Sen','Sel','Rab','Kam','Jum','Sab']
      };
      LocaleConfig.defaultLocale = 'id'
      if(!this.state.loadholiday){
        return(
          <Calendar
            style={styles.calendar}
            onDayPress={this.onDayPress.bind(this)}
            current={moment(this.state.month).format('YYYY-MM-DD')}
            onMonthChange={(month) => this.onMonthChange.bind(this)(month)}
            onPressArrowLeft={(substractMonth) => {
              this.setState({loadholiday:true})
              let prevMonth = momentA(this.state.month).subtract(1, 'month').format('YYYY-MM')
              this.setState({month: prevMonth})
              var holidays = this.state.holidays
              var month = prevMonth
              var items = []
              Object.keys(holidays).forEach(function(key,index) {
                let monthkey = momentA(key, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM')
                if(monthkey === month){
                  holidays[key].map((item)=>{
                    item['color']=color[index]
                    items.push(item)
                  })
                }
              });
              var data = {}
              items.map((item)=>{
                  var element = []
                  element.push({key:item.name, color: item.color, selectedDotColor: item.color})
                  data[item.date] = {dots: element}
              })
              this.setState({data:data,loadholiday:false})
              if(momentA(prevMonth).format('YYYY') != momentA(this.state.month).format('YYYY')){
                axios.get('https://holidayapi.pl/v1/holidays?country=ID&year='+`${momentA(prevMonth).format('YYYY')}`)
                .then((row)=>{
                  return this.setState({holidays: row.data.holidays})
                })
              }
              substractMonth()
            }}
            // Handler which gets executed when press arrow icon left. It receive a callback can go next month
            onPressArrowRight={(addMonth) => {
              this.setState({loadholiday:true})
              let nextMonth = momentA(this.state.month).add(1, 'month').format('YYYY-MM')
              this.setState({month: nextMonth})
              var data = {}
              this.state.items.map((item)=>{
                  var element = []
                  element.push({key:item.name, color: item.color, selectedDotColor: item.color})
                  data[item.date] = {dots: element}
              })
              this.setState({data:data,loadholiday:false})
              if(momentA(nextMonth).format('YYYY') != momentA(this.state.month).format('YYYY')){
                axios.get('https://holidayapi.pl/v1/holidays?country=ID&year='+`${momentA(nextMonth).format('YYYY')}`)
                .then((row)=>{
                  return this.setState({holidays: row.data.holidays})
                })
              }
              addMonth()
            }}
            theme={{
              calendarBackground: colors.white,
              textSectionTitleColor: 'rgba(0, 150, 100, 0.85)',
              dayTextColor: colors.dark,
              todayTextColor: colors.green2,
              selectedDayTextColor: colors.white,
              monthTextColor: 'rgba(0, 150, 100, 0.85)',
              selectedDayBackgroundColor: colors.gray2,
              arrowColor: 'rgba(0, 150, 100, 0.85)',
              // textDisabledColor: 'red',
              'stylesheet.calendar.header': {
                week: {
                  color: 'rgba(0, 150, 100, 0.85)',
                  marginTop: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }
              }
            }}
            markedDates={this.state.data}
            markingType={'multi-dot'}
            hideArrows={false}
          />
        )
      }else{
        return(
          <View style={[globalStyles.centerContainer,{backgroundColor:colors.white, height:380}]}>
            <ActivityIndicator color={colors.green2} size='large' />
          </View>
        )
      }
    }
  }

  loading(){
    setTimeout(() => {
      this.setState({loading: false})
    }, 50)
    return (
      <View style={[globalStyles.centerContainer,{backgroundColor:colors.white, height:380}]}>
        <ActivityIndicator color={colors.green2} size='large' />
      </View>
    )
  }

  renderHolidays(){
    var holidays = this.state.holidays
    var month = this.state.month
    var items = []
    Object.keys(holidays).forEach(function(key, index) {
      let monthkey = momentA(key, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM')
      if(monthkey === month){
        holidays[key].map((item)=>{
          items.push(
            <CustomCard moreStyle={{marginBottom:10, justifyContent:'center', borderColor: colors.green2, borderWidth: 1, backgroundColor:colors.white}}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 5}}>
                <View style={{width:12, height:12, borderRadius:6, backgroundColor:color[index]}}></View>
                <Text style={{fontSize: 16, marginLeft:15}}>{item.name}</Text>
              </View>
            </CustomCard>
          )
        })
      }
    });
    return items
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
      <View style={[globalStyles.growContainer, {backgroundColor: colors.white, marginTop:StatusBar.currentHeight}]}>
        <ScrollView style={styles.container}>
          <View style={{backgroundColor:colors.white, marginLeft:width*0.05, marginRight:width*0.05}}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <TouchableItem onPress={()=>this.setState({loading: true, press:true})}>
                <CustomCard moreStyle={{width:width*0.4, marginBottom:10, justifyContent:'center', alignItems:'center', borderColor: colors.green2, borderWidth: 1, backgroundColor: this.state.press ? 'rgba(0, 150, 100, 0.85)' : colors.white}}>
                  <Text style={{fontSize: 14, color: this.state.press ? colors.white : 'rgba(0, 150, 100, 0.85)'}}>Hijriah</Text>
                </CustomCard>
              </TouchableItem>
              <TouchableItem onPress={()=>this.setState({loading:true, press:false})}>
                <CustomCard moreStyle={{width:width*0.4, marginBottom:10, justifyContent:'center', alignItems:'center', borderColor: colors.green2, borderWidth: 1, backgroundColor: this.state.press ? colors.white : 'rgba(0, 150, 100, 0.85)'}}>
                  <Text style={{fontSize: 14, color: this.state.press ? 'rgba(0, 150, 100, 0.85)' : colors.white}}>Masehi</Text>
                </CustomCard>
              </TouchableItem>
            </View>
            {
              this.state.loading || this.isEmpty(this.state.items) ? 
              this.loading()
              :
              this.calendar()
            }
            {
              this.state.loading || this.isEmpty(this.state.items) ? 
              this.loading()
              :
              this.renderHolidays()
            }
              {/* <CustomCard moreStyle={{marginBottom:10, justifyContent:'center', borderColor: colors.green2, borderWidth: 1, backgroundColor:colors.white}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 5}}>
                  <View style={{width:12, height:12, borderRadius:6, backgroundColor:colors.green2}}></View>
                  <Text style={{fontSize: 16, marginLeft:15}}>Puasa Ayyamul Bidh</Text>
                </View>
              </CustomCard>
              <CustomCard moreStyle={{marginBottom:10, justifyContent:'center', borderColor: colors.green2, borderWidth: 1, backgroundColor:colors.white}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 5}}>
                  <View style={{width:12, height:12, borderRadius:6, backgroundColor:colors.orange}}></View>
                  <Text style={{fontSize: 16, marginLeft:15}}>Puasa Asyura</Text>
                </View>
              </CustomCard> */}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: colors.white,
    height: 380
  },
  text: {
    textAlign: 'center',
    borderColor: '#bbb',
    padding: 10,
    backgroundColor: '#eee'
  },
  container: {
    flex: 1,
    backgroundColor: colors.white
  }
});
