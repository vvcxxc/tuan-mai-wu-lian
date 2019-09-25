import Taro from "@tarojs/taro"

/**
 * 获取codeid
 */
export const getCode = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    Taro.login({
      success(res) {
        return resolve(res)
      },
      fail(err) {
        return reject(err)
      }
    })
  })
}

/**
 *  倒计时
 */
export const getTime = time => {
  var tmp = Date.parse( new Date() ).toString();
  tmp = tmp.substr(0,10)
  let display = time - tmp;
  if(display > 0){
    let day = Math.floor((sys_second / 1000 / 3600) / 24);
        let hour = Math.floor((sys_second / 1000 / 3600) % 24);
        let minute = Math.floor((sys_second / 1000 / 60) % 60);
        let second = Math.floor(sys_second / 1000 % 60);
  }
}
