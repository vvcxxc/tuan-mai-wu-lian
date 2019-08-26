import Taro, { Component } from "@tarojs/taro"
import { Block, View, Image, Button } from "@tarojs/components"
import withWeapp from "@tarojs/with-weapp"
import "./style.auth.styl"
import { tabbar } from "./data"
import { getUserInfo } from "@/utils/getInfo"

interface State {
  tabbar: string[];
  currentUrl: string;
  id: string;
  isShowButton: boolean;
}

/**
 * @currentUrl -> 需要授权的页面
 * @id -> 如果是从活动主页跳过来时, 会带上id(, 跳回去时才能拿到优惠券数据)
 * interface ParamsRouter {
 *   currentUrl: string;
 *   id?: string;
 * }
 */
withWeapp("Page")
export default class Auth extends Component {
  config = {
    navigationBarTitleText: "授权登录"
  }
  state: State = {
    tabbar,
    currentUrl: "",
    id: "",
    isShowButton: false
  }
  componentWillMount() {
    const { currentUrl = "", id = "" } = this.$router.params
    if (currentUrl) {
      this.setState({
        currentUrl,
        ...( id ? { id } : "" )
      })
      this.handleCheckoutAuth()
    }
  }

  /**
   * 登录处理
   */
  handleSign = async (): Promise<void> => {
    const { miniProgramSign } = require("@/utils/sign")
    const { currentUrl, tabbar, id } = this.state
    if (!currentUrl) return
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
        // Taro.setStorageSync("encryptedData", _encryptedData)
        // Taro.setStorageSync("iv", _iv)
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
    const method = tabbar.includes(currentUrl)
      ? "switchTab"
      : "redirectTo"
    console.log(method)
    // Taro[method]({
    //   url: `${currentUrl}?id=${id}`
    // })
    Taro.switchTab({url: '/pages/index/index'})
  }

  /**
   * 监听授权登录按钮点击事件
   */
  handleGetUserInfo = (e): void => {
    const { errMsg, userInfo, encryptedData, iv } = e.detail
    if (errMsg === "getUserInfo:ok") {
      Taro.setStorageSync("userInfo", userInfo)
      // Taro.setStorageSync("encryptedData", encryptedData)
      // Taro.setStorageSync("iv", iv)
      this.handleSign()
    }
  }

  /**
   * 登录检查
   */
  handleCheckoutAuth = (): void => {
    Taro.getSetting({
      success: ({ authSetting }) => {
        if (authSetting["scope.userInfo"]) {
          if (!Taro.getStorageSync("userInfo")) {
            getUserInfo().then(res => {
              const { errMsg, userInfo, encryptedData, iv } = res
              if (errMsg === "getUserInfo:ok") {
                Taro.setStorageSync("userInfo", userInfo)
                Taro.setStorageSync("encryptedData", encryptedData)
                Taro.setStorageSync("iv", iv)
                this.handleSign()
              }
            })
          } else {
            this.handleSign()
          }
        } else {
          this.setState({
            isShowButton: true
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  }
  render() {
    const { isShowButton } = this.state
    return (
      <Block>
        <View className="auth">
          <View className="logo-wrapper">
            <Image className="logo" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/w35HkGCSnYSXP3myQCC2dKfb4k3wcyCJ.png" />
          </View>
          <View className="description">
            <View className="item">* 申请获取以下授权</View>
            <View className="item">获取您的公开信息(头像, 昵称等)</View>
          </View>
          {/* {
            isShowButton && ( */}
              <Button
                className="action"
                openType="getUserInfo"
                onGetUserInfo={this.handleGetUserInfo}
              >
                授权登录
              </Button>
            {/* )
          } */}
        </View>
      </Block>
    )
  }
}
