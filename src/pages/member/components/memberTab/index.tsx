import Taro, { Component } from '@tarojs/taro';
import './index.less';
import { View, Image, Text } from '@tarojs/components';

interface tabItem {
  num: string | number;//数字
  unit: string;//单位
  text: string;//文字介绍

}
interface Props {
  tabItem: Array<tabItem>;
  title: string;//标题
  question: boolean//有无问号
  onAction: any;//回调
  noMore?: boolean//临时，是否隐藏查看详情
}

export default class MemberTab extends Component<Props> {


  componentDidMount() {
    console.log(this.props)
  }

  render() {
    const { tabItem } = this.props;
    console.log(tabItem)
    return (
      <View className="member-page-tab">
        <View className="member-page-tab-title">
          <View className="member-page-tab-left">
            <View className="member-page-tab-left-info">{this.props.title}</View>
            {this.props.question ? <Image className="member-page-tab-left-icon" src="http://oss.tdianyi.com/front/ewyywJ6f5tzmA8NHH6ea54RizhTkE2GQ.png" /> : null}
          </View>
          {
            this.props.noMore ? null : <View className="member-page-tab-right" onClick={() => { this.props.onAction }}>
              <View className="member-page-tab-right-info">查看详情</View>
              <Image className="member-page-tab-right-icon" src="http://oss.tdianyi.com/front/EaMDtiM388m4BwmGa3yzH5GKw82Xh3SX.png" />
            </View>
          }

        </View>
        <View className="member-page-tab-content">
          {
            tabItem.map((item: any, index: any) => {
              return (
                <View className="member-page-tab-item">
                  <View className="item-key">
                    <View className="item-key-num">{item.num}</View>
                    <View className="item-key-text">({item.unit})</View>
                  </View>
                  <View className="item-word">{item.text}</View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}
