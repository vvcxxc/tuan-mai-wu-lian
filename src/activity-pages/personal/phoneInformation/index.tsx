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
        tipsType: 1,//1验证码错误 2手机号一样 3确定更改
        tipsShow: false,//提示是否显示
        wait: 60,//发送等待时间
        is_ok: true,//是否已发送
        phone: '',//旧手机号
        _code: '',//输入验证码
        changeStep: false,//第二层输入新手机页面
        newPhone: '',//新手机号
        new_code: '',//新验证码,
        changeSuccess: false//修改成功
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
        // if (true) {
        if (this.state.phone && this.state._code) {
            Taro.showLoading();
            userRequest({
                url: '    ',
                method: "GET",
            })
                .then((res: any) => {
                    Taro.hideLoading();
                    let { status_code, data, message } = res;
                    if (status_code == 200) {
                        Taro.showToast({ title: message, icon: 'none' })
                        this.setState({ changeStep: true })
                    } else {
                        this.setState({ tipsShow: true, tipsType: 1 })
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
            Taro.showLoading();
            userRequest({
                url: '    ',
                method: "GET",
                data: {
                    phone: this.state.newPhone,
                    verifyCode: this.state.new_code
                }
            })
                .then((res: any) => {
                    Taro.hideLoading();
                    let { status_code, data, message } = res;
                    if (status_code == 200) {
                        Taro.showToast({ title: message, icon: 'none' })
                        this.setState({ changeStep: false, changeSuccess: true })
                    } else {
                        this.setState({ tipsShow: true, tipsType: 1 })
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
    getCode = () => {
        // const { phone } = this.state;
        let phone = '17766665555';
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
            Taro.showToast({ title: '当前无绑定手机号', duration: 1500, icon: 'none' })
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
                                        <View className='phoneInformationBtn' onClick={this.getCode.bind(this)}> 获取验证码</View>
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
                                <Input className='itemLeftInputPhone' type="text" placeholder="请输入手机号码" onInput={this.handleCode.bind(this, 'newPhone')} />
                            </View>
                            <View className='PhoneNumberItem'>
                                <View className='itemLeftCode'>验证码</View>
                                <Input className='itemLeftInputCode' type="text" placeholder="请输入验证码" maxLength={6} onInput={this.handleCode.bind(this, 'new_code')} />
                                <View className='getCodeBtn'>获取验证码</View>
                            </View>
                        </View>
                        <View className='submitBtn' onClick={this.changeNewPhone.bind(this)}>提交</View>
                    </View> : null
                }


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
                                : (
                                    this.state.tipsType == 2 ?
                                        <View className='maskContentBox'>
                                            <View className='maskTitle'>温馨提示</View>
                                            <View className='maskInfo'>您当前已经绑定该手机号码</View>
                                            <View className='maskBtnBox'>
                                                <View className='maskSumbitBtn' onClick={this.cancleBtn.bind(this)}>确认</View>
                                            </View>
                                        </View>
                                        :
                                        <View className='maskContentBox'>
                                            <View className='maskTitle'>温馨提示</View>
                                            <View className='maskInfo'>该手机号码已绑定其他账号，请更换手机号码再尝试。</View>
                                            <View className='maskBtnBox'>
                                                <View className='maskSumbitBtn' onClick={this.cancleBtn.bind(this)}>确认</View>
                                            </View>
                                        </View>
                                )

                        }
                    </View> : null
                }

            </View >
        )
    }
}
