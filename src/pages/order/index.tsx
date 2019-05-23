import Taro, { Component, Config } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import Tabs from "../../components/tabs";
import Content from "./content";
import "./index.styl";
import request from "../../services/request";

export default class Order extends Component {
  config: Config = {
    navigationBarTitleText: "我的订单"
  };
  state = {
    current: 0,
    coupon: [],
    page: 1,
    loading: false
  };

  handlerTabChange(current) {
    this.setState({ current });
  }

  componentWillMount() {
    this.getData();
  }

  getData() {
    this.setState({ loading: true });
    request({
      url: "v3/user/coupons",
      data: { coupons_status: this.state.current + 1, page: this.state.page }
    })
      .then((res: any) => this.setState({ coupon: res, loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const list = ["未使用", "已使用", "已过期", "已退款"];
    return (
      <View className="order flex column">
        <Tabs list={list} onChange={this.handlerTabChange.bind(this)} />
        <ScrollView scrollY className="item content-wrap">
          <Content list={this.state.coupon} loading={this.state.loading} />
        </ScrollView>
      </View>
    );
  }
}
