import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View } from "@tarojs/components";
import CashCoupon from "../../components/cash-coupon/index";
import { AtLoadMore } from "taro-ui";

interface Props {
  /**优惠券列表 */
  list: Array<any>;
  loading: boolean;
}

/**订单-内容 */
export default class Content extends Component<Props> {
  static options: ComponentOptions = {
    addGlobalClass: true
  };
  render() {
    return (
      <View className="content">
        {this.props.list.map((_) => (
          <CashCoupon key={_.coupons_id} />
        ))}

        {this.props.loading && <AtLoadMore status="loading" />}
      </View>
    );
  }
}
