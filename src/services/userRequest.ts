import Taro, { RequestParams } from "@tarojs/taro";
import {
  FETCH_BAD,
  FETCH_OK,
  SERVER_ERROR,
  NOT_FIND,
  NOT_SIGN
} from "@/utils/constants";
import { quietLogin } from '../utils/sign'
// const USER_API = process.env.USER_API;
interface Options extends RequestParams {
  /**替换的主机域名 */
  host?: string;
}

const host = process.env.USER_API;

export default function userRequest(options: Options) {
  const pages = Taro.getCurrentPages();
console.log(32323)
  // console.log(pages[pages.length - 1].route.indexOf("confirm-order"));
  // if (pages[pages.length - 1].route.indexOf("confirm-order") == -1) {
  //   if (pages.length == 9) {
  //     Taro.showToast({
  //       title: "页面打开太多，请回退关闭几个页面",
  //       icon: 'none',
  //       duration: 2000
  //     })
  //     setTimeout(() => {
  //       Taro.navigateBack({
  //       })
  //     }, 2000)
  //     return new Promise((resolve, reject) => { })
  //   }
  // }
  const token = Taro.getStorageSync("token");
  options.header = { ...options.header, Authorization: token };
  return new Promise((resolve, reject) => {
    /**拼接接口地址 */
    options.url = options.url.includes('http')
      ? options.url
      : host + options.url
    /**统一请求 */
    // options.success = (res) => resolve(res.data.data);
    // options.fail = (res) => reject(res);
    Taro.request({
      ...options,
      async success(res) {
        // console.log(res,3333)
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
            return reject(res)
            break
          case NOT_SIGN:
            // 重新触发登录，重新请求接口
            await quietLogin()
            res = await userRequest(options)
            return resolve(res)
            break
          case NOT_FIND:
            Taro.showToast({
              title: "not find",
              icon: "none"
            })
            return reject(res)
            break
          default:
            // Taro.showToast({
            //   title: "unknow error",
            //   icon: "none"
            // })
            return resolve(res)
            break
        }
      },
      async fail(err) {
        switch (err.statusCode) {
          case SERVER_ERROR:
            Taro.showToast({
              title: 'server error :d',
              icon: 'none'
            })
            break
          case FETCH_BAD:
            Taro.showToast({
              title: "bad request",
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
    });
  });

}

