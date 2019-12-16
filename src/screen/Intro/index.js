import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Image, AsyncStorage } from 'react-native';
import { width, height } from '../../assets/constants/constants'
import colors from '../../assets/constants/colors'
import Routes from '../../config/routes'
import AppIntro from 'react-native-app-intro-slider';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SplashScreen from 'react-native-splash-screen';

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    color: 'black',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 30,
    fontSize: 14
  },
  title: {
    fontSize: 26,
    color: '#20d286',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonCircle: {
    width: width*0.15,
    height: width*0.15,
    backgroundColor: '#20d286',
    borderRadius: width*0.15/2,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const slides = [
  {
    key: 'amalan',
    title: 'Ahlan wa sahlan',
    text: 'Pantau terus amalan sunnah Anda.\n'+'Agar kelak menjadi kebiasaan, insyaAllah.',
    image: require('../../assets/images/illus-intro-1.png')
  },
  {
    key: 'laporan',
    title: 'Laporan Perkembangan',
    text: 'Ukur kemampuan sejauh mana\n'+'Anda mampu menyelesaikan target.',
    image: require('../../assets/images/illus-intro-2.png')
  },
  {
    key: 'bismillah',
    title: 'Bismillah',
    text: 'Maksimalkan usaha Anda dan\n'+'minta tolonglah kepada Allah\n'+'Subhanallahu wa Ta`ala.',
    image: require('../../assets/images/illus-intro-3.png')
  }
];

export default class Intro extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      done: true,
      showRealApp: false
    }
  }

  async componentDidMount() {
    const first_install = await AsyncStorage.getItem('first_install')
    if(first_install === 'true') this.setState({ showRealApp: true });
    SplashScreen.hide()
    this.setState({done:false})
  }

  
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    AsyncStorage.setItem('first_install','true')
    this.setState({ showRealApp: true });
  }

  _renderDoneButton = () => {
    return (
      <View>
        <Image
          source={require('../../assets/images/icons/button-next-100px.png')}
          style={{ width: height * 0.08, height: height * 0.08}}
          resizeMethod='resize'
          resizeMode='contain'
        />
      </View>
    );
  }

  _renderNextButton = () => {
    return (
      <View>
        <Image
          source={require('../../assets/images/icons/button-next-100px.png')}
          style={{ width: height * 0.08, height: height * 0.08}}
          resizeMethod='resize'
          resizeMode='contain'
        />
      </View>
    );
  }

  _renderItem = props => (
    <View
      style={[styles.mainContent, {
        paddingTop: props.topSpacer,
        paddingBottom: props.bottomSpacer,
        width: props.width,
        height: props.height,
        backgroundColor: 'white'
      }]}
      // start={{x: 0, y: .1}} end={{x: .1, y: 1}}
    >
      <Text style={styles.title}>{props.title}</Text>
      <Image
        source={props.image}
        style={{ width: height * 0.45, height: height * 0.5, borderRadius: 15, marginBottom: 10 }}
        resizeMethod='resize'
        resizeMode='contain'
      />
      <Text style={[styles.text]}>{props.text}</Text>
    </View>
  );

  render() {
    if(this.state.done){
      return(
        <View style={{height:height, width:width, backgroundColor:'#01CA9E', justifyContent:'center', alignItems:'center'}}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={{ width: width * 1.2, height: height * 1.2 }}
            resizeMethod='resize'
            resizeMode='contain'
          />
        </View>
      )
    }
    if (this.state.showRealApp) {
      return <Routes />;
    } else {
      return (
        <AppIntro
          slides={slides}
          renderItem={this._renderItem}
          onDone={this._onDone}
          renderDoneButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
          activeDotStyle={{backgroundColor: '#20d286'}}
          dotStyle={{backgroundColor: '#b1eeac'}}
        />
      );
    }
    
  }
}
