import Taro, { Component } from "@tarojs/taro"
import { Block, View, ScrollView, Image, Text, Button} from "@tarojs/components"
import './index.styl'
import userRequest from '../../services/userRequest';
interface Props {
  onChange: any
}
export default function LoginAlert(props: Props) {
  // const { list } = params
  console.log(props)
  const closeAlert = () => {
    props.onChange('close')
  }
  // const goTo = () => {

  //   props.onChange('login')
  // }
  const getPhoneNumber = (e) => {
    let { encryptedData, iv, errMsg } = e.detail
    console.log(errMsg)
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
          }
        }
      })
    } else {
      props.onChange('close')
    }
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
      </View>
    </Block>
  )
}
