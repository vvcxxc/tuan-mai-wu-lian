import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";


import "./index.styl";

interface Props {
  _id: any,
  return_money: any,
  youhui_type: any,
  timer: any,
  sname: any,
  list_brief: any,
  _image: any,
  type: any,
  bg_img_type: any,
  clickcode: any
}
//type: 0为空白，1立即使用，2再来一单
// bg_img_type: 0为正常，1为已使用

/**现金优惠券 */
export default class CashCoupon extends Component<Props> {
  state = {
  };

  static options: ComponentOptions = {
    addGlobalClass: true
  };
  handleClick = (_id, e) => {
    // console.log(e.target)
    Taro.navigateTo({
      url: '/pages/orderdetail/index?id=' + _id
    })
  }
  useNow = (_id, e) => {
    console.log("儿子" + _id)
    this.props.clickcode(this.props._id);
    e.stopPropagation();
  }
  buyMore = (_id, e) => {
    console.log(e.target)
    // console.log("buymore"+_id)
    Taro.navigateTo({
      url: '/business-pages/confirm-order/index?id=' + _id
    })
    e.stopPropagation();
  }
  render() {
    return (
      <View
        className="cash-coupon flex active"
        style={{
          backgroundImage: this.props.bg_img_type == 0 ? `url("http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/D3Ws4B7kH8PwEsDdJiDtzaNtZdtWcZBr.png")` : `url("http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/by5b6PKpQ5QYREYfdMZhSPD5rBYRefyR.png")`
        }}
        onClick={this.handleClick.bind(this, this.props._id)}
      >
        <View className="secondary flex center" >
          <Image src={this.props._image} style={{ width: "100%", height: "100%" }} />
        </View>
        {/* <Image
          className="middle-bg"
          mode="widthFix"
          src={{this.props.image}}
        /> */}
        <View className="item content">
          <View className="head flex">
            <View className="label flex center">{this.props.sname}</View>
          </View>
          <View className="info">{this.props.timer}</View>
          <View className="date">{this.props.list_brief}</View>
          {
            this.props.type == 1 ? <View className="usenow" onClick={this.useNow.bind(this, this.props._id)}>立即使用</View> : (
              this.props.type == 2 ? <View className="buymore" onClick={this.buyMore.bind(this, this.props._id)} >再来一单</View> : <View></View>)
          }


        </View>
      </View>
    );
  }
}
