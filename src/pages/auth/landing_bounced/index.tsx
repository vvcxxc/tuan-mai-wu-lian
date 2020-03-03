import Taro, { Component } from "@tarojs/taro"
import { Block, View, ScrollView, Image, Text} from "@tarojs/components"
import './index.styl'

export default function PhysicalBond(params: any) {
  const { list } = params
  return (
    <Block>
      <View className="landing_bounced">
        <ul>
          <li>您还未登录</li>
          <li>登录后可享受完整的服务</li>
          <li>
            <Image src={require('../../../assets/bear_logo.png')} />
          </li>
          <li>
            <Text>暂不登录</Text>
            <Text>立即登录</Text>
          </li>
        </ul>
      </View>
    </Block>
  )
}