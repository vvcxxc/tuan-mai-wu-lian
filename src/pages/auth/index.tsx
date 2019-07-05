import Taro, { Component } from "@tarojs/taro";
import { View, Image, Button } from "@tarojs/components";
import './index.styl';
import { getCode } from '@/src/utils/common';
const login_url = process.env.LOGIN_URL || 'https://test.api.tdianyi.com/wechat/jscode2session';
export default class Auth extends Component {
  state = {

  }
  handleGetUserInfo = async(e: any) => {
    console.log(e.target)
    let { encryptedData, iv } = e.target;
    let { avatarUrl, nickName } = e.target.userInfo;
    const { code } = await getCode();
    let data = {
      avatar: avatarUrl,
      nickname: nickName,
      js_code: code,
      encrypted_data: encryptedData,
      iv
    }
    Taro.request({
      url: login_url,
      method: 'GET',
      data
    }).then( res => {
      console.log(res.data);
      let { expires_in, openid, session_key, token, unionid } = res.data;
      Taro.setStorageSync('token', 'Bearer '+ token);
      Taro.setStorageSync('expires_in', expires_in);
      Taro.setStorageSync('openid', openid);
      Taro.setStorageSync('session_key', session_key);
      Taro.setStorageSync('unionid', unionid);
      Taro.switchTab({
        url: '/pages/index/index'
      })
    })

  }
  render (){
    return (
      <View>
        <View className="auth">
          <View className="logo-wrapper">
            <Image className="logo" src={'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/w35HkGCSnYSXP3myQCC2dKfb4k3wcyCJ.png'} />
          </View>
          <View className="description">
            <View className="item">* 申请获取以下授权</View>
            <View className="item">获取您的公开信息(头像, 昵称等)</View>
          </View>
            <Button
              className="action"
              openType="getUserInfo"
              onGetUserInfo={this.handleGetUserInfo}
            >
              授权登陆
            </Button>
        </View>
      </View>
    )
  }
}
