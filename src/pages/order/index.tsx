import Taro, { Component, Config } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import Content from "./content";
import "./index.styl";

export default class Order extends Component {
  config: Config = {
    navigationBarTitleText: "我的订单"
  };
  state = {
    current: 0
  };
  handlerTablChange(current) {
    this.setState({ current });
  }
  render() {
    return (
      <View className="order flex column">
        <View className="tab flex">
          <View
            className={
              "item flex center " + (this.state.current === 0 ? "active" : "")
            }
            onClick={this.handlerTablChange.bind(this, 0)}
          >
            <View className="label">未使用</View>
          </View>
          <View
            className={
              "item flex center " + (this.state.current === 1 ? "active" : "")
            }
            onClick={this.handlerTablChange.bind(this, 1)}
          >
            <View className="label">未使用</View>
          </View>
          <View
            className={
              "item flex center " + (this.state.current === 2 ? "active" : "")
            }
            onClick={this.handlerTablChange.bind(this, 2)}
          >
            <View className="label">未使用</View>
          </View>
        </View>
        <ScrollView scrollY className="item content-wrap">
          <Content />
        </ScrollView>
      </View>
    );
  }
}
