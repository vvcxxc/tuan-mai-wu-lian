import Taro, { Component } from "@tarojs/taro";
import { AtIcon } from 'taro-ui';
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem, Video } from "@tarojs/components";
import "./index.less";
import ApplyToTheStore from '@/components/applyToTheStore';
import LoginAlert from '@/components/loginAlert';
import CouponsPoster from '@/components/poster/coupons'//海报

export default class SnapUp extends Component {
  config = {
    navigationBarTitleText: "小熊抢购",
    enablePullDownRefresh: false
  };

  state = {
    videoShow: false,
    store: {
      brief: "课件撒发给骄傲无色韩国的覅看萨格fig第四哦i都是有丰厚的商业化",
      id: 0,
      open_time: "",
      route: "",
      saddress: "课件撒发给骄傲无色韩国的覅看萨格fig第四哦i都是有丰厚的商业化",
      sname: "课件撒发给骄傲无色韩国的覅=",
      tel: "13455556566",
      distance: "",
      shop_door_header_img: "http://oss.tdianyi.com/front/ATDhJFbKfRYidDPnhak8QsTxWGB57HJ4.png",
      xpoint: 0,
      ypoint: 0
    },
    coupon: {
      invitation_user_id: '',
      begin_time: "",
      brief: [],
      //真正的收藏
      collect: "",
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
      total_num: 0,
      publish_wait: 0,
      limit_purchase_quantity: 0,//限购数量
      user_youhu_log_sum: 0,// 已购数量
      share_text: '',//要分享的文字信息
      images: [],
    },
    isFromShare: false,
    is_alert: false,
    showAll: false,
    showMoreRules: false,
    showMoreImages: false,
    showShare: false, //显示分享
    showPoster: false, //显示海报
    posterList: {
      store: {
        name: '',
        address: ''
      }
    },
    tipsMessage: '',
    is_code: false,
    is_level: false,
    type_index_id: 0
  }

  /**
    * 回首页
    */
  handleGoHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }
  goToSnapList = () => {
    Taro.navigateTo({ url: '/business-pages/snap-up/snap-up-list/index' })
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
     * 去支付
     */
  goToPay = (id, e) => {
    let phone_status = Taro.getStorageSync('phone_status')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      if (this.state.coupon.limit_purchase_quantity && this.state.coupon.user_youhu_log_sum >= this.state.coupon.limit_purchase_quantity) {
        this.setState({ tipsMessage: '本优惠已达购买上限，无法购买。' })
      } else {
        let invitation_user_id = this.$router.params.invitation_user_id ? '&invitation_user_id=' + this.$router.params.invitation_user_id : ''
        Taro.navigateTo({
          url: '../../business-pages/coupon-distribution/index?id=' + id + invitation_user_id
        })
      }
    } else {
      this.setState({ is_alert: true })
    }
  }

  render() {
    let imglist = [
      'http://oss.tdianyi.com/front/ATDhJFbKfRYidDPnhak8QsTxWGB57HJ4.png',
      'http://oss.tdianyi.com/front/ATDhJFbKfRYidDPnhak8QsTxWGB57HJ4.png',
      'http://oss.tdianyi.com/front/ATDhJFbKfRYidDPnhak8QsTxWGB57HJ4.png',
      'http://oss.tdianyi.com/front/ATDhJFbKfRYidDPnhak8QsTxWGB57HJ4.png',
      'http://oss.tdianyi.com/front/ATDhJFbKfRYidDPnhak8QsTxWGB57HJ4.png'
    ]
    return (
      <View className="snap-up-detail">
        <CouponsPoster
          show={this.state.showPoster}
          list={this.state.posterList}
          onClose={() => {
            this.setState({ showPoster: false, showShare: false })
          }}
        />
        <Swiper
          onChange={(e) => {
            this.setState({ bannerImgIndex: e.detail.current })
          }}
          className='snap-banner'
          circular
        >
          <SwiperItem className="snap-banner-swiperItem">
            {
              !this.state.videoShow ?
                <View className="snap-banner-box">
                  <Image className="snap-banner-cover" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" onClick={() => { this.setState({ videoShow: true }) }} />
                  <View className="snap-banner-playBox">
                    <Image className="snap-banner-playIcon" src="http://oss.tdianyi.com/front/FR4D74jKb5mpa5mPZrcsAJQ4pRra8Zyb.png" onClick={() => { this.setState({ videoShow: true }) }} />
                    <View className="snap-banner-playWord">视频</View>
                  </View>
                </View> :
                <Video src="https://videocdn.taobao.com/oss/ali-video/d6bc4ae3eb3c866bee9903d47d1210c6/video.mp4" title="测试" object-fit='cover' autoplay={true} play-btn-position className="snap-banner-img"> </Video>
            }

          </SwiperItem>
          <SwiperItem className="snap-banner-swiperItem">
            <Image className="snap-banner-img" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" />
          </SwiperItem>
        </Swiper>
        <View className="snap-banner-timeUp-box">
          <View className="snap-banner-timeUp-area">
            <View className="snap-banner-timeUp-top">距离结束仅剩：</View>
            <View className="snap-banner-timeUp-down">
              <View className="timeUp-down-word">2天</View>
              <View className="timeUp-down-num">09</View>
              <View className="timeUp-down-word">:</View>
              <View className="timeUp-down-num">09</View>
              <View className="timeUp-down-word">:</View>
              <View className="timeUp-down-num">09</View>
            </View>
          </View>
        </View>

        <View className="snap-up-content-member">
          <View className="snap-up-title">
            <View className="snap-up-title-label">商品券</View>
            <View className="snap-up-title-text">测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试</View>
          </View>
          <View className="snap-up-price">
            <View className="snap-up-info">
              <View className="snap-up-info-text">优惠价￥</View>
              <View className="snap-up-info-new">1222</View>
              <View className="snap-up-info-old">￥33333</View>
            </View>
          </View>
          <View className="snap-up-people-box">
            <View className="snap-up-people-ul">
              {
                imglist.map((item: string, index: number) => {
                  return (
                    <View className='smallBox' key={index} style={{ zIndex: 1 + index }}>
                      <View className={index ? 'participants' : 'open_group'} >
                        <Image className='smallBox-img' src={item} />
                      </View>
                    </View>
                  )
                })
              }
            </View>
            <View className="snap-up-people-info" onClick={this.goToSnapList}>
              <View className="snap-up-people-info-num">2097</View>
              <View className="snap-up-people-info-word">个人已参与</View>
              <Image className="snap-up-people-info-icon" src="http://oss.tdianyi.com/front/MHpbePFWbpc2tejtR6Hpxp4m3tfCdGQ4.png" />
            </View>
          </View>
        </View>
        <View className="snap-up">
          <View className="snap-up-box">
            <View className='snap-up-left-box'>
              <View className='snap-up-left'></View>
              <View className='snap-up-title'>成交有礼</View>
            </View>
            <View className='snap-up-right' >
              <View className='snap-up-right-info' >惊喜有礼，先抢先得</View>
              {/* <Image className="snap-up-right-icon" src={"http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png"} /> */}
            </View>
          </View>
          <View className="gift_info" >
            <View className="gift_msg_area" >
              <View className="gift_msg" >
                <Image className="gift_img" src="http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png" />
                <View className="gift_detail">
                  <View className="gift_detail_info">
                    <View className="gift_title">
                      <View className="gift_type">  平台礼品 </View>
                      <View className="gift_cash">i脚后跟i结果</View>
                    </View>
                    <View className="gift_desc">剩余20件</View>
                    <View className="gift_desc">适用店铺：多美蛋糕店</View>
                  </View>
                  <View className="gift_money">
                    <View className="gift_new_money_icon">￥</View>
                    <View className="gift_new_money">{22}</View>
                  </View>
                </View>
              </View>
              <Image className="gift_icon" src="http://oss.tdianyi.com/front/YpXpE5CfGazrbp6ynt72QBaiQGPAh766.png" />
            </View>
          </View>
          <View className="gift_info" >
            <View className="gift_msg_area" >
              <View className="gift_msg" >
                <Image className="gift_img" src="http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png" />
                <View className="gift_detail">
                  <View className="gift_detail_info">
                    <View className="gift_title">
                      <View className="gift_type">商品券</View>
                      <View className="gift_cash">i脚后跟i结果</View>
                    </View>
                    <View className="gift_desc">剩余20件</View>
                    <View className="gift_desc">适用店铺：多美蛋糕店</View>
                  </View>
                  <View className="gift_money">
                    <View className="gift_new_money_icon">￥</View>
                    <View className="gift_new_money">{22}</View>
                  </View>
                </View>
              </View>
              <Image className="gift_icon" src="http://oss.tdianyi.com/front/YpXpE5CfGazrbp6ynt72QBaiQGPAh766.png" />
            </View>
          </View>
        </View>

        <View className="snap-up">
          <View className="snap-up-box">
            <View className='snap-up-left-box'>
              <View className='snap-up-left'></View>
              <View className='snap-up-title'>成交有礼</View>
            </View>
          </View>
            iuagsfdigdsig详情

        </View>

        <View className="snap-up-info">
          <ApplyToTheStore
            store_id={this.state.store.id}
            isTitle={false}
            img={this.state.store.shop_door_header_img}
            name={this.state.store.sname}
            phone={this.state.store.tel}
            address={this.state.store.saddress}
            location={{ xpoint: this.state.store.xpoint, ypoint: this.state.store.ypoint }}
            meter={this.state.store.distance}
          />
        </View>
        <View className="appre-buy-box" >
          <View className="group-buy-icon-box" >
            <View className='group-buy-icon-item' onClick={this.handleGoHome}>
              <Image src={require('@/assets/member/home.png')} />
              首页
            </View>
            {/* <View className='group-buy-icon-item' onClick={this.handleGoStore}>
              <Image src={require('@/assets/member/store.png')} />
              进店
            </View> */}
            <View className='group-buy-icon-item' onClick={() => this.setState({ is_code: true })}>
              <Image src={require('@/assets/member/service.png')} />
              客服
            </View>
          </View>
          <View className="appre-buy-btn-box" >
            <View className="appre-buy-btn-left" onClick={() => {
              this.setState({ showPoster: true })
            }}
            >
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





        <View className="tips-mask">
          <View className="gift-content">
            <View className="gift-content-top">

              <View className="gift-content-box">
                <View className='gift-content-left-box'>
                  <View className='gift-content-left'></View>
                  <View className='gift-content-title'>礼品信息</View>
                </View>
              </View>


            </View>
            <View className="gift-content-bottom">
              <View className="bottom-info">
                <View className="bottom-info-key">使用门槛</View>
                <View className="bottom-info-word">消费满200可用</View>
              </View>
              <View className="bottom-info">
                <View className="bottom-info-key">发放限制</View>
                <View className="bottom-info-word">1个/人</View>
              </View>
              <View className="bottom-info">
                <View className="bottom-info-key">有效期</View>
                <View className="bottom-info-word">消费满200可用</View>
              </View>
              <View className="bottom-info-column">
                <View className="bottom-info-key">使用说明</View>
                <View className="bottom-info-word">消费满200可用</View>
              </View>


              <View className="gift-bottom-box">
                <View className='gift-bottom-left-box'>
                  <View className='gift-bottom-left'></View>
                  <View className='gift-bottom-title'>成交有礼</View>
                </View>               
              </View>


           


            </View>
          </View>
        </View>

















      </View>
    );
  }
}
