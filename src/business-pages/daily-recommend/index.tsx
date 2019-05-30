import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.styl";


export default class PaySuccess extends Component {
  config = {
    navigationBarTitleText: "今日推荐"
  };

  state = {
  };

  componentWillMount() {
  }
  componentDidMount() {
  }

  render() {
    return (
        <View className="daily-recommend">
        </View>
    );
  }
}
