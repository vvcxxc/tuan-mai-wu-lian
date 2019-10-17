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
  console.log('倒计时');
  var tmp = Date.parse( new Date() ).toString();
  tmp = tmp.substr(0,10)
  let display = time - tmp;
  let date = ''
  // console.log(time,'结束时间')
  // console.log(display,'时间差')
  if(display > 0){
    let day = Math.floor((display / 3600) / 24);
    let hour = Math.floor((display / 3600) % 24);
    let minute = Math.floor((display / 60) % 60);
    let second = Math.floor(display % 60);
    date = `${day}天${hour}:${minute}:${second}`
  } else {
    date = '已过期'
  }
  return time = {date,display}
}
