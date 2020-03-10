import Taro, { RequestParams } from "@tarojs/taro";
import {
  FETCH_BAD,
  FETCH_OK,
  SERVER_ERROR,
  NOT_FIND,
  NOT_SIGN
} from "@/utils/constants";
import { quietLogin } from '../utils/sign'
const BASIC_API = process.env.BASIC_API;
interface Options extends RequestParams {
  /**替换的主机域名 */
  host?: string;
}
const host = process.env.BASIC_API;

export default async function request(options: Options) {
  const token = Taro.getStorageSync("token");
  // ShareSign()
  const pages = Taro.getCurrentPages();
  // console.log(pages[pages.length - 1].route.indexOf("confirm-order"));
  if (pages[pages.length - 1].route.indexOf("confirm-order") == -1) {
    if (pages.length == 9) {
      Taro.showToast({
        title: "页面打开太多，请回退关闭几个页面",
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        Taro.navigateBack({
        })
      }, 2000)
      return new Promise((resolve, reject) => { })
    }
  }

  options.header = { ...options.header, Authorization: token };
  return new Promise((resolve, reject) => {
    /**拼接接口地址 */
    // options.url = options.host
    //   ? options.host + options.url
    //   : host + options.url;
    options.url = options.url.includes('http')
      ? options.url
      : host + options.url
    /**统一请求 */
    // options.success = (res) => resolve(res.data.data);
    // options.fail = (res) => reject(res);
    Taro.request({
      ...options,
      async success(res) {
        const { statusCode, data } = res;
        switch (statusCode) {
          case SERVER_ERROR:
            Taro.showToast({
              title: 'server error :d',
              icon: 'none'
            })
            break
          case FETCH_OK:
            return resolve(res.data)
          case FETCH_BAD:
            Taro.showToast({
              title: data.message || "bad request",
              icon: "none"
            })
            break
          case NOT_SIGN:
            // 重新触发登录，重新请求接口
            await quietLogin()
            console.log(523423455)
            res = await request(options)
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
            // routerLogin()

            quietLogin()
            await request(options)
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
    });
  });

}

