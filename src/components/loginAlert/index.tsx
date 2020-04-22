import Taro, { Component } from "@tarojs/taro"
import { Block, View, ScrollView, Image, Text, Button } from "@tarojs/components"
import './index.styl'
import userRequest from '../../services/userRequest';
import MergePrompt from '@/components/merge_prompt'

const router_data = ['pages/index/index', 'pages/order/index', 'pages/my/index', 'pages/activity/index', 'pages/member/index']
interface Props {
  onChange: any
}
export default function LoginAlert(props: Props) {
  let phone = ''
  let is_show = false
  const closeAlert = () => {
    // let pages = Taro.getCurrentPages()
    // console.log(pages)
    // if(pages.length){
    //   let route = pages[pages.length - 1].route
    //   if(router_data.indexOf(route) > -1){
    //     Taro.switchTab({url: '/' + route})
    //   }else {
    //     console.log(32341)
    //   }
    // }

    props.onChange('close')
  }
  // const goTo = () => {

  //   props.onChange('login')
  // }
  const getPhoneNumber = (e) => {
    let { encryptedData, iv, errMsg } = e.detail
    if (errMsg == 'getPhoneNumber:ok') {
      userRequest({
        url: 'v1/user/auth/xcx_quick_login',
        method: 'PUT',
        data: {
          encryptedData,
          iv
        }
      }).then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.status == 'bind_success' || res.data.status == 'binded') {
            Taro.setStorageSync('phone_status', res.data.status)
            Taro.showToast({
              title: '登录成功'
            })
            props.onChange('login')
          } else if (res.data.status == 'merge_success') {
            Taro.setStorageSync('phone_status', 'bind_success')
            Taro.setStorageSync('token', 'Bearer ' + res.data.token)
            Taro.showToast({
              title: '登录成功'
            })
            props.onChange('login')
          } else if (res.data.status == 'need_merge') {
            is_show = true
            phone = res.data.mobile
          }
        }
      })
    } else {
      props.onChange('close')
    }
  }
  const sureMerge = () => {
    userRequest({
      url: 'v1/user/user/merge_user',
      method: "PUT",
      data: {
        mobile: phone,
        type: 'xcx'
      }
    }).then(res => {
      if (res.status_code == 200) {
        Taro.setStorageSync('phone_status', 'bind_success')
        Taro.setStorageSync('token', 'Bearer ' + res.data.token)
        Taro.showToast({ title: '同步成功' })
        props.onChange('close')
      }
    })
  }
  return (
    <Block>
      <View className="landing_bounced">
        <View className='alert-box'>
          <View className='alert-title'>您还未登录</View>
          <View className='alert-text'>登录后可享受完整的服务</View>
          <View className='alert-img'>
            <Image src={require('../../assets/login.png')} />
          </View>
          <View className='alert-button-box'>
            <Text className='alert-button-close' onClick={closeAlert}>暂不登录</Text>
            {/* <Text className='alert-button-login' onClick={goTo}>立即登录</Text> */}
            <Button className='alert-button-login' open-type='getPhoneNumber' onGetPhoneNumber={getPhoneNumber}>立即登录</Button>
          </View>
        </View>
        {is_show ? <MergePrompt cancel={() => is_show = false}
          confirm={() => sureMerge()} /> : null}
      </View>

    </Block>
  )
}
