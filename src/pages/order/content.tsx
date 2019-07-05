import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View } from "@tarojs/components";
import CashCoupon1 from "./cash-coupon1/index";
import CashCoupon2 from "./cash-coupon2/index";
import { AtLoadMore } from "taro-ui";

interface Props {
  /**优惠券列表 */
  list: Array<any>;
  loading: boolean;
  current: any
}

/**订单-内容 */
export default class Content extends Component<Props> {
  static options: ComponentOptions = {
    addGlobalClass: true
  };
  componentWillMount() {
  }
  handleClick = (e) => {
    Taro.navigateTo({
      // url: '../../orderdetail/index.tsx?id=' +_id
      url: '../../pages/orderdetail/index'
    })
  }

  render() {
    return (
      <View className="content">
        {/* {this.props.list.map((_) => (
          <CashCoupon key={_.coupons_id} />
        ))} */}
        {
          this.props.current === 0 ?
            <View className="tiket_box">
              {/* {this.props.list.map((_) => (
                <CashCoupon2 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" />
              ))}
              {this.props.list.map((_) => (
                <CashCoupon1 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" _image="" />
              ))} */}

              <View onClick={this.handleClick.bind(this)}>
                <CashCoupon2 _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              </View>
              <CashCoupon2 _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon2 _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon2 _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon1 _id="1" return_money="100" pay_money="20" youhui_type="1" timer="100" sname="ddddd" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" />
              <CashCoupon1 _id="1" return_money="100" pay_money="20" youhui_type="1" timer="100" sname="ddddd" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" />
              <CashCoupon1 _id="1" return_money="100" pay_money="300" youhui_type="1" timer="100" sname="广告费个" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" />
              <CashCoupon1 _id="1" return_money="100" pay_money="20" youhui_type="1" timer="100" sname="ddddd" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" />

            </View>
            : (
              this.props.current == 1 ?
                <View className="tiket_box">
                  {/* {this.props.list.map((_) => (
                <CashCoupon2 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" />
              ))}
              {this.props.list.map((_) => (
                <CashCoupon1 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" _image="" />
              ))} */}
                </View>
                : (
                  this.props.current == 2 ?
                    <View className="tiket_box">
                      {/* {this.props.list.map((_) => (
                <CashCoupon2 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" />
              ))}
              {this.props.list.map((_) => (
                <CashCoupon1 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" _image="" />
              ))} */}
                    </View>
                    : (
                      this.props.current == 3 ?
                        <View className="tiket_box">
                          {/* {this.props.list.map((_) => (
                <CashCoupon2 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" />
              ))}
              {this.props.list.map((_) => (
                <CashCoupon1 _id="" return_money="" pay_money="" youhui_type="" timer="" sname="" list_brief="" _image="" />
              ))} */}
                        </View>
                        : "")))
        }
        {/* {this.props.loading && <AtLoadMore status="loading" />} */}
      </View>
    );
  }
}
