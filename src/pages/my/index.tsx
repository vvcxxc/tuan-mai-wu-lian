import Taro, { Component, Config } from "@tarojs/taro"
import { View, Image, Text, Button } from "@tarojs/components"
import request from '@/services/request'
import LoginAlert from '@/components/loginAlert';
import { getUserInfo } from '@/utils/getInfo';
import "./index.less"

type Props = any

interface State {
  emptyAvatar: String,
  settingShow: Boolean;
  cells: any;
  userInfo: any;
  user_img: string;
  data: string,
  activityList: Object[],
  list: Object[],
  userData: Object,
  showBounced: boolean,
  needLogin: boolean,
  mobile: number | string
}
export default class AppreActivity extends Component<Props> {
  config: Config = {
    navigationBarTitleText: "我的",
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ff4444',
    navigationBarTextStyle: 'white'
  };

  state: State = {
    emptyAvatar: '',
    settingShow: false,
    cells: {},
    userInfo: {},
    userData: {
      head_img: '',
      user_name: ''
    },
    user_img: '',
    data: '',
    activityList: [
      {
        des: '我的拼团活动',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/JXPsxjERwiZNEeJYjBtNeEkZDenaxRsw.png',
        path: "/activity-pages/my-activity/my.activity",
      }
      , {
        des: '我的增值活动',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/iKrnFcGfytkT6nGEiZYscGAwkmhwMtt4.png',
        path: "/activity-pages/my-activity/my.activity",
      },
    ],
    list: [
      {
        des: '我的邮寄礼品',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/en6B6t6aYzMPTwpFTWYxE378ykzasSeC.png',
        path: "/activity-pages/my-welfare/pages/gift/welfare.gift"
      }
      // ,
      // {
      //     des: '我的到店奖品',
      //     img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/Kw2nhNTkChiWrnX3nPiMMTxy87Efmj4w.png',
      //     path: "/activity-pages/my-prize/index"
      // }
      , {
        des: '我的收货地址',
        prompt: '',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/PhwEi7cAeBRncA6rhHBWrtKEyGGCraJz.png',
        path: "/activity-pages/Shipping-address/index",
      },
      {
        des: '我的邀请列表',
        prompt: '',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/JaSrdADTMkfAyZtwzn3mh2aEytc5yFpF.png',
        path: "/pages/my/invitation-list/index",
      },

    ],
    showBounced: false,//登录弹框
    needLogin: true,
    mobile: ''
  }

  componentDidShow() {
    let phone_status = Taro.getStorageSync('phone_status')
    this.handleGetUserinfo()
    request({
      url: 'v3/user/home_index'
    }).then((res: any) => {
      this.setState({
        userData: {
          head_img: res.data.avatar,
          user_name: res.data.user_name
        },
        emptyAvatar: res.data.emptyAvatar,
        mobile: res.data.mobile
      })
      if (res.data.mobile) {
        this.setState({ settingShow: true, needLogin: false })
      } else {
        this.setState({ settingShow: false, needLogin: true }, () => {
          if (this.state.needLogin) {
            this.setState({
              userData: {
                head_img: 'http://oss.tdianyi.com/front/ek7cPQsFbEt7DXT7E7B6Xaf62a46SCXw.png',
                user_name: ''
              },
            })
          }
        })
      }
      let myData: any = this.state.list
      myData[0].prompt = res.data.order_msg
      myData[1].prompt = res.data.gift_msg
      myData[2].prompt = res.data.activity_msg
      this.setState({ list: myData })
    })
  }

  /**
   * 获取用户信息
   */
  handleGetUserinfo = (): void => {
    const { userInfo } = this.state
    if (!userInfo.nickName) {
      const userInfo = Taro.getStorageSync("userInfo")
      if (userInfo) {
        this.setState({
          userInfo
        })
      } else {
        // const { toMiniProgramSign } = require("../../utils/sign")
        // toMiniProgramSign(process.env.BASIC_API)
      }
    }
  }

  // 跳转路径
  jumpData = (data: string) => {
    if (this.state.mobile) {
      Taro.navigateTo({ url: data })
      return
    }
    this.setState({ is_alert: true })
  }
  setPersonalInfo = () => {
    Taro.navigateTo({
      url: '/activity-pages/personal/index'
    })
  }
  // 手动登录跳转
  handLogin = () => {

    Taro.navigateTo({ url: '/pages/my/login_page/index' })
  }
  setOrderInfo = (type) => {
    Taro.setStorageSync("order_type", type)
    Taro.switchTab({
      url: '/pages/order/index'
    })
  }
  setActivityInfo = (type) => {
    if (this.state.mobile) {
      Taro.setStorageSync("activity_type", type)
      Taro.navigateTo({ url: '/activity-pages/my-activity/my.activity' })
      return
    }
    this.setState({ is_alert: true })
  }

  // 登录弹窗
  loginChange = (type: string) => {
    if (type == 'close') {
      this.setState({ is_alert: false })
    } else {
      // 重新请求当前数据
      this.handleGetUserinfo()
      request({
        url: 'v3/user/home_index'
      }).then((res: any) => {

        this.setState({
          userData: {
            head_img: res.data.avatar,
            user_name: res.data.user_name
          },
          emptyAvatar: res.data.emptyAvatar,
          mobile: res.data.mobile
        })
        let myData: any = this.state.list
        myData[0].prompt = res.data.order_msg
        myData[1].prompt = res.data.gift_msg
        myData[2].prompt = res.data.activity_msg
        this.setState({
          list: myData
        })
        if (res.data.mobile) {
          this.setState({ settingShow: true, needLogin: false })
        } else {
          this.setState({ settingShow: false, needLogin: true }, () => {
            if (this.state.needLogin) {
              this.setState({
                userData: {
                  head_img: 'http://oss.tdianyi.com/front/ek7cPQsFbEt7DXT7E7B6Xaf62a46SCXw.png',
                  user_name: ''
                },
              })
            }
          })
        }
      })
      // let phone_status = Taro.getStorageSync('phone_status')
      // let user = Taro.getStorageSync('user')
      // if (phone_status == 'binded' || phone_status == 'bind_success') {
      //   if (!user.avatar) {
      //     this.setState({ type: 'user' })
      //   }
      //   this.setState({ is_show: true })
      // } else {
      //   this.setState({ type: 'phone' })
      //   this.setState({ is_show: false })
      // }
      this.setState({ is_alert: false })
    }
  }

  setPersonal = (type: string) => {
    if (type == 'user') {
      Taro.navigateTo({
        url: '/pages/auth/index?type=userInfo',
      })
    } else {
      Taro.navigateTo({
        url: '/pages/auth/index',
      })
    }
  }

  toMember = () => {
    Taro.navigateTo({
      url: '/pages/member/index',
    })
  }

  render() {
    const { showBounced, needLogin } = this.state
    return (
      <View className="my-list">
        <View className="my-list-banner">
          {
            this.state.settingShow ?
              <Image className='my-list-set' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/nAP8aBrDk2yGzG7AdaTrPDWey8fDB2KP.png' onClick={this.setPersonalInfo} />
              : null
          }
          <View className="my-list-info">
            <View className="my-head">
              <Image className="my-head-img" src={this.state.userData.head_img} />
            </View>

            <View className="my-text">

              <View className="my-text-top">{this.state.userData.user_name}</View>
              {
                this.state.emptyAvatar == 'Y' && this.state.settingShow ?
                  <View className="my-text-btn" onClick={this.setPersonal.bind(this, 'user')}>一键获取用户头像</View> : null
              }
            </View>
            {
              needLogin ? <View className="my-text" onClick={this.setPersonal.bind(this, 'phone')}>
                <View className="my-text-top">登录手机号</View>
                <View className="my-text-btn">同步全渠道订单与优惠券</View>
              </View> : null
            }
          </View>
          <View className="my-member" onClick={this.toMember}>
            <View className="my-member-left">
              <Image className="my-member-left-icon" src="http://oss.tdianyi.com/front/txKFnKDjwkzjEacrJWzZ4DNyPeefMNMA.png" />
              <View className="my-member-left-info">我的会员等级</View>
            </View>
            <View className="my-member-right">
              <View className="my-member-right-info">立即查看</View>
              <Image className="my-member-right-icon" src="http://oss.tdianyi.com/front/AeDfZdwfppksiMzNKwxK8e2K5DEfsbpp.png" />
            </View>
          </View>
        </View>
        <View className="my-list-nav">
          <View className="my-list-nav-title-box" onClick={this.setOrderInfo.bind(this, '待使用')}>
            <View className="name-box">我的订单</View>
            <View className="icon-box" >
              <View className="icon-box-text">查看全部</View>
              <Image className="icon-box-icon" src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MWCtxcnQ6AmEpbHRedHfjeDhde2t5fr8.png' />

            </View>
          </View>
          <View className="my-list-nav-btn-box">
            <View className="nav-btn-item" onClick={this.setOrderInfo.bind(this, '待使用')}>
              <Image className='item-img' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/TThxprTzKKiDQZR2zA8zt7TH2bpGKewC.png' />
              <View className="item-text">待使用</View>
            </View>
            <View className="nav-btn-item" onClick={this.setOrderInfo.bind(this, '已完成')}>
              <Image className='item-img' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/NwjXRGmCTmymnjC52J3E7btfzDX2FX7t.png' />
              <View className="item-text">已完成</View>
            </View>
            <View className="nav-btn-item" onClick={this.setOrderInfo.bind(this, '已过期')}>
              <Image className='item-img' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/GfMPAZctjGhKbbr2HXjdkdAsdj3WaKTr.png' />
              <View className="item-text">已过期</View>
            </View>
            <View className="nav-btn-item" onClick={this.setOrderInfo.bind(this, '已退款')}>
              <Image className='item-img-refund' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/zjbwTHQJEWZh2waG6K2xYjkAP26Gbktr.png' />
              <View className="item-text">已退款</View>
            </View>
          </View>
        </View>
        <View className="my-tab-content">
          <View className="my-tab-item" onClick={this.setActivityInfo.bind(this, '拼团')}>
            <View className="tab-item-box">
              <Image className='item-box-img' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/JXPsxjERwiZNEeJYjBtNeEkZDenaxRsw.png' />
              <View className="item-box-text">我的拼团活动</View>
            </View>
            <Image className="tab-item-icon" src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MWCtxcnQ6AmEpbHRedHfjeDhde2t5fr8.png' />
          </View>
          <View className="my-tab-item" onClick={this.setActivityInfo.bind(this, '增值')}>
            <View className="tab-item-box">
              <Image className='item-box-img' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/iKrnFcGfytkT6nGEiZYscGAwkmhwMtt4.png' />
              <View className="item-box-text">我的增值活动</View>
            </View>
            <Image className="tab-item-icon" src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MWCtxcnQ6AmEpbHRedHfjeDhde2t5fr8.png' />
          </View>

        </View>
        <View className="my-tab-content">
          {
            this.state.list.map((item: any, index) => {
              return <View className="my-tab-item" key={item} onClick={this.jumpData.bind(this, item.path)}>
                <View className="tab-item-box">
                  <Image className='item-box-img' src={item.img} />
                  <View className="item-box-text">{item.des}</View>
                </View>
                <Image className="tab-item-icon" src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MWCtxcnQ6AmEpbHRedHfjeDhde2t5fr8.png' />
              </View>
            })
          }
        </View>
        {
          this.state.is_alert ? <LoginAlert onChange={this.loginChange} /> : null
        }
      </View>
    );
  }
}
