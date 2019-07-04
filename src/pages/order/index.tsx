import Taro, { Component, Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtTabs, AtTabsPane } from 'taro-ui'
import "taro-ui/dist/style/components/tabs.scss";
import CashCoupon1 from "./cash-coupon1/index";
import CashCoupon2 from "./cash-coupon2/index";
import CashCoupon3 from "./cash-coupon3/index";
import CashCoupon4 from "./cash-coupon4/index";
import CashCoupon5 from "./cash-coupon5/index";
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
    // console.log(current)
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
  handleClick0(value) {
    this.setState({
      current: value
    })
  }
  handleClick = (e) => {
    // console.log();
    Taro.navigateTo({
      // url: '../../orderdetail/index.tsx?id=' +_id
      url: '../../pages/orderdetail/index'
    })
  }
  render() {
    // const list = ["未使用", "已使用", "已过期", "已退款"];
    const tabList = [{ title: '未使用' }, { title: '已使用' }, { title: '已过期' }, { title: '已退款' }]

    return (
      <View className="order flex column">
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick0.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            <View className="tiket_box">
              {/* {this.props.list.map((_) => (
                <CashCoupon2 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" />
              ))}
              {this.props.list.map((_) => (
                <CashCoupon1 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" _image="" />
              ))} */}
              <CashCoupon2 _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon2 _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon1 _id="1" type={1} return_money="100" pay_money="300" youhui_type="1" timer="100" sname="广告费个" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" />
              <CashCoupon1 _id="1" type={1} return_money="100" pay_money="20" youhui_type="1" timer="100" sname="ddddd" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" />
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View className="tiket_box">
              {/* {this.props.list.map((_) => (
                <CashCoupon4 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" />
              ))}
              {this.props.list.map((_) => (
                <CashCoupon5 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" _image="" />
              ))} */}
              <CashCoupon4 _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon4 _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon5 _id="1" return_money="100" pay_money="300" youhui_type="1" timer="100" sname="广告费个" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" />
              <CashCoupon5 _id="1" return_money="100" pay_money="300" youhui_type="1" timer="100" sname="广告费个" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" />

            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            <View className="tiket_box">
              {/* {this.props.list.map((_) => (
                <CashCoupon3 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" />
              ))}
              {this.props.list.map((_) => (
                <CashCoupon1 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" _image="" />
              ))} */}
              <CashCoupon3 _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon3 _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon1 type={0} _id="1" return_money="100" pay_money="20" youhui_type="1" timer="100" sname="ddddd" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" />
              <CashCoupon1 type={0} _id="1" return_money="100" pay_money="20" youhui_type="1" timer="100" sname="ddddd" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" />
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={3}>
            <View className="tiket_box">
              {/* {this.props.list.map((_) => (
                <CashCoupon2 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" />
              ))}
              {this.props.list.map((_) => (
                <CashCoupon1 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" _image="" />
              ))} */}
              <CashCoupon2 _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon2 _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon1 type={2} _id="1" return_money="100" pay_money="20" youhui_type="1" timer="100" sname="ddddd" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" />
              <CashCoupon1 type={2} _id="1" return_money="100" pay_money="20" youhui_type="1" timer="100" sname="ddddd" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" />
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}
