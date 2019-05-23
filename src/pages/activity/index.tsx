import Taro, { Component } from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";

import "./index.styl";

export default class Activity extends Component {
  config = {
    navigationBarTitleText: "活动中心"
  };

  state = {};

  componentWillMount() {}
  render() {
    return (
      <View>
        <Swiper indicator-dots circular className="swiper">
          <SwiperItem>1</SwiperItem>
          <SwiperItem>1</SwiperItem>
          <SwiperItem>1</SwiperItem>
        </Swiper>
      </View>
    );
  }
}
