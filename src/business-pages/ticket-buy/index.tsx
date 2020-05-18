import Taro, { Component } from "@tarojs/taro";
import { AtIcon } from 'taro-ui';
// import { AtIcon, AtToast, AtTabs, AtTabsPane } from "taro-ui";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.styl";
import ApplyToTheStore from '@/components/applyToTheStore';
// import TimeUp from '@/components/TimeUp';
// import LandingBounced from '@/components/landing_bounced'//登录弹框
// import Cookie from 'js-cookie';
import ShareBox from "@/components/share-box"; //分享组件
import VouchersPoster from '@/components/poster/vouchers'//海报
import request from '../../services/request'

import { discountCoupons, moneyPoster } from "./service";
import { getLocation } from "@/utils/getInfo";
import LoginAlert from '@/components/loginAlert';
import Zoom from '@/components/zoom';
import { getXcxQrcode } from "@/api";
import { accSubtr } from '@/utils/common'
import { accSub, accAdd } from '@/components/acc-num'

// import ShareBox from '@/components/share-box';
const BASIC_API = process.env.BASIC_API;
export default class TicketBuy extends Component {
  config = {
    navigationBarTitleText: "现金券",
    enablePullDownRefresh: false
  };

  state = {
    imgZoomSrc: '',
    imgZoom: false,
    showAll: false,
    showBounced: false,
    bannerImgIndex: 0,
    yPoint: '',
    xPoint: '',
    keepCollect_data: "",
    //表面收藏
    keepCollect_bull: false,
    is_alert: false, //登录弹窗
    coupon: {
      invitation_user_id: '',
      begin_time: "",
      brief: [],
      description: [],
      end_time: "",
      icon: "",
      id: 0,
      image: "",
      image_type: 1,
      list_brief: "",
      commission: '',
      own: "",
      label: [''],
      pay_money: "",
      return_money: "",
      yname: "",
      youhui_type: 0,
      expire_day: '',
      total_fee: 0,
      total_num: 0,
      publish_wait: 0,
      limit_purchase_quantity: 0,//限购数量
      user_youhu_log_sum: 0,// 已购数量
      share_text: '',
      images: []
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
      list_brief: "",
      open_time: "",
      pay_money: "",
      return_money: "",
      sname: "",
      yname: "",
      expire_day: '',
      total_fee: '',
      image: "",
      youhui_type: 0
    }],
    user_info: { userGroupId: 0 },
    showShare: false, //显示分享
    showPoster: false, //显示海报
    posterList: {
      store: {
        name: '',
        address: ''
      }
    },
    tipsMessage: '',
    isFromShare: false,
    showMoreImages: false,
    is_code: false, // 展示公众号二维码
    is_level: false
  }

  componentDidMount() {
    let youhui_id = this.$router.params.id
    moneyPoster({ youhui_id, from: 'wx' })
      .then(({ data, code }) => {
        // this.setState({ posterList: data })
        let link = data.link
        getXcxQrcode({ link, id: youhui_id })
          .then((res) => {
            // let meta = this.state.posterList
            let meta = data
            meta['wx_img'] = BASIC_API + res.data.url
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
        if (res.data.user_info) {
          const { userGroupId } = res.data.user_info
          if (userGroupId == 6 || userGroupId == 7 || userGroupId == 8) {
            this.setState({ is_level: true })
          } else {
            this.setState({ is_level: false })
          }
        }
        this.setState({
          coupon: res.data.info.coupon,
          store: res.data.info.store,
          goods_album: res.data.info.goods_album,
          recommend: res.data.recommend.data,
          user_info: res.data.user_info
        }, () => {
          console.log(this.state.store)
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
      if (this.state.coupon.limit_purchase_quantity && this.state.coupon.user_youhu_log_sum >= this.state.coupon.limit_purchase_quantity) {
        this.setState({ tipsMessage: '本优惠已达购买上限，无法购买。' })
      } else {
        let invitation_user_id = this.$router.params.invitation_user_id && this.state.user_info.userGroupId == 5 ? '&invitation_user_id=' + this.$router.params.invitation_user_id : ''
        Taro.navigateTo({
          url: '../../business-pages/confirm-order/index?id=' + id + invitation_user_id
        })
      }
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

  onShareAppMessage = () => {
    return {
      title: '老板送钱！' + this.state.coupon.return_money + '元现金券限时发放中，快来一起领取！',
      path: '/business-pages/ticket-buy/index?id=' + this.state.coupon.id + '&invitation_user_id=' + this.state.coupon.invitation_user_id,
      imageUrl: this.state.coupon.image
    }
  }

  // 图片预览
  onPreviewImage = () => {
    Taro.previewImage({
      current: this.state.coupon.images[this.state.bannerImgIndex],
      urls: [
        ...this.state.coupon.images
      ]
    })
  }



  /**
* 去店铺
*/
  handleGoStore = () => {
    Taro.navigateTo({ url: '/pages/business/index?id=' + this.state.store.id })
  }

  //    保存二维码
  saveCode = () => {
    const img = require('@/assets/member/code.jpg')
    Taro.saveImageToPhotosAlbum({
      filePath: img,
    }).then(res => {
      Taro.showToast({ title: '保存成功' })
    })
  }

  render() {
    const { description, brief } = this.state.coupon;
    return (
      <View className="appre-activity-detail">
        {/* 分享组件 */}
        <ShareBox
          astrict={2}
          show={this.state.showShare}
          onClose={() => this.setState({ showShare: false })}
          sendText={() => { }}
          sendLink={this.onShareAppMessage}
          createPoster={() => {
            this.setState({ showPoster: true })
          }}
        />

        <VouchersPoster
          show={this.state.showPoster}
          list={this.state.posterList}
          onClose={() => {
            this.setState({ showPoster: false, showShare: false })
          }}
        />
        <View onClick={this.onPreviewImage}>
          <Swiper
            onChange={(e) => {
              this.setState({ bannerImgIndex: e.detail.current })
            }}
            className='group-banner'
            circular
            autoplay
          >
            {
              this.state.coupon.images.length ? this.state.coupon.images.map((item, index) => {
                return (
                  <SwiperItem className="group-banner-swiperItem" key={item}>
                    <Image className="group-banner-img" src={item} />
                  </SwiperItem>
                )
              }) : null
            }
          </Swiper>
        </View>
        <View className="banner-number-box">
          <View className="banner-number">{accAdd(this.state.bannerImgIndex, 1)}</View>
          <View className="banner-number">{this.state.coupon.images.length}</View>
        </View>
        {/* <View className="appre-info-content">
          <View className="appre-info-title">
            <View className="appre-info-title-label">到店支付可用</View>
            <View className="appre-info-title-text">{this.state.coupon.yname}</View>
          </View>
          <View className="appre-info-price">
            <View className="appre-price-info">
              <View className="appre-price-info-text">优惠价￥</View>
              <View className="appre-price-info-new">{this.state.coupon.pay_money}</View>
              <View className="appre-price-info-old">￥{this.state.coupon.return_money}</View>
            </View>
            <View className="appre-price-discounts">已优惠￥{accSubtr(Number(this.state.coupon.return_money), Number(this.state.coupon.pay_money))}</View>
          </View>
        </View> */}

        <View className="appre-info-content-member">
          <View className="appre-info-title">
            <View className="appre-info-title-label">到店支付可用</View>
            <View className="appre-info-title-text">{this.state.coupon.yname}</View>
          </View>
          <View className="appre-info-price">
            <View className="appre-price-info">
              <View className="appre-price-info-text">会员价￥</View>
              <View className="appre-price-info-new">{this.state.coupon.pay_money}</View>
              <View className="appre-price-info-old">门市价￥{this.state.coupon.return_money}</View>
            </View>
            {
              this.state.coupon.commission ? <View>
                {
                  this.state.is_level ? <View className="appre-price-discounts">分享可得佣金¥{this.state.coupon.commission}</View> : <View className="appre-price-discounts">升级会员可再省¥{this.state.coupon.commission}</View>
                }
              </View> : null
            }


          </View>
          <View className="appre-info-label">
            <View className='appre-info-label-item'>已优惠￥{accSubtr(Number(this.state.coupon.return_money), Number(this.state.coupon.pay_money))}</View>
          </View>
        </View>
        {/* 分享（发送图片链接等） */}
        <View className='syz-share-box'>
          <Button openType='share' className='share-item share-button' />
          <Image className='share-item' src={require('@/assets/member/img.png')} onClick={this.onPreviewImage} />
        </View>


        <Image className="appre-banner-img" src="http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png" />

        <View className="appre-store-info">
          <ApplyToTheStore
            store_id={this.state.store.id}
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
            <View className="rules-key">使用方式：</View>
            <View className="rules-words">扫码支付时抵用</View>
          </View>

          <View className="appre-rules-item" >
            <View className="rules-key"> 使用门槛：</View>
            <View className="rules-words">满￥{this.state.coupon.total_fee}可用</View>
          </View>
          <View className="appre-rules-item" >
            <View className="rules-key">有效期：</View>
            <View className="rules-words">购买后{this.state.coupon.expire_day}天内可用</View>
          </View>
          {
            this.state.coupon.limit_purchase_quantity ? <View className="appre-rules-item" >
              <View className="rules-key">购买限制：</View>
              <View className="rules-words">每人最多可购买{this.state.coupon.limit_purchase_quantity}份</View>
            </View> : null
          }
          {/* {
            this.state.coupon.description&&this.state.coupon.description.length ? <View>
              <View className="appre-rules-list-title" >使用规则：</View>
              {
                this.state.coupon.description.map((item, index) => {
                  <View className="appre-rules-list-text" >-{item}</View>
                })
              }
            </View> : null
          } */}
        </View>
        {
          brief.length ? <View className="img-list-box">
            <View className="img-title-box">
              <View className='img-title-left'></View>
              <View className='img-title'>图文详情</View>
            </View>
            <View className="images-content">
              {
                !this.state.showMoreImages && brief.length > 0 ? <Image className="images-item" mode={'widthFix'} src={brief[0]} />
                  : null
              }
              {
                !this.state.showMoreImages && brief.length > 1 ? <Image className="images-item" mode={'widthFix'} src={brief[1]} />
                  : null
              }
              {
                this.state.showMoreImages && brief.length > 2 ? brief.map((item: any, index: any) => {
                  return (
                    <Image className="images-item" mode={'widthFix'} key={item} src={item} />
                  )
                }) : null
              }
            </View>
            {
              brief.length > 2 && !this.state.showMoreImages ? <View className="img-more" onClick={() => { this.setState({ showMoreImages: true }) }} >
                <Image className="img-more-icon" src={"http://oss.tdianyi.com/front/GQr5D7QZwJczZ6RTwDapaYXj8nMbkenx.png"} />
                <View className="img-more-text" >查看更多</View>
              </View>
                : (
                  brief.length > 2 && this.state.showMoreImages ? <View className="img-more" onClick={() => { this.setState({ showMoreImages: false }) }} >
                    <Image className="img-more-icon" src={"http://oss.tdianyi.com/front/3pwMx3EMhEpZQs7jhS2zrA6fjSQdsFbW.png"} />
                    <View className="img-more-text" >收起</View>
                  </View> : null
                )
            }
          </View> : null
        }
        {
          this.state.recommend && this.state.recommend.length > 0 ?
            (<View className="more_goods">
              <View className="title-box">
                <View className='title-left'></View>
                <View className="title">更多本店宝贝</View>
              </View>
              {
                this.state.recommend.length > 0 && !this.state.showAll ? <View className="good_info" onClick={this.gotoTicketBuy.bind(this, this.state.recommend[0].youhui_type, this.state.recommend[0].id)}>
                  <View className="good_msg">
                    <Image className="good_img" src={this.state.recommend[0].image} />

                    <View className="good_detail">
                      <View className="good_detail_info">
                        <View className="good_title">
                          <View className="good_type">
                            <View className="text">{this.state.recommend[0].youhui_type == 0 ? "小熊敬礼" : "到店支付可用"}</View>
                          </View>
                          <View className="good_cash">{this.state.recommend[0].yname}</View>
                        </View>
                        <View className="good_desc">
                          <View className="good_desc_info">购买后{this.state.recommend[0].expire_day}天内有效</View>
                        </View>
                      </View>
                      <View className="good_money">
                        <View className="good_new_money_icon">￥</View>
                        <View className="good_new_money">{this.state.recommend[0].pay_money}</View>
                        <View className="good_old_money">￥{this.state.recommend[0].return_money}</View>
                      </View>
                    </View>
                  </View>

                  <View className="good_btn">
                    <View className="text">抢购</View>
                  </View>
                </View> : null
              }
              {
                this.state.recommend.length > 1 && !this.state.showAll ? <View className="good_info" onClick={this.gotoTicketBuy.bind(this, this.state.recommend[1].youhui_type, this.state.recommend[1].id)}>
                  <View className="good_msg">
                    <Image className="good_img" src={this.state.recommend[1].image} />
                    <View className="good_detail">
                      <View className="good_detail_info">
                        <View className="good_title">
                          <View className="good_type">
                            <View className="text">{this.state.recommend[1].youhui_type == 0 ? "小熊敬礼" : "到店支付可用"}</View>
                          </View>
                          <View className="good_cash">{this.state.recommend[1].yname}</View>
                        </View>
                        <View className="good_desc">
                          <View className="good_desc_info">购买后{this.state.recommend[1].expire_day}天内有效</View>
                        </View>
                      </View>
                      <View className="good_money">
                        <View className="good_new_money_icon">￥</View>
                        <View className="good_new_money">{this.state.recommend[1].pay_money}</View>
                        <View className="good_old_money">￥{this.state.recommend[1].return_money}</View>
                      </View>
                    </View>
                  </View>
                  <View className="good_btn">
                    <View className="text">抢购</View>
                  </View>
                </View> : null
              }
              {
                this.state.showAll && this.state.recommend.map((item) => (
                  <View key={item.id} className="good_info" onClick={this.gotoTicketBuy.bind(this, item.youhui_type, item.id)}>
                    <View className="good_msg">
                      <Image className="good_img" src={item.image} />

                      <View className="good_detail">
                        <View className="good_detail_info">
                          <View className="good_title">
                            <View className="good_type">
                              <View className="text">{item.youhui_type == 0 ? "小熊敬礼" : "到店支付可用"}</View>
                            </View>
                            <View className="good_cash">{item.yname}</View>
                          </View>
                          <View className="good_desc">
                            <View className="good_desc_info">购买后{item.expire_day}天内有效</View>
                          </View>
                        </View>
                        <View className="good_money">
                          <View className="good_new_money_icon">￥</View>
                          <View className="good_new_money">{item.pay_money}</View>
                          <View className="good_old_money">￥{item.return_money}</View>
                        </View>
                      </View>
                    </View>

                    <View className="good_btn">
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
            </View>) : ""
        }

        <View className="appre-buy-box" >
          <View className="group-buy-icon-box" >
            <View className='group-buy-icon-item' onClick={this.handleGoHome}>
              <Image src={require('@/assets/member/home.png')} />
              首页
            </View>
            <View className='group-buy-icon-item' onClick={this.handleGoStore}>
              <Image src={require('@/assets/member/store.png')} />
              进店
            </View>
            <View className='group-buy-icon-item' onClick={() => this.setState({ is_code: true })}>
              <Image src={require('@/assets/member/service.png')} />
              客服
            </View>
          </View>
          <View className="appre-buy-btn-box" >
            <View className="appre-buy-btn-left" onClick={() => {
              this.setState({ showPoster: true })
            }}>
              分享海报
             {
                this.state.coupon.commission ? <View>
                  {
                    this.state.is_level ? <View className="appre-buy-btn-yongjin" >佣金¥{this.state.coupon.commission}</View> : null
                  }
                </View> : null
              }


            </View>
            {
              this.state.coupon.total_num && this.state.coupon.publish_wait == 1 ? <View className="appre-buy-btn-right" onClick={this.goToPay.bind(this, this.state.coupon.id)}>立即购买</View> :
                <View className="appre-buy-btn-right" style={{ backgroundImage: 'url("http://oss.tdianyi.com/front/TaF78G3Nk2HzZpY7z6Zj4eaScAxFKJHN.png")' }}>已结束</View>
            }
          </View>
        </View>
        {
          this.state.is_alert ? <LoginAlert onChange={this.loginChange} /> : null
        }
        {/* {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '200rpx', right: '40rpx', zIndex: 88, width: '160rpx', height: '160rpx' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../assets/go-home/go_home.png')} style={{ width: '160rpx', height: '160rpx' }} />
            </View>
          ) : ''
        }

        <Zoom
          src={this.state.imgZoomSrc}
          showBool={this.state.imgZoom}
          onChange={() => { this.setState({ imgZoom: !this.state.imgZoom }) }}
        /> */}



        {
          this.state.is_code ? (
            <View className="tips-mask">
              <View className='code-content'>
                <Image className='code-img' src={require('@/assets/member/code.jpg')} />
                <View className='code-text'>
                  点击保存二维码关注小熊敬礼公众号即可联系客服
            </View>
                <View className='code-button' onClick={this.saveCode}>保存二维码</View>
                <Image className='code-close' onClick={() => this.setState({ is_code: false })} src={require('@/assets/member/close.png')} />
              </View>
            </View>
          ) : null
        }

        {
          this.state.tipsMessage ? <View className="tips-mask">
            <View className="tips-content">
              <View className="tips-title">购买失败</View>
              <View className="tips-info">{this.state.tipsMessage}</View>
              <View className="tips-btn" onClick={() => { this.setState({ tipsMessage: '' }) }}>确定</View>
            </View>
          </View> : null
        }

      </View>
    );
  }
}
