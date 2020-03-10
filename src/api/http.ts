import Taro from "@tarojs/taro";
import {
  FETCH_BAD,
  FETCH_OK,
  SERVER_ERROR,
  NOT_FIND,
  NOT_SIGN
} from "@/utils/constants";
import { quietLogin } from '../utils/sign'
const BASIC_API = process.env.BASIC_API;
interface Params {
  url: string;
  method?: string;
  data?: any;
  options?: any;
}
const http = (params: Params): Promise<any> => {
  const {
    url,
    method = "get",
    data,
    options
  } = params;
  Taro.showLoading({
    title: ""
  });
  return new Promise((resolve, reject) => {
    const mergeConfig = Object.assign({}, {
      url: `${BASIC_API}${url}`,
      header: {
        Accept: "application/json",
        Authorization: Taro.getStorageSync("token") || "",
      },
      data,
      method
    }, options);
    Taro.request({
      ...mergeConfig,
      async success(res) {
        Taro.hideLoading()
        const { statusCode, data } = res;
        switch (statusCode) {
          case SERVER_ERROR:
            Taro.showToast({
              title: 'server error :d',
              icon: 'none'
            })
            break
          case FETCH_OK:
            return resolve(data);
          case FETCH_BAD:
            Taro.showToast({
              title: data.message || "bad request",
              icon: "none"
            })
            break
          case NOT_SIGN:
             // 重新触发登录，重新请求接口
            await quietLogin()
            res = await http(options)
            return resolve(res)
            break
          case NOT_FIND:
            Taro.showToast({
              title: "not find",
              icon: "none"
            })
            break
          default:
            Taro.showToast({
              title: "unknow error",
              icon: "none"
            })
            break
        }
      },
      async fail(err) {
        let aa = err.json()
        let a = await Promise.resolve(aa)
        const { code, message } = a;
        switch (code) {
          case SERVER_ERROR:
            Taro.showToast({
              title: 'server error :d',
              icon: 'none'
            })
            break
          case FETCH_BAD:
            Taro.showToast({
              title: message,
              icon: "none"
            })
            break
          case NOT_SIGN:
            return reject(new Error('--- no sign ---'))
          case NOT_FIND:
            Taro.showToast({
              title: "not find",
              icon: "none"
            })
            break
          default:
            Taro.showToast({
              title: "unknow error",
              icon: "none"
            })
            break
        }
      }
    })
  })
};

export default http;
