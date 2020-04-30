import Taro, { Component } from '@tarojs/taro';
import './index.styl';
import { View, Image, Text } from '@tarojs/components';
import { accSubtr } from '@/utils/common'
interface Props {
  item: any;
  onAction: any;
  is_level: boolean;
  userGroupId: Number;
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
    if(item){
      const is_share = item.is_share || 0
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

  }

  goto = (e: any) => {
    console.log(this.props.userGroupId)
    if(this.props.userGroupId == 5){
      Taro.navigateTo({
        url: '/business-pages/membership-upgrade/index'
      })
    }else if(this.props.userGroupId == 0){
      Taro.navigateTo({
        url: '/pages/auth/index'
      })
    }
    e.stopPropagation()
  }


  render() {
    const { item, is_level } = this.props
    return (
      <View className='coupon-box' onClick={this.handleClick.bind(this, item)}>
        <Image className='coupon-img' src={'http://oss.tdianyi.com/' + item.icon} />
        <View className='coupon-detail'>
          <View>
          <View className='coupon-title'>
            <View className='coupon-type'>
              {this.couponType(item)}
            </View>
            <Text>
              {item.name}
            </Text>
          </View>
          <View className='coupon-validity'>有效期：{item.expire_day}天有效</View>
          </View>

          <View className='money-box'>
            <View className='store-money-box'>
              门市价￥{item.return_money}
            </View>
            <View className='member-box'>
              <View className='member-name'>会员价￥</View>
              <View className='member-money'>{item.is_share == 5 ? item.participation_money : item.pay_money}</View>
            </View>
            {
              item.commission ? <View>
                {
              is_level ? (
                <View className='member-label1'>
              分享可得佣金￥{item.commission}
            </View>
              ) : (
                <View className='member-label' onClick={this.goto}>
                升级会员可再省￥{item.commission}
                <Image className='goto' src={require('@/assets/index/go-to.png')} />
              </View>
              )
            }
              </View> : null
            }

          </View>
          {
            is_level ? <View className='coupon-button1'>立即推广</View> : <View className='coupon-button1'>立即抢购</View>
          }


        </View>
      </View>
    )
  }
}
