import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View } from "@tarojs/components";

import "./index.styl";

/**现金优惠券 */
export default class CashCoupon extends Component {
  state = {};

  static options: ComponentOptions = {
    addGlobalClass: true
  };

  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}
  componentDidShow() {}
  componentDidHide() {}
  componentDidCatchError() {}
  componentDidNotFound() {}
  render() {
    return (
      <View className="cash-coupon-wrap flex center">
        <View className="cash-coupon">现金优惠券</View>
      </View>
    );
  }
}
