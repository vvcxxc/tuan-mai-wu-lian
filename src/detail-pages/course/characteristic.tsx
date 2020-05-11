import Taro, { Component, Config } from '@tarojs/taro'
import './index.styl'
import {
  Image, View
} from '@tarojs/components'

export default class Characteristic extends Component {
  config: Config = {
    navigationBarTitleText: "小熊敬礼特色",
    // enablePullDownRefresh: true
  }
  state = {

  }
  onShareAppMessage = e => {
    let router = Taro.getStorageSync('router')
    let data = {}
    if(router.type_index_id == 0 || router.type_index_id == 1){
      data = {
        path: '/detail-pages/course/characteristic?c_id=' + router.city_id + '&c_name=' + router.city_name + '&type_id=' + router.type_index_id,
      }
    }else {
      data = {path: '/detail-pages/course/characteristic'}
    }
    return data
  }

  render() {
    return (
      <View className='characteristic-page'>
        <Image className='img1' src='http://oss.tdianyi.com/public/characteristic/1.jpg'/>
        <Image className='img2' src='http://oss.tdianyi.com/public/characteristic/2.jpg'/>
        <Image className='img3' src='http://oss.tdianyi.com/public/characteristic/3.jpg'/>
        <Image className='img4' src='http://oss.tdianyi.com/public/characteristic/4.jpg'/>
        <Image className='img5' src='http://oss.tdianyi.com/public/characteristic/5.jpg'/>
      </View>
    )
  }
}
