import Taro, { Component } from '@tarojs/taro';
import './index.styl';
import { View, Image, Text } from '@tarojs/components';
import { accSubtr } from '@/utils/common'
interface Props {
  item: any;
  onAction: any;
}
export default class CouponBox extends Component<Props> {
  CouponBox.defaultProps = {
    item: {
      is_share: 0
    }
  }
  state = {

  }
  componentDidMount() {
  }
  handleClick(item) {
    this.props.onAction(item)
  }

  render() {
    const { item } = this.props
    return (
      <View className='coupon-box' onClick={this.handleClick.bind(this,item)}>
        <Image className='coupon-img' src={'http://oss.tdianyi.com/' + item.icon} />
        <View className='coupon-detail'>
          <View className='coupon-title'>
            <View className='coupon-type'>拼团券</View>
            <Text>
              {item.name}
            </Text>
          </View>
    <View className='coupon-validity'>有效期：{item.expire_day}天有效</View>
          <View className='coupon-label'>立减￥{ item.is_share == 5 ? accSubtr(item.pay_money,item.participation_money) : accSubtr(item.return_money, item.pay_money)}</View>
          <View className='coupon-money'>
            优惠价￥
            <Text className='new-money'>{item.is_share == 5 ? item.participation_money : item.pay_money}</Text>
            <Text className='old-money'>￥{item.is_share == 5 ? item.pay_money : item.return_money}</Text>
          </View>
          <View className='coupon-button'>抢购</View>
        </View>
      </View>
    )
  }
}
