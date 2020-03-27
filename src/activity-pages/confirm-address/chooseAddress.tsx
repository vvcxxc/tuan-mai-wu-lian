import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button, Input, Textarea } from "@tarojs/components";
import "./chooseAddress.scss";
import "taro-ui/dist/style/components/toast.scss";
import request from '../../services/request'



export default class ChooseAddress extends Component {
    config = {
        navigationBarTitleText: "我的收货地址"
    };

    state = {
        myAddressList: [],
        currentAddress: undefined,
        currentId: undefined

    };

    componentWillUnmount() {
        // Taro.removeStorage({ key: 'cityList' })
    }

    componentDidMount() {
        console.log(this.$router.params)
        Taro.showLoading({
            title: ""
        });
        request({
            url: 'v3/address',
            method: "GET",
        })
            .then((res: any) => {
                Taro.hideLoading();
                this.setState({ myAddressList: res.data })
            })
    }

    componentDidShow() {
        Taro.showLoading({
            title: ""
        });
        request({
            url: 'v3/address',
            method: "GET",
        })
            .then((res: any) => {
                Taro.hideLoading();
                this.setState({ myAddressList: res.data })
            })
    }
    //有地址，编辑后使用
    editorAddress = (_id: any) => {
        if (this.$router.params.activityType == '55') {
            Taro.navigateTo({
                url: '/activity-pages/Shipping-address/editor?type=useItemChange&activityType=55&editorId=' + _id + '&goodsId=' + this.$router.params.goodsId + '&groupId=' + this.$router.params.groupId + '&storeName=' + this.$router.params.storeName
            })
        } else {
            Taro.navigateTo({
                url: '/activity-pages/Shipping-address/editor?type=useItemChange&activityType=' + this.$router.params.activityType + '&editorId=' + _id + '&goodsId=' + this.$router.params.goodsId + '&storeName=' + this.$router.params.storeName
            })
        }
    }
    //没有地址，新增并使用
    goToEditor = () => {
        if (this.$router.params.activityType == '55') {
            Taro.navigateTo({
                url: '/activity-pages/Shipping-address/editor?type=useItem&activityType=55&goodsId=' + this.$router.params.goodsId + '&groupId=' + this.$router.params.groupId + '&storeName=' + this.$router.params.storeName
            })
        } else {
            Taro.navigateTo({
                url: '/activity-pages/Shipping-address/editor?type=useItem&activityType=' + this.$router.params.activityType + '&goodsId=' + this.$router.params.goodsId + '&storeName=' + this.$router.params.storeName
            })
        }
    }

    //保存
    chosoeCurrent = (index, _id, e) => {
        var pages = Taro.getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上个页面
        this.setState({ currentAddress: index, currentId: _id }, () => {
            Taro.showToast({ title: '选择地址成功', icon: 'none', mask: true });
            setTimeout(() => {
                if (this.$router.params.activityType == '55') {
                    prevPage.setData({
                        fromPage: 'editor',
                        parmsData: {
                            activityType: '55',
                            id: this.$router.params.goodsId,
                            groupId: this.$router.params.groupId,
                            address_id: _id
                        }
                    })
                    Taro.navigateBack({
                        delta: 1
                    })
                } else if (this.$router.params.activityType == '5') {
                    prevPage.setData({
                        fromPage: 'editor',
                        parmsData: {
                            activityType: '5',
                            id: this.$router.params.goodsId,
                            address_id: _id
                        }
                    })
                    Taro.navigateBack({
                        delta: 1
                    })
                } else if (this.$router.params.activityType == '1') {
                    prevPage.setData({
                        fromPage: 'editor',
                        parmsData: {
                            activityType: '1',
                            id: this.$router.params.goodsId,
                            storeName: this.$router.params.storeName,
                            address_id: _id
                        }
                    })
                    Taro.navigateBack({
                        delta: 1
                    })
                } else if (this.$router.params.activityType == 'duihuan') {
                    prevPage.setData({
                        fromPage: 'editor',
                        parmsData: {
                            activityType: 'duihuan',
                            id: this.$router.params.goodsId,
                            address_id: _id
                        }
                    })
                    Taro.navigateBack({
                        delta: 1
                    })
                }
            }, 1500);
        })
    }

    render() {
        return (

            <View className="choose-shipping-address">
                {
                    this.state.myAddressList.length == 0 ? <View className="Shipping-noAddress_box">
                        <Image className="noAddress_img" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/ZAtsKCjGrhhsrf7C7Z4dMhwpFJDY2t3f.png" />
                    </View> : null
                }
                <View className="Shipping-address-content">

                    {
                        this.state.myAddressList && this.state.myAddressList.length > 0 ? this.state.myAddressList.map((item: any, index: any) => (
                            <View className="address-chooseThis" key={item.id}>
                                <View className="address-chooseimg-box" onClick={this.chosoeCurrent.bind(this, index, item.id)}>
                                    {
                                        index == this.state.currentAddress ? <Image className="address-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/jCzizjY4Fjna5HdneGSccWChTtA4DThf.png" />
                                            : <Image className="address-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/tX8YdWMcGPYZMdJGdCjTtRPD3WsP7szh.png" />
                                    }
                                </View>
                                <View className="address-box0">
                                    <View className="address-msgBox">
                                        <View className="address-msgBox_userBox0">
                                            <View className="address-msgBox_box01">
                                                <View className="address-msgBox_userBox_name">{item.name}</View>
                                                <View className="address-msgBox_userBox_phone">{item.mobile}</View>
                                            </View>
                                            {
                                                item.is_default ? <View className="address-msgBox_userBox_choose">默认</View> : null
                                            }
                                        </View>
                                        <View className="address-msgBox_address0">{item.address}</View>
                                    </View>
                                    <View className="address-changeIcon_img_box0" onClick={this.editorAddress.bind(this, item.id)} >
                                        <Image className="address-changeIcon_img0" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/nYFTGYptxHKZwWDCiJHRy5BniRkkDQJQ.png" />
                                    </View>
                                </View>
                            </View>
                        )) : null
                    }
                </View>
                <View className="choose-bottom_btn_box">
                    <View className="bottom_btn_submit" onClick={this.goToEditor.bind(this)} >添加新地址</View>
                </View>
            </View>
        );
    }
}
