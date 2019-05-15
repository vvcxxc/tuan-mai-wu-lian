import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View } from "@tarojs/components";
import CashCoupon from "../../components/cash-coupon/index";

/**订单-内容 */
export default class Content extends Component {
  state = {
    coupon: [, , , , , , ,]
  };
  static options: ComponentOptions = {
    addGlobalClass: true
  };
  render() {
    return (
      <View className="content">
        {this.state.coupon.map((_, index) => (
          <CashCoupon key={index} />
        ))}
      </View>
    );
  }
}
