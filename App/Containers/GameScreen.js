import React, { Component } from 'react'
import { Image, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { Images } from '../Themes'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import Swiper from 'react-native-swiper'

import ActivityActions from '../Redux/ActivityRedux'
import GameActions from '../Redux/GameRedux'
import BetActions from '../Redux/BetRedux'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import { Metrics } from '../Themes'
import styles from './Styles/GameScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Coin from '../Components/Coin'
import OneDice from '../Components/OneDice'
import TwoDice from '../Components/TowDice'
import Etheroll from '../Components/Etheroll'

const Slide = props => {
  return (
    <View style={styles.slide}>
      <Image style={styles.image} source={{uri: props.uri}}/>
    </View>)
}

const entryData = [
  {img: Images.coin, title: 'Coin Flip', desc: 'Fifty-fifty Winning bet pays 1.98×', key: 0},
  {img: Images.dice1, title: 'Roll a Dice', desc: '1 to 6 Winning bet pays up to 5.94×', key: 1},
  {img: Images.dice2, title: 'Two Dice', desc: '2 to 12 Winning bet pays up to 35.64×', key: 2},
  {img: Images.roll, title: 'Etheroll', desc: '1% to 97% Winning bet pays up to 99×', key: 3}
]

class GameScreen extends Component {
  static navigationOptions = {
    title: 'Games',
    tabBarLabel: 'Games',
    tabBarIcon: ({tintColor}) => (
      <FA5 name={'dice'} size={Metrics.bottomTabIconSize} color={tintColor}/>
    )
  }

  componentDidMount () {
    this.props.loadBanners('game')
  }

  Entry = ({item}) => {
    // console.log('Entry this:', this)
    return (
      <TouchableOpacity style={styles.entry} onPress={() => {
        this.props.setGameKey(item.key)
        switch (item.key) {
          case 0:
            this.props.loadOneDice()
            break
          case 1:
            this.props.loadOneDice()
            break
          case 2:
            this.props.loadTwoDice()
            break
          case 3:
            this.props.loadEtheroll()
            break
        }
        this.props.navigate('GameContainer')
      }}>
        <View style={styles.entryLeft}>
          <Image source={item.img} resizeMode={'contain'} style={styles.entryImage}/>
        </View>
        <View style={styles.entryRight}>
          <Text style={styles.entryTitle}> {item.title} </Text>
          <Text style={styles.entryDesc}> {item.desc} </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.swiper}>
          <Swiper autoplay={true} showsPagination={false}>
            {
              this.props.banners && this.props.banners.items.map((item, i) => <Slide
                loaded={true}
                uri={item.img}
                i={i}
                key={i}/>)
            }
          </Swiper>
        </View>
        <FlatList
          style={styles.entryList}
          data={entryData}
          renderItem={({item}) => this.Entry({item})}
          keyExtractor={item => item.title}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    banners: state.activity.payload.banners
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadBanners: (type) => dispatch(ActivityActions.activityRequest({type: type})),
    setGameKey: (key) => dispatch(GameActions.setGameKey(key)),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    loadCoin: () => dispatch(BetActions.loadCoin()),
    loadOneDice: () => dispatch(BetActions.loadOneDice()),
    loadTwoDice: () => dispatch(BetActions.loadTwoDice()),
    loadEtheroll: () => dispatch(BetActions.loadEtheroll())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen)
