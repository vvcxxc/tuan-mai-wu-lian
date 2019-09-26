import Taro, { Component } from '@tarojs/taro';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtIcon } from "taro-ui"
import request from '../../services/request';
import { View, Button, Image } from '@tarojs/components';
import { getUserInfo } from "@/utils/getInfo"
import './index.styl'
interface Props {
  is_login: boolean;
  onClose: any;
}
export default class Index extends Component<Props> {
  state = {
    is_login: false
  }
  componentDidMount (){
    this.setState({
      is_login: this.props.is_login
    })
  }
   /**
   * 监听授权登录按钮点击事件
   */
  handleGetUserInfo = (e): void => {
    console.log('走着啦')
    const { errMsg, userInfo, encryptedData, iv } = e.detail
    if (errMsg === "getUserInfo:ok") {
      Taro.setStorageSync("userInfo", userInfo)
      this.handleSign()
    }
  }
  /**
   * 登录处理
   */
  handleSign = async (): Promise<void> => {
    const { miniProgramSign } = require("@/utils/sign")
    // const { currentUrl, tabbar, id } = this.state
    // if (!currentUrl) return
    const userInfo = Taro.getStorageSync("userInfo")
    let encryptedData = Taro.getStorageSync("encryptedData")
    let iv = Taro.getStorageSync("iv")
    await Taro.login()
    // if (!encryptedData || !iv) {
      const {
        errMsg,
        encryptedData: _encryptedData,
        iv: _iv
      } = await getUserInfo()
      if (errMsg === "getUserInfo:ok") {
        encryptedData = _encryptedData
        iv = _iv
      }
    // }
    await miniProgramSign({
      basicApi: process.env.BASIC_API,
      userInfo,
      encryptedData,
      iv
    }).catch(err => {
      console.log(err)
      throw Error("--- 登录出错(, auth) ---")
    })
    Taro.removeStorageSync('is_login')
    this.setState({is_login: false})
    // Taro.switchTab({url: '/pages/index/index'})

  }

  close = () => {
    console.log('触发了')
    this.setState({
      is_login: false
    })
    this.props.onClose()
  }

  render (){
    return (
      <View>
        <AtModal isOpened={this.state.is_login} className='confirm_box'>
          <AtModalContent>
            <Image src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/TQnWAHEBkpBtEiAW6wmfJDyGS6Kfzydj.png' className='confirm_logo'/>
            <View className='confirm_text'>登录后可访问更精彩的内容</View>
          </AtModalContent>
          <AtModalAction> <Button onClick={this.close}>取消</Button> <Button style={{color: '#fe9692'}} openType="getUserInfo" onGetUserInfo={this.handleGetUserInfo}>微信登录</Button> </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
