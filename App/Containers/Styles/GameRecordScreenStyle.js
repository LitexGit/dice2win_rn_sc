import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'
import Colors from '../../Themes/Colors';

const ICON_SIZE = 24

const {create, hairlineWidth} = StyleSheet


const timeStyle = () => {
  return {
    timeWrapper: {
      width: 60,
      alignItems: 'center',
      justifyContent: 'center'
    },
    timeText: {
      color: Colors.ricePaper,
      fontSize: 11,
    },
    statusText: {
      color: 'steelblue',
    },
  }
}

const tabBarStyle = () => {
  return {
    tabBarStyle: {
      borderWidth:0
    },
    tabBarUnderlineStyle: {
      backgroundColor: Colors.activeTint,
    }
  }
}

const listStyle = () => {
  return {
    sectionHeader: {
      flex:1,
      justifyContent: 'center',
      backgroundColor: Colors.neetGray,
      padding: 3,
    },
    sectionHeaderText: {
      fontSize:14,
      color: Colors.silver,
      marginLeft: 5,
    }
  }
}

const gameListStyle = () =>{

  let valueWrapper = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 70,
  }

  let iconWrapper = {
    ...ApplicationStyles.screen.hContainer,
    paddingLeft: 10,
    paddingRight: 10,
  }

  let valueText = {
    fontSize: 16,
    fontWeight: '500',
  }

  return {
    inWrapper: {
      ...valueWrapper,
    },
    outWrapper: {
      ...valueWrapper,
    },
    inValue: {
      ...valueText,
      color: Colors.casinoGreen
    },
    outValue: {
      ...valueText,
      color: Colors.activeTint
    },
    betWrapper: {
      ...iconWrapper,
      flex: 3,
    },
    betText: {
      color: Colors.text,
    },
    resultWrapper: {
      ...iconWrapper,
      flex: 1,
    },
    resultText: {
      color: Colors.text,
    },
    icon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
    },
    gameItem: {
      flex:1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: 60,
      padding: 5,
      color: Colors.silver,
      borderTopWidth:0,
      borderBottomWidth:hairlineWidth,
      borderBottomColor:Colors.cloud,
    }
  }
}


export default create({
  ...ApplicationStyles.screen,
  ...timeStyle(),
  ...tabBarStyle(),
  ...listStyle(),
  ...gameListStyle(),
})