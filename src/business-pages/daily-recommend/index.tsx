import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.styl";
import { AtIcon } from "taro-ui";


export default class PaySuccess extends Component {
  config = {
    navigationBarTitleText: "今日推荐"
  };

  state = {
  };

  componentWillMount() {
  }
  componentDidMount() {
  }

  render() {
    return (
        <View className="daily-recommend">
          <View className="top-success">
            <View className="status">已领取</View>
            <View>关注“<Text className="c2649FD">公众号</Text>”获取更多优惠信息</View>
          </View>
          <ScrollView scrollX className="tabs-view bcfff">
            <View className="flex">
              <View className="tab-text active">为你推荐</View>
              <View className="tab-text">为你推荐</View>
              <View className="tab-text">为你推荐</View>
              <View className="tab-text">为你推荐</View>
              <View className="tab-text">为你推荐</View>
            </View>
          </ScrollView>
          <View className="sort bcfff flex">
            <Text className="sort-text active">智能排序</Text>
            <Text className="sort-text">距离优先</Text>
          </View>
          <ScrollView scrollY className="scroll-view">
            <View className="shop-cell">
              <View className="flex center shop-cell__bd">
                <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg"/>
                <View className="item content ">
                  <View className="flex center mb10">  
                    <Text className="item">华润万家（广州东晓南121号店）</Text>
                    <AtIcon value="chevron-right" color="#999" size="16px"/>
                  </View>
                  <View className="flex center fs24 c666 mb10">
                    <Text>便利店</Text>
                    <Text>660m</Text>
                  </View>
                  <ScrollView scrollX>
                    <View className='scroll-flex'>
                      <Text className="tag-view active">免费礼品</Text>
                      <Text className="tag-view">优秀商家</Text>
                      <Text className="tag-view">现金券</Text>
                    </View>
                  </ScrollView>
                </View>
              </View>
              <View className="adv-cells">
                <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg"/>
                <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg"/>
              </View>
              <View className="present flex">
                <View className="label flex center">券</View>
                <View className="desc item">拼西西咖啡店(珞喻路)餐券<Text className="cc71d0b">送价值3000元</Text>耳机...</View>
                <View className="count">1.4万已领</View>
              </View>
            </View>
          </ScrollView>
        </View>
    );
  }
}
