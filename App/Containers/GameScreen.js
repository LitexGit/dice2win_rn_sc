import React, { Component } from 'react'
import { Image, Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback, Clipboard } from 'react-native'
import { Images } from '../Themes'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import Swiper from 'react-native-swiper'

import ActivityActions from '../Redux/ActivityRedux'
import GameActions from '../Redux/GameRedux'
import BetActions from '../Redux/BetRedux'

import UserActions from '../Redux/UserRedux'

import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import { Metrics } from '../Themes'
import styles from './Styles/GameScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'
import MarqueeText from 'react-native-marquee'


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

  constructor(props) {
    super(props)

    this.state = {
      noticeIndex: 0,
    }
  }

  componentDidMount () {
    // 记录 邀请码
    this.props.fetchInviteCode()
    this.props.loadBanners()
    console.tron.log('navigation', this.props.navigation)
  }

  Slide = (item) => {
    return (
      <TouchableWithoutFeedback onPress={_=>{
        this.props.navigate('WebviewScreen', {url:item.img_href, title:item.title})
      }} style={styles.slide} >
        <Image style={styles.image} source={{ uri: item.img_url }} />
      </TouchableWithoutFeedback>)
  }

  Entry = ({item}) => {
    return (
      <TouchableOpacity style={styles.entry} onPress={() => {
        this.props.setGameKey(item.key)
        switch (item.key) {
          case 2: this.props.loadCoin();break
          case 6: this.props.loadOneDice();break
          case 36: this.props.loadTwoDice();break
          case 100: this.props.loadEtheroll();break
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

  _changeNotice = () => {
    let noticeIndex = (this.state.noticeIndex + 1) % this.props.notices.length
    this.setState({noticeIndex})
    // let that = this
    // setTimeout(_=>that.setState({noticeIndex}), 1000)
  }

  render () {
    let {banners, notices} = this.props
    let {noticeIndex} = this.state
    let notice = notices[noticeIndex]
    return (
      <View style={styles.container}>
        <View style={styles.swiper}>
          <Swiper autoplay={true} showsPagination={false}>
            { banners && banners.map((item, i) => this.Slide(item)) }
          </Swiper>
        </View>
        <View style={styles.noticeBar}>
          <Image style={styles.noticeIcon} source={Images.bullhorn} />
          <TouchableWithoutFeedback  onPress={_=>
            this.props.navigate('WebviewScreen', {url:notice.url, title:notice.title})
          }>
            <View style={styles.noticeWrapper}>
              <MarqueeText ref='marquee'
                marqueeOnStart
                loop
                duration={3000}
                marqueeResetDelay={1000}
                onMarqueeComplete={this._changeNotice.bind(this)}
                style={styles.noticeText}>
                {notice && notice.text}
              </MarqueeText>
            </View>
          </TouchableWithoutFeedback>
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
  let {
    activity:{banners, notices}
  } = state
  return {
    banners, notices
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
    loadEtheroll: () => dispatch(BetActions.loadEtheroll()),
    setInviteCode: (invite) => dispatch(UserActions.setInviteCode(invite)),
    fetchInviteCode: () => dispatch(UserActions.fetchInviteCode())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen)
