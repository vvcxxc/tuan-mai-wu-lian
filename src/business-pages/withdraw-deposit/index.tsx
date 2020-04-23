import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import './index.less'
export default class WithdrawDeposit extends Component {
    config = {
        navigationBarTitleText: "我的账户",
        enablePullDownRefresh: false,
    };




    render() {
        return (
            <View className="withdraw-deposit">

                <View className="withdraw-deposit-content">
                    <View className="withdraw-deposit-left">未绑定银行卡</View>
                    <View className="withdraw-deposit-right">
                        <View className="withdraw-deposit-right-info">去绑定</View>
                        <Image className="withdraw-deposit-right-icon" src="http://oss.tdianyi.com/front/EaMDtiM388m4BwmGa3yzH5GKw82Xh3SX.png" />
                    </View>
                </View>

                <View className="withdraw-deposit-content">
                    <View className="withdraw-deposit-bankcard">
                        <Image className="withdraw-deposit-bankcard-img" src="http://oss.tdianyi.com/front/EaMDtiM388m4BwmGa3yzH5GKw82Xh3SX.png" />
                        <View className="withdraw-deposit-bankcard-box">
                            <View className="withdraw-deposit-bankcard-name">中国交通银行</View>
                            <View className="withdraw-deposit-bankcard-num">**** **** **** 1234</View>
                        </View>
                    </View>
                </View>



                <View className="withdraw-deposit-takeMoney">
                    <View className="withdraw-deposit-takeMoney-info">
                        <View className="withdraw-deposit-takeMoney-info-key">可提现收益：</View>
                        <View className="withdraw-deposit-takeMoney-info-word">100.00元</View>
                    </View>
                    <View className="withdraw-deposit-takeMoney-input-area">

                        <View className="withdraw-deposit-takeMoney-input-btn">全部提现</View>

                    </View>
                    <View className="withdraw-deposit-takeMoney-msg">每个月15-18号、28-30号可申请提现</View>

                </View>




            </View>
        );
    }
}
