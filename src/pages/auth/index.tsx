import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import './index.styl';
import userRequest from '../../services/userRequest';

export default class Auth extends Component {
  state = {

  };
  getPhoneNumber = (e) => {
    let {encryptedData, iv} = e.detail
    userRequest({
      url: 'v1/user/auth/xcx_quick_login',
      method: 'PUT',
      data: {
        encryptedData,
        iv
      }
    }).then((res: any) => {
      console.log(res)
      if(res.status_code == 200){
        if(res.data.status == 'bind_success'){
          console.log(5234)
        }
      }
    })
  }
  handleGetUserInfo = (e) => {
    let {avatarUrl, nickName} = e.detail.userInfo
    userRequest({
      method: 'POST',
      url: 'v1/user/user/user_info',
      data: {
        head: avatarUrl,
        name: nickName
      }
    }).then(res => {
      console.log(res)
    })
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
