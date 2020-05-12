import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import {
  getYouhuiAppreciationInfo,
  getShareSign,
  wxXcxuWechatPay,
  getUserLastYouhuiId,
  geValueAddedPoster
} from "./service";
import { getXcxQrcode } from "@/api";
import ApplyToTheStore from '@/components/applyToTheStore';
import LoginAlert from '@/components/loginAlert';
import ShareBox from "@/components/share-box";//分享组件
import HaveGift from '@/components/poster/value-added/have-gift'//有礼品版本
import NoGift from '@/components/poster/value-added/no-gift'//无礼品版本
import Other from '@/components/poster/value-added/other'//其他版本(同拼团海报类似)
import Zoom from '@/components/zoom';
import { accSubtr } from '@/utils/common'
import { accAdd } from '@/components/acc-num'
const BASIC_API = process.env.BASIC_API;
export default class AppreActivity extends Component {
  config = {
    navigationBarTitleText: "增值活动",
    enablePullDownRefresh: false
  };


  state = {
    imgZoomSrc: '',
    imgZoom: false,
    //图片轮播下标
    bannerImgIndex: 0,
    //是否从分享链接进入
    isFromShare: false,
    // 登录弹窗
    is_alert: false,
    //查看更多
    showMoreRules: false,
    data: {
      invitation_user_id: '',
      activity_begin_time: "",
      activity_end_time: "",
      activity_time_status: 0,
      address: "",
      begin_time: "",
      commission: '',
      imagesCurrent: 0,
      description: [],
      distances: "",
      end_time: "",
      gift: { title: "", price: "", postage: "", mail_mode: 0 },
      gift_id: 0,
      gift_pic: '',
      id: 0,
      image: "",
      images: [],
      init_money: "",
      is_show_button: 0,
      location_name: "",
      name: "",
      pay_money: "",
      preview: "",
      return_money: "",
      store_id: 0,
      supplier_id: 0,
      tel: "",
      total_fee: 0,
      total_num: 0,
      user_info: {},
      type: 0,
      validity: 0,
      xpoint: "",
      ypoint: "",
      dp_count: 0,
      publish_wait: 0
    },
    showShare: false, //显示分享
    showPoster: false, //显示海报
    posterList: {
      gift: {
        gift_pic: '',
        gift_price: ''
      },
      store: {
        name: '',
        address: ''
      },
      youhui_type: ''
    },
    posterType: '',
    is_code: false, // 展示公众号二维码
    is_level: false
  };

  componentDidMount() {
    /* 请求海报数据 */
    let id = this.$router.params.id;
    let router = Taro.getStorageSync('router')
    geValueAddedPoster({ youhui_id: id, from: 'wx' })
      .then(({ data, code }) => {
        // this.setState({ posterList: data })
        let link = ''
        if(router.city_id){
          link = data.link + '&c_id=' + router.city_id
        }else {
          link = data.link
        }
        getXcxQrcode({ link, id })
          .then((res) => {
            // let meta = this.state.posterList
            let meta = data
            meta['wx_img'] = BASIC_API + res.data.url
            this.setState({ posterList: meta })
          })
        switch (data.youhui_type) {
          case 0:
            this.setState({ posterType: 'Other' })
            break;
          default:
            this.setState({ posterType: data.gift.gift_pic ? 'HaveGift' : 'NoGift' })
            break;
        }

      })
  }

  /**
 * 判断从分享链接进入
 * 获取定位
 */
  componentDidShow() {
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) { this.setState({ isFromShare: true }) }
    Taro.showLoading({ title: 'loading' })
    Taro.getLocation({
      type: 'gcj02',
      success: res => {
        this.getAppreInfo({ youhui_id: this.$router.params.id, ypoint: res.latitude || '', xpoint: res.longitude || '' })
      },
      fail: () => {
        this.getAppreInfo({ youhui_id: this.$router.params.id, ypoint: '', xpoint: '' })
      }
    })
  }
  /**
     * 获取增值活动信息
     * @param {object} data 增值id,坐标
     */
  getAppreInfo = (data: object) => {
    getYouhuiAppreciationInfo(data)
      .then((res: any) => {
        Taro.hideLoading();
        if (res.code == 200) {
          if (res.data.user_info) {
            const { userGroupId } = res.data.user_info
            if (userGroupId == 6 || userGroupId == 7 || userGroupId == 8) {
              this.setState({ is_level: true })
            } else {
              this.setState({ is_level: false })
            }
          }
          let isPostage = false;
          if (res.data.gift_id && res.data.gift.mail_mode == 2) { isPostage = true; }
          // this.getPostList(res.data.id)
          this.setState({ data: res.data, isPostage });
        } else {
          Taro.showToast({ title: '请求失败', icon: 'none' });
        }
      }).catch(err => {
        Taro.hideLoading();
        Taro.showToast({ title: '请求失败', icon: 'none' });
      })
  }

  /**
     * 判断活动是否有礼品，有礼品跳页面，没礼品调起支付
     * 判断是否登录
     */
  goToaConfirm = () => {
    let phone_status = Taro.getStorageSync('phone_status')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      if (this.state.data.gift_id) {
        let invitation_user_id = this.$router.params.invitation_user_id ? '&invitation_user_id=' + this.$router.params.invitation_user_id : ''
        Taro.navigateTo({
          url: '/activity-pages/confirm-address/index?activityType=1&id=' + this.$router.params.id + '&storeName=' + encodeURIComponent(this.state.data.location_name) + invitation_user_id
        })
      } else {
        this.payment()
      }
    } else {
      this.setState({ is_alert: true })
    }
  }

  /**
  * 支付,不带礼品
  */
  payment = () => {
    let that = this;
    Taro.showLoading({ title: 'loading', mask: true })
    let datas = {
      youhui_id: this.$router.params.id,
      activity_id: this.$router.params.activity_id,
      open_id: Taro.getStorageSync("openid"),
      unionid: Taro.getStorageSync("unionid"),
      type: "1",
      xcx: 1,
      invitation_user_id: this.$router.params.invitation_user_id ? this.$router.params.invitation_user_id : undefined
    }
    wxXcxuWechatPay(datas).then((res: any) => {
      Taro.hideLoading();
      if (res.code == 200) {
        let order_sn = res.data.channel_order_sn;
        Taro.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(res) {
            that.getLastYouhuiId(order_sn)
          },
          fail(err) {
            Taro.showToast({ title: '支付失败', icon: 'none' })
          }
        })
      } else {
        Taro.showToast({ title: res.message, icon: 'none' })
      }
    }).catch(err => {
      Taro.hideLoading();
      Taro.showToast({ title: "调起支付失败", icon: "none" });
    })
  }

  /**
   * 查询用户最后一次购买的增值活动id
   * @param {string} order_sn 订单号
   */
  getLastYouhuiId = (order_sn) => {
    let that = this;
    Taro.showLoading({ title: '支付成功，正在查询用户增值活动id', mask: true });
    let timer = setTimeout(() => {
      clearTimeout(timer);
      getUserLastYouhuiId({ order_sn: order_sn })
        .then((res: any) => {
          if (res.code == 200) {
            Taro.hideLoading();
            //得到增值活动id并跳转活动详情
            Taro.navigateTo({
              url: '/pages/activity/pages/appreciation/appreciation?id=' + res.data.id
            })
          } else {
            that.getLastYouhuiId(order_sn)
          }
        }).catch((err) => {
          that.getLastYouhuiId(order_sn)
        })
    }, 500);
  }

  /**
   * 去图文详情
   */
  toImgList = () => {
    Taro.navigateTo({
      url: '/detail-pages/gift/gift?gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id
    })
  }

  /**
 * 回首页
 */
  handleGoHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
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

  onShareAppMessage() {
    const userInfo = Taro.getStorageSync("userInfo");
    const { gift_id, gift, return_money, preview, pay_money, invitation_user_id } = this.state.data;
    const { id, activity_id, type } = this.$router.params;
    let title, imageUrl, path;
    let router = Taro.getStorageSync('router')
    if(router.type_index_id == 0 || router.type_index_id == 1){
      path = '/pages/activity/appreciation/index?id=' + id + '&type=1&gift_id=' + gift_id + '&activity_id=' + activity_id + '&invitation_user_id=' + invitation_user_id+ '&c_id=' + router.city_id
    }else {
      path = '/pages/activity/appreciation/index?id=' + id + '&type=1&gift_id=' + gift_id + '&activity_id=' + activity_id + '&invitation_user_id=' + invitation_user_id
    }
    if (gift_id) {
      title = `快来！${pay_money}元增值至${return_money}元，还可免费领${gift.price}元礼品，机会仅此一次！`;
      imageUrl = this.state.data.image
    } else {
      title = `送你一次免费增值机会！${pay_money}元可增值至${return_money}元，速领！`;
      imageUrl = this.state.data.image
    }
    return {
      title: title,
      path,
      imageUrl: imageUrl
    }
  }

  /* 关闭海报 */
  closePoster = () => {
    this.setState({ showPoster: false, showShare: false })
  }

  // 图片预览
  onPreviewImage = () => {
    // this.setState({ imgZoom: true, imgZoomSrc: this.state.data.images[this.state.bannerImgIndex] })
    Taro.previewImage({
      current: this.state.data.images[this.state.bannerImgIndex],
      urls: [
        ...this.state.data.images
      ]
    })
  }
  /**
 * 去店铺
 */
  handleGoStore = () => {
    Taro.navigateTo({ url: '/pages/business/index?id=' + this.state.data.store_id })
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
    const { images, description } = this.state.data;
    const { posterList, posterType, showPoster } = this.state
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
        <HaveGift show={showPoster} list={posterList} onClose={this.closePoster} type={posterType} />
        <Other show={showPoster} list={posterList} onClose={this.closePoster} type={posterType} />
        < NoGift show={showPoster} list={posterList} onClose={this.closePoster} type={posterType} />
        <View onClick={this.onPreviewImage}>
          <Swiper
            onChange={(e) => {
              this.setState({ bannerImgIndex: e.detail.current })
            }}
            className='appre-banner'
            circular
            autoplay
          >
            {
              this.state.data.images.length ? this.state.data.images.map((item, index) => {
                return (
                  <SwiperItem className="appre-banner-swiperItem" key={item}>
                    <Image className="appre-banner-img" src={item} />
                  </SwiperItem>
                )
              }) : null
            }
          </Swiper>
        </View>
        <View className="banner-number-box">
          <View className="banner-number">{accAdd(this.state.bannerImgIndex, 1)}</View>
          <View className="banner-number">{this.state.data.images.length}</View>
        </View>
        {/* <View className="collect-box">
                    <Image className="collect-img" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" />
                </View>
                <View className="share-box">
                    <Image className="share-img" src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
                </View> */}

        {/* <View className="appre-info-content">
          <View className="appre-info-title">
            <View className="appre-info-title-label">增值券</View>
            <View className="appre-info-title-text">{this.state.data.name}</View>
          </View>
          <View className="appre-info-price">
            <View className="appre-price-info">
              <View className="appre-price-info-text">优惠价￥</View>
              <View className="appre-price-info-new">{this.state.data.pay_money}</View>
            </View>
            <View className="appre-price-discounts">最高抵用￥{this.state.data.return_money}</View>
          </View>
        </View> */}

        <View className="appre-info-content-member">
          <View className="appre-info-title">
            <View className="appre-info-title-label">增值券</View>
            <View className="appre-info-title-text">{this.state.data.name}</View>
          </View>
          <View className="appre-info-price">
            <View className="appre-price-info">
              <View className="appre-price-info-text">会员价￥</View>
              <View className="appre-price-info-new">{this.state.data.pay_money}</View>
              <View className="appre-price-info-old">门市价￥{this.state.data.pay_money}</View>
            </View>
            {
              this.state.data.commission ? <View>
                {
                  this.state.is_level ? <View className="appre-price-discounts">分享可得佣金¥{this.state.data.commission}</View> : <View className="appre-price-discounts">升级会员可再省¥{this.state.data.commission}</View>
                }
              </View> : null
            }

          </View>
          <View className="appre-info-label">
            <View className='appre-info-label-item'>最高抵用￥{this.state.data.return_money}</View>
          </View>
        </View>

        {/* 分享（发送图片链接等） */}
        <View className='syz-share-box'>
          <Button openType='share' className='share-item share-button' />
          <Image className='share-item' src={require('@/assets/member/img.png')} onClick={this.onPreviewImage} />
          {/* <Image className='share-item' src={require('@/assets/member/text.png')} onClick={this.copyText} /> */}
        </View>


        <Image className="appre-banner-img" src="http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png" />

        <View className="appre-store-info">
          <ApplyToTheStore
            store_id={this.state.data.store_id}
            isTitle={true}
            img={this.state.data.preview}
            name={this.state.data.location_name}
            phone={this.state.data.tel}
            address={this.state.data.address}
            location={{ xpoint: 111, ypoint: 222 }}
            meter={this.state.data.distances}
          />
        </View>

        {
          this.state.data.gift_id ?
            <View className="appre-gift">
              <View className="appre-title-box">
                <View className='appre-title-left-box'>
                  <View className='appre-title-left'></View>
                  <View className='appre-title'>赠送礼品</View>
                </View>
                <View className='appre-title-right' onClick={this.toImgList.bind(this)}>
                  <View className='appre-title-right-info' >查看详情</View>
                  <Image className="appre-title-right-icon" src={"http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png"} />
                </View>
              </View>
              <View className='appre-gift-brief'>{this.state.data.gift.title}</View>
              <View className='appre-gift-label-box'>
                <View className='appre-gift-label'>{
                  this.state.data.gift.mail_mode == 1 ? '免运费' : `运费${this.state.data.gift.postage}元`
                }</View>
              </View>
              <Image className="appre-gift-img" src={this.state.data.gift_pic} mode={'widthFix'} />
            </View> : null
        }



        <View className="appre-rules">
          <View className="appre-title-box">
            <View className='appre-title-left'></View>
            <View className='appre-title'>使用说明</View>
          </View>
          {
            this.state.data.type != 0 ?
              <View className="appre-rules-item" >
                <View className="rules-key">使用方式：</View>
                <View className="rules-words">扫码支付时抵用</View>
              </View> : null
          }
          {
            this.state.data.type != 0 ?
              <View className="appre-rules-item" >
                <View className="rules-key"> 使用门槛：</View>
                <View className="rules-words">满{this.state.data.total_fee}可用</View>
              </View> : null
          }
          <View className="appre-rules-item" >
            <View className="rules-key">有效期：</View>
            <View className="rules-words">成团后{this.state.data.validity}日内可用</View>
          </View>


          {
            this.state.data.type == 0 && description && description.length && !this.state.showMoreRules ? <View>
              <View className="appre-rules-list-title" >使用规则：</View>                            {
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
            this.state.data.type == 0 && description && description.length && description.length > 4 && this.state.showMoreRules ? <View>
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
            this.state.data.type == 0 && description && description.length && description.length > 4 && !this.state.showMoreRules ? <View className="appre-more" onClick={() => { this.setState({ showMoreRules: true }) }} >
              <Image className="appre-more-icon" src={"http://oss.tdianyi.com/front/GQr5D7QZwJczZ6RTwDapaYXj8nMbkenx.png"} />
              <View className="appre-more-text" >查看更多</View>
            </View> : null
          }
        </View>
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
                this.state.data.commission ? <View>
                  {
                    this.state.is_level ? <View className="appre-buy-btn-yongjin" >佣金¥{this.state.data.commission}</View> : null
                  }
                </View> : null
              }


            </View>
            {
              this.state.data.publish_wait != 1 || this.state.data.total_num == 0 || this.state.data.activity_time_status == 3 ? (
                <View className="appre-buy-btn-right" style={{ backgroundImage: 'url("http://oss.tdianyi.com/front/TaF78G3Nk2HzZpY7z6Zj4eaScAxFKJHN.png")' }}>已结束</View>
              ) : this.state.data.activity_time_status == 1 ? (
                <View className="appre-buy-btn-right" style={{ backgroundImage: 'url("http://oss.tdianyi.com/front/TaF78G3Nk2HzZpY7z6Zj4eaScAxFKJHN.png")' }} >暂未开始</View>
              ) : this.state.data.activity_time_status == 2 ? (
                <View className="appre-buy-btn-right" onClick={this.goToaConfirm.bind(this)}>立即购买</View>
              ) : null
            }
          </View>
        </View>

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
          this.state.is_alert ? <LoginAlert onChange={this.loginChange} /> : null
        }
      </View>
    );
  }
}
