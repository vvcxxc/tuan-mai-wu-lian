import Taro, { Component } from "@tarojs/taro"
import { Block, View, ScrollView, Image, Text} from "@tarojs/components"
import './index.styl'
interface Props {
  onChange: any
}
export default function LoginAlert(props: Props) {
  // const { list } = params
  console.log(props)
  const closeAlert = () => {
    props.onChange('close')
  }
  const goTo = () => {
    props.onChange('login')
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
            <Text className='alert-button-login' onClick={goTo}>立即登录</Text>
          </View>
        </View>
      </View>
    </Block>
  )
}
