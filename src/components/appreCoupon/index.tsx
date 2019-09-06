import Taro, { Component } from "@tarojs/taro"
import { View, Image, Text, Button } from "@tarojs/components"

export default class AppreCoupon extends Component {
  state = {
    item: {
      gift_pic: '',
      return_money: ''
    }
  }
  render (){
    const { item } = this.state
    return (
      <View className="image-list" style={{ position: "relative", marginBottom: "5px" }}>
      {
        item.gift_pic == "" ? <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/bMGJKGX2JcKWbs8JEypeiB7CAbd4wAz4.png"} /> :
          <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/andhNY3XKEWrW8nYBK5pyAptaJWeJz68.png"} />
      }
      <View className="img" style={{ width: "100%" }}   >
        <View className="box_left">
          <View className="box_left_price">￥ <View className="_price">{item.pay_money}</View></View>
          <View className="box_left_return">最高可抵{parseInt(item.return_money)}元</View>
        </View>
        <View className="box_center">
          {/* 使用stylus时多行文本省略要写父容器行内 */}
          <View className="present" style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-camp:2;overflow:hidden"><View className="present_text">{}</View></View>
          <View className="present_recommend">{}</View>
        </View>
        <View className="box_right" style={{ overflow: "hidden" }}>
          <Image className="image" src={} style={{ width: "100%", height: "100%" }} />
        </View>
      </View>
    </View>
    )
  }
}
