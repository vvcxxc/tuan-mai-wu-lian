import Taro, { Component, Config } from "@tarojs/taro"
// import { View } from "@tarojs/components";
import { Block, View, Image, Text, Navigator } from "@tarojs/components"
import request from '@/services/request'
import "./index.styl"
import { url } from "inspector"
import LoginAlert from '@/components/loginAlert';
type Props = any

interface Cell {
  text: string;
  icon: string;
  path: string;
}

interface State {
  cells: any;
  userInfo: any;
  user_img: string;
  data: string,
  list: Object[],
  userData: Object,
  type: string,
  is_alert: boolean
}

export default class NewPage extends Component<Props>{

  config: Config = {
    navigationBarTitleText: "我的"
  }

  state: State = {
    cells: {},
    userInfo: {},
    userData: {},
    user_img: '',
    type: '', // user: 未设置用户信息，phone: 未绑定手机号，为空不展示
    data: '',
    is_alert: false, //登录弹窗
    list: [
      {
        des: '我的订单',
        prompt: '有快到期的券',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/XWWfhzTJEXwsB6DKczbKBNRpbDASRDsW.png',
        path: "/pages/order/index",
      }
      , {
        des: '我的礼品',
        prompt: '有正在配送的礼品',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/BjNjHfJ2FstMaB4PjNbCChCS6D2FDJb5.png',
        path: "/activity-pages/my-welfare/pages/gift/welfare.gift"
      }, {
        des: '我参与的活动',
        prompt: '有正在进行的拼团活动',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/r55CxTJ4AAkmZFHRESeFs2GAFDCJnW5Z.png',
        path: "/activity-pages/my-activity/my.activity",
      }
      ,
      {
        des: '我的收货地址',
        prompt: '',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/FMMGCc7ecQ38FT3tYct45NEfBFJbhRFz.png',
        path: "/activity-pages/Shipping-address/index",
      }
    ]
  }



  componentDidShow() {
    this.handleGetUserinfo()
    request({
      url: 'v3/user/home_index'
    }).then((res: any) => {

      this.setState({
        userData: {
          head_img: res.data.avatar,
          user_name: res.data.user_name
        }
      })
      let myData: any = this.state.list
      myData[0].prompt = res.data.order_msg
      myData[1].prompt = res.data.gift_msg
      myData[2].prompt = res.data.activity_msg
      this.setState({
        list: myData
      })
      // console.log(res,'res')
      // this.setState({
      //   user_img: res.data.avatar
      // })

    })

    let phone_status = Taro.getStorageSync('phone_status')
    let user = Taro.getStorageSync('user')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      if (!user.avatar) {
        this.setState({ type: 'user' })
      }
    } else {
      this.setState({ type: 'phone' })
    }
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
    let phone_status = Taro.getStorageSync('phone_status')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      if (data.indexOf('order') > 0) {
        Taro.switchTab({ url: data })
      } else {
        Taro.navigateTo({
          url: data
        })
      }
    } else {
      this.setState({ is_alert: true })
    }
  }
  //临时跳转测试
  gotoPersonal = () => {
    Taro.navigateTo({
      url: '/activity-pages/personal/index'
    })
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
          }
        })
        let myData: any = this.state.list
        myData[0].prompt = res.data.order_msg
        myData[1].prompt = res.data.gift_msg
        myData[2].prompt = res.data.activity_msg
        this.setState({
          list: myData
        })
        // console.log(res,'res')
        // this.setState({
        //   user_img: res.data.avatar
        // })

      })
      this.setState({ is_alert: false })
    }
  }
  setPersonalInfo = () => {
    Taro.navigateTo({
      url: '/activity-pages/personal/index'
    })
  }
  render() {
    const { type } = this.state
    return (
      <View className='newPage'>
        <Image className='settleIcon' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/nAP8aBrDk2yGzG7AdaTrPDWey8fDB2KP.png' onClick={this.setPersonalInfo.bind(this)} />
        <View className='newPage_head'>
          <View className="img_box">
            <Image src={this.state.userData.head_img} onClick={this.gotoPersonal} />
          </View>

          {
            type == 'phone' ? (
              <View>
                <View className='phone_text'>登录手机号，同步全渠道订单与优惠券</View>
                <View className='setPersonalInfoBox' onClick={this.setPersonal.bind(this, 'phone')} >
                  <View className='setPersonalInfo' >登录</View>
                </View>
              </View>
            ) : type == 'user' ? (
              <View>
                <View className='userName'>{this.state.userData.user_name}</View>
                <View className='setPersonalInfoBox' onClick={this.setPersonal.bind(this, 'user')} >
                  <View className='setPersonalInfo' >一键设置头像</View>
                </View>
              </View>
            ) : null
          }

          {/* <View className='giftMoney'>
          <Text className='white'>礼品币</Text>
          <Text className='yellow'>27</Text>
        </View> */}
        </View>

        <View className="newPage_content">
          <View className="content">
            {
              this.state.list.map((item: any, index) => {
                return <View className="list" onClick={this.jumpData.bind(this, item.path)}>
                  <View className="list_content">
                    <View className="list_left">
                      <Image src={item.img} />
                      <View className="des">{item.des}</View>
                    </View>
                    <View className="list_right">
                      <Text className="prompt">{item.prompt}</Text>
                      <Image src={require('../../assets/right_arro.png')} className='back' />
                    </View>
                  </View>
                </View>
              })
            }
          </View>
        </View>
        {
          this.state.is_alert ? <LoginAlert onChange={this.loginChange} /> : null
        }


        {/* <View className="newPage_foot">
          客服电话：10101010 <Text className='left'>（服务时间：9：00~20：00）</Text>
        </View> */}
      </View>
    )
  }
}
