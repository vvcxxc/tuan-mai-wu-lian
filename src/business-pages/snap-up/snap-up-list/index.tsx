import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem, Video } from "@tarojs/components";
import "./index.less";

export default class SnapUpList extends Component {
    config = {
        navigationBarTitleText: "参与信息",
        enablePullDownRefresh: false
    };

    state = {

    }


    render() {
        return (
            <View className="snap-up-list">

                <View className="snap-up-item">
                    <View className="snap-up-item-left">
                        <Image className="snap-up-item-left-img" src={'http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png'} />
                        <View className="snap-up-item-left-name">小熊敬礼普通用户</View>
                    </View>
                    <View className="snap-up-item-right">1321-32-23</View>
                </View>
            </View>
        );
    }
}
