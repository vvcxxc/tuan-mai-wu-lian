import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import './index.less'
export default class MemberPromotion extends Component {
    config = {
        navigationBarTitleText: "什么是活跃值",
        enablePullDownRefresh: false,
    };




    render() {
        return (
            <View className="member-promotion">
                <View className="member-promotion-img-content">
                    <Image className="promotion-img" mode={'widthFix'} src="http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png" />
                </View>
                <View className="member-promotion-content">
                    <View className="member-promotion-title">介绍规则内容：</View>
                </View>

            </View>
        );
    }
}
