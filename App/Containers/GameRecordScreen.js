import React, { Component } from 'react'
import { View, FlatList, Text, } from 'react-native'
import RecordActions from '../Redux/RecordRedux'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/GameRecordScreenStyle'

import ListEmptyComponent from '../Components/ListEmptyComponent'

class GameRecordScreen extends Component {
  _renderItem(item) {

  }

  render () {
    return (
      <View style={styles.container}>
        <FlatList style={styles.list}
          source={this.props.records}
          renderItem={this._renderItem.bind(this)}
          ListEmptyComponent={ListEmptyComponent} />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    records: state.record.global
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRecords: () => dispatch(RecordActions.getGameRecords())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameRecordScreen)
