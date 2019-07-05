import Taro, { Component } from "@tarojs/taro";
import { View, Image, Button } from "@tarojs/components";
import './index.styl';
import { getCode } from '@/src/utils/common';

export default class Auth extends Component {
  state = {

  }
  handleGetUserInfo = async(e: any) => {
    console.log(e.target)
    let { encryptedData,  } = e.target;
    let { avatarUrl, nickName } = e.target.userInfo;
    const { code } = await getCode();
    let data = {
      avatar: avatarUrl,
      nickname: nickName,
      js_code: code,
      encrypted_data: encryptedData
    }
    let login_url = process.env.login_url;
    console.log(login_url)
  }
  render (){
    return (
      <View>
        <View className="auth">
          <View className="logo-wrapper">
            <Image className="logo" src={require("../../static/images/ic_logo.jpg")} />
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
