import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import './index.styl';
import userRequest from '../../services/userRequest';

export default class Auth extends Component {
  state = {
    type: 1, //1手机号，0用户信息
  };

  componentDidMount() {
    console.log(this.$router)
    if (this.$router.params.type) {
      let type = this.$router.params.type
      if (type == 'userInfo') {
        this.setState({ type: 0 })
      }
    }
  }

  getPhoneNumber = (e) => {
    let { encryptedData, iv, errMsg } = e.detail
    console.log(errMsg)
    if (errMsg == 'getPhoneNumber:ok') {
      userRequest({
        url: 'v1/user/auth/xcx_quick_login',
        method: 'PUT',
        data: {
          encryptedData,
          iv
        }
      }).then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.status == 'bind_success' || res.data.status == 'binded') {
            Taro.setStorageSync('phone_status', res.data.status)
            Taro.showToast({
              title: '登录成功'
            })
            setTimeout(() => {
              Taro.navigateBack()
            }, 1500)
            // }
          }
        }
      })
    } else {
      let res = Taro.getCurrentPages()
      if (res.length == 1) {
        Taro.switchTab({ url: '/pages/index/index' })
      } else {
        Taro.navigateBack()
      }
    }

  }
  handleGetUserInfo = (e) => {
    let { errMsg } = e.detail
    if (errMsg == 'getUserInfo:ok') {
      let { avatarUrl, nickName } = e.detail.userInfo
      userRequest({
        method: 'PUT',
        url: 'v1/user/user/upload_user_info',
        data: {
          head: avatarUrl,
          name: nickName
        }
      }).then((res: any) => {
        if (res.status_code == 200) {
          Taro.showToast({
            title: '设置成功'
          })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
        }
      })
    } else {
      let res = Taro.getCurrentPages()
      if (res.length == 1) {
        Taro.switchTab({ url: '/pages/index/index' })
      } else {
        Taro.navigateBack()
      }
    }

  }

  // 跳到手机登录
  goToPhoneLogin = () => {
    Taro.navigateTo({ url: '/pages/auth/login_page/index' })
  }

  render() {
    return (
      <View className='authPage'>
        <View className='logoBox'>
          <Image className='authLogo' src={require('../../assets/login.png')} />
        </View>

        {
          this.state.type ? (
            <View className='buttonBox'>
              <Button className='button' open-type='getPhoneNumber' onGetPhoneNumber={this.getPhoneNumber}><Image className='wxLogo' src={require('../../assets/wexin.png')} />微信用户一键登录</Button>
              <View className='small' onClick={this.goToPhoneLogin}>手机号码登录/注册</View>
            </View>
          ) : (
              <View className='buttonBox'>
                <Button className='button' openType="getUserInfo" onGetUserInfo={this.handleGetUserInfo}><Image className='wxLogo' src={require('../../assets/wexin.png')} />一键设置昵称与头像</Button>
                <View className='small'>设置完毕后即可使用</View>
              </View>
            )
        }
      </View>
    )
  }
}
