import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import './index.less'
import MemberTab from './components/memberTab'
export default class Member extends Component {
    config = {
        navigationBarTitleText: "会员",
        enablePullDownRefresh: false,
        navigationBarBackgroundColor: '#ff4444',
        navigationBarTextStyle: 'white'
    };




    copyBtn = (e) => {
        Taro.setClipboardData({
            data: '邀请码：BH9527',
            success: function (res) {
                Taro.getClipboardData({
                    success: function (res) {
                        console.log(res.data) // data
                    }
                })
            }
        })
    }

    goto = () => {
      Taro.navigateTo({
        url: '/business-pages/member-level/index'
      })
    }

    render() {
        return (
            <View className="member-page" onClick={() => {
                Taro.navigateTo({
                    url: '/business-pages/fan-data/index'
                })
            }}>

                <View className="member-page-personal">
                    <Image className="member-page-personal-left" src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
                    <View className="member-page-personal-right">
                        <View className="member-page-personal-row">
                            <View className="member-page-personal-title">小熊敬礼用户</View>
                            {/* <Image className="member-page-personal-label" src="http://oss.tdianyi.com/front/sCdc3MZektR5JfTBsMiP4bxKdaDXCGBE.png" /> */}
                            <Image className="member-page-personal-label" src="http://oss.tdianyi.com/front/yFiASnipf36jW8CTnRHRrQpDNNWwmx7x.png" />
                        </View>
                        <View className="member-page-personal-row" onClick={this.copyBtn}>
                            <View className="member-page-personal-item">邀请码：BH9527</View>
                            <View className="member-page-personal-item-copy">复制</View>
                        </View>
                    </View>
                </View>
                <View className="member-page-activeValue">活跃值:2000</View>


                <View className="member-page-playMethods">
                    <View className="member-page-playMethods-left">
                        <Image className="member-page-playMethods-left-icon" src="http://oss.tdianyi.com/front/3MrMr4xiExhFiwXs4f3nGDChe45QaK5j.png" />
                        <View className="member-page-playMethods-left-info">会员等级玩法介绍</View>
                    </View>
                    <View className="member-page-playMethods-right">
                        <View className="member-page-playMethods-right-info">了解详情</View>
                        <Image className="member-page-playMethods-right-icon" src="http://oss.tdianyi.com/front/AeDfZdwfppksiMzNKwxK8e2K5DEfsbpp.png" />
                    </View>
                </View>

                <View className="member-page-bill">
                    <View className="member-page-bill-left">我的账单</View>
                    <View className="member-page-bill-right">
                        <View className="member-page-bill-right-info">去提现</View>
                        <Image className="member-page-bill-right-icon" src="http://oss.tdianyi.com/front/EaMDtiM388m4BwmGa3yzH5GKw82Xh3SX.png" />
                    </View>
                </View>

                <MemberTab title='我的粉丝/店铺' tabItem={[{ num: 100, unit: '个', text: '测试' }, { num: 100, unit: '个', text: '测试' }, { num: 100, unit: '个', text: '测试' }]} onAction={() => { }} question={true} />
                <MemberTab title='社群收益' tabItem={[{ num: 100, unit: '个', text: '测试' }, { num: 100, unit: '个', text: '测试' }, { num: 100, unit: '个', text: '测试' }, { num: 100, unit: '个', text: '测试' }]} onAction={() => { }} question={true} />
                <View className="member-page-sign" onClick={this.goto}>注册会员升级成为创客，赚取更多佣金</View>
                <MemberTab title='邀请店铺收益' tabItem={[]} onAction={() => { }} question={true} />
                <MemberTab title='邀请运营中心收益' tabItem={[]} onAction={() => { }} question={true} />




            </View>
        );
    }
}
