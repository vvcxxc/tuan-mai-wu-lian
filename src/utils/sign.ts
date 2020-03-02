import Taro from "@tarojs/taro";
import { FETCH_OK } from "./constants";
import { getCode } from "./getInfo";
import dayjs from 'dayjs'
import userRequest from '../services/userRequest'

/**
 * 小程序登录
 */
interface Params {
  userInfo: {
    avatarUrl: string;
    nickName: string;
  },
  basicApi: string;
  encryptedData: string;
  iv: string;
}
interface SignResponse {
  message: string;
  err?: any;
}
export const miniProgramSign = (params: Params): Promise<SignResponse> => {
  return new Promise(async (resolve, reject) => {
    const {
      userInfo: { avatarUrl, nickName },
      basicApi,
      encryptedData,
      iv
    } = params;
    const joinApi = `${basicApi}wechat/jscode2session`
    Taro.showLoading({
      title: "授权中...",
    });
    const { code } = await getCode();
    Taro.request({
      url: joinApi,
      data: {
        avatar: avatarUrl,
        nickname: nickName,
        js_code: code,
        encrypted_data: encryptedData,
        iv
      },
      // @ts-ignore
      success(res) {
        const { statusCode, data: { openid, token, unionid } } = res;
        Taro.hideLoading();
        if (statusCode === FETCH_OK) {
          Taro.setStorageSync("openid", openid)
          Taro.setStorageSync("unionid", unionid)
          Taro.setStorageSync("token", `Bearer ${token}`)
          return resolve({
            message: "successful",
          });
        }
        resolve({
          message: "no data",
        });
      },
      fail(err) {
        Taro.hideLoading();
        return reject({
          message: "fail",
          err
        });
      }
    });
  });
}

/**
 * 跳转至登陆页面
 */
export const toMiniProgramSign = (basicApi: string): void => {
  const pages = Taro.getCurrentPages();
  const currentUrl = pages[0]["route"];
  // 设置时间来避免多次触发跳转
  let date = dayjs().unix() // 当前时间
  let time = Taro.getStorageSync('time') // 之前的时间
  if (time) {
    if (date - time < 5) {
      // 避免多次触发
      return
    } else {
      Taro.setStorageSync('time', date)
    }
  } else {
    Taro.setStorageSync('time', date)
  }
  const id = Taro.getStorageSync("authid") || "";
  Taro.navigateTo({
    url: `/pages/auth/auth?basicApi=${basicApi}&currentUrl=/${currentUrl}&id=${id}`
  });
}

/**
 *  小程序静默登录
 * */
export const quietLogin = () => {
  Taro.login({
    success: res => {
      userRequest({
        method: 'POST',
        url: 'v1/user/auth/auth_xcx',
        data: {
          code: res.code
        }
      }).then((res1: any) => {
        if(res1.status_code == 200){
          Taro.setStorageSync('token', 'Bearer ' + res1.data.token)
          Taro.setStorageSync('openid', res1.data.user.xcx_openid)
          Taro.setStorageSync('user',res1.data.user)
          Taro.setStorageSync('token_expires_in',res1.data.expires_in)
          if(res1.data.user.mobile){
            Taro.setStorageSync('mobile_status','binded')
          }
        }
      })
    },
    fail: err => {
      console.log(err)
    }
  })

}
