import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button, Input, Textarea } from "@tarojs/components";
import "./index.scss";
import "taro-ui/dist/style/components/toast.scss";
import request from '../../services/request'


export default class confirmAddress extends Component {
    config = {
        navigationBarTitleText: "确认订单"
    };

    state = {
        activityType: "",
        address_id: "",
        id: "",
        storeName: "",
        groupId: '',
        contentboxShow: false,
        giftChoice: true,
        coinsChoice: false,
        data: {
            address: {
                city: "",
                detail: "",
                district: "",
                mobile: "",
                name: "",
                is_default: 0,
                province: ""
            },
            youhui: {
                activity_id: 0,
                gift_id: 0,
                gift_name: "",
                gift_pic: "",
                gift_price: 0,
                id: 0,
                image_url: "",
                init_money: 0,
                name: "",
                pay_money: 0,
                postage: 0,
                return_money: 0,
                total_fee: 0,
                youhuiHour: '',
                participation_number: 0
            },
            team_set_end_time: ''
        }
    };

    componentDidShow() {
        let pages = Taro.getCurrentPages();
        let currPage = pages[pages.length - 1];
        console.log('currPage', currPage)
        if (currPage.data.fromPage == "editor") {
            console.log('editor')
            this.setState({
                activityType: currPage.data.parmsData.activityType,
                address_id: currPage.data.parmsData.address_id,
                id: currPage.data.parmsData.id,
                storeName: currPage.data.parmsData.storeName,
                groupId: currPage.data.parmsData.activityType == '55' ? currPage.data.parmsData.groupId : undefined,
            })
            let data;
            if (currPage.data.parmsData.address_id) {
                data = { youhui_id: currPage.data.parmsData.id, address_id: currPage.data.parmsData.address_id }
            } else {
                data = { youhui_id: currPage.data.parmsData.id, }
            }
            console.log('233')
            if (currPage.data.parmsData.activityType == '1') {
                request({
                    url: '/api/wap/user/appreciation/appreciationOrderInfo',
                    method: "GET",
                    data: data
                }).then((res: any) => {
                    if (res.code == 200) {
                        this.setState({ data: res.data })
                    } else {
                        Taro.showToast({ title: '加载失败', icon: 'none' })
                    }

                }).catch((err) => {
                    console.log(err);
                    Taro.showToast({ title: '加载失败', icon: 'none' })
                })

            } else {
                console.log('or')

                request({
                    url: '/api/wap/user/groupOrderInfo',
                    method: "GET",
                    data: data
                }).then((res: any) => {
                    if (res.code == 200) {
                        console.log(res)
                        this.setState({ data: res.data })
                    } else {
                        Taro.showToast({ title: '加载失败', icon: 'none' })
                    }

                }).catch((err) => {
                    console.log(err);
                    Taro.showToast({ title: '加载失败', icon: 'none' })
                })
            }
        }
    }


    componentDidMount() {
        let pages = Taro.getCurrentPages();
        let currPage = pages[pages.length - 1];
        if (currPage.data.fromPage != "editor") {
            console.log(this.state);
            this.setState({
                activityType: this.$router.params.activityType,
                address_id: this.$router.params.address_id,
                id: this.$router.params.id,
                storeName: this.$router.params.storeName,
                groupId: this.$router.params.activityType == '55' ? this.$router.params.groupId : undefined,
            })
            Taro.showLoading({
                title: ""
            });
            let data;
            if (this.state.address_id) {
                data = { youhui_id: this.$router.params.id, address_id: this.$router.params.address_id }
            } else {
                data = { youhui_id: this.$router.params.id }
            }
            if (this.$router.params.activityType == '1') {
                request({
                    url: '/api/wap/user/appreciation/appreciationOrderInfo',
                    method: "GET",
                    data: data
                }).then((res: any) => {
                    if (res.code == 200) {
                        Taro.hideLoading();
                        this.setState({ data: res.data })
                    } else {
                        Taro.hideLoading();
                        Taro.showToast({ title: '加载失败', icon: 'none' })
                    }

                }).catch((err) => {
                    Taro.hideLoading();
                    console.log(err);
                    Taro.showToast({ title: '加载失败', icon: 'none' })
                })

            } else {
                request({
                    url: '/api/wap/user/groupOrderInfo',
                    method: "GET",
                    data: data
                }).then((res: any) => {
                    if (res.code == 200) {
                        Taro.hideLoading();
                        console.log(res)
                        this.setState({ data: res.data })
                    } else {
                        Taro.hideLoading();
                        Taro.showToast({ title: '加载失败', icon: 'none' })
                    }

                }).catch((err) => {
                    Taro.hideLoading();
                    console.log(err);
                    Taro.showToast({ title: '加载失败', icon: 'none' })
                })

            }
        }
    }

    clickGift = (e) => {
        if (this.state.giftChoice == true) {
            this.setState({ giftChoice: false })
        } else {
            if ((!this.state.data.address || !this.state.data.address.detail) && this.state.data.youhui.gift_id) {
                Taro.showToast({ title: '请添加收货地址后再提交', icon: 'none' })
            }
            this.setState({ giftChoice: true, coinsChoice: false })
        }
    }

    clickCoins = (e) => {
        if (this.state.coinsChoice == true) {
            this.setState({ coinsChoice: false })
        } else {
            this.setState({ coinsChoice: true, giftChoice: false })
        }
    }
    goToAddressList = () => {
        if (this.state.activityType == '55') {
            Taro.navigateTo({
                url: '/activity-pages/confirm-address/chooseAddress?activityType=55&goodsId=' + this.state.id + '&groupId=' + this.state.groupId + '&storeName=' + this.state.storeName
            })
        } else {
            Taro.navigateTo({
                url: '/activity-pages/confirm-address/chooseAddress?activityType=' + this.state.activityType + '&goodsId=' + this.state.id + '&storeName=' + this.state.storeName
            })
        }
    }
    //没有地址，新增并使用
    goToEditor = () => {
        if (this.state.activityType == '55') {
            Taro.navigateTo({
                url: '/activity-pages/Shipping-address/editor?type=useItem&activityType=55&goodsId=' + this.state.id + '&groupId=' + this.state.groupId + '&storeName=' + this.state.storeName
            })
        } else {
            Taro.navigateTo({
                url: '/activity-pages/Shipping-address/editor?type=useItem&activityType=' + this.state.activityType + '&goodsId=' + this.state.id + '&storeName=' + this.state.storeName
            })
        }
    }

    payment = () => {
        if ((!this.state.data.address || !this.state.data.address.detail) && this.state.data.youhui.gift_id && this.state.giftChoice) {
            this.setState({ contentboxShow: true })
            return;
        }
        let that = this;
        let data = {};
        let interval;
        let open_id = Taro.getStorageSync("openid");
        let unionid = Taro.getStorageSync("unionid");
        if (this.state.activityType == '1') {
            //1增值
            if (this.state.giftChoice && this.state.data.youhui.gift_id) {
                data = {
                    youhui_id: this.state.id,
                    activity_id: this.state.data.youhui.activity_id,
                    gift_id: this.state.data.youhui.gift_id,
                    open_id: open_id,
                    unionid: unionid,
                    type: 1,// 微信1 支付宝2
                    xcx: 1
                }
            } else {
                data = {
                    youhui_id: this.state.id,
                    activity_id: this.state.data.youhui.activity_id,
                    open_id: open_id,
                    unionid: unionid,
                    type: 1,
                    xcx: 1
                }
            }
            request({
                url: 'v1/youhui/wxXcxuWechatPay',
                method: "POST",
                data
            }).then((res: any) => {
                Taro.hideLoading();
                if (res.code == 200) {
                    let order_sn = res.data.channel_order_sn;
                    // 发起支付
                    Taro.requestPayment({
                        timeStamp: res.data.timeStamp,
                        nonceStr: res.data.nonceStr,
                        package: res.data.package,
                        signType: res.data.signType,
                        paySign: res.data.paySign,
                        success(res) {
                            Taro.showLoading({
                                title: 'loading',
                                mask: true
                            });
                            interval = setInterval(() => {
                                //查询用户最后一次购买的增值活动id
                                request({
                                    url: 'v1/youhui/getUserLastYouhuiId',
                                    method: "GET",
                                    data: { order_sn: order_sn }
                                }).then((res: any) => {
                                    if (res.code == 200) {
                                        clearInterval(interval);
                                        Taro.hideLoading();
                                        //得到增值活动id并跳转活动详情
                                        Taro.navigateTo({
                                            url: '/pages/activity/pages/appreciation/appreciation?id=' + res.data.id,
                                            success: () => {
                                                var page = Taro.getCurrentPages().pop();
                                                if (page == undefined || page == null) return;
                                                page.onLoad();
                                            }
                                        })
                                    }
                                })
                            }, 1000);
                        },
                        fail(err) {
                            Taro.showToast({ title: '支付失败', icon: 'none' })
                        }
                    })
                } else {
                    Taro.showToast({ title: res.message, icon: 'none' })
                }
            })
        } else if (this.state.activityType == '5') {
            //5开团
            if (this.state.giftChoice && this.state.data.youhui.gift_id) {
                data = {
                    public_type_id: this.state.id,
                    activity_id: this.state.data.youhui.activity_id,
                    gift_id: this.state.data.youhui.gift_id,
                    open_id: open_id,
                    unionid: unionid,
                    type: this.state.activityType,//5开团 55拼团
                    xcx: 1,
                    number: 1
                }
            } else {
                data = {
                    public_type_id: this.state.id,
                    activity_id: this.state.data.youhui.activity_id,
                    open_id: open_id,
                    unionid: unionid,
                    type: this.state.activityType,
                    xcx: 1,
                    number: 1
                }
            }
            request({
                url: 'payCentre/toWxPay',
                method: "POST",
                data
            }).then((res: any) => {
                Taro.hideLoading();
                if (res.code == 200) {
                    let order_sn = res.channel_order_sn;//比增值少一层data
                    // 发起支付
                    Taro.requestPayment({
                        timeStamp: res.data.timeStamp,
                        nonceStr: res.data.nonceStr,
                        package: res.data.package,
                        signType: res.data.signType,
                        paySign: res.data.paySign,
                        success(res) {
                            //开团要得到开团活动id再跳转活动详情
                            Taro.showLoading({
                                title: 'loading',
                                mask: true
                            });
                            interval = setInterval(() => {
                                request({
                                    url: 'api/wap/user/getUserYouhuiGroupId',
                                    method: "GET",
                                    data: { order_sn: order_sn }
                                }).then((res: any) => {
                                    if (res.code == 200) {
                                        clearInterval(interval);
                                        Taro.hideLoading();
                                        Taro.navigateTo({
                                            url: '/pages/activity/pages/group/group?id=' + res.data.id,
                                            success: () => {
                                                var page = Taro.getCurrentPages().pop();
                                                if (page == undefined || page == null) return;
                                                page.onLoad();
                                            }
                                        })
                                    }
                                })
                            }, 1000);
                        },
                        fail(err) {
                            // Taro.showToast({ title: '支付失败', icon: 'none' })
                        }
                    })
                } else {
                    Taro.showToast({ title: res.message, icon: 'none' })
                }
            })
        } else if (this.state.activityType == '55') {
            //55参团
            if (this.state.giftChoice && this.state.data.youhui.gift_id) {
                data = {
                    public_type_id: this.state.groupId,
                    activity_id: this.state.data.youhui.activity_id,
                    gift_id: this.state.data.youhui.gift_id,
                    open_id: open_id,
                    unionid: unionid,
                    type: this.state.activityType,
                    xcx: 1,
                    number: 1
                }
            } else {
                data = {
                    public_type_id: this.state.groupId,
                    activity_id: this.state.data.youhui.activity_id,
                    open_id: open_id,
                    unionid: unionid,
                    type: this.state.activityType,
                    xcx: 1,
                    number: 1
                }
            }
            request({
                url: 'payCentre/toWxPay',
                method: "POST",
                data
            }).then((res: any) => {
                Taro.hideLoading();
                if (res.code == 200) {
                    // 发起支付
                    Taro.requestPayment({
                        timeStamp: res.data.timeStamp,
                        nonceStr: res.data.nonceStr,
                        package: res.data.package,
                        signType: res.data.signType,
                        paySign: res.data.paySign,
                        success(res) {
                            Taro.navigateTo({
                                url: '/pages/activity/pages/group/group?id=' + that.state.groupId,
                                success: () => {
                                    var page = Taro.getCurrentPages().pop();
                                    if (page == undefined || page == null) return;
                                    page.onLoad();
                                }
                            })
                        },
                        fail(err) {
                            // Taro.showToast({ title: '支付失败', icon: 'none' })
                        }
                    })
                } else {
                    Taro.showToast({ title: res.message, icon: 'none' })
                }
            })
        } else {
            console.log('不知道啥子类型')
            return;
        }
    }


    render() {
        return (
            <View className="confirm-address">
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
                    !this.state.data.address || !this.state.data.address.name ?
                        <View className="no-address-box" onClick={this.goToEditor.bind(this)}>
                            你的收货地址为空，点击添加收货地址
                    <View className="no-address-msgbox">
                                <AtIcon className="msg_icon" value='chevron-right' color='#b5b5b5' size='30' />
                            </View>
                        </View> : null
                }
                {
                    this.state.data.address && this.state.data.address.name ? <View className="address-msgbox" onClick={this.goToAddressList.bind(this)}>
                        <View className="address-msgbox-left">
                            <View className="address-name-msgbox">
                                <View className="address-name-msgbox-info">
                                    <View className="address-name-msgbox-key">收件人： </View>
                                    <View className="address-name-msgbox-value-box">
                                        <View className="address-msgBox_userBox_name">{this.state.data.address.name}</View>
                                        <View className="address-msgBox_userBox_phone">{this.state.data.address.mobile}</View>
                                    </View>
                                </View>
                                {
                                    this.state.data.address.is_default ? <View className="address-msgBox_userBox_choose">默认 </View> : null
                                }

                            </View>

                            <View className="address-addressInfo-msgbox">
                                <View className="address-address-msgbox-key">收货地址：</View>
                                <View className="address-address-item">{this.state.data.address.province + this.state.data.address.city + this.state.data.address.district + this.state.data.address.detail}</View>
                            </View>
                        </View>
                        <View className="address-msgbox-icon">
                            <AtIcon className="msg_icon" value='chevron-right' color='#b5b5b5' size='30' />
                        </View>
                    </View> : null
                }

                {
                    this.state.activityType == '55' || this.state.activityType == '5' ?
                        <View className="group-msgbox">
                            <View className="group-msgbox-title-BOX">
                                <View className="group-titlebox">
                                    <Image className="group-titlebox-storeicon" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/scSRkZHXxSj3z5jjaKWGzEPCX2cK524K.png" />
                                    <View className="group_storename">{this.state.storeName}</View>
                                </View>
                                <View className="group-msgbox-icon">
                                    {/* <AtIcon className="msg_icon" value='chevron-right' color='#b5b5b5' size='30' /> */}
                                </View>
                            </View>
                            <View className="group-msgbox-content-BOX">
                                <View className="group-msgbox-content-imgbox">
                                    <Image className="group-msgbox-content-img" src={this.state.data.youhui.image_url} />
                                </View>
                                <View className="group-msgbox-content-msgbox">
                                    <View className="group-msgbox-content-name">{this.state.data.youhui.name}</View>
                                    <View className="group-msgbox-label-box">
                                        {
                                            this.state.data.youhui.participation_number ? <View className="group-msgbox-label">{this.state.data.youhui.participation_number}人团</View> : null
                                        }
                                        <View className="group-msgbox-label">{this.state.data.team_set_end_time}小时</View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        :
                        <View className="appre-msgbox">
                            <View className="appre-msgbox-title-BOX">
                                <View className="appre-titlebox">
                                    <Image className="appre-titlebox-storeicon" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/scSRkZHXxSj3z5jjaKWGzEPCX2cK524K.png" />
                                    <View className="appre_storename">{this.state.storeName}</View>
                                </View>
                                <View className="appre-msgbox-icon">
                                    {/* <AtIcon className="msg_icon" value='chevron-right' color='#b5b5b5' size='30' /> */}
                                </View>
                            </View>
                            <View className="appre-msgbox-content-BOX">
                                <View className="appre-msgbox-yellowBox">
                                    <View className="appre-msgbox-yellowBox_left">
                                        <View className="appre-msgbox-yellowBox_left_money">
                                            <View className="appre-msgbox-yellowBox_left_money_icon">￥</View>
                                            <View className="appre-msgbox-yellowBox_left_money_num">{this.state.data.youhui.pay_money}</View>
                                        </View>
                                        <View className="appre-msgbox-yellowBox_left_info">最高可抵{this.state.data.youhui.return_money}元</View>
                                    </View>
                                    <View className="appre-msgbox-yellowBox_middle">
                                        <View className="appre-msgbox-yellowBox_appre_name">{this.state.data.youhui.name}</View>
                                        <View className="appre-msgbox-yellowBox_appre_label_box">
                                            <View className="appre-msgbox-yellowBox_appre_label">满{this.state.data.youhui.total_fee}元可用</View>
                                            {
                                                this.state.data.youhui.youhuiHour && this.state.data.youhui.youhuiHour != '' ? <View className="appre-msgbox-yellowBox_appre_label">{this.state.data.youhui.youhuiHour}</View> : null
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                }

                {
                    this.state.data.youhui.gift_id ? <View className="gift-msgbox">
                        <View className="gift-msgbox-giftinfo-box">
                            <View className="gift-msgbox-giftinfo-chooseimg-box" onClick={this.clickGift.bind(this)}>
                                {
                                    this.state.giftChoice ? <Image className="gift-msgbox-giftinfo-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/jCzizjY4Fjna5HdneGSccWChTtA4DThf.png" />
                                        : <Image className="gift-msgbox-giftinfo-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/tX8YdWMcGPYZMdJGdCjTtRPD3WsP7szh.png" />

                                }
                            </View>
                            <View className="gift-msgbox-giftinfo-giftimg-box">
                                <View className="gift-image-list" >
                                    <View className="gift-image-content">
                                        <Image className="gift-img1" src="http://oss.tdianyi.com/front/enfshdWzXJy8FsBYeMzPfHJW8fetDNzy.png" />
                                        <Image className="gift-img2" src="http://oss.tdianyi.com/front/daNKrCsn2kK7Zr8ZzEJwdnQC5jPsaFkX.png" />
                                        <Image className="gift-img" src={this.state.data.youhui.gift_pic} />
                                    </View>
                                </View>
                            </View>
                            <View className="gift-msgbox-giftinfo-giftmsg-box">
                                <View className="gift-msgbox-giftinfo-title">赠送礼品</View>
                                <View className="gift-msgbox-giftinfo-name">{this.state.data.youhui.gift_name}</View>
                                <View className="gift-msgbox-label-box">
                                    <View className="gift-msgbox-label">价值{this.state.data.youhui.gift_price}元</View>
                                    {
                                        this.state.data.youhui.postage ? <View className="gift-msgbox-label">运费{this.state.data.youhui.postage}元</View> : null
                                    }
                                </View>
                            </View>
                        </View>
                        {/* <View className="gift-msgbox-giftcoins-box">
                        <View className="gift-msgbox-giftcoins-chooseimg-box1" onClick={this.clickCoins.bind(this)}>
                            {
                                this.state.coinsChoice ? <Image className="gift-msgbox-giftcoins-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/jCzizjY4Fjna5HdneGSccWChTtA4DThf.png" />
                                    : <Image className="gift-msgbox-giftcoins-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/tX8YdWMcGPYZMdJGdCjTtRPD3WsP7szh.png" />

                            }
                        </View>
                        <View className="gift-msgbox-giftcoins-chooseimg-box2">
                            <View className="gift-msgbox-giftcoins-label">27礼品币</View>
                        </View>
                    </View> */}
                    </View> : null
                }


                {
                    this.state.giftChoice && this.state.data.youhui.gift_id && (this.state.activityType == '55' || this.state.activityType == '5') ? <View className="yellow-info">拼团活动完成并使用后礼品即会送出</View>
                        : (
                            this.state.giftChoice && this.state.data.youhui.gift_id && this.state.activityType == '1' ? <View className="yellow-info">增值券使用后礼品即会送出</View> : null
                        )
                }

                <View className="paymoney_box">
                    <View className="paymoney_price">
                        <View className="paymoney_price_icon">￥</View>
                        <View className="paymoney_price_num">{this.state.data.youhui.pay_money}</View>
                        {
                            this.state.data.youhui.gift_id && this.state.giftChoice && this.state.data.youhui.postage ? <View className='paymoney_price_info'>+{this.state.data.youhui.postage}</View> : null
                        }
                    </View>
                    <View className="paymoney_buynow" onClick={this.payment.bind(this)} >立即购买</View>
                </View>

            </View>
        );
    }
}
