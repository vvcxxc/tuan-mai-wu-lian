import Taro, { Component } from "@tarojs/taro"
import { View, Image, Text, Button } from "@tarojs/components"
import "./index.styl";

interface Props {
  data: any;
}
export default class AppreCoupon extends Component<Props> {
  static defaultProps: Props = {
    data: {
      money:"",
      limit_money: '',
      gift_image: ''
    }
  }

  state = {
    item: {
      gift_pic: '1',
      return_money: '2',
      pay_money: '11'
    },
    money: '',
    limit_money: '',
    gift_image: ''
  }
  render() {
    const { money, limit_money, gift_image, youhui_type } = this.props.data
    console.log(this.props.data,'222')
    return (
      <View>
            <View>
              <View className="image-list" style={{ position: "relative", marginBottom: "5px" }}>
                {
                  this.props.data.gift_image == "" ? <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/bMGJKGX2JcKWbs8JEypeiB7CAbd4wAz4.png"} /> :
                    <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/andhNY3XKEWrW8nYBK5pyAptaJWeJz68.png"} />
                }
                <View className="img" style={{ width: "100%" }}   >
                  <View className="box_left">
                    <View className='max_text'>最高可抵</View>
                    <View>
                      <Text style={{ fontSize: '14px', color: '#EE3131', fontWeight: 600 }}>￥</Text>
                      <Text style={{ fontSize: '22px', color: '#EE3131', lineHeight: 1 }}>{this.props.data.money}</Text>
                    </View>
                  </View>
                  <View className="box_center">
                    <View className='box_center_main'>
                      <View className='coupon_label'>全场通用</View>
                      <View className='coupon_tips'>满{this.props.data.limit_money}元可用</View>
                    </View>
                  </View>
                  <View className="box_right" style={{ overflow: "hidden" }}>
                    <Image className="image" src={this.props.data.gift_image} style={{ width: "100%", height: "100%" }} />
                  </View>
                </View>
              </View>
            </View>
      </View>
    )
  }
}
