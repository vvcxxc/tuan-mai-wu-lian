import Taro, { Component, Config } from "@tarojs/taro"
import { Block, View,Text } from "@tarojs/components"
import { AtInput, AtButton} from 'taro-ui'
import "./index.styl"

export default class LoginPage extends Component<any>{

  config: Config = {
    navigationBarTitleText: "登录"
  }

  state = {
    data: '',
    value: '',
    phoneNumber:'',//手机号码
    validationNumber:'',//验证码


    time: 60,
    showTime:false
  }

  componentDidMount() {

  }

  handleChange = (type,value)=> {
    this.setState({ [type]: value})
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }

  // 定时器
  performTimer = () => {

    this.setState({ showTime:true})
    const time = setTimeout(() => {
      this.setState({ time: this.state.time - 1 }, () => {
        if (this.state.time < 1) {
          clearTimeout(time)
          this.setState({ time: 60, showTime: false})
          return
        }
          this.performTimer()
      })
    }, 1000);

  }

  //确定登录
  sureLogin = () => {
    console.log(this.state.phoneNumber,this.state.validationNumber,'值')
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
              onChange={this.handleChange.bind(this,'phoneNumber')}
            />
            {
              !this.state.showTime ? <Text onClick={this.performTimer}>获取验证码</Text> : <Text >{time}</Text>
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
      </View>
    )
  }
}
