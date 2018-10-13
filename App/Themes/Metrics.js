import {Dimensions, Platform} from 'react-native'
import {getStatusBarHeight} from 'react-native-iphone-x-helper'
import DeviceInfo from 'react-native-device-info'

const { width, height } = Dimensions.get('window')

// Used via Metrics.baseMargin
const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  // baseMargin: 10,
  baseMargin: 0,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  statusBarHeight: getStatusBarHeight(),
  navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
  buttonRadius: 4,
  bottomTabIconSize: 24,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200
  },
  timeZone: DeviceInfo.getTimezone(),
}

export default metrics
