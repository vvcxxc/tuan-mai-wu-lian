import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.less';

interface Props {
  textInfo: any;
  level: number;
}
// const text = ['注册会员：通过产品或者平台链接进入平台，授权登录即成为注册会员', '建群：本人建立1个50人以上的微信群，截图人数页及群主页上传，审核通过即可成为创客', '同时满足以下3个条件：1. 建群：①本人所建立群人数达200人；②直属创客不低于5人，总创客数不低于20人2.拓展商家3家   3. 活跃值达到1000；活跃值：1元销售佣金=1个活跃值；活跃值构成：1.本人建群：200分封顶 2.直属创客建群：200分封顶/群', '1、推荐3名超级创客，拓展店铺5家 2、拓展5个群']
export default class LevelShow extends Component<Props> {
  state = {
    pageX: 0,
    index: 1, // 会员的index
    animationData: {}
  }
  componentDidMount(){
    this.setState({index: this.props.level-3})
  }

  TouchStart = (e) => {
    this.setState({ pageX: e.changedTouches[0].pageX })
  }

  TouchEnd = (e) => {
    let endPageX = e.changedTouches[0].pageX
    let { pageX, index } = this.state
    let animation: any = Taro.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    if (pageX - endPageX >= 100) {
      // 向右滑
      if (index == 4) {

        index = 1
      } else {
        index = index + 1
      }
      animation.opacity(0).scale(0.01).step({
        duration: 32,
        timingFunction: 'step-start',
      })
      animation.opacity(1).scale(1).step({
        duration: 500,
        timingFunction: 'ease',
      })
    } else if (pageX - endPageX <= -100) {
      // 向左滑
      if (index == 1) {
        index = 4
      } else {
        index = index - 1
      }
      animation.opacity(0).scale(0.01).step({
        duration: 32,
        timingFunction: 'step-start',
      })
      animation.opacity(1).scale(1).step({
        duration: 500,
        timingFunction: 'ease',
      })
    }

    this.setState({ index, animationData: animation.export() }, () => {
      setTimeout(() => {
        this.setState({ animationData: {} })
      }, 500)

    })
  }

  handleClick = (idx: number) => {
    const { index } = this.state
    if (index != idx) {
      let animation: any = Taro.createAnimation({
        duration: 500,
        timingFunction: 'linear',
      })
      animation.opacity(0).scale(0.01).step({
        duration: 32,
        timingFunction: 'step-start',
      })
      animation.opacity(1).scale(1).step({
        duration: 500,
        timingFunction: 'ease',
      })

      this.setState({ index: idx, animationData: animation.export() }, () => {
        setTimeout(() => {
          this.setState({ animationData: {} })
        }, 500)
      })
    }
  }

  render() {
    const { index } = this.state
    return (
      <View className='show-box'>
        <View className='level-main'>
          <View className='level-box'>
            <View className='level-item item1' onClick={this.handleClick.bind(this, 1)}>
              <Image className='item-img' src={index == 1 ? require('@/assets/member/1.png') : require('@/assets/member/5.png')} />
              <View>注册会员</View>
            </View>
            <View className='level-item item2' onClick={this.handleClick.bind(this, 2)}>
              <Image className='item-img' src={index == 2 ? require('@/assets/member/2.png') : require('@/assets/member/6.png')} />
              <View>普通创客</View>
            </View>
            <View className='level-item item3' onClick={this.handleClick.bind(this, 3)}>
              <Image className='item-img' src={index == 3 ? require('@/assets/member/3.png') : require('@/assets/member/7.png')} />
              <View>超级创客</View>
            </View>
            <View className='level-item item4' onClick={this.handleClick.bind(this, 4)}>
              <Image className='item-img' src={index == 4 ? require('@/assets/member/4.png') : require('@/assets/member/8.png')} />
              <View>合伙人</View>
            </View>
          </View>
        </View>
        <View className={`level-details details${index}`} onTouchStart={this.TouchStart} onTouchEnd={this.TouchEnd} animation={this.state.animationData}>
          <View className={`triangle${index}`}></View>
          <View className='title'>晋升任务</View>
          <View className='text'>
            {this.props.textInfo[index - 1]}
          </View>
        </View>
      </View>
    )
  }
}
