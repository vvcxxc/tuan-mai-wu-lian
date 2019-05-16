import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui";
import "./index.styl";

export default class My extends Component {
  config = {
    navigationBarTitleText: "我的"
  };

  state = {};

  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}
  componentDidShow() {}
  componentDidHide() {}
  componentDidCatchError() {}
  componentDidNotFound() {}
  render() {
    return (
      <View className="flex column center">
        <View className="head-img" />
        <View className="name">杨大富</View>
        <View className="meuns">
          <AtList>
            <AtListItem
              title="我的订单"
              arrow="right"
              extraText="有快到期的券"
            />
            <AtListItem title="我的收藏" arrow="right" extraText="收藏有更新" />
            <AtListItem
              title="我的礼品"
              arrow="right"
              extraText="有正在配送的礼品"
            />
            <AtListItem
              title="我参与的活动"
              arrow="right"
              extraText="有正在进行的拼团活动"
            />
          </AtList>
        </View>
        <View className="info">
          <Text className="theme">客服电话：10101010</Text>
          （服务时间：9：00~20：00）
        </View>
      </View>
    );
  }
}