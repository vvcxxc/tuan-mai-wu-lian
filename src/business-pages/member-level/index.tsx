import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import request from '@/services/request'
import LevelShow from './level-show';

import './index.less';

export default class MemberLevel extends Component {
  config = {
    navigationBarTitleText: "会员等级",
    navigationBarBackgroundColor: '#ff4444',
    navigationBarTextStyle: 'white'
};
  state = {
    show: false,
    grade: '',
    upgrade: '',
    active: '',
    invitation_code: '',
    user_add_at: '',
    width: 0
  }

  componentDidMount(){
    request({
      url: 'v1/community/examine',
      method: 'GET'
    }).then((res:any) => {
      const width = Math.round(res.data.active / 3000)
      // const width = 100
      this.setState({...res.data,width})
    })
  }

  /**
    * 升级，审核
    */
  upgrade = () => {
    Taro.navigateTo({
      url: '/business-pages/membership-upgrade/index'
    })
  }

  render() {
    const { active,width } = this.state
    return (
      <View className='level-page'>
        <View className='level-header'>
          <Image className='header' src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
          <View className='name'>
            EDchan
            <Image className="header-icon" src="http://oss.tdianyi.com/front/yFiASnipf36jW8CTnRHRrQpDNNWwmx7x.png" />
          </View>
          <View className='to-level' onClick={this.upgrade}>
            去升级
            <Image src={require('@/assets/member/right.png')} />
          </View>
        </View>

        <View className='level-main'>
          <View className='liveness-box'>
            <View className='liveness-title'>
              <View>活跃值</View>
              <View onClick={() => this.setState({ show: true })}>什么是活跃值</View>
            </View>
            <View className='progress-box'>
              <View className='rate' style={width < 95 ? { width: `${width}%`,borderRadius: '16rpx 0 0 16rpx' } : {width: `${width}%`,borderRadius: '16rpx'}}>
                <View className='rate-label'>
                  <View className='rate-num' style={width < 90 ? {paddingLeft: '80rpx'} : {paddingRight: '80rpx'}}>{active}/3000</View>
                  {
                    width == 100 ? null : <View className='triangle'></View>
                  }

                </View>
              </View>
            </View>
          </View>

          <LevelShow />

        </View>


        {
          this.state.show ? (
            <View className='mark'>
              <View className='mark-main'>
                <View className='title'>什么是活跃值</View>
                <View className='text'>近30天，本人销售产品的佣金加上所有直推创客产品销售佣金，按产品销售佣金1元等于1个活跃值</View>
                <View className='button' onClick={() => this.setState({ show: false })}>
                  确定
                </View>
              </View>
            </View>
          ) : null
        }


      </View>
    )
  }
}
