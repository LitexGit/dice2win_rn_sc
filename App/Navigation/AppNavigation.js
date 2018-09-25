import { StackNavigator, TabNavigator } from 'react-navigation'
import WalletScreen from '../Containers/WalletScreen'
import RecordScreen from '../Containers/RecordScreen'
import GameScreen from '../Containers/GameScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'
import Colors from '../Themes/Colors'

const BottomTabNav = TabNavigator({
  Game: { screen: GameScreen },
  Record: {screen: RecordScreen},
  Wallet: {screen: WalletScreen}
}, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    // activeTintColor: '#e91e63'
    activeTintColor: Colors.activeTint,
    inactiveTintColor: Colors.inActiveTint,
    tabStyle: styles.tab,

    style:{
      backgroundColor: Colors.casinoBlue
    }
  }
})

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  BottomTab: {screen: BottomTabNav},
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'float',
  cardStyle: {shadowColor: 'transparent'},
  initialRouteName: 'BottomTab',
  navigationOptions: {
    headerStyle: styles.header,
    headerTintColor: Colors.snow,
  }
})

export default PrimaryNav
