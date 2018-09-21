import React, { Component } from 'react'
import { ScrollView, Image, Text, View, FlatList, TouchableOpacity} from 'react-native'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import Swiper from 'react-native-swiper'

import ActivityActions from '../Redux/ActivityRedux'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/GameScreenStyle'

const Slide = props => {
  return (
  <View style={styles.slide}>
    <Image style={styles.image} source={{uri: props.uri}} />
    {/* {
      !props.loaded && <View style={styles.loadingView}>
        <Image style={styles.loadingImage} source={loading} />
      </View>
    }*/} 
  </View>)
}

const Entry = ({item}) => {
  return (
    <TouchableOpacity style={styles.entry}>
      <View style={styles.entryLeft}>
        <Image source={item.img} resizeMode={'contain'} style={styles.entryImage} />
      </View>
      <View style={styles.entryRight}>
        <Text style={styles.entryTitle}> {item.title} </Text>
        <Text style={styles.entryDesc}> {item.desc} </Text>
      </View>
    </TouchableOpacity>
  )
}

const entryData = [
  {img:require('../Images/ir.png'), title: 'Coin Flip', desc: 'Fifty-fifty Winning bet pays 1.98×'},
  {img:require('../Images/ir.png'), title: 'Roll a Dice', desc: '1 to 6 Winning bet pays up to 5.94×'},
  {img:require('../Images/ir.png'), title: 'Two Dice', desc: '2 to 12 Winning bet pays up to 35.64×'},
  {img:require('../Images/ir.png'), title: 'Etheroll', desc: '1% to 97% Winning bet pays up to 99×'},
]

class GameScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Games',
    tabBarIcon:({tintColor}) => (
      <FA5 name={'dice'} size={26} color={tintColor}/>
    )
  }
  constructor(props){
    super(props)
  }

  componentDidMount () {
    this.props.loadBanners('game')
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
                key={i} />)
            }
          </Swiper>
        </View>
        <FlatList 
          style={styles.entryList}
          data={entryData}
          renderItem={({item})=><Entry item={item} />}
          keyExtractor={item=>item.title}
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
    loadBanners: (type) => dispatch(ActivityActions.activityRequest({type:type}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen)
