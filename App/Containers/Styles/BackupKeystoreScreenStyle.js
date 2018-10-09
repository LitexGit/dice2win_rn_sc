import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'stretch',
  },
  header: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  headerText: {
    ...Fonts.style.h5,
    color: Colors.text,
  },
  keystore: {
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.steel,
    padding: 10,
    margin: 5
  },
  qr: {
    alignItems: 'center'
  }

})

