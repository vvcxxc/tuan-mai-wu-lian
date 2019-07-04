import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";

import secondaryActiveBg from "./secondary-avitve-bg.png";

import "./index.styl";

interface Props {
  _id: any, return_money: any, pay_money: any, youhui_type: any, timer: any, sname: any, list_brief: any, _image:any }

/**现金优惠券 */
export default class CashCoupon extends Component<Props> {
  state = {};

  static options: ComponentOptions = {
    addGlobalClass: true
  };
  handleClick = (_id, e) => {
    Taro.navigateTo({
      // url: '../../orderdetail/index.tsx?id=' +_id
      url: '/pages/orderdetail/index?id=' +_id
    })
  }
  render() {
    return (
      <View
        className="cash-coupon flex active"
        style={{
          backgroundImage: `url(${require("./active-bg2.png")})`
        }}
        onClick={this.handleClick.bind(this, this.props._id)}
      >
        <View className="secondary flex center" >
          <Image src={this.props._image} style={{width:"100%",height:"100%"}} />
        </View>
        {/* <Image
          className="middle-bg"
          mode="widthFix"
          src={{this.props.image}}
        /> */}
        <View className="item content">
          <View className="head flex">
            <View className="label flex center">{this.props.youhui_type == "0" ? "兑换券" : "现金券"}</View>{this.props.sname}
          </View>
          <View className="info">{this.props.timer}</View>
          <View className="date">{this.props.list_brief}</View>
          <View className="usenow" >立即使用</View>
        </View>
      </View>
    );
  }
}
