import Taro, { Component } from "@tarojs/taro";
import { Image, View } from "@tarojs/components";
import { AtIcon, AtToast } from "taro-ui";

import request from '../../services/request'
import "./index.styl";
import addimg from '../../assets/add.png';
import addimg2 from '../../assets/add2.png';
import cutimg from '../../assets/cut.png';
import cutimg2 from '../../assets/cut2.png';
import AlertLogin from '@/components/alertLogin'
export default class ConfirmOrder extends Component {
  config = {
    navigationBarTitleText: "确认订单"
  };

  state = {
    tempNum: 0,
    amount: 1,
    pay_success: false,
    coupon: {
      id: "",
      pay_money: 0,
      brief: "",
      list_brief: "",
      description: "0",
      yname: ""
    },
    store: {
      id: "",
      sname: ""
    },
    pay_bull: false,
    pay_data: "支付成功",
    is_login: false
  };
  componentWillMount() {
    Taro.showLoading({
      title: 'loading',
    })
    request({ url: '/v3/discount_coupons/' + this.$router.params.id })
      .then((res: any) => {
        console.log(res.data);
        this.setState({
          coupon: res.data.info.coupon,
          store: res.data.info.store
        }, () => {
          this.accMul();
        })
        Taro.hideLoading()
      });

  }
  componentDidMount() {

  }
  cutnum() {
    if (this.state.amount > 1) {
      this.setState({ amount: Number(this.state.amount) - 1 }, () => {
        this.accMul();
      })
    }

  }
  addnum() {
    console.log(this.accMul())
    if (this.state.amount < 10) {
      this.setState({ amount: Number(this.state.amount) + 1 }, () => {
        this.accMul();
      })
    }
  }
  payMoney() {
    if (!Taro.getStorageSync("unionid")) {
      this.setState({
        is_login: true
      })
      return
    }
    Taro.showLoading({
      title: 'loading',
    })
    //请求支付属性
    request({
      url: 'api/wap/coupon/wxWechatPay',
      method: "POST",
      data: {
        youhui_id: this.state.coupon.id,
        store_id: this.state.store.id,
        youhui_number: this.state.amount,
        type: "1",  //1 微信 2支付宝
        open_id: Taro.getStorageSync("openid"), //登录时获取设置本地缓存
        // open_id: "oCRAS0aZJrVnuK3K-pw0b1AZslzM"
        // alipay_user_id: ""
      }
    })
      .then((res: any) => {
        Taro.hideLoading();
        // 发起支付
        Taro.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(res) {
            Taro.showToast({ title: '支付成功', icon: 'none' })
            Taro.switchTab({
              url: '/pages/order/index',
              success: () => {
                var page = Taro.getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          },
          fail(err) {
            Taro.showToast({ title: '支付失败', icon: 'none' })
          },
        })
      });
  }


  accMul = () => {
    let arg1 = this.state.coupon.pay_money;
    let arg2 = this.state.amount;
    var m = 0, s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) { }
    try {
      m += s2.split(".")[1].length
    } catch (e) { }
    let tempNum = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    this.setState({ tempNum: tempNum })
  }


  render() {
    return (
      <View className="confirm-order" >
        {/* {

          this.state.pay_bull ? <AtToast isOpened text={this.state.pay_data} duration={2000} ></AtToast> : ""
        } */}
        <View className="content">
          <View className="flex center">
            <View className="item label">{this.state.store.sname}{this.state.coupon.yname}</View>
            <View>{this.state.coupon.pay_money}元</View>
          </View>
          <View className="flex center">
            <View className="item label">数量</View>
            <View className="flex center">
              {/* <AtIcon value="subtract-circle" color={this.state.amount > 1 ? "#FF6654" : "#999"} onClick={this.cutnum.bind(this)} /> */}
              <View className="subimg" style={{ width: "22px", height: "22px" }} onClick={this.cutnum.bind(this)}>
                <Image className="image" style={{ width: "100%", height: "100%" }} src={this.state.amount > 1 ? cutimg : cutimg2} />
              </View>
              <View className="amount" >{this.state.amount}</View>
              {/* <AtIcon value="add-circle" color={this.state.amount < 10 ? "#FF6654" : "#999"} onClick={this.addnum.bind(this)} /> */}
              <View className="addimg" style={{ width: "22px", height: "22px" }} onClick={this.addnum.bind(this)}>
                <Image className="image" style={{ width: "100%", height: "100%" }} src={this.state.amount < 10 ? addimg : addimg2} />
              </View>
            </View>
          </View>
        </View>
        <View className="content">
          <View className="flex center">
            <View className="item label">金额</View>
            <View className="price">
              ￥{this.state.tempNum}
            </View>
          </View>
        </View>
        <View className="pay-btn-box">
          <View className="pay-btn" onClick={this.payMoney.bind(this)}>￥ {this.state.tempNum}去支付</View>
        </View>
        {/* <View className="btn-wrap">
          <View className="submit-btn flex center"
            onClick={this.payMoney.bind(this)}
          >
            ￥ {this.state.coupon.pay_money * this.state.amount} 去支付
          </View>
        </View> */}
        {
          this.state.is_login ? <AlertLogin is_login={this.state.is_login} onClose={() => { this.setState({ is_login: false }) }} /> : null
        }
      </View>
    );
  }
}
