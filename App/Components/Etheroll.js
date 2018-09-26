import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image, Slider } from 'react-native'
import styles from './Styles/EtherollStyle'
import Images from '../Themes/Images'
import BetActions from '../Redux/BetRedux'
import connect from 'react-redux/es/connect/connect'

class Etheroll extends Component {

  render () {
    return (
      <React.Fragment>
        <Slider minimumValue={1} maximumValue={97} step={1}
                value={50} onValueChange={(val) => this.props.clickEtheroll(val)}
        />
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>选择硬币的一面来进行投注</Text>
        </View>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    betMask: state.bet.betMask
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadEtheroll: () => dispatch(BetActions.loadEtheroll()),
    clickEtheroll: (val) => dispatch(BetActions.clickEtheroll(val))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Etheroll)
