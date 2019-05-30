import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.styl";
import "../set-meal/index";
import { AtIcon } from "taro-ui";
import CashCoupon from '../../components/cash-coupon'
import MobileImg from '../../assets/dianhua.png'
import AddressImg from '../../assets/address.png'

export default class PaySuccess extends Component {
  config = {
    navigationBarTitleText: "优惠信息"
  };

  state = {
  };

  componentWillMount() {
  }
  componentDidMount() {
  }

  render() {
    return (
        <View className="set-meal">
          <View className=" pd30 bcff">
            <View className="ticket-buy-view">
                <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg"/>
                <View className="hd tit">洛溪路店</View>
                <View className="bd money">¥50</View>
                <View className="ft">
                <View className="desc">满199可用</View>
                <View className="tags">
                    <Text className="tag-text">可叠加</Text>
                    <Text className="tag-text">随时退</Text>
                    <Text className="tag-text">免预约</Text>
                </View>
                </View>
            </View>
          </View>
          <View className="shop mt20 pd30 bcff">
            <View className="set-meal__tit">
              <Text className="fwb">优惠信息</Text>
            </View>
            <View className="flex center">
              <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg"/>
              <View className="item">
                <View className="tit">洛溪店</View>
                <View className="money">人均：￥222.00</View>
              </View>
              <AtIcon value="chevron-right" color="#999" size="24px"/>
            </View>  
            <View className="address-view flex center">
              <Image className="address-image" src={AddressImg}/>
              <View className="distance">2.6m</View>
              <View className="text flex-item">南洲路北晓港湾樱花街道27-55号11...</View>
              <Image className="mobile-image" src={MobileImg}/>
            </View>
          </View> 
          <View className="remark mt20 pd30 bcff">
            <View className="set-meal__tit">
              <Text className="fwb">购买须知</Text>
            </View>
            <View>
              <View className="label">有效期：</View>
              <View className="label-value">购买后6天内有效</View>
              <View className="label">使用规则：</View>
              <View className="label-value">·使用规则使用规则使用规则使用规则，使用规则使用 
</View>
            </View>
            <View className="ft-more flex center">查看更多<AtIcon value="chevron-right" color="#999" size="16px"/></View>
          </View> 
          <View className="graphic-details bt20 pd30 bcff">
            <View className="set-meal__tit">
              <Text className="fwb">图文详情</Text>
            </View>
            <View>
              <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg"/>
            </View>
            <View className="ft-more flex center">查看更多<AtIcon value="chevron-right" color="#999" size="16px"/></View>
          </View>
          <View className="examine-more mt20 pd30 bcff">
            <View className="set-meal__tit">
              <Text className="fwb">更多本店宝贝</Text>
            </View>
            <CashCoupon />
            <CashCoupon />
          </View>
          <View className="occupied">
            <View className="layer-ft-buy flex">
              <View className="money">￥<Text className="count">10</Text></View>
              <View><Button className="btn-buy">立即抢购</Button></View>
            </View>
          </View>
        </View>
    );
  }
}