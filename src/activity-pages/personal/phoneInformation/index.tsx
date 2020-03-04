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
        tipsType: 1,
        tipsShow: false,
        wait: 60,
        is_ok: true,
        phone: '',
        _code: ''

    }
    componentDidMount() {
        Taro.showLoading();
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
                console.log('666')
                Taro.showToast({ title: '加载失败', icon: 'none' })
            })
    }
    handleCode = (e) => {
        this.setState({ _code: e.detail.value })
    }
    cancleBtn = () => {
        this.setState({ tipsShow: false })
    }
    sumbit = () => {
        //测试
        if (this.state.phone && this.state._code) {
            this.setState({ tipsShow: true, tipsType: !this.state.tipsType })
        } else if (this.state.phone && !this.state._code) {
            Taro.showToast({ title: '请输入验证码', icon: 'none' })
        } else {
            Taro.showToast({ title: '当前无绑定手机号', icon: 'none' })
        }

    }
    changeNumber = () => {
        Taro.navigateTo({
            url: '/activity-pages/personal/phoneInformation/changePhoneNumber'
        })
    }
    /**
         * 获取验证码
         */
    getCode = () => {
        const { phone } = this.state;
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
                    if (res.code == 200) {
                        Taro.showToast({ title: res.message, duration: 1500, icon: 'none' })
                    } else {
                        _this.setState({ is_ok: true });

                        clearInterval(timer);
                        Taro.showToast({ title: res.message, duration: 1500, icon: 'none' })
                    }
                })
        } else {
            Taro.showToast({ title: '当前无绑定手机号', duration: 1500, icon: 'none' })
        }
    }
    render() {
        return (
            <View className='phoneInformation'>
                <View className='phoneInformationBox'>
                    <View className='imageBox'>
                        <Image className='phoneImg' src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/7f2mdFaRxyYHsDeGGRXcrpCFP5fHTfEJ.png" />
                    </View>
                    <View className='msgBox'> 您当前绑定的手机号码:{this.state.phone}</View>
                    <View className='infoBox'> 为了您的账户安全，请输入验证码</View>
                    <View className='inputBox'>
                        <Input className='phoneInformationInput' type="text" maxLength={6} onInput={this.handleCode.bind(this)} />
                        {
                            this.state.is_ok ? (
                                <View className='phoneInformationBtn' onClick={this.getCode.bind(this)}> 获取验证码</View>
                            ) : (
                                    <View className='phoneInformationBtn' > {this.state.wait}s后重新获取</View>
                                )
                        }
                    </View>
                    <View className='btnBox' onClick={this.sumbit.bind(this)}>确认</View>
                </View>
                {
                    this.state.tipsShow ? <View className='phoneMask'>
                        {
                            this.state.tipsType == 1 ?
                                <View className='maskContentBox'>
                                    <View className='maskTitle'>温馨提示</View>
                                    <View className='maskInfo'>验证码不正确，请重试</View>
                                    <View className='maskBtnBox'>
                                        <View className='maskSumbitBtn' onClick={this.cancleBtn.bind(this)}>确认</View>
                                    </View>
                                </View>
                                :
                                <View className='maskContentBox'>
                                    <View className='maskTitle'>温馨提示</View>
                                    <View className='maskInfo'>该手机号码已和其他账号绑定，如果继续，原账号将自动解绑。是否继续？</View>
                                    <View className='maskBtnBox'>
                                        <View className='sumbitBtn' onClick={this.cancleBtn.bind(this)}>暂不解绑</View>
                                        <View className='cancelBtn' onClick={this.changeNumber.bind(this)}>确认</View>
                                    </View>
                                </View>
                        }
                    </View> : null
                }

            </View>
        )
    }
}
