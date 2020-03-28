import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast, AtTabs, AtTabsPane } from "taro-ui";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { groupOrderInfo, toWxPay, getUserYouhuiGroupId } from "./service";
import { getLocation } from "@/utils/getInfo";

export default class distributionDetail extends Component {
    config = {
        navigationBarTitleText: "拼团活动购买订单页",
        enablePullDownRefresh: false
    };
    state = {
        chooseGift: false,
        chooseDistribution: false,
        contentboxShow: true,
        sumMoney: 0,
        data: {
            address: {
                id: 0,
                city: "",
                detail: "",
                district: "",
                mobile: "",
                name: "",
                is_default: 0,
                province: ""
            },
            supplier_location: {
                id: 0,
                name: ''
            },
            youhui: {
                activity_id: 0,
                gift_id: 0,
                gift_name: "",
                gift_pic: "",
                gift_price: 0,
                image_url: "",
                is_delivery: 0,
                location_id: 0,
                name: "",
                participation_number: 0,
                pay_money: 0,
                postage: 0,
                supplier_delivery_id: 0,
                supplier_delivery_service_money: 0,
                youhuiHour: 0,
                youhui_id: 0,
            },
            team_set_end_time: ''
        }
    }
    componentDidShow() {
        let data;
        this.setState({ contentboxShow: false })
        let pages = Taro.getCurrentPages();
        let currPage = pages[pages.length - 1];
        if (currPage.data.fromPage == "editor") {
            this.setState({
                activityType: currPage.data.parmsData.activityType,
                address_id: currPage.data.parmsData.address_id,
                id: currPage.data.parmsData.id,
                storeName: currPage.data.parmsData.storeName,
                groupId: currPage.data.parmsData.activityType == '55' ? currPage.data.parmsData.groupId : undefined,
            })
            if (currPage.data.parmsData.address_id) {
                data = {
                    youhui_id: currPage.data.parmsData.id,
                    address_id: currPage.data.parmsData.address_id
                }
            } else {
                data = { youhui_id: currPage.data.parmsData.id }
            }
            this.groupOrderInfo(data)
        } else {
            this.setState({
                activityType: this.$router.params.activityType,
                address_id: this.$router.params.address_id,
                id: this.$router.params.id,
                storeName: this.$router.params.storeName,
                groupId: this.$router.params.activityType == '55' ? this.$router.params.groupId : undefined,
            })
            if (this.$router.params.address_id) {
                data = { youhui_id: this.$router.params.id, address_id: this.$router.params.address_id }
            } else {
                data = { youhui_id: this.$router.params.id }
            }
            this.groupOrderInfo(data)
        }
    }

    /**
     * 请求数据
     * @param data 活动id，地址id可选
     */
    groupOrderInfo = (data: object) => {
        groupOrderInfo(data)
            .then((res: any) => {
                if (res.code == 200) {
                    this.setState({ data: res.data }, () => { this.calculateSumMoney() })
                } else {
                    Taro.showToast({ title: res.message, icon: 'none' })
                }
            }).catch((err) => {
                console.log(err);
                Taro.showToast({ title: '加载失败', icon: 'none' })
            })
    }

    /**
     * 没有地址，新增并使用
     */
    goToEditor = () => {
        if (this.$router.params.activityType == '55') {
            Taro.navigateTo({
                url: '/activity-pages/Shipping-address/editor?type=useItem&activityType=55&goodsId=' + this.$router.params.id + '&groupId=' + this.$router.params.groupId + '&storeName=' + this.$router.params.storeName
            })
        } else {
            Taro.navigateTo({
                url: '/activity-pages/Shipping-address/editor?type=useItem&activityType=' + this.$router.params.activityType + '&goodsId=' + this.$router.params.id + '&storeName=' + this.$router.params.storeName
            })
        }
    }

    /**
     * 去店铺
     */
    goToStore = () => {
        Taro.navigateTo({
            url: '/pages/business/index?id=' + this.state.data.supplier_location.id
        })
    }

    /**
     * 换地址
     */
    goToAddressList = () => {
        if (this.$router.params.activityType == '55') {
            Taro.navigateTo({
                url: '/activity-pages/confirm-address/chooseAddress?activityType=55&goodsId=' + this.$router.params.id + '&groupId=' + this.$router.params.groupId + '&storeName=' + this.$router.params.storeName
            })
        } else {
            Taro.navigateTo({
                url: '/activity-pages/confirm-address/chooseAddress?activityType=' + this.$router.params.activityType + '&goodsId=' + this.$router.params.id + '&storeName=' + this.$router.params.storeName
            })
        }
    }

    /**
     * 选礼品
     */

    chooseGiftItem = () => {
        this.setState({ chooseGift: !this.state.chooseGift }, () => { this.calculateSumMoney(); })
    }

    /**
     * 选配送
     */
    chooseDistributionItem = () => {
        this.setState({ chooseDistribution: !this.state.chooseDistribution }, () => { this.calculateSumMoney(); })
    }

    /**
     * 总金额计算
     */
    calculateSumMoney = () => {
        let sum = Number(this.state.data.youhui.pay_money);
        if (this.state.chooseGift) { sum = sum + Number(this.state.data.youhui.postage) }
        if (this.state.chooseDistribution) { sum = sum + Number(this.state.data.youhui.supplier_delivery_service_money) }
        this.setState({ sumMoney: sum })
    }

    /**
     * 支付
     */
    payment = () => {
        let that = this;
        if ((!this.state.data.address || !this.state.data.address.detail) &&
            (
                (this.state.data.youhui.gift_id && this.state.chooseGift) ||
                (this.state.chooseDistribution && this.state.data.youhui.is_delivery)
            )
        ) {
            this.setState({ contentboxShow: true })
            return;
        }
        Taro.showLoading({ title: 'loading', mask: true });
        let _tempid = this.$router.params.groupId ? this.$router.params.groupId : undefined;
        let _temptype = this.$router.params.activityType;
        let data = {
            public_type_id: this.$router.params.activityType == '55' ? this.$router.params.groupId : this.$router.params.id,
            activity_id: this.state.data.youhui.activity_id,
            gift_id: this.state.chooseGift && this.state.data.youhui.gift_id ? this.state.data.youhui.gift_id : undefined,
            is_distribution: this.state.chooseDistribution && this.state.data.youhui.is_delivery ? 1 : 0,
            type: this.$router.params.activityType,
            address_id: this.state.data.address && this.state.data.address.id ? this.state.data.address.id : undefined,
            xcx: 1,
            number: 1,
            open_id: Taro.getStorageSync("openid"),
            unionid: Taro.getStorageSync("unionid"),
        };
        toWxPay(data).then((res: any) => {
            Taro.hideLoading();
            if (res.code == 200) {
                let order_sn = res.channel_order_sn;//比增值少一层data
                Taro.requestPayment({
                    timeStamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    package: res.data.package,
                    signType: res.data.signType,
                    paySign: res.data.paySign,
                    success(res) {
                        if (_temptype == '5') {
                            //开团要得到开团活动id再跳转活动详情
                            that.getLastGroupId(order_sn);
                        } else if (_temptype == '55') {
                            that.goToGroupInfo(_tempid);
                        }
                    },
                    fail(err) {
                        Taro.showToast({ title: '支付失败', icon: 'none' })
                    }
                })
            } else {
                Taro.showToast({ title: res.message, icon: 'none' })
            }
        }).catch(err => {
            Taro.showToast({ title: '调起支付失败', icon: 'none' })
        })
    }
    /**
      * 发团支付后查询团id跳转
      *  @param {object} order_sn 订单号
      */
    getLastGroupId = (order_sn) => {
        let that = this;
        Taro.showLoading({ title: '支付成功，正在查询用户团活动id', mask: true });
        console.log('getLastGroupId', order_sn)
        let timer = setTimeout(() => {
            clearTimeout(timer);
            getUserYouhuiGroupId({ order_sn: order_sn })
                .then((res: any) => {
                    if (res.code == 200) {
                        Taro.hideLoading();
                        that.goToGroupInfo(res.data.id)
                    } else {
                        console.log('res', res)
                        that.getLastGroupId(order_sn)
                    }
                }).catch((err) => {
                    console.log('err', err)
                    that.getLastGroupId(order_sn)
                })
        }, 1000);
    }

    /**
     * 跳转团详情
     *  @param {object} _tempid 团id
     */
    goToGroupInfo = (_tempid: any) => {
        Taro.navigateTo({
            url: '/pages/activity/pages/group/group?id=' + _tempid,
            success: () => {
                var page = Taro.getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
            }
        })
    }

    render() {
        return (
            <View className="distribution-detail">
                {
                    this.state.contentboxShow ? <View className="no-address-contentbox">
                        <View className="tips-box">
                            <View className="tips-box-info">你还没有收货地址，快去新增一个吧</View>
                            <View className="tips-box-bottomBox">
                                <View className="tips-box-bottomBox_cancle" onClick={() => { this.setState({ contentboxShow: false }) }}>取消</View>
                                <View className="tips-box-bottomBox_go" onClick={this.goToEditor.bind(this)} >去新增</View>
                            </View>
                        </View>
                    </View> : null
                }
                {
                    this.state.data.address && this.state.data.address.name ?
                        <View className="address-red" onClick={this.goToAddressList.bind(this)}>
                            <View className="address-content">
                                {
                                    this.state.data.address.is_default ? <View className="address-label">默认</View> : null
                                }
                                {
                                    this.state.data.address.is_default ?
                                        <View className="address-info">{this.state.data.address.province + this.state.data.address.city + this.state.data.address.district + this.state.data.address.detail}</View>
                                        :
                                        <View className="address-info-normal">{this.state.data.address.province + this.state.data.address.city + this.state.data.address.district + this.state.data.address.detail}</View>
                                }
                                <View className="user-info-label">
                                    <View className="user-name-label">{this.state.data.address.name}</View>
                                    <View className="user-phone-label">{this.state.data.address.mobile}</View>
                                </View>
                                <Image className="address-icon" src={"http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png"} />
                            </View>
                        </View> : null
                }
                <View className="activity-box">
                    <View className="store-content" onClick={this.goToStore.bind(this)}>
                        <View className="store-left">
                            <Image className="store-icon" src="http://oss.tdianyi.com/front/JhGtnn46tJksAaNCCMXaWWCGmsEKJZds.png" />
                            <View className="store-name">{this.state.data.supplier_location.name}</View>
                        </View>
                        <Image className="store-right" src="http://oss.tdianyi.com/front/fpsw5CyhYJQTDEABZhs4iFDdC48ZGidn.png" />
                    </View>
                    <View className="activity-content">
                        <Image className="activity-img" src={this.state.data.youhui.image_url} />
                        <View className="activity-info">
                            <View className="activity-title">{this.state.data.youhui.name}</View>
                            <View className="activity-labels">
                                <View className="activity-label-item">随时退</View>
                            </View>
                            <View className="activity-price-box">
                                <View className="activity-price-icon">￥</View>
                                <View className="activity-price-num">{this.state.data.youhui.pay_money}</View>
                            </View>
                        </View>
                    </View>
                    {
                        this.state.data.youhui.gift_id ?
                            <View className="gift-content" onClick={this.chooseGiftItem.bind(this)}>
                                <View className="gift-choose-area">
                                    {
                                        this.state.chooseGift ?
                                            <Image className="gift-choose-icon" src="http://oss.tdianyi.com/front/mhth4rhHmcW3SmQ8kWiHeNw2NDdYxiwc.png" />
                                            :
                                            <Image className="gift-choose-icon" src="http://oss.tdianyi.com/front/nppTFyPWrnAGC535GBc2mddSfrXAwR5e.png" />

                                    }
                                </View>
                                <View className="gift-info-area">
                                    <Image className="gift-img" src={this.state.data.youhui.gift_pic} />
                                    <View className="gift-info">
                                        <View className="gift-title">{this.state.data.youhui.gift_name}</View>
                                        <View className="gift-labels">
                                            <View className="gift-label-item">价值￥{this.state.data.youhui.gift_price}</View>
                                            <View className="gift-label-item">运费{this.state.data.youhui.postage}元</View>
                                        </View>
                                    </View>
                                </View>
                            </View> : null
                    }
                    {
                        this.state.data.youhui.is_delivery ?
                            <View className="distribution-content" onClick={this.chooseDistributionItem.bind(this)}>
                                <View className="distribution-choose-area">
                                    {
                                        this.state.chooseDistribution ?
                                            <Image className="distribution-choose-icon" src="http://oss.tdianyi.com/front/mhth4rhHmcW3SmQ8kWiHeNw2NDdYxiwc.png" />
                                            :
                                            <Image className="distribution-choose-icon" src="http://oss.tdianyi.com/front/nppTFyPWrnAGC535GBc2mddSfrXAwR5e.png" />
                                    }
                                </View>
                                <View className="distribution-info">
                                    <View className="distribution-tips">选择后，商家将会提高送货上门的服务。</View>
                                    <View className="distribution-labels">
                                        <View className="distribution-label-item">配送费{this.state.data.youhui.supplier_delivery_service_money}元</View>
                                        {/* <View className="distribution-label-item">10km可送</View> */}
                                    </View>
                                </View>
                            </View> : null
                    }

                </View>
                <View className="order-box">
                    <View className='order-title-left-box'>
                        <View className='order-title-left'></View>
                        <View className='order-title'>订单详情</View>
                    </View>
                    <View className='order-item'>
                        <View className='order-item-key'>商品价格</View>
                        <View className='order-item-words'>￥{this.state.data.youhui.pay_money}</View>
                    </View>
                    {
                        this.state.chooseGift ?
                            <View className='order-item'>
                                <View className='order-item-key'>礼品运费</View>
                                <View className='order-item-words'>￥{this.state.data.youhui.postage}</View>
                            </View> : null
                    }{
                        this.state.chooseDistribution ?
                            <View className='order-item'>
                                <View className='order-item-key'>配送金额</View>
                                <View className='order-item-words'>￥{this.state.data.youhui.supplier_delivery_service_money}</View>
                            </View> : null
                    }
                    <View className='order-item-all'>
                        <View className='order-item-all-text'>合计</View>
                        <View className='order-item-all-num'>￥{this.state.sumMoney}</View>
                    </View>
                </View>

                <View className="paymoney_box">
                    <View className="paymoney_price">
                        <View className="paymoney_price_icon">￥</View>
                        <View className="paymoney_price_num">{this.state.sumMoney}</View>
                    </View>
                    <View className="paymoney_buynow" onClick={this.payment.bind(this)} >提交订单</View>
                </View>

            </View>
        );
    }
}
