import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View } from "@tarojs/components";
import CashCoupon from "../../components/cash-coupon/index";
import { AtLoadMore } from "taro-ui";


interface Props {
  /**优惠券列表 */
  list: Array<any>;
  loading: boolean;
   /**优惠券类型  0 未使用 1已使用 2 已过期  3 已退款 */
  type:number 
  
}

/**订单-内容 */
export default class Content extends Component<Props> {
  static options: ComponentOptions = {
    addGlobalClass: true,
  };
  handerClickCb(cuoPonsId:any){
    const { type  } = this.props
     Taro.navigateTo({
       url:'/pages/order/orderdetail/index?cuoPonsId='+cuoPonsId+'&type='+String(type)
     })
  }
  render() {
    return (
      <View className="content">
        {this.props.list.map((_) => (
          <CashCoupon  cuoPonsId = {_.coupons_id}  handerClickCb = { this.handerClickCb.bind(this,_.coupons_id) }   key={_.coupons_id} />
        ))}

        {this.props.loading && <AtLoadMore status="loading" />}
      </View>
    );
  }
}
