import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

import './index.less';

export default class MyQRCode extends Component {
  config = {
    navigationBarTitleText: "我的邀请店铺二维码",
};
  state = {

  }

  render (){
    return (
      <View className='my-code-page'>
        <View className='code-main'>
          <View className='header'>
            <Image src='' />
            <View>EDchen</View>
          </View>
        </View>
      </View>
    )
  }
}
