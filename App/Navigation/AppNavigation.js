import { StackNavigator, TabNavigator } from 'react-navigation'
import TransferScreen from '../Containers/TransferScreen'
import BackupScreen from '../Containers/BackupScreen'
import PreBackupScreen  from '../Containers/PreBackupScreen'
import NewWalletScreen  from '../Containers/NewWalletScreen'
import ImportWalletScreen  from '../Containers/ImportWalletScreen'
import GameContainerScreen  from '../Containers/GameContainerScreen'
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
  TransferScreen: { screen: TransferScreen },
  BackupScreen: { screen: BackupScreen },
  PreBackupScreen: { screen: PreBackupScreen },
  NewWalletScreen: { screen: NewWalletScreen },
  ImportWalletScreen: { screen: ImportWalletScreen },
  GameContainerScreen: {screen: GameContainerScreen},
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
