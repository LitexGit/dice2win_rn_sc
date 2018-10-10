import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Slider, Vibration } from 'react-native'
import styles from './Styles/EtherollStyle'
import BetActions from '../Redux/BetRedux'
import connect from 'react-redux/es/connect/connect'
import { Colors } from '../Themes';

class Etheroll extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayValue: 50,
    }
  }

  componentDidMount () {
    this.props.loadEtheroll()
  }

  render () {
    return (
      <React.Fragment>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>adjust you winning chance</Text>
        </View>
        <View style={styles.sliderWrapper}>
          <Text style={styles.label}>1%</Text>
          <Slider style={styles.slider}
            step={1}
            value={50}
            minimumValue={1}
            maximumValue={97}
            onSlidingComplete={(val) => this.props.clickEtheroll(val)}
            onValueChange={(val) => {
              this.setState({ displayValue: val })
              Vibration.vibrate(100)
            }
            } />
          <Text style={styles.label}>97%</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={styles.rateWrapper}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.label}>winning</Text>
              <Text style={styles.label}> chance:</Text>
            </View>
            <Text style={styles.rateText}>{this.state.displayValue}%</Text>
          </View>
          <View style={styles.rateWrapper}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.label}>winning</Text>
              <Text style={styles.label}>pays:</Text>
            </View>
            <Text style={styles.rateText}>{(95 * 0.99 / this.state.displayValue + 0.05).toFixed(2)}x</Text>
          </View>
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
