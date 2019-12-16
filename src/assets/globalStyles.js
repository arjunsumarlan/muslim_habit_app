import {
  StyleSheet,
  StatusBar
} from 'react-native';
import colors from './constants/colors';
import { normalize } from 'react-native-elements';
import { height } from './constants/constants';
import { Header } from 'react-navigation';

export default globalStyles = StyleSheet.create({
  growContainer: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    backgroundColor: colors.background1
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  h1Center: {
    fontFamily: 'SanomatSans',
    textAlign: 'center',
    fontSize: normalize(20)
  },
  h1Left: {
    fontFamily: 'SanomatSans',
    fontSize: normalize(20),
    color: colors.dark
  },
  h2Left: {
    fontFamily: 'SanomatSans',
    fontSize: normalize(18),
    color: colors.dark
  },
  h3Left: {
    fontFamily: 'SanomatSans',
    fontSize: normalize(16),
    color: colors.dark
  },
  h4Left: {
    fontFamily: 'SanomatSans',
    fontSize: normalize(14),
    color: colors.dark
  },
  h4Center: {
    fontFamily: 'SanomatSans',
    fontSize: normalize(14),
    color: colors.dark,
    textAlign: 'center'
  },
  h5Center: {
    fontFamily: 'SanomatSans',
    fontSize: normalize(12),
    color: colors.dark,
    textAlign: 'center'
  },
  h5LeftGray: {
    fontFamily: 'SanomatSans',
    fontSize: normalize(12),
    color: colors.gray2,
  },
  h5Left: {
    fontFamily: 'SanomatSans',
    fontSize: normalize(12),
    color: colors.dark
  },
  h3Center: {
    fontFamily: 'SanomatSans',
    fontSize: normalize(16),
    color: colors.dark,
    textAlign: 'center'
  },
  h4LeftGray: {
    fontFamily: 'SanomatSans',
    fontSize: normalize(14),
    color: colors.gray2
  },
  formLabel: {
    fontFamily: 'SanomatSans',
    fontSize: normalize(12),
    color: colors.gray2
  },
  textInputContainer: {
    borderBottomWidth: 1,
    borderColor: colors.gray2,
    width: '80%',
    marginTop: 15
  },
  grayTextInputContainer: {
    backgroundColor: colors.gray1,
    width: '100%',
    marginBottom: 15
  },
  graySmallTextInputContainer: {
    backgroundColor: colors.gray1,
    width: '100%',
    marginBottom: 15
  },
  $15innerContainer: {
    padding: 15,
    paddingTop: StatusBar.currentHeight + 15
  },
  rowContainer: {
    flexDirection: 'row',
  },
  rowSpaceBetweenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  smallLeftRowContainer: {
    width: '20%',
    height: height * 0.06,
    padding: '1%',
    justifyContent: 'center'
  },
  centerMediumRowContainer: {
    width: '60%',
  },
  ContentCard: {
    width:'30%',
    height: height * 0.15,
    marginBottom: 15,
    backgroundColor: colors.white,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7
  },
  headerContainer: {
    height: Header.HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%'
  },
  absoluteFooter: {
    height: Header.HEIGHT,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderColor: 'rgba(0,0,0,0)',
  }
})