import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import request from '@/services/request'
import LevelShow from './level-show';
import { getUserGrade } from './service'
import './index.less';

export default class MemberLevel extends Component {
  config = {
    navigationBarTitleText: "会员等级",
    navigationBarBackgroundColor: '#ff4444',
    navigationBarTextStyle: 'white'
  };
  state = {
    show: false,
    upgrade: '',
    invitation_code: '',
    user_add_at: '',
    width: 0,
    user_name: '',
    avatar: '',
    dynamic_value: '',
    dynamic_sum: '',
    user_group: 0,//5注册会员 6普通创客 7超级创客 8合伙人
    grade: [],// 等级描述 从5开始

  }

  componentDidMount() {
    Taro.showLoading({ title: 'loading', mask: true });
    getUserGrade().then((res: any) => {
      Taro.hideLoading();
      if (res.status_code == 200) {
        const width = Math.round(res.data.dynamic_value / res.data.dynamic_sum) || 0
        // const width = 100
        this.setState({ ...res.data, width })
      } else {
        Taro.showToast({ title: res.message || '请求失败', icon: 'none' })
      }
    }).catch((err: any) => {
      Taro.hideLoading();
      Taro.showToast({ title: err.message || '请求失败', icon: 'none' })
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
    const { dynamic_value, dynamic_sum, width, grade, user_group } = this.state
    return (
      <View className='level-page'>
        <View className='level-header'>
          <Image className='header' src={this.state.avatar} />
          <View className='name'>
            {this.state.user_name}
            {
              user_group == 5 ? <Image className="header-icon" src="http://oss.tdianyi.com/front/CGcd64DyAJAnJk5kCFJERXMAGBPNPPzF.png" /> : (
                user_group == 6 ? <Image className="header-icon" src="http://oss.tdianyi.com/front/hKJDb3t8CiJj5fmFzEY4FiNQzXEataPY.png" /> : (
                  user_group == 7 ? <Image className="header-icon" src="http://oss.tdianyi.com/front/2YxRmhGnap4ricS27GbTB4Tc8dY6bBPQ.png" /> : (
                    user_group == 8 ? <Image className="header-icon" src="http://oss.tdianyi.com/front/ETTnGxZk6FHaCPBDzaRSpdkjFGGSmpsb.png" /> : null
                  )
                )
              )
            }
          </View>
          {
            this.state.user_group != 8 ?
              <View className='to-level' onClick={this.upgrade}>
                去升级
            <Image src={require('@/assets/member/right.png')} />
              </View> : null
          }
        </View>
        <View className='level-main'>
          <View className='liveness-box'>
            <View className='liveness-title'>
              <View>活跃值</View>
              <View onClick={() => this.setState({ show: true })}>什么是活跃值</View>
            </View>
            <View className='progress-box'>
              <View className='rate' style={width < 95 ? { width: `${width}%`, borderRadius: '16rpx 0 0 16rpx' } : { width: `${width}%`, borderRadius: '16rpx' }}>
                <View className='rate-label'>
                  <View className='rate-num' style={width < 90 ? { paddingLeft: '80rpx' } : { paddingRight: '80rpx' }}>{dynamic_value}/{dynamic_sum}</View>
                  {
                    width == 100 ? null : <View className='triangle'></View>
                  }

                </View>
              </View>
            </View>
          </View>
          {
            grade.length ? <LevelShow textInfo={this.state.grade} /> : null
          }

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
