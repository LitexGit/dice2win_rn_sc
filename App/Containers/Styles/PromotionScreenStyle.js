import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors } from '../../Themes/'

const topStyle = () => {
  return {
    upWrapper: {
      height: 200,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: Colors.facebook,
      borderBottomWidth: 1,
    },

    balanceWrapper:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'baseline',
    },
    balance:{
      ...Fonts.style.h4,
      color: Colors.activeTint,
    },

    withdrawButton: {
      backgroundColor: Colors.facebook,
      paddingTop: 5,
      paddingBottom: 5,
      padding: 15,
      borderRadius: 5,
      margin: 10,
    },
    withdrawButtonText: {
      fontSize: 16,
      color: Colors.snow,
    },

    unit: {
      color: Colors.text,
    },

    shareText: {
      textDecorationLine: 'underline',
      color: Colors.bloodOrange,
      marginTop: 10,
    },
  }
}

const bottomStyle = () => {
  return {
    downWrapper: {
      flex: 1,
    },

  }
}

const listStyle = () => {
  let wrapper = {
    alignItems: 'center',
    justifyContent: 'center'
  }
  return {
    sectionHeader:{
      flex:1,
      justifyContent: 'center',
      backgroundColor: Colors.neetGray,
      padding: 3,
    },
    sectionHeaderText:{
      fontSize:14,
      color: Colors.snow,
    },

    itemWrapper: {
      flex:1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 60,
      padding: 5,
      color: Colors.silver,
      borderTopWidth:0,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor:Colors.cloud,
    },

    timeWrapper:{
      ...wrapper,
      width: 70,
    },
    valueWrapper: {
      ...wrapper,
      flex:1,
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    sourceWrapper: {
      ...wrapper,
      width: 100,
    },
    statusWrapper: {
      ...wrapper,
    },

    timeText: {
      fontSize: 12,
      color: Colors.silver
    },
    levelText: {
      fontSize: 12,
      color: 'steelblue',
      textAlign: 'center',
    },
    addressText: {
      fontSize: 10,
      color: 'lightgrey',
    },
    valueText:{
      fontSize: 16,
      color: Colors.activeTint
    },

  }
}

const statusTextStyles = () => {
  let statusText = {
    fontSize: 12,
  }

  return {
    successText: {
      ...statusText,
      color: 'lightgreen'
    },
    pendingText: {
      ...statusText,
      color: 'grey'
    },
    rejectedText: {
      ...statusText,
      color: Colors.fire
    },
    failedText: {
      ...statusText,
      color: Colors.ember,
    },
    approvedText: {
      ...statusText,
      color: 'steelblue',
    }
  }
}

const typeTextStyles = () => {
  let typeText = {
    fontSize: 12
  }
  return {
    withdrawText: {
      ...typeText,
      color: Colors.casinoGreen
    },
    bonusText: {
      ...typeText,
      color: 'darkorange'
    },
  }
}

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...topStyle(),
  ...bottomStyle(),
  ...listStyle(),
  ...statusTextStyles(),
  ...typeTextStyles(),
})
