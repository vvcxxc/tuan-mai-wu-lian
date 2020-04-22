import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";

export default class Member extends Component {
    config = {
        navigationBarTitleText: "粉丝数据",
        enablePullDownRefresh: false
    };

    render() {
        return (
            <View className="fan-data-page">

                <View className="fan-data-page-tabBar">
                    <View className="fan-data-page-tabBar-item">
                        <View className="fan-data-page-tabBar-item-words"> 注册会员</View>
                    </View>
                    <View className="fan-data-page-tabBar-item"> </View>
                    <View className="fan-data-page-tabBar-item"> </View>
                    <View className="fan-data-page-tabBar-item"> </View>
                </View>
            </View>
        );
    }
}
