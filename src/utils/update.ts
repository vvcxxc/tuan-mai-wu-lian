import Taro from '@tarojs/taro';
/**
   * 判断小程序是否需要更新
   */
export default function isUpdate() {
  console.log(Taro.canIUse('getUpdateManager'), 'isUpdate')
  if (Taro.canIUse('getUpdateManager')) {
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      console.log('onCheckForUpdate====', res)
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        console.log('res.hasUpdate====')
        updateManager.onUpdateReady(function () {
          Taro.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res1) {
              console.log('success====', res1)
              // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
              if (res1.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                // let pages = Taro.getCurrentPages()
                // console.log(pages, 'pages')
                // let route = pages[pages.length - 1].route
                // let options = pages[pages.length - 1].options
                // let params = ''
                // if (options) {
                //   for (let key in options) {
                //     if (params) {
                //       params = `${params}&${key}=${options[key]}`
                //     } else {
                //       params = `${key}=${options[key]}`
                //     }
                //   }
                // }
                // Taro.setStorageSync('update_page', `${route}?${params}`)
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          // 新的版本下载失败
          Taro.showModal({
            title: '已经有新版本啦',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
          })
        })
      } else {
        // let update_page = Taro.getStorageSync('update_page')
        // let tab = ['pages/index/index', 'pages/merchant/index', 'pages/activity/index', 'pages/order/index', 'pages/my/index']
        // if (update_page) {
        //   if (tab.includes(update_page)) {
        //     Taro.switchTab({ url: '/' + update_page })
        //   } else {
        //     Taro.navigateTo({
        //       url: '/' + update_page
        //     })
        //   }
        // }
        // Taro.removeStorageSync('update_page')
      }
    })
  } else {

  }
}
