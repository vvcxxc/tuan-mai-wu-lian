import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtIcon } from "taro-ui";

import request from '../../services/request'
import "./index.styl";

export default class ConfirmOrder extends Component {
  config = {
    navigationBarTitleText: "确认订单"
  };

  state = {
    amount: 1,
    pay_success: false,
    coupon: {
      pay_money: 1,
      brief: "",
      list_brief: "",
      description: "0",
      yname: ""
    },
    store: {
      id: "",
      sname: ""
    }
  };
  componentWillMount() {
    Taro.showLoading({
      title: 'loading',
    })
    // console.log(this.$router.params.id )
    request({ url: '/v3/discount_coupons/' + this.$router.params.id })
      .then((res: any) => {
        console.log(res);
        this.setState({
          coupon: res.info.coupon,
          store:res.info.store
        })
        Taro.hideLoading()
      });

  }
  componentDidMount() {

  }
  cutnum() {
    if (this.state.amount > 1) {
      this.setState({ amount: Number(this.state.amount) - 1 })
    }

  }
  addnum() {
    if (this.state.amount < 99) {
      this.setState({ amount: Number(this.state.amount) + 1 })
    }
  }

  payMoney(youhui_id, store_id, youhui_number, type, openid, alipay_user_id, el) {
    Taro.showLoading({
      title: 'loading',
    })
    request({
      url: 'api/merchant/youhui/wxWechatPay',
      method: "GET",
      data: {
        youhui_id: "",
        store_id: "",
        youhui_number: "",
        type: "",  //1 微信 2支付宝			
        openid: "",
        alipay_user_id: ""
      }
    })
      .then((res: any) => {

        Taro.hideLoading()
      });
  }
  render() {
    return (
      <View className="confirm-order" >
        <View className="check" style={{ display: this.state.pay_success ? "block" : "none" }}>支付失败</View>
        <View className="content">
          <View className="flex center">
            <View className="item label">{this.state.coupon.yname}</View>
            <View>{this.state.coupon.pay_money}元</View>
          </View>
          <View className="flex center">
            <View className="item label">数量</View>
            <View className="flex center">
              <AtIcon value="subtract-circle" color={this.state.amount > 1 ? "#FF6654" : "#999"} onClick={this.cutnum.bind(this)} />
              <View className="amount" >{this.state.amount}</View>
              <AtIcon value="add-circle" color={this.state.amount < 99 ? "#FF6654" : "#999"} onClick={this.addnum.bind(this)} />
            </View>
          </View>
        </View>
        <View className="content">
          <View className="flex center">
            <View className="item label">金额</View>
            <View className="price">
              {this.state.coupon.pay_money * this.state.amount}元
            </View>
          </View>
        </View>
        <View className="btn-wrap">
          <View className="submit-btn flex center"
          // onClick={this.payMoney.bind(this,youhui_id, store_id, youhui_number, type, openid, alipay_user_id)}
          >
            ￥ {this.state.coupon.pay_money * this.state.amount} 去支付
          </View>
        </View>
      </View>
    );
  }
}
