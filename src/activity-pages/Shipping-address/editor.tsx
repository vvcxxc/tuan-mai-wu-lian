import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast, AtActionSheet, AtActionSheetItem } from "taro-ui"
import { View, Text, Image, ScrollView, Button, Input, Textarea } from "@tarojs/components";
import "./index.scss";
import "taro-ui/dist/style/components/toast.scss";
import request from '../../services/request'
import CitySelecter from "../components/citySelecter/index2.js"

export default class EditorAddress extends Component {
    config = {
        navigationBarTitleText: "我的收货地址"
    };

    state = {
        nameValue: '',
        phoneValue: '',
        cityValue: [],
        TextareaValue: '',
        chooseMove: false,
        //第三层
        z3show: false,
        toastShow: false,
        toastInfo: '',
        tempCityInfo: '',
        actionsheetShow: false,
    };


    componentDidMount() {
        console.log(this.$router.params);
        if (this.$router.params.type == "editorItem" || this.$router.params.type == "useItemChange") {
            Taro.showLoading({
                title: ""
            });
            let tempid = this.$router.params.editorId;
            request({
                url: 'v3/address/' + tempid,
                method: "GET",
            })
                .then((res: any) => {
                    Taro.hideLoading();
                    let tempCityInfo = res.data.province + '-' + res.data.city + '-' + res.data.district;
                    console.log(tempCityInfo)
                    let tempCityValue = [res.data.province_id, res.data.city_id, res.data.district_id];
                    this.setState({
                        nameValue: res.data.name,
                        phoneValue: res.data.mobile,
                        cityValue: tempCityValue,
                        TextareaValue: res.data.detail,
                        chooseMove: res.data.is_default ? true : false,
                        tempCityInfo: tempCityInfo
                    })
                })
        }
    }

    // 用户名
    onHandelChangeName = (e) => {
        this.setState({ nameValue: e.detail.value })
    }
    // 电话
    onHandelChangePhone = (e) => {
        this.setState({ phoneValue: e.detail.value })
    }
    // 所在区域
    cityEnd = (query) => {
        this.setState({ cityValue: query.tempselectorid })
        // this.setState({ cityValue: query.tempselectorid, tempCityInfo: query.selectorChecked, actionsheetShow: false })
    }
    //详细地址
    onHandelChangeAddress = (e) => {
        this.setState({ TextareaValue: e.detail.value })
    }
    //选择默认
    onChangeDefaultAddress = () => {
        this.setState({ chooseMove: !this.state.chooseMove })
    }

    handleSubmit = (e) => {
        const { nameValue, phoneValue, cityValue, TextareaValue, chooseMove } = this.state;
        if (!nameValue) {
            this.setState({ toastShow: true, toastInfo: '请输入收件人' }, () => {
                setTimeout(() => { this.setState({ toastInfo: '', toastShow: false }) }, 1000)
            })
            return;
        }
        if (!phoneValue || !(/^1[3456789]\d{9}$/.test(phoneValue))) {
            this.setState({ toastShow: true, toastInfo: '请输入正确的手机号码' }, () => {
                setTimeout(() => { this.setState({ toastInfo: '', toastShow: false }) }, 1000)
            })
            return;
        }
        if (cityValue.length == 0) {
            this.setState({ toastInfo: '请选择地区', toastShow: true }, () => {
                setTimeout(() => { this.setState({ toastShow: false, toastInfo: '' }) }, 1000)
            })
            return;
        }
        if (!TextareaValue) {
            this.setState({ toastInfo: '请输入详细地址', toastShow: true }, () => {
                setTimeout(() => { this.setState({ toastShow: false, toastInfo: '' }) }, 1000)
            })
            return;
        }

        if (nameValue && phoneValue && cityValue.length != 0 && TextareaValue) {
            Taro.showLoading({
                title: ""
            });
            request({
                url: 'v3/address',
                method: "POST",
                data: {
                    name: nameValue,
                    mobile: phoneValue,
                    is_default: chooseMove ? 1 : 0,
                    province_id: cityValue[0],
                    city_id: cityValue[1],
                    district_id: cityValue[2],
                    detail: TextareaValue,
                }
            })
                .then((res: any) => {
                    Taro.hideLoading();
                    if (res.code == 200) {
                        Taro.showToast({ title: '收货地址添加成功', icon: 'none' })
                        setTimeout(() => {
                            Taro.navigateBack({
                            })
                        }, 1500)
                    } else {
                        Taro.showToast({ title: res.message, icon: 'none' })
                    }
                    console.log(res)
                }).catch(() => {
                    Taro.hideLoading();
                    Taro.showToast({ title: '请求失败', icon: 'none' })
                })
        }
    }

    deleAddressItem = (e) => {
        let tempid = this.$router.params.editorId;
        Taro.showLoading({
            title: ""
        });
        request({
            url: 'v3/address/' + tempid,
            method: "DELETE",
        })
            .then((res: any) => {
                Taro.hideLoading();
                if (res.code == 200) {
                    Taro.showToast({ title: '删除成功', icon: 'none' })
                    setTimeout(() => {
                        Taro.navigateBack({
                        })
                    }, 1500)
                } else {
                    Taro.showToast({ title: res.message, icon: 'none' })
                }
                console.log(res)
            }).catch(() => {
                Taro.hideLoading();
                Taro.showToast({ title: '请求失败', icon: 'none' })
            })
    }

    changeAddressItem = (e) => {
        let tempid = this.$router.params.editorId;
        const { nameValue, phoneValue, cityValue, TextareaValue, chooseMove } = this.state;
        if (!nameValue) {
            this.setState({ toastShow: true, toastInfo: '请输入收件人' }, () => {
                setTimeout(() => { this.setState({ toastInfo: '', toastShow: false }) }, 1000)
            })
            return;
        }
        if (!phoneValue || !(/^1[3456789]\d{9}$/.test(phoneValue))) {
            this.setState({ toastShow: true, toastInfo: '请输入正确的手机号码' }, () => {
                setTimeout(() => { this.setState({ toastInfo: '', toastShow: false }) }, 1000)
            })
            return;
        }
        if (cityValue.length == 0) {
            this.setState({ toastInfo: '请选择地区', toastShow: true }, () => {
                setTimeout(() => { this.setState({ toastShow: false, toastInfo: '' }) }, 1000)
            })
            return;
        }
        if (!TextareaValue) {
            this.setState({ toastInfo: '请输入详细地址', toastShow: true }, () => {
                setTimeout(() => { this.setState({ toastShow: false, toastInfo: '' }) }, 1000)
            })
            return;
        }

        if (nameValue && phoneValue && cityValue.length != 0 && TextareaValue) {
            Taro.showLoading({
                title: ""
            });
            request({
                url: 'v3/address/' + tempid,
                method: "PUT",
                data: {
                    name: nameValue,
                    mobile: phoneValue,
                    is_default: chooseMove ? 1 : 0,
                    province_id: cityValue[0],
                    city_id: cityValue[1],
                    district_id: cityValue[2],
                    detail: TextareaValue,
                }
            })
                .then((res: any) => {
                    Taro.hideLoading();
                    if (res.code == 200) {
                        Taro.showToast({ title: '修改成功', icon: 'none' })
                        setTimeout(() => {
                            Taro.navigateBack({
                            })
                        }, 1500)
                    } else {
                        Taro.showToast({ title: res.message, icon: 'none' })
                    }
                    console.log(res)
                }).catch(() => {
                    Taro.hideLoading();
                    Taro.showToast({ title: '请求失败', icon: 'none' })
                })
        }
    }

    saveAndUse = () => {
        let that = this;
        var pages = Taro.getCurrentPages();
        const { nameValue, phoneValue, cityValue, TextareaValue, chooseMove } = this.state;
        if (!nameValue) {
            this.setState({ toastShow: true, toastInfo: '请输入收件人' }, () => {
                setTimeout(() => { this.setState({ toastInfo: '', toastShow: false }) }, 1000)
            })
            return;
        }
        if (!phoneValue || !(/^1[3456789]\d{9}$/.test(phoneValue))) {
            this.setState({ toastShow: true, toastInfo: '请输入正确的手机号码' }, () => {
                setTimeout(() => { this.setState({ toastInfo: '', toastShow: false }) }, 1000)
            })
            return;
        }
        if (cityValue.length == 0) {
            this.setState({ toastInfo: '请选择地区', toastShow: true }, () => {
                setTimeout(() => { this.setState({ toastShow: false, toastInfo: '' }) }, 1000)
            })
            return;
        }
        if (!TextareaValue) {
            this.setState({ toastInfo: '请输入详细地址', toastShow: true }, () => {
                setTimeout(() => { this.setState({ toastShow: false, toastInfo: '' }) }, 1000)
            })
            return;
        }

        if (nameValue && phoneValue && cityValue.length != 0 && TextareaValue) {
            Taro.showLoading({
                title: ""
            });
            let method, url;
            if (this.$router.params.type == 'useItemChange') {
                method = 'put';
                url = 'v3/address/' + this.$router.params.editorId;
            } else {
                method = "POST";
                url = 'v3/address';
            }
            request({
                url: url,
                method: method,
                data: {
                    name: nameValue,
                    mobile: phoneValue,
                    is_default: chooseMove ? 1 : 0,
                    province_id: cityValue[0],
                    city_id: cityValue[1],
                    district_id: cityValue[2],
                    detail: TextareaValue,
                }
            })
                .then((res: any) => {
                    Taro.hideLoading();
                    if (res.code == 200) {
                        Taro.showToast({ title: '收货地址添加成功', icon: 'none' })
                        let adderssId, delta, prevPage;
                        if (pages[pages.length - 2].route.indexOf('confirm-address/chooseAddress') > 0) {
                            delta = 2;
                            prevPage = pages[pages.length - 3];
                        }
                        else if (pages[pages.length - 2].route.indexOf('confirm-address/index') > 0 ||
                            pages[pages.length - 2].route.indexOf('group-distribution/index') > 0 ||
                            pages[pages.length - 2].route.indexOf('coupon-distribution/index') > 0) {
                            delta = 1;
                            prevPage = pages[pages.length - 2];
                        }
                        if (this.$router.params.type == 'useItemChange') {
                            adderssId = this.$router.params.editorId;
                        } else {
                            adderssId = res.data.data.id;
                        }
                        setTimeout(() => {
                            if (this.$router.params.activityType == '55') {
                                console.log('55', prevPage)
                                prevPage.setData({
                                    fromPage: 'editor',
                                    parmsData: {
                                        activityType: 55,
                                        id: this.$router.params.goodsId,
                                        groupId: this.$router.params.groupId,
                                        address_id: adderssId
                                    }
                                })
                            } else if (this.$router.params.activityType == '5') {
                                console.log('5', prevPage)
                                prevPage.setData({
                                    fromPage: 'editor',
                                    parmsData: {
                                        activityType: this.$router.params.activityType,
                                        id: this.$router.params.goodsId,
                                        address_id: adderssId
                                    }
                                })
                            } else if (this.$router.params.activityType == '1') {
                                prevPage.setData({
                                    fromPage: 'editor',
                                    parmsData: {
                                        activityType: this.$router.params.activityType,
                                        id: this.$router.params.goodsId,
                                        storeName: this.$router.params.storeName,
                                        address_id: adderssId
                                    }
                                })
                            } else if (this.$router.params.activityType == 'duihuan') {
                                prevPage.setData({
                                    fromPage: 'editor',
                                    parmsData: {
                                        activityType: 'duihuan',
                                        id: this.$router.params.goodsId,
                                        address_id: adderssId
                                    }
                                })
                            }
                            Taro.navigateBack({
                                delta: delta
                            })
                        }, 1500)
                    } else {
                        Taro.showToast({ title: res.message, icon: 'none' })
                    }
                    console.log(res)
                }).catch(() => {
                    Taro.hideLoading();
                    Taro.showToast({ title: '请求失败', icon: 'none' })
                })
        }
    }

    render() {
        return (
            <View className="Shipping-address">

                {
                    this.state.toastShow ? <View className="toast_box">
                        <View className="toast_box_icon">
                            <AtIcon size='70' color='#fff' value='alert-circle' />
                        </View>
                        <View className="toast_box_info">{this.state.toastInfo}</View>
                    </View> : null
                }


                <View className="content-editor" onClick={(e) => { e.stopPropagation() }} onTouchMove={(e) => { e.stopPropagation() }} >
                    <View className="editor-box">
                        <View className="editor-box_left">收件人:</View>
                        <Input className="editor-box_input"
                            placeholder="请填写收件人姓名"
                            value={this.state.nameValue}
                            onInput={this.onHandelChangeName.bind(this)}
                        />
                    </View>
                    <View className="editor-box">
                        <View className="editor-box_left">手机号码:</View>
                        <Input className="editor-box_input"
                            placeholder="请填写收件人电话"
                            value={this.state.phoneValue}
                            onInput={this.onHandelChangePhone.bind(this)}
                        />
                    </View>
                    {/* <View className="editor-box" onClick={(e) => { this.setState({ actionsheetShow: true }); e.stopPropagation(); }} >
                        <View className="editor-box_left">所在区域:</View>
                        <View className="editor-box_input0" >{this.state.tempCityInfo}</View>
                        <View className="editor-box_right">
                            <AtIcon className="editor-box_icon" value='chevron-right' color='#f2f2f2' />
                        </View>
                    </View> */}
                    <CitySelecter getCity={this.cityEnd} border={true} tempCityInfo={this.state.tempCityInfo} />

                    <View className="editor-box2">
                        <View className="editor-box_left2">详细地址:</View>
                        <Textarea
                            className="editor-box_input2"
                            value={this.state.TextareaValue}
                            onInput={this.onHandelChangeAddress.bind(this)}
                            placeholder="请填写详细地址，如街道、门牌、小区等" />
                    </View>
                    <View className="editor-box">
                        <View className="choose_msg_box">
                            <View className="choose_msg_msgTitle">设置默认地址</View>
                            <View className="choose_msg_msgInfo">每次下单会默认使用该地址</View>

                        </View>
                        <View className="choose_btn_box"
                            onClick={this.onChangeDefaultAddress}
                            style={{
                                justifyContent: this.state.chooseMove ? 'flex-end' : 'flex-start',
                                border: this.state.chooseMove ? 'solid 2px #FE7450' : 'solid 2px #cccccc'
                            }}
                        >
                            <View className="choose_btn_item"
                                style={{ background: this.state.chooseMove ? 'linear-gradient(90deg, #FE7450, #FF2614)' : '#cccccc' }}
                            ></View>
                        </View>
                    </View>
                    {/* 1：editorItem:编辑地址，2：addItem：添加地址，3、4：useItem、useItemChange:隔壁chooseAddress过来的,保存使用地址 */}
                    {
                        this.$router.params.type == "editorItem" ? <View className="bottom_btn_box_z2">
                            <View className="bottom_btn_submit_z2" onClick={this.changeAddressItem.bind(this)}>保存</View>
                            <View className="bottom_btn_dele_z2" onClick={() => { this.setState({ z3show: true }) }}>删除地址</View>
                        </View> : (this.$router.params.type == "addItem" ? <View className="bottom_btn_box_z2">
                            <View className="bottom_btn_submit_z2" onClick={this.handleSubmit.bind(this)}>添加新地址</View>
                        </View> : <View className="bottom_btn_box_z2" onClick={this.saveAndUse.bind(this)}>
                                <View className="bottom_btn_submit_z2">保存并使用 </View>
                            </View>)
                    }
                </View>
                {/* 第三层：第二层的遮罩,层级5 */}
                {
                    this.state.z3show ? <View className="z2Mask_z3" >
                        <View className="Mask_msgBox" >
                            <View className="Mask_msgBox_info" >确定要删除收货地址吗</View>
                            <View className="Mask_msgBox_btnBox" >
                                <View className="Mask_msgBox_cancel" onClick={() => { this.setState({ z3show: false }) }} >取消</View>
                                <View className="Mask_msgBox_submit" onClick={this.deleAddressItem.bind(this)} >确定</View>
                            </View>
                        </View>
                    </View> : null
                }

                {/* <AtActionSheet isOpened={this.state.actionsheetShow ? true : false} onCancel={(e) => { this.setState({ actionsheetShow: false }) }} onClose={(e) => { this.setState({ actionsheetShow: false }) }}>
                    <View className="AtActionSheetBox">
                        <CitySelecter getCity={this.cityEnd} onclose={() => { this.setState({ actionsheetShow: false }) }} />
                    </View>
                </AtActionSheet> */}

            </View>
        );
    }
}
