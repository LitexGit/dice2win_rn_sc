import React, { Component } from 'react'
import { Image, Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
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


const entryData = [
  {img: Images.coin, title: 'Coin Flip', desc: 'Fifty-fifty Winning bet pays 1.98×', key: 2},
  {img: Images.dice1, title: 'Roll a Dice', desc: '1 to 6 Winning bet pays up to 5.94×', key: 6},
  {img: Images.dice2, title: 'Two Dices', desc: '2 to 12 Winning bet pays up to 35.64×', key: 36},
  {img: Images.roll, title: 'Etheroll', desc: '1% to 97% Winning bet pays up to 99×', key: 100}
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
    this.props.loadBanners()
  }

  Slide = (item) => {
    console.tron.log('SLIDE', item)
    return (
      <TouchableWithoutFeedback onPress={_=>{
        this.props.navigate('WebviewScreen', {url:item.img_href, title:item.title})
      }} style={styles.slide} >
        <Image style={styles.image} source={item.img_url}/>
      </TouchableWithoutFeedback>)
  }

  Entry = ({item}) => {
    return (
      <TouchableOpacity style={styles.entry} onPress={() => {
        this.props.setGameKey(item.key)
        switch (item.key) {
          case 2:
            this.props.loadCoin()
            break
          case 6:
            this.props.loadOneDice()
            break
          case 36:
            this.props.loadTwoDice()
            break
          case 100:
            this.props.loadEtheroll()
            break
        }
        this.props.navigate('GameContainerScreen')
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
            { this.props.banners && this.props.banners.map((item, i) => this.Slide(item)) }
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
    banners: state.activity.banners
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadBanners: () => dispatch(ActivityActions.activityRequest()),
    setGameKey: (key) => dispatch(GameActions.setGameKey(key)),
    navigate: (target, params) => dispatch(NavigationActions.navigate({routeName: target, params: params})),
    loadCoin: () => dispatch(BetActions.loadCoin()),
    loadOneDice: () => dispatch(BetActions.loadOneDice()),
    loadTwoDice: () => dispatch(BetActions.loadTwoDice()),
    loadEtheroll: () => dispatch(BetActions.loadEtheroll())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen)
