import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'
import Colors from '../../Themes/Colors';

const ICON_SIZE = 24

const {create, hairlineWidth} = StyleSheet


const timeStyle = () => {
  return {
    timeWrapper: {
      width: 75,
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    },
    timeText: {
      color: Colors.ricePaper,
      fontSize: 12,
    },
    statusText: {
      color: 'gray',
      fontSize: 12,
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  }
  let valueText = {
    fontSize: 22,
  }

  return {
    inWrapper: {
      ...valueWrapper,
      flex: 2,
    },
    outWrapper: {
      ...valueWrapper,
      flex: 3,
    },
    inValue: {
      ...valueText,
      color: Colors.casinoGreen
    },
    outValue: {
      ...valueText,
      color: Colors.activeTint
    },
    iconWrapper: {
      width: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
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

const txListStyle = () => {
  return {
    remarkText :{
      color: Colors.silver,
    },
    incomeValue :{
      fontSize: 22,
      color: Colors.activeTint
    },
    outcomeValue :{
      fontSize: 22,
      color: Colors.casinoGreen
    }
  }
}

export default create({
  ...ApplicationStyles.screen,
  ...timeStyle(),
  ...tabBarStyle(),
  ...listStyle(),
  ...gameListStyle(),
  ...txListStyle(),
})