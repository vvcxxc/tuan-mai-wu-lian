import Taro, { Component } from "@tarojs/taro";
import { AtIcon } from 'taro-ui';
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";

export default class AppreActivity extends Component {
  config = {
    navigationBarTitleText: "小熊抢购",
    enablePullDownRefresh: false
  };

  state = {}


  render() {

    return (
      <View className="snap-up-detail">


      </View>
    );
  }
}
