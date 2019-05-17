import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import "./index.styl";

export default class ConfirmOrder extends Component {
  config = {
    navigationBarTitleText: "确认订单"
  };

  state = { amount: 1, price: 30 };

  render() {
    return (
      <View className="confirm-order">
        <View className="content">
          <View className="flex center">
            <View className="item label">华润万家50元现金券</View>
            <View>{this.state.price}元</View>
          </View>
          <View className="flex center">
            <View className="item label">数量</View>
            <View className="flex center">
              <AtIcon value="subtract-circle" color="#999" />
              <View className="amount">{this.state.amount}</View>
              <AtIcon value="add-circle" color="#FF6654" />
            </View>
          </View>
        </View>
        <View className="content">
          <View className="flex center">
            <View className="item label">金额</View>
            <View className="price">
              {this.state.price * this.state.amount}元
            </View>
          </View>
        </View>
        <View className="btn-wrap">
          <View className="submit-btn flex center">
            ￥ {this.state.price} 去支付
          </View>
        </View>
      </View>
    );
  }
}
