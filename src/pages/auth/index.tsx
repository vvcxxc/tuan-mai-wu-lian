import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import './index.styl';
import request from '../../services/request';

export default class Auth extends Component {
  state = {

  };
  componentDidMount (){

  }
  getPhoneNumber = (e) => {
    console.log(e)
    let {encryptedData, iv} = e.detail
    request({
      url: 'v1/user/auth/get_phone_number',
      method: 'GET',
      data: {
        encryptedData,
        iv
      }
    }).then(res => {
      console.log(res)
    })
  }
  handleGetUserInfo = (e) => {
    console.log(e.detail.userInfo)
    let {avatarUrl, nickName} = e.detail.userInfo
  }

  render (){
    return (
      <View className='authPage'>
        <View className='logoBox'>
          <Image className='authLogo' src={require('../../assets/login.png')}/>
        </View>
        {/* <View className='buttonBox'>
          <Button className='button' open-type='getPhoneNumber' onGetPhoneNumber={this.getPhoneNumber}><Image className='wxLogo' src={require('../../assets/wexin.png')}/>微信用户一键登录</Button>
          <View className='small'>手机号码登录/注册</View>
        </View> */}
        <View className='buttonBox'>
          <Button className='button' openType="getUserInfo" onGetUserInfo={this.handleGetUserInfo}><Image className='wxLogo' src={require('../../assets/wexin.png')}/>一键设置昵称与头像</Button>
          <View className='small'>设置完毕后即可使用</View>
        </View>
      </View>
    )
  }
}
