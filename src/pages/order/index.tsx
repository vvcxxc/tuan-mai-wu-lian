import Taro, { Component, Config } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import Tabs from "../../components/tabs";
import Content from "./content";
import "./index.styl";

export default class Order extends Component {
  config: Config = {
    navigationBarTitleText: "我的订单"
  };
  state = {
    current: 0
  };

  handlerTabChange(current) {
    this.setState({ current });
  }

  render() {
    const list = ["未使用", "已使用", "已过期", "已退款"];
    return (
      <View className="order flex column">
        <Tabs list={list} onChange={this.handlerTabChange.bind(this)} />
        <ScrollView scrollY className="item content-wrap">
          <Content />
        </ScrollView>
      </View>
    );
  }
}
