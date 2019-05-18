import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

import "./index.styl";

interface Props {
  /**当前父级元素的背景色 */
  background?: string;
}

/**现金优惠券 */
export default class CashCoupon extends Component<Props> {
  state = {};

  static options: ComponentOptions = {
    addGlobalClass: true
  };

  render() {
    return (
      <View className="cash-coupon flex active">
        <View className="secondary flex center">
          <View className="money-wrap">
            ￥<Text className="money">50</Text>
            <View className="info">满199可用</View>
          </View>
          <View className="bg flex">
            <View className="mask item" />
            <View className="pl">
              <View
                className="after"
                style={{ background: this.props.background }}
              />
              <View
                className="before"
                style={{ background: this.props.background }}
              />
            </View>
          </View>
        </View>
        <View className="item content">
          <View className="head flex">
            <View className="label flex center">现金券</View>洛溪路店
          </View>
          <View className="date">2019.4.20-2019.4.30</View>
          <View className="info">极速退/免预约/全部商品可用</View>
          <View className="bg flex">
            <View className="pl">
              <View
                className="after"
                style={{ background: this.props.background }}
              />
              <View
                className="before"
                style={{ background: this.props.background }}
              />
            </View>
            <View className="mask item" />
          </View>
        </View>
      </View>
    );
  }
}
