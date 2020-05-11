import Taro, { Component, Config } from '@tarojs/taro'
import './index.styl'
import {
  Image, View
} from '@tarojs/components'

export default class Newbie extends Component {
  config: Config = {
    navigationBarTitleText: "新手上路",
    // enablePullDownRefresh: true
  }
  state = {

  }
  onShareAppMessage = e => {
    let router = Taro.getStorageSync('router')
    let data = {}
    if(router.type_index_id == 0 || router.type_index_id == 1){
      data = {
        path: '/detail-pages/course/newbie?c_id=' + router.city_id + '&c_name=' + router.city_name + '&type_id=' + router.type_index_id,
      }
    }else {
      data = {path: '/detail-pages/course/newbie'}
    }
    return data
  }

  goto = () => {
    Taro.navigateTo({
      url: '/detail-pages/course/make_money_plan'
    })
  }

  render() {
    return (
      <View className='newbie-page'>
        <Image className='img1' src='http://oss.tdianyi.com/public/FFLL/1.jpg'/>
        <Image className='img2' src='http://oss.tdianyi.com/public/FFLL/2.jpg'/>
        <Image className='img3' src='http://oss.tdianyi.com/public/FFLL/3.jpg'/>
        <Image className='img4' src='http://oss.tdianyi.com/public/FFLL/4.jpg'/>
        <Image className='img5' onClick={this.goto} src='http://oss.tdianyi.com/public/FFLL/5.jpg'/>
      </View>
    )
  }
}
