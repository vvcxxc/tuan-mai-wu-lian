import Taro, { RequestParams } from "@tarojs/taro";

interface Options extends RequestParams {
  /**替换的主机域名 */
  host?: string;
}

const host = "http://test.api.tdianyi.com/";

export default function request(options: Options) {
  var pages = Taro.getCurrentPages();
  console.log("pages:" + pages.length);
  if (pages.length == 10) {
    Taro.showToast({
      title: "页面打开太多，请回退关闭几个页面",
      icon: 'none',
      duration: 2000
    })
    setTimeout(() => {
      Taro.navigateBack({

      })
    }, 2000)
    return;
  }
  const token = Taro.getStorageSync("token");
  options.header = { ...options.header, Authorization: token };
  return new Promise((resolve, reject) => {
    /**拼接接口地址 */
    options.url = options.host
      ? options.host + options.url
      : host + options.url;
    /**统一请求 */
    options.success = (res) => resolve(res.data.data);
    options.fail = (res) => reject(res);
    Taro.request(options);
  });
}

