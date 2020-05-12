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
        tipsTitle: '',
        tipsText: [],
        data: {
            active_value: "",
            advertising_revenue: "",
            coupon_premium: "",
            direct_maker: "",
            estimated_platform_rewards: "",
            estimated_sales_revenue: "",
            estimated_total_revenue: "",
            grade: '',
            grade_id: 0,
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
            subsidy_income: "",
            upgrade: ''

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
            Taro.showLoading({ title: 'loading', mask: true });
            getUser().then((res: any) => {
                Taro.hideLoading();
                if (res.status_code == 200) {
                    let data = res.data;
                    let list1 = [{ num: data.invite_member, unit: '人', text: '注册会员' }, { num: data.direct_maker, unit: '人', text: '直属创客' }, { num: data.total_maker, unit: '人', text: '创客总数' }, { num: data.invite_store, unit: '家', text: '邀请店铺' }];
                    let list2 = [{ num: data.estimated_sales_revenue, unit: '元', text: '预估销售收益' }, { num: data.estimated_platform_rewards, unit: '元', text: '预估平台奖励' }, { num: data.subsidy_income, unit: '元', text: '补贴收益' }, { num: data.estimated_total_revenue, unit: '元', text: '预估总收益' }];
                    let list3 = [{ num: data.rate_income, unit: '元', text: '费率收益' }, { num: data.estimated_order, unit: '元', text: '订单收益' }, { num: data.advertising_revenue, unit: '元', text: '广告收益' }, { num: data.shop_total_revenue, unit: '元', text: '总收益' }];
                    let list4 = [{ num: data.operation_center_number, unit: '家', text: '邀请运营中心' }, { num: data.operation_center_revenue, unit: '元', text: '总收益' }];
                    this.setState({ data, list1, list2, list3, list4 })
                } else {
                    Taro.showToast({ title: res.message || '请求失败', icon: 'none' })
                }
            }).catch((err) => {
                Taro.hideLoading();
                Taro.showToast({ title: err.message || '请求失败', icon: 'none' })
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
    goQRcode = () => {
        Taro.navigateTo({
            url: '/business-pages/my-qrcode/index'
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

    showListInfo = (index: number) => {
        let titleList = ['我的粉丝/店铺', '社群收益', '邀请店铺收益', '邀请运营中心收益']
        let list = [
            ['本会员邀请用户、店铺数量总计'],
            ['1.预估销售收益：本会员销售产品获得的收益（包括已核销产品及未核销产品的佣金收益）', '2.预估平台奖励：本会员邀请其他会员销售产品获得的邀请奖励收益', '3.额外补贴：商家或平台额外奖励会员用户销售奖励'],
            ['1.费率收益：本会员所开拓商家，使用线下扫码支付时，所产生费率佣金', '2.预估订单收益：本会员拓展的商家，商家在平台销售卡券后（未使用和已使用订单），获得预估订单收益奖励', '3.广告收益：本会员因所拓展的商家展示商圈广告所获得的收益奖励'],
            ['当前会员用户邀请运营中心入驻后，可获得额外运营中心 产生的收益奖励']
        ]
        this.setState({ tipsText: list[index], tipsTitle: titleList[index], tipsShow: true })
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
                            {
                                data.grade_id == 5 ? <Image className="member-page-personal-label" src="http://oss.tdianyi.com/front/CGcd64DyAJAnJk5kCFJERXMAGBPNPPzF.png" /> : (
                                    data.grade_id == 6 ? <Image className="member-page-personal-label" src="http://oss.tdianyi.com/front/hKJDb3t8CiJj5fmFzEY4FiNQzXEataPY.png" /> : (
                                        data.grade_id == 7 ? <Image className="member-page-personal-label" src="http://oss.tdianyi.com/front/2YxRmhGnap4ricS27GbTB4Tc8dY6bBPQ.png" /> : (
                                            data.grade_id == 8 ? <Image className="member-page-personal-label" src="http://oss.tdianyi.com/front/ETTnGxZk6FHaCPBDzaRSpdkjFGGSmpsb.png" /> : null
                                        )
                                    )
                                )
                            }
                        </View>
                        {
                            data.grade_id != 5 ? <View className="member-page-personal-row member-page-personal-bottom" onClick={this.copyBtn}>
                                <View className="member-page-personal-item">邀请码：{data.invitation_code}</View>
                                <View className="member-page-personal-item-copy">复制</View>
                            </View> : null
                        }
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

                <MemberTab title={'我的粉丝/店铺'} questionAction={this.showListInfo.bind(this, 0)} tabItem={list1} onAction={this.toFanData} />
                <MemberTab title={'社群收益'} questionAction={this.showListInfo.bind(this, 1)} noMore={true} tabItem={list2} onAction={() => { }} />
                {
                    data.upgrade ? <View className="member-page-sign" onClick={this.goto}>{data.grade}升级成为{data.upgrade}，赚取更多佣金</View> : null
                }
                <MemberTab title={'邀请店铺收益'} questionAction={this.showListInfo.bind(this, 2)} noMore={true} tabItem={list3} onAction={() => { }} />
                <View className="member-page-sign" onClick={this.goQRcode}>我的店铺邀请码，赚取更多额为奖励</View>
                <MemberTab title={'邀请运营中心收益'} questionAction={this.showListInfo.bind(this, 3)} noMore={true} tabItem={list4} onAction={() => { }} />
                {
                    this.state.tipsShow ? <View className='memberMark'>
                        <View className='mark-main'>
                            <View className='title'>{this.state.tipsTitle}</View>{}
                            <View className='text'>
                                {
                                    this.state.tipsText.length ? this.state.tipsText.map((item: any, index: any) => {
                                        return (
                                            <View className='text-item' key={index} style={{ textAlign: this.state.tipsText.length == 1 ? 'center' : 'left' }}> {item}</View>
                                        )
                                    }) : null
                                }
                            </View>
                            <View className='button' onClick={() => this.setState({ tipsShow: false })}>
                                <View className='button-area'>确定</View>
                            </View>
                        </View>
                    </View> : null
                }
            </View>
        );
    }
}
