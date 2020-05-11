import Taro, { Component } from "@tarojs/taro"
import {
  Block,
  View,
  Text,
  Image,
  ScrollView,
  Button,
} from "@tarojs/components"
import "./style.styl"
import {
  getCouponinforForGroup,
  getGiftinfo,
  getCouponForGroup,
  getQrcode,
  listenQrcodeForGroup
} from "@/api"
import { getTime } from '@/utils/common';
import { getLocation } from "@/utils/getInfo"
import { GROUP_AREADY, UNUSED, USED } from "../../data"
import { ACTION_JUMP, ACTION_USE, ACTION_VIEW, ACTION_CLOSE } from "@/utils/constants"
import Coupon from "@/components/coupon/coupon"
import Qrcode from "@/components/qrcode/qrcode"
import dayjs from 'dayjs'
let timer = null;
let timer2 = null
interface State {
  basicinfo: any;
  giftBasicInfo: any;
  list: any[];
  isFinish: boolean;
  isJoin: boolean;
  isShowUse: boolean;
  isQrcode: boolean;
  base64: string;
  isShowStartGroup: boolean;
  time: any;
  isFromShare: boolean;
  groupDesc: string
}
export default class Group extends Component {
  config = {
    navigationBarTitleText: "拼团"
  }
  state: State = {
    basicinfo: {},
    giftBasicInfo: {},
    list: [],
    isFinish: false,
    isJoin: false,
    isShowUse: false,
    isQrcode: false,
    base64: "",
    isShowStartGroup: false,
    time: {
      date: '',
      display: 2
    },
    isFromShare: false,
    groupDesc: ''
  }
  async componentDidShow() {
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) {
      this.setState({
        isFromShare: true
      })
    }

    // Taro.showShareMenu()
    const { id = "" } = this.$router.params
    /**
     * 授权认证用
     */
    Taro.setStorageSync("authid", id)
    const location = await getLocation().catch(err => {
      console.log(err)
    })
    await this.fetchBasicinfo(id)
    await this.fetchCoupon(location)
    this.setTime()

  }

  onShareAppMessage() {
    const { share: { title, small_img: imageUrl } } = this.state.basicinfo
    const { id = "" } = this.$router.params
    let router = Taro.getStorageSync('router')
    let path = ''
    if(router.type_index_id == 0 || router.type_index_id == 1){
      path = `/pages/activity/pages/group/group?id=${id}&invitation_user_id=${this.state.basicinfo.invitation_user_id}&c_id${router.city_id}&c_name${router.city_name}&type_id${router.type_index_id}`
    }else {
      path = `/pages/activity/pages/group/group?id=${id}&invitation_user_id=${this.state.basicinfo.invitation_user_id}`
    }
    return {
      title,
      imageUrl,
      path
    }
  }

  /**
   * 点击动作(如果是跳转动作的时候, 带上参数type, id, publictypeid)
   */
  handleClick = (e): void => {
    const { action, type } = e.currentTarget.dataset
    this.handleAction(action, null, type)
  }

  /**
   * 用户动作集中处理(跳转, 查看, 使用, 关闭动作)
   */
  // @ts-ignore
  handleAction = (action: string, data: any, type = 0): void => {
    switch (action) {
      case ACTION_JUMP: {
        const {
          youhui_id: id,
          id: publictypeid,
          gift_id,
          activity_id
        } = this.state.basicinfo
        let dataId = 0
        if (data && data.id) {
          dataId = data.id
        }
        const invitation_user_id = this.$router.params.invitation_user_id ? '&invitation_user_id='+this.$router.params.invitation_user_id : ''
        Taro.navigateTo({
          // url: `/pages/activity/pages/detail/detail?id=${dataId || id}&type=${+type === 55 ? 55 : 5}&gift_id=${gift_id}&activity_id=${activity_id}&publictypeid=${dataId || publictypeid}`,
          url: `/pages/activity/group/index?id=${dataId || id}&type=${+type === 55 ? 55 : 5}&gift_id=${gift_id}&activity_id=${activity_id}&publictypeid=${dataId || publictypeid}${invitation_user_id}`
        })
        break
      }
      case ACTION_VIEW: {
        const { gift_id, activity_id } = this.state.basicinfo
        Taro.navigateTo({
          // url: `/pages/gift/gift?gift_id=${gift_id}&activity_id=${activity_id}`
          url: `/detail-pages/gift/gift?gift_id=${gift_id}&activity_id=${activity_id}`
        })
        break
      }
      case ACTION_USE:
        this.fetchQrcode()
        break
      case ACTION_CLOSE:
        this.setState({
          isQrcode: false
        })
        break
      default:
        console.log("no action~")
    }
  }

  /**
   * 计算: 已完成?|参团?|去使用?
   */
  handleCalculate = (data: any): void => {
    const {
      number: groupNumber,
      participation_number: groupParticipator,
      is_group_participation,
      is_employ
    } = data
    const isFinish = groupParticipator === groupNumber
    const isJoin = is_group_participation !== GROUP_AREADY
    const isShowUse = isFinish && (is_employ === UNUSED)
    const isShowStartGroup = isFinish && !is_group_participation
    // const isFinish = false
    // const isJoin = true
    // const isShowUse = false
    this.setState({
      isFinish,
      isJoin,
      isShowUse,
      isShowStartGroup
    })
  }

  /**
   * 监听二维码的使用(, 太屌了👀)
   */
  async fetchListenQrcode(): Promise<void> {
    const {
      basicinfo: { youhui_log_id }
    } = this.state
    const { status } = await listenQrcodeForGroup({ youhui_log_id })
    if (+status === USED) {
      this.setState({
        isQrcode: false
      })
    }
    timer = setTimeout(() => {
      const { isQrcode } = this.state
      clearTimeout(timer)
      isQrcode && this.fetchListenQrcode()
    }, 2000)
  }
  /**
   * 定时
   */
  setTime = () => {
    let times = dayjs(this.state.basicinfo.end_at).unix()
    if (this.state.time.display <= 0) {
      clearTimeout(timer2)
      return
    } else {
      timer2 = setTimeout(() => {
        clearTimeout(timer)
        let time = getTime(times)
        this.setState({
          time
        })
        this.setTime()
      }, 1000)
    }
  }
  componentWillUnmount() {
    clearTimeout(timer)
    clearTimeout(timer2)
  }

  /**
   * 获取二维码(, "去使用"按钮)
   */
  async fetchQrcode(): Promise<void> {
    const { youhui_log_id } = this.state.basicinfo
    const { data, code } = await getQrcode({ youhui_log_id })
    if (code == 0) {
      Taro.showToast({ title: '卡券已核销使用' })
    } else {
      this.setState({
        isQrcode: true,
        base64: data
      })
      this.fetchListenQrcode()
    }
  }

  /**
   * 获取券列表
   */
  async fetchCoupon(userLocation): Promise<void> {
    const params = {
      xpoint: userLocation.longitude || "",
      ypoint: userLocation.latitude || ""
    }
    const { data } = await getCouponForGroup(params)
    this.setState({
      list: data
    })
  }

  /**
   * 获取礼品信息
   */
  async fetchGiftinfo(gift_id: string, activity_id: string): Promise<void> {
    if (!activity_id || !gift_id) return
    if (+gift_id === 0) return
    const params = {
      activity_id,
      gift_id
    }
    const { data } = await getGiftinfo(params)
    this.setState({
      giftBasicInfo: data
    })
  }

  /**
   * 获取基本信息
   */
  async fetchBasicinfo(id: string): Promise<void> {
    const params = {
      group_id: id
    }
    const { data } = await getCouponinforForGroup(params)
    const { gift_id = "", activity_id = "" } = data
    this.fetchGiftinfo(gift_id, activity_id)
    this.handleCalculate(data)
    this.setState({
      basicinfo: data
    }, () => {
      let res = this.groupDesc()
      this.setState({ groupDesc: res })
    })
  }
  toMoreGroup = () => {
    Taro.navigateTo({
      url: '/pages/activity/pages/list/list?type=5'
    })
  }

   /**
    * 回首页
    */
   handleGoHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  groupDesc = () => {
    if (this.state.time.display > 0) {
      // 活动未结束
      if (this.state.isFinish) {
        // 活动完成
        return "拼团已经完成, 感谢您的参与!"
      } else {
        // 活动未完成
        if (this.state.basicinfo.is_group_participation) {
          // 参与
          const surplus = this.state.basicinfo.number
            ? this.state.basicinfo.number - this.state.basicinfo.participation_number
            : 0
          return `还差${surplus}人成团`
        } else {
          // 未参与
          const surplus = this.state.basicinfo.number
            ? this.state.basicinfo.number - this.state.basicinfo.participation_number
            : 0
          return `仅剩${surplus}个名额`
        }
      }
    } else {
      // 活动结束
      if (this.state.isFinish) {
        // 活动完成
        return "拼团已经完成, 感谢您的参与!"
      } else {
        // 活动未完成
        if (this.state.basicinfo.is_group_participation) {
          return '拼团失败，金额已返还至账户'
        } else {
          return '本拼团已结束，可前往查看更多拼团活动'
        }
      }
    }
  }

  render() {
    const {
      basicinfo,
      giftBasicInfo,
      list,
      isFinish,
      isShowUse,
      isJoin,
      isQrcode,
      base64,
      isShowStartGroup,
      groupDesc
    } = this.state
    // console.log(this.state.basicinfo.is_group_participation)
    // const surplus = basicinfo.number
    //   ? basicinfo.number - basicinfo.participation_number
    //   : 0
    // const groupDesc = this.state.time.display > 0 ? isFinish
    //   ? "拼团已经完成, 感谢您的参与!"
    //   : `还差${surplus}人成团` : this.state.basicinfo.is_group_participation ? '拼团失败，金额已返还至账户' : '活动已结束，更多活动正在进行中'
    return (
      <Block>
        <View className="group" style="background-image: url(http://tmwl-resources.tdianyi.com/miniProgram/MiMaQuan/img_group.png)">
          <View className="container">
            <View className="area-title">拼团</View>
            <View className="area-panel">
              <View className="coupon-info">
                <View className="avatar">
                  <Image className="icon" src={basicinfo.image} />
                </View>
                <View className="description">
                  <View className="item name">{basicinfo.name}</View>
                  <View className="item brief">
                    {basicinfo.list_brief || "暂无"}
                  </View>
                  <View className="item remark">
                    <View className="classify">
                      {`${basicinfo.number}人团`}
                    </View>
                    <View className="price">
                      {`${basicinfo.participation_money}元`}
                    </View>
                    <View className="price-old">
                      {`原价${basicinfo.pay_money}元`}
                    </View>
                  </View>
                </View>
              </View>
              <View className="time">
                {!isFinish ? <View className="time">
                  <Text className="text">距离结束时间还剩:</Text>
                  <Text>{this.state.time.date}</Text>
                </View> : null}
              </View>
              <ScrollView
                scrollX
                style="margin-top: 25px; height: 50px; white-space: nowrap;"
              >
                <View className="participator-wrapper">
                  {
                    basicinfo.rsParticipate.map((item, index) => {
                      return (
                        <View className="item" key={item}>
                          <Image className="icon" src={item.user_portrait} />
                        </View>
                      )
                    })
                  }
                </View>
              </ScrollView>
              <View className="group-tips">{groupDesc}</View>
              {
                this.state.time.display > 0 ? (
                  <View>
                    {
                      isShowStartGroup ? (<View className='actions'>
                        <Button
                          className="item join"
                          data-action="jump"
                          data-publictypeid={basicinfo.id}
                          data-id={basicinfo.youhui_id}
                          data-type="5"
                          onClick={this.handleClick}
                        >
                          我也要发起拼团
                    </Button>
                      </View>) : (
                          <View className="actions">
                            {
                              isJoin && (
                                <Button
                                  className="item join"
                                  data-action="jump"
                                  data-publictypeid={basicinfo.id}
                                  data-id={basicinfo.youhui_id}
                                  data-type="55"
                                  onClick={this.handleClick}
                                >
                                  参加拼团
                          </Button>
                              )
                            }
                            {
                              isShowUse && (
                                <Button
                                  className="item used"
                                  data-action="use"
                                  onClick={this.handleClick}
                                >
                                  去使用
                        </Button>
                              )
                            }
                            {
                              // 未完成就表示可以参团
                              !isFinish && (
                                <Button
                                  className="item invite"
                                  openType="share"
                                >
                                  邀请好友参团
                        </Button>
                              )
                            }
                          </View>
                        )
                    }
                  </View>
                ) : isShowUse && this.state.basicinfo.is_group_participation ? (
                  (
                    <View className="actions">
                      <Button
                        className="item used"
                        data-action="use"
                        onClick={this.handleClick}
                      >
                        去使用
                  </Button>
                    </View>
                  )
                ) : (
                      <View className='actions'>
                        <Button
                          className="item used"
                          onClick={this.toMoreGroup}
                        >
                          查看更多拼团送礼
                    </Button>
                      </View>
                    )
              }


            </View>
            {
              giftBasicInfo.gift_title &&
              (
                <View className="gift-wrapper">
                  <View
                    className="area-gift"
                    data-action="view"
                    onClick={this.handleClick}
                  >
                    <View
                      className="title"
                      style={`background-image: url(http://tmwl-resources.tdianyi.com/miniProgram/MiMaQuan/img_sharp.png)`}
                    >
                      赠送礼物
                    </View>
                    <View className="split" />
                    <View className="tips">点击查看</View>
                    <View className="content">
                      <Image className="icon" src={giftBasicInfo.cover_image} />
                      <View className="description">
                        <View className="name">{giftBasicInfo.gift_title}</View>
                        <View className="brief">{giftBasicInfo.title}</View>
                        <View className="price">￥{giftBasicInfo.postage}</View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            }
            <View className="area-coupon">
              {
                list.map((item, index) => {
                  return (
                    <Coupon
                      key={''}
                      data={item}
                      onAction={this.handleAction}
                    />
                  )
                })
              }
            </View>
          </View>
          {isQrcode && <Qrcode data={base64} onAction={this.handleClick} />}

          {/* 去首页 */}
          {
            this.state.isFromShare ? (
              <View style={{ position: 'fixed', bottom: '200rpx', right: '40rpx', zIndex: 88, width: '160rpx', height: '160rpx' }} onClick={this.handleGoHome.bind(this)}>
                <Image src={require('../../../../assets/go_home.png')}  style={{ width: '160rpx', height: '160rpx' }}/>
              </View>
            ) : ''
          }
        </View>
      </Block>
    )
  }
}
