import { StackNavigator, TabNavigator } from 'react-navigation'
import Transfer from '../Containers/Transfer'
import Backup from '../Containers/Backup'
import PreBackup from '../Containers/PreBackup'
import NewWallet from '../Containers/NewWallet'
import ImportWallet from '../Containers/ImportWallet'
import GameContainer from '../Containers/GameContainer'
import WebviewScreen from '../Containers/WebviewScreen'
import PromotionScreen from '../Containers/PromotionScreen'
import WalletManageScreen from '../Containers/WalletManageScreen'
import SettingScreen from '../Containers/SettingScreen'
import WalletScreen from '../Containers/WalletScreen'
import RecordScreen from '../Containers/RecordScreen'
import GameScreen from '../Containers/GameScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'
import Colors from '../Themes/Colors'

const BottomTabNav = TabNavigator({
  Game: {screen: GameScreen},
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

    style: {
      backgroundColor: Colors.casinoBlue
    }
  }
})

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  Transfer: { screen: Transfer },
  Backup: { screen: Backup },
  PreBackup: { screen: PreBackup },
  NewWallet: { screen: NewWallet },
  ImportWallet: { screen: ImportWallet },
  GameContainer: {screen: GameContainer},
  WebviewScreen: {screen: WebviewScreen},
  PromotionScreen: {screen: PromotionScreen},
  WalletManageScreen: {screen: WalletManageScreen},
  WalletScreen: {screen: WalletScreen},
  SettingScreen: {screen: SettingScreen},
  BottomTab: {screen: BottomTabNav},
  LaunchScreen: {screen: LaunchScreen}
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
