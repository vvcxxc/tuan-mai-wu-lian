import Taro, { Component, Config } from "@tarojs/taro"
// import { View } from "@tarojs/components";
import { Block, View, Image, Text, Navigator, Input } from "@tarojs/components"
import "./index.less"
import { url } from "inspector"
import { AtIcon } from 'taro-ui'
import userRequest from '@/services/userRequest'

export default class PhoneInformation extends Component {

    config: Config = {
        navigationBarTitleText: "换绑手机号码"
    }
    state = {
        tipsInfo: '',//提示内容
        tipsShow: false,//提示是否显示
        wait: 60,//发送等待时间
        is_ok: true,//是否可以发送
        phone: '',//旧手机号
        _code: '',//输入验证码
        changeStep: false,//第二层输入新手机页面
        newPhone: '',//新手机号
        new_code: '',//新验证码,
        changeSuccess: false//修改成功
    }
    //changeSuccess==false&&changeStep==false第一层初始=>验证旧手机=>changeSuccess==false&&changeStep==true第二层=>验证新手机=>changeSuccess==true&&changeStep==false第一层成功
    componentDidMount() {
        Taro.showLoading({ title: 'loading', mask: true });
        userRequest({
            url: 'v1/user/user/user_info',
            method: "GET",
        })
            .then((res: any) => {
                Taro.hideLoading();
                let { status_code, data, message } = res;
                if (status_code == 200) {
                    this.setState({
                        phone: data.phone
                    })
                } else {
                    Taro.showToast({ title: message, icon: 'none' })
                }
            }).catch(err => {
                Taro.hideLoading();
                Taro.showToast({ title: '加载失败', icon: 'none' })
            })
    }
    //输入框
    handleCode = (type, e) => {
        this.setState({ [type]: e.detail.value })
    }
    //隐藏提示
    cancleBtn = () => {
        this.setState({ tipsShow: false })
    }
    //验证旧手机
    checkOldPhone = () => {
        if (this.state.phone && this.state._code) {
            Taro.showLoading({ title: 'loading', mask: true });
            userRequest({
                url: 'v1/user/user/check_phone',
                method: "GET",
            })
                .then((res: any) => {
                    Taro.hideLoading();
                    let { status_code, data, message } = res;
                    if (status_code == 200) {
                        Taro.showToast({ title: message, icon: 'none' })
                        this.setState({ is_ok: true, changeStep: true })
                    } else {
                        this.setState({ tipsShow: true, tipsInfo: message, })
                    }
                }).catch(err => {
                    Taro.hideLoading();
                    Taro.showToast({ title: '请求失败', icon: 'none' })
                })
        } else if (this.state.phone && !this.state._code) {
            Taro.showToast({ title: '请输入验证码', icon: 'none' })
        } else {
            Taro.showToast({ title: '当前无绑定手机号', icon: 'none' })
        }
    }
    //换新手机
    changeNewPhone = () => {
        if (this.state.newPhone && this.state.new_code) {
            Taro.showLoading({ title: 'loading', mask: true });
            userRequest({
                url: 'v1/user/user/change_phone',
                method: "PUT",
                data: {
                    phone: this.state.newPhone,
                    verifyCode: this.state.new_code
                }
            })
                .then((res: any) => {
                    Taro.hideLoading();
                    let { status_code, message } = res;
                    if (status_code == 200) {
                        Taro.showToast({ title: message, icon: 'none' })
                        this.setState({ is_ok: true, changeStep: false, changeSuccess: true })
                    } else if (status_code == 400) {
                        Taro.showToast({ title: '请求出错', icon: 'none' })
                    }
                    else {
                        //  201等等
                        this.setState({ tipsShow: true, tipsInfo: message, is_ok: true, changeStep: false })
                    }
                }).catch(err => {
                    Taro.hideLoading();
                    Taro.showToast({ title: '请求失败', icon: 'none' })
                })
        } else {
            Taro.showToast({ title: '请输入新手机号和验证码', icon: 'none' })
        }
    }
    /**
         * 获取验证码
         */
    getCode = (type: number, e) => {
        let phone = type == 1 ? this.state.phone : this.state.newPhone;
        let wait = 60;
        if (phone) {
            let _this = this;
            function resend() {
                if (wait == 0) {
                    _this.setState({ is_ok: true });
                    clearInterval(timer)
                } else {
                    wait--;
                    _this.setState({ is_ok: false, wait });
                    clearInterval();
                }
            }
            resend();
            let timer = setInterval(() => {
                resend()
            }, 1000);
            userRequest({
                url: 'v1/user/auth/verifyCode',
                method: "POST",
                data: { phone }
            })
                .then((res: any) => {
                    if (res.status_code == 200) {
                        Taro.showToast({ title: res.message, duration: 1500, icon: 'none' })
                    } else {
                        _this.setState({ is_ok: true });
                        clearInterval(timer);
                        Taro.showToast({ title: res.message, duration: 1500, icon: 'none' })
                    }
                })
        } else {
            Taro.showToast({ title: '手机号有误', duration: 1500, icon: 'none' })
        }
    }
    goToMy = () => {
        Taro.reLaunch({
            url: '/pages/my/index'
        })
    }
    render() {
        return (
            <View className='phoneInformation'>
                {
                    !this.state.changeSuccess ?
                        <View className='phoneInformationBox'>
                            <View className='imageBox'>
                                <Image className='phoneImg' src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/7f2mdFaRxyYHsDeGGRXcrpCFP5fHTfEJ.png" />
                            </View>
                            <View className='msgBox'> 您当前绑定的手机号码:{this.state.phone}</View>
                            <View className='infoBox'> 为了您的账户安全，请输入验证码</View>
                            <View className='inputBox'>
                                <Input className='phoneInformationInput' type="text" maxLength={6} onInput={this.handleCode.bind(this, '_code')} />
                                {
                                    this.state.is_ok ? (
                                        <View className='phoneInformationBtn' onClick={this.getCode.bind(this, 1)}> 获取验证码</View>
                                    ) : (
                                            <View className='phoneInformationBtn' > {this.state.wait}s后重新获取</View>
                                        )
                                }
                            </View>
                            <View className='btnBox' onClick={this.checkOldPhone.bind(this)}>确认</View>
                        </View> :
                        <View className='phoneInformationBox'>
                            <View className='imageBox'>
                                <Image className='phoneImg' src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/7f2mdFaRxyYHsDeGGRXcrpCFP5fHTfEJ.png" />
                            </View>
                            <View className='msgBox'>换绑成功</View>
                            <View className='infoBox'>点击确认后将返回个人中心</View>
                            <View className='btnBox' onClick={this.goToMy.bind(this)}>确认</View>
                        </View>
                }
                {
                    this.state.changeStep ? <View className='changePhonePage'>
                        <View className='informationTitle'>请输入新的手机号码</View>
                        <View className='changePhoneNumberBox'>
                            <View className='PhoneNumberItem'>
                                <View className='itemLeftPhone'>+86</View>
                                <Input className='itemLeftInputPhone' type="text" placeholder="请输入手机号码" maxLength={11} onInput={this.handleCode.bind(this, 'newPhone')} />
                            </View>
                            <View className='PhoneNumberItem'>
                                <View className='itemLeftCode'>验证码</View>
                                <Input className='itemLeftInputCode' type="text" placeholder="请输入验证码" maxLength={6} onInput={this.handleCode.bind(this, 'new_code')} />
                                {
                                    this.state.is_ok ? (
                                        <View className='getCodeBtn' onClick={this.getCode.bind(this, 2)}>获取验证码</View>
                                    ) : (
                                            <View className='getCodeBtn' >{this.state.wait}s后重新获取</View>
                                        )
                                }
                            </View>
                        </View>
                        <View className='submitBtn' onClick={this.changeNewPhone.bind(this)}>提交</View>
                    </View> : null
                }


                {
                    this.state.tipsShow ?
                        <View className='phoneMask'>
                            <View className='maskContentBox'>
                                <View className='maskTitle'>温馨提示</View>
                                <View className='maskInfo'>{this.state.tipsInfo}</View>
                                <View className='maskBtnBox'>
                                    <View className='maskSumbitBtn' onClick={this.cancleBtn.bind(this)}>确认</View>
                                </View>
                            </View>
                        </View> : null
                }

            </View >
        )
    }
}
