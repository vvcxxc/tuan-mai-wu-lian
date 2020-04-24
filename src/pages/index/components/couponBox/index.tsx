import Taro, { Component } from '@tarojs/taro';
import './index.styl';
import { View, Image, Text } from '@tarojs/components';
import { accSubtr } from '@/utils/common'
interface Props {
  item: any;
  onAction: any;
}
export default class CouponBox extends Component<Props> {
  defaultProps = {
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

  couponType(item) {
    const { is_share } = item
    let type = ''
    if (is_share == 1) {
      // 增值
      type = '增值券'
    } else if (is_share == 4) {
      // 现金券兑换券
      if (item.youhui_type) {
        // 现金券
        type = '现金券'
      } else {
        // 兑换券
        type = '兑换券'
      }
    } else if (is_share == 5) {
      // 拼团
      type = '拼团券'
    }
    return type
  }


  render() {
    const { item } = this.props
    return (
      <View className='coupon-box' onClick={this.handleClick.bind(this, item)}>
        <Image className='coupon-img' src={'http://oss.tdianyi.com/' + item.icon} />
        <View className='coupon-detail'>
          <View className='coupon-title'>
            <View className='coupon-type'>
              {this.couponType(item)}
            </View>
            <Text>
              {item.name}
            </Text>
          </View>
          <View className='coupon-validity'>有效期：{item.expire_day}天有效</View>
          <View className='money-box'>
            <View className='member-box'>
              <View className='member-name'>会员价￥</View>
              <View className='member-money'>29.9</View>
            </View>
            <View className='member-label'>
              升级会员可再省￥1.39
              <Image className='goto' src={require('@/assets/index/go-to.png')} />
            </View>
            {/* <View className='member-label1'>
              分享可得佣金￥1.39
            </View> */}
          </View>
          {/* <View className='coupon-button'>抢购</View> */}
          <View className='coupon-button1'>立即推广</View>
        </View>
      </View>
    )
  }
}
