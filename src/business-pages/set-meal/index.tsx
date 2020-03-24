import Taro, { Component } from "@tarojs/taro";
import { AtIcon } from 'taro-ui';
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.styl";
import ApplyToTheStore from '@/components/applyToTheStore';
import { discountCoupons, shopPoster } from "./service";
import ShareBox from "@/components/share-box"; //分享组件
import CouponsPoster from '@/components/poster/coupons'//海报
import { getLocation } from "@/utils/getInfo";
import LoginAlert from '@/components/loginAlert';
import Zoom from '@/components/zoom';
import { getXcxQrcode } from "@/api";
// import ShareBox from '@/components/share-box';
const H5_URL = process.env.H5_URL
export default class AppreActivity extends Component {
  config = {
    navigationBarTitleText: "兑换券",
    enablePullDownRefresh: false
  };

  state = {
    imgZoomSrc: '',
    imgZoom: false,
    bannerImgIndex: 0,
    yPoint: '',
    xPoint: '',
    keepCollect_data: "",
    //表面收藏
    keepCollect_bull: false,
    coupon: {
      invitation_user_id: '',
      begin_time: "",
      brief: "",
      //真正的收藏
      collect: "",
      description: [],
      end_time: "",
      icon: "",
      id: 0,
      image: "",
      image_type: 1,
      list_brief: "",
      own: "",
      label: [''],
      pay_money: "",
      return_money: "",
      yname: "",
      youhui_type: 0,
      expire_day: '',
      share_text: ''//要分享的文字信息
    },
    store: {
      brief: "",
      id: 0,
      open_time: "",
      route: "",
      saddress: "",
      sname: "",
      tel: "",
      distance: "",
      shop_door_header_img: "",
      xpoint: 0,
      ypoint: 0
    },
    goods_album: [
      {
        id: 0,
        image_url: ""
      }
    ],
    recommend: [{
      begin_time: "",
      brief: "",
      end_time: "",
      id: 0,
      image: "",
      list_brief: "",
      open_time: "",
      pay_money: "",
      return_money: "",
      sname: "",
      yname: "",
      youhui_type: 0,
      expire_day: '',
    }],

    isFromShare: false,
    is_alert: false,
    showAll: false,
    showMoreRules: false,
    showShare: false, //显示分享
    showPoster: false, //显示海报
    posterList: {}
  }

  componentDidMount() {
    let youhui_id = this.$router.params.id
    shopPoster({ youhui_id, from: 'wx' })
      .then(({ data, code }) => {
        this.setState({ posterList: data })
        let link = data.link
        getXcxQrcode({ link })
          .then((res) => {
            let meta = this.state.posterList
            meta['wx_img'] = 'https://test.api.tdianyi.com/' + res.data.url
            this.setState({ posterList: meta })
          })
      })
  }

  /**
    * 回首页
    */
  handleGoHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  /**
       * 获取定位
       */
  componentDidShow() {
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) { this.setState({ isFromShare: true }) }
    Taro.showLoading({ title: 'loading', mask: true })
    Taro.getLocation({
      type: 'gcj02',
      success: res => {
        this.getTicketInfo(this.$router.params.id, { ypoint: res.latitude || '', xpoint: res.longitude || '' })
      },
      fail: () => {
        this.getTicketInfo(this.$router.params.id, { xpoint: '', ypoint: '' })
      }
    })
  }

  /**
     * 获取券信息
     */
  getTicketInfo = (id: number | string, data: object) => {
    discountCoupons(id, data)
      .then((res: any) => {
        Taro.hideLoading()
        this.setState({
          coupon: res.data.info.coupon,
          store: res.data.info.store,
          goods_album: res.data.info.goods_album,
          recommend: res.data.recommend.data
        })
      }).catch(err => {
        Taro.hideLoading()
        Taro.showToast({ title: '信息错误', icon: 'none' })
        setTimeout(() => { Taro.navigateBack() }, 2000)
      })
  }


  /**
      * 去支付
      */
  goToPay = (id, e) => {
    let phone_status = Taro.getStorageSync('phone_status')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      Taro.navigateTo({
        url: '../../business-pages/confirm-order/index?id=' + id
      })
    } else {
      this.setState({ is_alert: true })
    }
  }

  // 登录弹窗
  loginChange = (type: string) => {
    if (type == 'close') {
      this.setState({ is_alert: false })
    } else {
      // 重新请求当前数据
      this.setState({ is_alert: false })
    }
  }

  /**
      * 其他现金券
      */
  gotoTicketBuy = (type, _id, e) => {
    if (type == 0) {
      Taro.navigateTo({ url: '../set-meal/index?id=' + _id })
    } else {
      Taro.navigateTo({ url: '../ticket-buy/index?id=' + _id })
    }
  }

  copyText = () => {
    let code = this.state.coupon.share_text.replace(/@#@#/, H5_URL)
    Taro.setClipboardData({
      data: code,
      success() {
        Taro.showToast({ title: '复制成功，请前往微信发送给好友。', icon: 'none' })
      },
      fail() {
        Taro.showToast({ title: '复制失败，请刷新页面重试', icon: 'none' })
      },
      complete: () => {
        this.setState({ showShare: false })
      },
    })
  }


  onShareAppMessage = () => {
    return {
      title: this.state.store.sname + '送福利啦！' + this.state.coupon.return_money + '元兑换券下单立刻抵扣，快点抢！',
      path: '/business-pages/set-meal/index?id=' + this.state.coupon.id + '&invitation_user_id=' + this.state.coupon.invitation_user_id,
      imageUrl: this.state.coupon.image
    }
  }

  render() {
    const { description } = this.state.coupon;
    return (
      <View className="appre-activity-detail">
        <ShareBox
          show={this.state.showShare}
          onClose={() => this.setState({ showShare: false })}
          sendText={this.copyText}
          sendLink={this.onShareAppMessage}
          createPoster={() => {
            this.setState({ showPoster: true })
          }}
        />
        <CouponsPoster
          show={this.state.showPoster}
          list={this.state.posterList}
          onClose={() => {
            this.setState({ showPoster: false, showShare: false })
          }}
        />
        <Image className='appre-banner' src={this.state.coupon.image}
          onClick={(e) => {
            this.setState({ imgZoom: true, imgZoomSrc: this.state.coupon.image })
          }}
        />
        <View className="banner-number-box">
          <View className="banner-number">1</View>
          <View className="banner-number">1</View>
        </View>
        {/* <View className="collect-box">
          <Image className="collect-img" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" />
        </View>
        <View className="share-box">
          <Image className="share-img" src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
        </View> */}
        <View className="appre-info-content">
          <View className="appre-info-title">
            <View className="appre-info-title-label">兑换券</View>
            <View className="appre-info-title-text">{this.state.coupon.yname}</View>
          </View>
          <View className="appre-info-price">
            <View className="appre-price-info">
              <View className="appre-price-info-text">优惠价￥</View>
              <View className="appre-price-info-new">{this.state.coupon.pay_money}</View>
              <View className="appre-price-info-old">￥{this.state.coupon.return_money}</View>
            </View>
            <View className="appre-price-discounts">已优惠￥{Number(this.state.coupon.return_money) - Number(this.state.coupon.pay_money)}</View>
          </View>

        </View>
        <Image className="appre-banner-img" src="http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png" />

        <View className="appre-store-info">
          <ApplyToTheStore
            id={this.state.store.id}
            isTitle={true}
            img={this.state.store.shop_door_header_img}
            name={this.state.store.sname}
            phone={this.state.store.tel}
            address={this.state.store.saddress}
            location={{ xpoint: this.state.store.xpoint, ypoint: this.state.store.ypoint }}
            meter={this.state.store.distance}
          />
        </View>



        <View className="appre-rules">
          <View className="appre-title-box">
            <View className='appre-title-left'></View>
            <View className='appre-title'>使用说明</View>
          </View>

          <View className="appre-rules-item" >
            <View className="rules-key">有效期：</View>
            <View className="rules-words">购买后{this.state.coupon.expire_day}天内可用</View>
          </View>
          {
            description && description.length && !this.state.showMoreRules ? <View>
              <View className="appre-rules-list-title" >使用规则：</View>
              {
                description.length > 0 ? <View className="appre-rules-list-text" >-{description[0]}</View> : null
              }
              {
                description.length > 1 ? <View className="appre-rules-list-text" >-{description[1]}</View> : null
              }
              {
                description.length > 2 ? <View className="appre-rules-list-text" >-{description[2]}</View> : null
              }
              {
                description.length > 3 ? <View className="appre-rules-list-text" >-{description[3]}</View> : null
              }
            </View> : null
          }
          {
            description && description.length && description.length > 4 && this.state.showMoreRules ? <View>
              <View className="appre-rules-list-title" >使用规则：</View>
              {
                description.map((item) => {
                  return (
                    <View className="appre-rules-list-text" >-{item}</View>
                  )
                })
              }
            </View> : null
          }
          {
            description && description.length && description.length > 4 && !this.state.showMoreRules ? <View className="appre-more" onClick={() => { this.setState({ showMoreRules: true }) }} >
              <Image className="appre-more-icon" src={"http://oss.tdianyi.com/front/GQr5D7QZwJczZ6RTwDapaYXj8nMbkenx.png"} />
              <View className="appre-more-text" >查看更多</View>
            </View> : null
          }
        </View>

        {
          this.state.recommend && this.state.recommend.length > 0 ?
            <View className="more_goods">
              <View className="title-box">
                <View className='title-left'></View>
                <View className="title">更多本店宝贝</View>
              </View>
              {
                this.state.recommend.length > 0 && !this.state.showAll ? <View className="good_info">
                  <View className="good_msg">
                    <Image className="good_img" src={this.state.recommend[0].image} />

                    <View className="good_detail">
                      <View className="good_detail_info">
                        <View className="good_title">
                          <View className="good_type">
                            <View className="text">{this.state.recommend[0].youhui_type == 0 ? "兑换券" : "现金券"}</View>
                          </View>
                          <View className="good_cash">{this.state.recommend[0].sname}</View>
                        </View>
                        <View className="good_desc">
                          <View className="good_desc_info">购买后{this.state.recommend[0].expire_day}天内有效</View>
                        </View>
                      </View>
                      <View className="good_money">
                        <View className="good_new_money">￥{this.state.recommend[0].pay_money}</View>
                        <View className="good_old_money">￥{this.state.recommend[0].return_money}</View>
                      </View>
                    </View>
                  </View>

                  <View className="good_btn" onClick={this.gotoTicketBuy.bind(this, this.state.recommend[0].youhui_type, this.state.recommend[0].id)}>
                    <View className="text">抢购</View>
                  </View>
                </View> : null
              }
              {
                this.state.recommend.length > 1 && !this.state.showAll ? <View className="good_info">
                  <View className="good_msg">
                    <Image className="good_img" src={this.state.recommend[1].image} />
                    <View className="good_detail">
                      <View className="good_detail_info">
                        <View className="good_title">
                          <View className="good_type">
                            <View className="text">{this.state.recommend[1].youhui_type == 0 ? "兑换券" : "现金券"}</View>
                          </View>
                          <View className="good_cash">{this.state.recommend[1].sname}</View>
                        </View>
                        <View className="good_desc">
                          <View className="good_desc_info">购买后{this.state.recommend[1].expire_day}天内有效</View>
                        </View>
                      </View>
                      <View className="good_money">
                        <View className="good_new_money">￥{this.state.recommend[1].pay_money}</View>
                        <View className="good_old_money">￥{this.state.recommend[1].return_money}</View>
                      </View>
                    </View>
                  </View>
                  <View className="good_btn" onClick={this.gotoTicketBuy.bind(this, this.state.recommend[1].youhui_type, this.state.recommend[1].id)}>
                    <View className="text">抢购</View>
                  </View>
                </View> : null
              }
              {
                this.state.showAll && this.state.recommend.map((item) => (
                  <View className="good_info">
                    <View className="good_msg">
                      <Image className="good_img" src={item.image} />

                      <View className="good_detail">
                        <View className="good_detail_info">
                          <View className="good_title">
                            <View className="good_type">
                              <View className="text">{item.youhui_type == 0 ? "兑换券" : "现金券"}</View>
                            </View>
                            <View className="good_cash">{item.sname}</View>
                          </View>
                          <View className="good_desc">
                            <View className="good_desc_info">购买后{item.expire_day}天内有效</View>
                          </View>
                        </View>
                        <View className="good_money">
                          <View className="good_new_money">￥{item.pay_money}</View>
                          <View className="good_old_money">￥{item.return_money}</View>
                        </View>
                      </View>
                    </View>

                    <View className="good_btn" onClick={this.gotoTicketBuy.bind(this, item.youhui_type, item.id)}>
                      <View className="text">抢购</View>
                    </View>
                  </View>
                ))
              }
              {
                this.state.recommend.length && this.state.recommend.length > 2 && !this.state.showAll ?
                  <View className="load_more" onClick={() => this.setState({ showAll: !this.state.showAll })}>
                    <View><AtIcon value='chevron-down' size="18" color='#999'></AtIcon>点击查看更多</View>
                  </View> : (this.state.recommend.length && this.state.recommend.length > 2 && !this.state.showAll ?
                    <View className="load_more" onClick={() => this.setState({ showAll: !this.state.showAll })}>
                      <View><AtIcon value='chevron-up' size="18" color='#999'></AtIcon>收起</View>
                    </View> : null
                  )
              }
            </View> : ""
        }

        <View className="appre-buy-box" >
          <View className="appre-buy-price-box" >
            <View className="appre-buy-price-icon" >￥</View>
            <View className="appre-buy-price-num" >{this.state.coupon.pay_money}</View>
          </View>
          <View className="appre-buy-btn-box" >
            <View className="appre-buy-btn-left" onClick={() => {
              this.setState({ showShare: true })
            }}>分享活动</View>
            <View className="appre-buy-btn-right" onClick={this.goToPay.bind(this, this.state.coupon.id)}>立即购买</View>

          </View>
        </View>
        {
          this.state.is_alert ? <LoginAlert onChange={this.loginChange} /> : null
        }
        {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '100rpx', right: '20rpx', zIndex: 88, width: '80rpx', height: '80rpx' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../assets/go-home/go_home.png')} style={{ width: '80rpx', height: '80rpx' }} />
            </View>
          ) : ''
        }

        <Zoom
          src={this.state.imgZoomSrc}
          showBool={this.state.imgZoom}
          onChange={() => { this.setState({ imgZoom: !this.state.imgZoom }) }}
        />
      </View>
    );
  }
}
