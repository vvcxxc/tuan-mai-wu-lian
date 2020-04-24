import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";

export default class memberPlayingMethod extends Component {
    config = {
        navigationBarTitleText: "会员等级玩法介绍",
        enablePullDownRefresh: false
    };
    state = {
        fanTabIndex: 0,
        noData: false,
    }

    render() {
        return (
            <View className="member-playingMethod">
                <View className="member-playingMethod-content">
                    <View className="member-playingMethod-title">会员等级玩法介绍：</View>
                    <View className="member-playingMethod-item">
                        <View className="member-playingMethod-item-key">提示：</View>
                        <View className="member-playingMethod-item-word">小熊敬礼大家庭欢迎您的加入，马上开启第一桶金</View>
                    </View>
                    <View className="member-playingMethod-item">
                        <View className="member-playingMethod-item-key">分享：</View>
                        <View className="member-playingMethod-item-word">分享产品给消费者，消费者即可成为注册会员；当所 属你的会员，之后在平台上每次消费均有属于您的佣金</View>
                    </View>
                    <View className="member-playingMethod-item">
                        <View className="member-playingMethod-item-key">步骤：</View>
                        <View className="member-playingMethod-item-word">
                            <View className="item-text">1.建立微信群</View>
                            <View className="item-text">2.选择平台的一个产品，点击分享发到群，群员点击 链接进入平台，即成为推荐的注册会员</View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
