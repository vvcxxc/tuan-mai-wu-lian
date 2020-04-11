import Taro, { Component, Config } from "@tarojs/taro"
import { Block, View, Text } from "@tarojs/components"
import { AtInput, AtButton } from 'taro-ui'
import "./index.styl"
import userRequest from '../../../services/userRequest';
import MergePrompt from '@/components/merge_prompt'
import { quietLogin } from '../../../utils/sign'
export default class LoginPage extends Component<any>{

  config: Config = {
    navigationBarTitleText: "登录"
  }

  state = {
    data: '',
    value: '',
    phoneNumber: '',//手机号码
    validationNumber: '',//验证码
    is_show: false,
    time: 60,
    showTime: false
  }

  componentDidMount() {
    quietLogin()
  }

  handleChange = (type, value) => {
    this.setState({ [type]: value })
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }

  // 定时器
  getValidationNumber = () => {
    let { phoneNumber } = this.state
    if (phoneNumber) {
      userRequest({
        url: 'v1/user/auth/verifyCode',
        method: 'POST',
        data: {
          phone: phoneNumber
        }
      }).then(res => {
        console.log(res)
        let { status_code, message } = res
        if (status_code == 200) {
          Taro.showToast({
            icon: 'none',
            title: message
          })
          this.performTimer()
        }
      })
    }


  }

  // 倒计时
  performTimer = () => {
    this.setState({ showTime: true })
    const time = setTimeout(() => {
      this.setState({ time: this.state.time - 1 }, () => {
        if (this.state.time < 1) {
          clearTimeout(time)
          this.setState({ time: 60, showTime: false })
          return
        }
        this.performTimer()
      })
    }, 1000);
  }

  //确定登录
  sureLogin = () => {
    const { phoneNumber, validationNumber } = this.state;
    console.log(phoneNumber, validationNumber)
    if (phoneNumber && validationNumber) {
      userRequest({
        url: 'v1/user/auth/login',
        method: 'PUT',
        data: {
          phone: phoneNumber,
          verify_code: validationNumber,
          from: 'xcx'
        }
      }).then((res: any) => {
    console.log(res)
        let { status_code } = res
        if (status_code == 200) {
          if(res.data.status == 'bind_success' || res.data.status == 'binded'){
            Taro.setStorageSync('phone_status', res.data.status)
            Taro.showToast({
              title: '登录成功',
              duration: 2000,
            },)

            setTimeout(() => {
              let page = Taro.getCurrentPages()
              if (page.length > 1) {
                Taro.navigateBack({
                  delta: 2
                })
              }
            }, 2000)
          }else if (res.data.status == 'need_merge') {
            this.setState({ is_show: true, phone: res.data.mobile })
          } else if (res.data.status == 'merge_success') {
            Taro.setStorageSync('phone_status', 'bind_success')
            Taro.setStorageSync('token', 'Bearer ' + res.data.token)
            Taro.showToast({
              title: '登录成功'
            })
            this.setState({ phone: res.data.mobile })
            setTimeout(() => {
              let page = Taro.getCurrentPages()
              if (page.length > 1) {
                Taro.navigateBack({
                  delta: 2
                })
              }
            }, 1500)
          } else if (res.data.status == 'merge_fail') {
            Taro.showToast({
              title: '登录失败'
            })
          }

        }
      })
    }
  }

  sureMerge = () => {
    userRequest({
      url: 'v1/user/user/merge_user',
      method: "PUT",
      data: {
        mobile: this.state.phoneNumber,
        type: 'xcx'
      }
    }).then(res => {
      if(res.status_code == 200){
        Taro.setStorageSync('phone_status', 'bind_success')
        Taro.setStorageSync('token','Bearer ' + res.data.token)
        Taro.showToast({title: '同步成功'})
        setTimeout(() => {
          let page = Taro.getCurrentPages()
          if (page.length > 1) {
            Taro.navigateBack({
              delta: 2
            })
          }
        }, 2000)
      }
    })
  }

  render() {
    const { time } = this.state
    return (
      <View className='loginPage'>
        <View className='loginPage_head'>
          <View className="input_phone">
            <AtInput
              name='phoneNumber'
              title='+86'
              type='number'
              placeholder='请输入手机号码'
              value={this.state.phoneNumber}
              onChange={this.handleChange.bind(this, 'phoneNumber')}
            />
            {
              !this.state.showTime ? <Text onClick={this.getValidationNumber}>获取验证码</Text> : <Text >{time}</Text>
            }
          </View>

          <AtInput
            name='validationNumber'
            title='验证码'
            type='number'
            placeholder='请输入验证码'
            value={this.state.validationNumber}
            onChange={this.handleChange.bind(this, 'validationNumber')}
          />
        </View>
        <AtButton type='primary' size='small' onClick={this.sureLogin}>
          <Text className='login_button'>
            登录
            </Text>
        </AtButton>
        {this.state.is_show ? <MergePrompt cancel={() => this.setState({ is_show: false })}
          confirm={() => this.sureMerge()} /> : null}
      </View>
    )
  }
}
