import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View } from "@tarojs/components";
import bg from "./bg.png";

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
      <View className="cash-coupon-wrap">
        <View
          className="cash-coupon flex center"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <View className="secondary">左边</View>
        </View>
      </View>
    );
  }
}
