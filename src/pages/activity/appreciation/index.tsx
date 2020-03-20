import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { getYouhuiAppreciationInfo, getShareSign, wxXcxuWechatPay, getUserLastYouhuiId } from "./service";
import ApplyToTheStore from '@/components/applyToTheStore';
import LoginAlert from '@/components/loginAlert';

export default class AppreActivity extends Component {
    config = {
        navigationBarTitleText: "增值活动",
        enablePullDownRefresh: false
    };


    state = {
        //图片轮播下标
        bannerImgIndex: 0,
        //是否从分享链接进入
        isFromShare: false,
        // 登录弹窗
        is_alert: false,
        //查看更多
        showMoreRules: false,
        data: {
            activity_begin_time: "",
            activity_end_time: "",
            activity_time_status: 0,
            address: "",
            begin_time: "",
            imagesCurrent: 0,
            description: [],
            distances: "",
            end_time: "",
            gift: { title: "", price: "", postage: "", mail_mode: 0 },
            gift_id: 0,
            gift_pic: '',
            id: 0,
            image: "",
            images: [],
            init_money: "",
            is_show_button: 0,
            location_name: "",
            name: "",
            pay_money: "",
            preview: "",
            return_money: "",
            store_id: 0,
            supplier_id: 0,
            tel: "",
            total_fee: 0,
            type: 0,
            validity: 0,
            xpoint: "",
            ypoint: "",
            dp_count: 0
        }
    };

    /**
   * 判断从分享链接进入
   * 获取定位
   */
    componentDidShow() {
        let arrs = Taro.getCurrentPages()
        if (arrs.length <= 1) { this.setState({ isFromShare: true }) }
        Taro.showLoading({ title: 'loading' })
        Taro.getLocation({
            type: 'gcj02',
            success: res => {
                this.getAppreInfo({ youhui_id: this.$router.params.id, yPoint: res.latitude || '', xPoint: res.longitude || '' })
            },
            fail: () => {
                this.getAppreInfo({ youhui_id: this.$router.params.id, yPoint: '', xPoint: '' })
            }
        })
    }
    /**
       * 获取增值活动信息
       * @param {object} data 增值id,坐标
       */
    getAppreInfo = (data: object) => {
        getYouhuiAppreciationInfo(data)
            .then((res: any) => {
                Taro.hideLoading();
                if (res.code == 200) {
                    let isPostage = false;
                    if (res.data.gift_id && res.data.gift.mail_mode == 2) { isPostage = true; }
                    this.setState({ data: res.data, isPostage });
                } else {
                    Taro.showToast({ title: '请求失败', icon: 'none' });
                }
            }).catch(err => {
                Taro.hideLoading();
                Taro.showToast({ title: '请求失败', icon: 'none' });
            })
    }

    /**
       * 判断活动是否有礼品，有礼品跳页面，没礼品调起支付
       * 判断是否登录
       */
    goToaConfirm = () => {
        let phone_status = Taro.getStorageSync('phone_status')
        if (phone_status == 'binded' || phone_status == 'bind_success') {
            if (this.state.data.gift_id) {
                Taro.navigateTo({
                    url: '/activity-pages/confirm-address/index?activityType=1&id=' + this.$router.params.id + '&storeName=' + encodeURIComponent(this.state.data.location_name)
                })
            } else {
                this.payment()
            }
        } else {
            this.setState({ is_alert: true })
        }
    }

    /**
    * 支付,不带礼品
    */
    payment = () => {
        let that = this;
        Taro.showLoading({ title: 'loading' })
        let datas = {
            youhui_id: this.$router.params.id,
            activity_id: this.$router.params.activity_id,
            open_id: Taro.getStorageSync("openid"),
            unionid: Taro.getStorageSync("unionid"),
            type: "1",
            xcx: 1
        }
        wxXcxuWechatPay(datas).then((res: any) => {
            Taro.hideLoading();
            if (res.code == 200) {
                let order_sn = res.data.channel_order_sn;
                Taro.requestPayment({
                    timeStamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    package: res.data.package,
                    signType: res.data.signType,
                    paySign: res.data.paySign,
                    success(res) {
                        that.getLastYouhuiId(order_sn)
                    },
                    fail(err) {
                        Taro.showToast({ title: '支付失败', icon: 'none' })
                    }
                })
            } else {
                Taro.showToast({ title: res.message, icon: 'none' })
            }
        }).catch(err => {
            Taro.hideLoading();
            Taro.showToast({ title: "支付失败", icon: "none" });
        })
    }

    /**
     * 查询用户最后一次购买的增值活动id
     * @param {string} order_sn 订单号
     */
    getLastYouhuiId = (order_sn) => {
        let that = this;
        Taro.showLoading({ title: '支付成功，正在查询用户增值活动id' });
        let timer = setTimeout(() => {
            clearTimeout(timer);
            getUserLastYouhuiId({ order_sn: order_sn })
                .then((res: any) => {
                    if (res.code == 200) {
                        Taro.hideLoading();
                        //得到增值活动id并跳转活动详情
                        Taro.navigateTo({
                            url: '/pages/activity/pages/appreciation/appreciation?id=' + res.data.id,
                            success: (e) => {
                                let page = Taro.getCurrentPages().pop();
                                if (page == undefined || page == null) return;
                                page.onShow();
                            }
                        })
                    } else {
                        that.getLastYouhuiId(order_sn)
                    }
                }).catch((err) => {
                    that.getLastYouhuiId(order_sn)
                })
        }, 500);
    }

    /**
     * 去图文详情
     */
    toImgList = () => {
        Taro.navigateTo({
            url: '/detail-pages/gift/gift?gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id
        })
    }

    /**
       * 回首页
       */
    handleGoHome = () => { Taro.navigateTo({ url: '/' }) }

    // 登录弹窗
    loginChange = (type: string) => {
        if (type == 'close') {
            this.setState({ is_alert: false })
        } else {
            // 重新请求当前数据
            this.setState({ is_alert: false })
        }
    }

    render() {
        const { images, description } = this.state.data;
        return (
            <View className="appre-activity-detail">
                <Swiper
                    onChange={(e) => {
                        this.setState({ bannerImgIndex: e.detail.current })
                    }}
                    className='appre-banner'
                    circular
                    autoplay
                >
                    {
                        this.state.data.images.length ? this.state.data.images.map((item, index) => {
                            return (
                                <SwiperItem className="appre-banner-swiperItem" key={item}>
                                    <Image className="appre-banner-img" src={item} />
                                </SwiperItem>
                            )
                        }) : null
                    }
                </Swiper>
                <View className="banner-number-box">
                    <View className="banner-number">{Number(this.state.bannerImgIndex) + 1}</View>
                    <View className="banner-number">{this.state.data.images.length}</View>
                </View>
                <View className="collect-box">
                    <Image className="collect-img" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" />
                </View>
                <View className="share-box">
                    <Image className="share-img" src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
                </View>

                <View className="appre-info-content">
                    <View className="appre-info-title">
                        <View className="appre-info-title-label">增值券</View>
                        <View className="appre-info-title-text">{this.state.data.name}</View>
                    </View>
                    <View className="appre-info-price">
                        <View className="appre-price-info">
                            <View className="appre-price-info-text">优惠价￥</View>
                            <View className="appre-price-info-new">{this.state.data.pay_money}</View>
                        </View>
                        <View className="appre-price-discounts">最高抵用￥{this.state.data.return_money}</View>
                    </View>

                </View>
                <Image className="appre-banner-img" src="http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png" />

                <View className="appre-store-info">
                    <ApplyToTheStore
                        isTitle={true}
                        img={this.state.data.preview}
                        name={this.state.data.location_name}
                        phone={this.state.data.tel}
                        address={this.state.data.address}
                        location={{ xpoint: 111, ypoint: 222 }}
                    />
                </View>

                {
                    this.state.data.gift_id ?
                        <View className="appre-gift">
                            <View className="appre-title-box">
                                <View className='appre-title-left-box'>
                                    <View className='appre-title-left'></View>
                                    <View className='appre-title'>赠送礼品</View>
                                </View>
                                <View className='appre-title-right' onClick={this.toImgList.bind(this)}>
                                    <View className='appre-title-right-info' >查看详情</View>
                                    <Image className="appre-title-right-icon" src={"http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png"} />
                                </View>
                            </View>
                            <View className='appre-gift-brief'>{this.state.data.gift.title}</View>
                            <View className='appre-gift-label-box'>
                                <View className='appre-gift-label'>{
                                    this.state.data.gift.mail_mode == 1 ? '免运费' : `运费${this.state.data.gift.postage}元`
                                }</View>
                            </View>
                            <Image className="appre-gift-img" src={this.state.data.gift_pic} mode={'widthFix'} />
                        </View> : null
                }



                <View className="appre-rules">
                    <View className="appre-title-box">
                        <View className='appre-title-left'></View>
                        <View className='appre-title'>使用说明</View>
                    </View>
                    {
                        this.state.data.type != 0 ?
                            <View className="appre-rules-item" >
                                <View className="rules-key">使用方式：</View>
                                <View className="rules-words">扫码支付时抵用</View>
                            </View> : null
                    }
                    {
                        this.state.data.type != 0 ?
                            <View className="appre-rules-item" >
                                <View className="rules-key"> 使用门槛：</View>
                                <View className="rules-words">满{this.state.data.total_fee}可用</View>
                            </View> : null
                    }
                    <View className="appre-rules-item" >
                        <View className="rules-key">有效期：</View>
                        <View className="rules-words">成团后{this.state.data.validity}日内可用</View>
                    </View>


                    {
                        this.state.data.type == 0 && description.length && !this.state.showMoreRules ? <View>
                            <View className="appre-rules-list-title" >使用规则：</View>                            {
                                description.length > 0 ? <View className="appre-rules-list-text" >-{description[0]}</View> : null
                            }
                            {
                                description.length > 1 ? <View className="appre-rules-list-text" >-{description[1]}</View> : null
                            }
                            {
                                description.length > 2 ? <View className="appre-rules-list-text" >-{description[2]}</View> : null
                            }
                            {
                                description.length > 3 ? <View className="appre-rules-list-text" >-{description[3]}</View> : null
                            }
                        </View> : null
                    }
                    {
                        this.state.data.type == 0 && description.length && description.length > 4 && this.state.showMoreRules ? <View>
                            <View className="appre-rules-list-title" >使用规则：</View>
                            {
                                description.map((item) => {
                                    return (
                                        <View className="appre-rules-list-text" >-{item}</View>
                                    )
                                })
                            }
                        </View> : null
                    }
                    {
                        description.length && description.length > 4 && !this.state.showMoreRules ? <View className="appre-more" onClick={() => { this.setState({ showMoreRules: true }) }} >
                            <Image className="appre-more-icon" src={"http://oss.tdianyi.com/front/GQr5D7QZwJczZ6RTwDapaYXj8nMbkenx.png"} />
                            <View className="appre-more-text" >查看更多</View>
                        </View> : null
                    }
                </View>
                <View className="appre-buy-box" >
                    <View className="appre-buy-price-box" >
                        <View className="appre-buy-price-icon" >￥</View>
                        <View className="appre-buy-price-num" >{this.state.data.pay_money}</View>
                    </View>
                    <View className="appre-buy-btn-box" >
                        <View className="appre-buy-btn-left" >分享活动</View>
                        {
                            this.state.data.activity_time_status == 1 ? (
                                <View className="appre-buy-btn-right" >暂未开始</View>
                            ) : this.state.data.activity_time_status == 2 ? (
                                <View className="appre-buy-btn-right" onClick={this.goToaConfirm.bind(this)}>立即购买</View>
                            ) : this.state.data.activity_time_status == 3 ? (
                                <View className="appre-buy-btn-right">已结束</View>
                            ) : null
                        }
                    </View>
                </View>
                {
                    this.state.is_alert ? <LoginAlert onChange={this.loginChange} /> : null
                }

                {/* 去首页 */}
                {
                    this.state.isFromShare ? (
                        <View style={{ position: 'fixed', bottom: '50%', right: '20px', zIndex: 88 }} onClick={this.handleGoHome.bind(this)}>
                            <Image src={require('../../../assets/go_home.png')} className="go_home" />
                        </View>
                    ) : ''
                }
            </View>
        );
    }
}
