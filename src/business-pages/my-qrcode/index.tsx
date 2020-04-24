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
            <View className="avatar_img"></View>
            <View className="user_name">EDchen</View>
          </View>
          <View className="qrcode"></View>
          <View className="download_qrcode">
            <View className="btn">下载保存二维码</View>
          </View>
        </View>

        <View className="code-desc">
          <View className="desc_title">邀请店铺入驻可获得以下收益：</View>
          <View className="desc_info">
            <View className="item">1.订单收益：入驻店铺通过小熊敬礼平台所达成的商品、卡券等销售，邀请人均可获得佣金，佣金比例为创客分享该产品所获销售收益的40%；</View>
            <View className="item">2.直属店铺广告收益分佣；</View>
            <View className="item">3.直属店铺线下扫码支付费率收益分佣</View>
          </View>
        </View>
      </View>
    )
  }
}
