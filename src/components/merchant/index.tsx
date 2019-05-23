import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import "./index.styl";

interface Props {
  merchant: any;
}

/**商店 ITEM 组件 */
export default class Merchant extends Component<Props> {
  render() {
    return (
      <View className="merchant">
        <View>{this.props.merchant.name}</View>
      </View>
    );
  }
}
