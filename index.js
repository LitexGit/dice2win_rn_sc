import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import './global'
import App from './App/Containers/App'

console.disableYellowBox = true

AppRegistry.registerComponent('Dice2Win', () => App)
