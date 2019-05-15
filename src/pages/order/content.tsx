import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import CashCoupon from "../../components/cash-coupon/index";

/**订单-内容 */
export default class Content extends Component {
  state = {
    coupon: [, , , , , , ,]
  };
  render() {
    return (
      <View className="content">
        {this.state.coupon.map((_) => (
          <CashCoupon />
        ))}
      </View>
    );
  }
}
