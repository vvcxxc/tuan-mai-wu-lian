import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui";
import request from "src/services/request";
import bg from "./bg.png";
import icon1 from "./3.png";
import icon2 from "./4.png";
import icon3 from "./5.png";
import icon4 from "./6.png";
import "./index.styl";

interface State {
  userInfo: any;
}

export default class My extends Component<any, State> {
  config = {
    navigationBarTitleText: "我的"
  };

  state = {
    userInfo: {
      user_name: "",
      avatar: "",
      order_msg: "",
      collect_msg: "",
      gift_msg: "",
      activity_msg: ""
    }
  };

  componentWillMount() {
    this.getInfo();
  }

  getInfo() {
    Taro.showLoading();
    request({ url: "v3/user/coupons" })
      .then((res) => {
        Taro.hideLoading();
        this.setState({ userInfo: res });
      })
      .catch(Taro.hideLoading);
  }

  render() {
    return (
      <View className="flex column center">
        <Image src={bg} className="bg" />
        <Image className="head-img" src={this.state.userInfo.avatar} />
        <View className="name">{this.state.userInfo.user_name}</View>
        <View className="meuns">
          <AtList>
            <AtListItem
              title="我的订单"
              arrow="right"
              extraText={this.state.userInfo.order_msg && "有快到期的券"}
              thumb={icon1}
            />
            <AtListItem
              title="我的收藏"
              arrow="right"
              extraText={this.state.userInfo.collect_msg && "有快到期的券"}
              thumb={icon2}
              onClick={() =>
                Taro.navigateTo({ url: "/business-pages/stars/index" })
              }
            />
            <AtListItem
              title="我的礼品"
              arrow="right"
              extraText={this.state.userInfo.gift_msg && "有快到期的券"}
              thumb={icon3}
              onClick={() =>
                Taro.navigateTo({ url: "/business-pages/gift/index" })
              }
            />
            <AtListItem
              title="我参与的活动"
              arrow="right"
              extraText={this.state.userInfo.activity_msg && "有快到期的券"}
              thumb={icon4}
            />
          </AtList>
        </View>
        <View className="info">
          <Text className="theme">客服电话：10101010</Text>
          （服务时间：9：00~20：00）
        </View>
      </View>
    );
  }
}
