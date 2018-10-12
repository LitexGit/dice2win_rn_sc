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
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start'
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
  let valueText = {
    fontSize: 22,
  }

  return {
    inWrapper: {
      ...valueWrapper,
      flex: 3,
    },
    outWrapper: {
      ...valueWrapper,
      flex: 5,
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
      width: 70,
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
    addressWrapper: {
      flex: 1,
      alignItems: 'center',
    },
    addressText :{
      color: Colors.silver,
    },
    valueWrapper: {
      alignItems: 'flex-end',
      minWidth: 100,
    },
    incomeValue :{
      fontSize: 17,
      color: Colors.activeTint
    },
    outcomeValue :{
      fontSize: 17,
      color: Colors.casinoGreen
    },
    txItem: {
      flex:1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 60,
      paddingLeft: 10,
      paddingRight: 10,
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
  ...txListStyle(),
})