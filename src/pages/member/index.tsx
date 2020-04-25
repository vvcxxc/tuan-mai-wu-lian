import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import './index.less';
import MemberTab from './components/memberTab';
import { getUser } from './service';

export default class Member extends Component {
    config = {
        navigationBarTitleText: "会员",
        enablePullDownRefresh: false,
        navigationBarBackgroundColor: '#ff4444',
        navigationBarTextStyle: 'white'
    };

    state = {
        tipsShow: false,
        tipsTitle: '什么是活跃值',
        tipsText: '按产品销售佣金1元等于1个活跃值',
        data: {
            active_value: "",
            advertising_revenue: "",
            coupon_premium: "",
            direct_maker: "",
            estimated_platform_rewards: "",
            estimated_sales_revenue: "",
            estimated_total_revenue: "",
            grade: "",
            head_portrait: "",
            id: "",
            invite_member: "",
            invite_store: "",
            rate_income: "",
            total_maker: "",
            user_name: "",

            estimated_order: "",
            invitation_code: "",
            operation_center_number: "",
            operation_center_revenue: "",
            shop_total_revenue: "10",
            subsidy_income: ""


        },
        list1: [],
        list2: [],
        list3: [],
        list4: [],
    }

    componentDidShow() {
        let phone_status = Taro.getStorageSync('phone_status')
        Taro.setStorageSync('order_type', '');
        if (phone_status == 'binded' || phone_status == 'bind_success') {
            getUser().then((res: any) => {
                let data = res.data;
                let list1 = [{ num: data.invite_member, unit: '人', text: '注册会员' }, { num: data.direct_maker, unit: '人', text: '直属创客' }, { num: data.total_maker, unit: '人', text: '创客总数' }, { num: data.invite_store, unit: '家', text: '邀请店铺' }];
                let list2 = [{ num: data.estimated_sales_revenue, unit: '元', text: '预估销售收益' }, { num: data.estimated_platform_rewards, unit: '元', text: '预估平台奖励' }, { num: data.subsidy_income, unit: '元', text: '补贴收益' }, { num: data.estimated_total_revenue, unit: '元', text: '预估总收益' }];
                let list3 = [{ num: data.rate_income, unit: '元', text: '费率收益' }, { num: data.estimated_order, unit: '元', text: '预估订单收益' }, { num: data.advertising_revenue, unit: '元', text: '广告收益' }, { num: data.shop_total_revenue, unit: '元', text: '总收益' }];
                let list4 = [{ num: data.operation_center_number, unit: '家', text: '邀请运营中心' }, { num: data.operation_center_revenue, unit: '元', text: '总收益' }];
                this.setState({ data, list1, list2, list3, list4 })
            })
        } else {
            Taro.navigateTo({ url: '/pages/auth/index' })
        }
    }

    /**
     * 复制文字
     */
    copyBtn = (e) => {
        let invitation_code = this.state.data.invitation_code;
        Taro.setClipboardData({
            data: invitation_code,
            success: function (res) {
                Taro.getClipboardData({
                    success: function (res) {
                        console.log(res.data) // data
                    }
                })
            }
        })
    }

    /**
     * 会员等级
     */
    goto = () => {
        Taro.navigateTo({
            url: '/business-pages/member-level/index'
        })
    }

    /**
     * 列表
     */
    toPlayMethod = () => {
        Taro.navigateTo({
            url: '/business-pages/member-playingMethod/index'
        })
    }

    /**
     * 列表
     */
    toFanData = () => {
        Taro.navigateTo({
            url: '/business-pages/fan-data/index'
        })
    }

    /**
     * 提现
     */
    takeMoney = () => {
        Taro.navigateTo({
            url: '/business-pages/withdraw-deposit/index'
        })
    }

    render() {
        const { data, list1, list2, list3, list4 } = this.state;
        return (
            <View className="member-page" >
                <View className="member-page-personal">
                    <Image className="member-page-personal-left" src={data.head_portrait} />
                    <View className="member-page-personal-right">
                        <View className="member-page-personal-row">
                            <View className="member-page-personal-title">{data.user_name}</View>
                            {/* <Image className="member-page-personal-label" src="http://oss.tdianyi.com/front/sCdc3MZektR5JfTBsMiP4bxKdaDXCGBE.png" /> */}
                            <Image className="member-page-personal-label" src="http://oss.tdianyi.com/front/yFiASnipf36jW8CTnRHRrQpDNNWwmx7x.png" />
                        </View>
                        {/* data.grade */}
                        <View className="member-page-personal-row" onClick={this.copyBtn}>
                            <View className="member-page-personal-item">邀请码：BH9527</View>
                            <View className="member-page-personal-item-copy">复制</View>
                        </View>
                    </View>
                </View>
                <View className="member-page-activeValue">活跃值:{data.active_value}</View>


                <View className="member-page-playMethods" onClick={this.toPlayMethod}>
                    <View className="member-page-playMethods-left">
                        <Image className="member-page-playMethods-left-icon" src="http://oss.tdianyi.com/front/3MrMr4xiExhFiwXs4f3nGDChe45QaK5j.png" />
                        <View className="member-page-playMethods-left-info">会员等级玩法介绍</View>
                    </View>
                    <View className="member-page-playMethods-right">
                        <View className="member-page-playMethods-right-info">了解详情</View>
                        <Image className="member-page-playMethods-right-icon" src="http://oss.tdianyi.com/front/AeDfZdwfppksiMzNKwxK8e2K5DEfsbpp.png" />
                    </View>
                </View>

                <View className="member-page-bill" >
                    <View className="member-page-bill-left">我的账单</View>
                    <View className="member-page-bill-right" onClick={this.takeMoney}>
                        <View className="member-page-bill-right-info">去提现</View>
                        <Image className="member-page-bill-right-icon" src="http://oss.tdianyi.com/front/EaMDtiM388m4BwmGa3yzH5GKw82Xh3SX.png" />
                    </View>
                </View>

                <MemberTab title={'我的粉丝/店铺'} questionAction={() => { this.setState({ tipsShow: true }) }} tabItem={list1} onAction={this.toFanData} question={true} />
                <MemberTab title={'社群收益'} questionAction={() => { this.setState({ tipsShow: true }) }} noMore={true} tabItem={list2} onAction={() => { }} question={true} />
                <View className="member-page-sign" onClick={this.goto}>注册会员升级成为创客，赚取更多佣金</View>
                <MemberTab title={'邀请店铺收益'} questionAction={() => { this.setState({ tipsShow: true }) }} noMore={true} tabItem={list3} onAction={() => { }} question={true} />
                <MemberTab title={'邀请运营中心收益'} questionAction={() => { this.setState({ tipsShow: true }) }} noMore={true} tabItem={list4} onAction={() => { }} question={true} />

                {
                    this.state.tipsShow ? <View className='mark'>
                        <View className='mark-main'>
                            <View className='title'>{this.state.tipsTitle}</View>
                            <View className='text'>{this.state.tipsText}</View>
                            <View className='button' onClick={() => this.setState({ tipsShow: false })}>确定</View>
                        </View>
                    </View> : null
                }


            </View>
        );
    }
}
