import Taro, { Component } from "@tarojs/taro";
import { AtIcon } from 'taro-ui';
// import { AtIcon, AtToast, AtTabs, AtTabsPane } from "taro-ui";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.styl";
// import { getBrowserType } from "@/utils/common";
// import { getYouhuiAppreciationInfo, getShareSign, wxXcxuWechatPay, getUserLastYouhuiId } from "./service";
// import { getLocation } from "@/utils/getInfo";
// import ActivityItem from '@/components/activity-item';
import ApplyToTheStore from '@/components/applyToTheStore';
// import TimeUp from '@/components/TimeUp';
// import LandingBounced from '@/components/landing_bounced'//登录弹框
// import Cookie from 'js-cookie';
import ShareBox from "@/components/share-box"; //分享组件
import VouchersPoster from '@/components/poster/vouchers'//海报
import request from '../../services/request'


// import ShareBox from '@/components/share-box';
export default class AppreActivity extends Component {
  config = {
    navigationBarTitleText: "增值活动",
    enablePullDownRefresh: false
  };

  state = {
    bannerImgIndex: 0,
    img: ["http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png", "http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png"],
    dataList: [
      // {
      //   img: "http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png",
      //   type: "现金券",
      //   cash: "800元现金券",
      //   desc: "购买后3天内有效",
      //   new_money: "￥99.99",
      //   old_money: "￥199.99"
      // },
    ],
    showAll: false,

    yPoint: '',
    xPoint: '',
    isFromShare: false,
    coupon: {
      begin_time: "",
      brief: "",
      //真正的收藏
      collect: "0",
      description: "",
      end_time: "",
      icon: "h",
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
      expire_day: ''
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
      youhui_type: 0,
      expire_day: '',
      total_fee: '',
      image: '',
    }],
    showShare: false, //显示分享
    showPoster: false, //显示海报
    posterList: {}
  }

  /**
     * 回首页
     */
  handleGoHome = () => { Taro.navigateTo({ url: '/' }) }


  componentWillMount() {
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) {
      this.setState({
        isFromShare: true
      })
    }
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
    // console.log(this.$router.params)
    Taro.getLocation({ type: 'gcj02' }).then(res => {
      this.setState({
        yPoint: res.latitude,
        xPoint: res.longitude
      }, () => {
        request({
          url: '/v3/discount_coupons/' + this.$router.params.id, method: "GET", data: { xpoint: this.state.xPoint, ypoint: this.state.yPoint }
        })
          .then((res: any) => {
            console.log(res);
            if (res.code != 200) {
              Taro.hideLoading()
              Taro.showToast({ title: '信息错误', icon: 'none' })
              setTimeout(() => {
                Taro.navigateBack({
                })
              }, 2000)
            }
            this.setState({
              coupon: res.data.info.coupon,
              store: res.data.info.store,
              goods_album: res.data.info.goods_album,
              recommend: res.data.recommend.data
            })
            Taro.hideLoading()
          }).catch(function (error) {
            Taro.hideLoading()
            Taro.showToast({ title: '数据请求失败', icon: 'none' })
            setTimeout(() => {
              Taro.navigateBack({
              })
            }, 2000)
          });
      })
    }).catch(err => {
      Taro.showLoading({
        title: 'loading',
      })
      request({
        url: '/v3/discount_coupons/' + this.$router.params.id, method: "GET", data: { xpoint: '', ypoint: '' }
      })
        .then((res: any) => {
          console.log(res);
          if (res.code != 200) {
            Taro.hideLoading()
            Taro.showToast({ title: '信息错误', icon: 'none' })
            setTimeout(() => {
              Taro.navigateBack({
              })
            }, 2000)
          }
          this.setState({
            coupon: res.data.info.coupon,
            store: res.data.info.store,
            goods_album: res.data.info.goods_album,
            recommend: res.data.recommend.data
          })
          Taro.hideLoading()
        }).catch(function (error) {
          Taro.hideLoading()
          Taro.showToast({ title: '数据请求失败', icon: 'none' })
          setTimeout(() => {
            Taro.navigateBack({
            })
          }, 2000)
        });
    })

    setTimeout(() => {
      console.log(this.state)
    }, 2000)
  }


  render() {

    return (
      <View className="appre-activity-detail">
        {/* 分享组件 */}
        <ShareBox
          show={this.state.showShare}
          onClose={() => this.setState({ showShare: false })}
          sendText={() => { }}
          sendLink={() => { }}
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
        <Swiper
          onChange={(e) => {
            this.setState({ bannerImgIndex: e.detail.current })
          }}
          className='appre-banner'
          circular
          autoplay
        >
          {
            this.state.img.length ? this.state.img.map((item, index) => {
              return (
                <SwiperItem className="appre-banner-swiperItem" key={item}>
                  <Image className="appre-banner-img" src={item} />
                </SwiperItem>
              )
            }) : null
          }
        </Swiper>
        <View className="banner-number-box">
          <View className="banner-number">{Number(this.state.bannerImgIndex) + 1}</View>
          <View className="banner-number">{this.state.img.length}</View>
        </View>
        <View className="collect-box">
          <Image className="collect-img" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" />
        </View>
        <View className="share-box">
          <Image className="share-img" src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
        </View>

        <View className="appre-info-content">
          <View className="appre-info-title">
            <View className="appre-info-title-label">{this.state.coupon.youhui_type == 0 ? "兑换券" : "现金券"}</View>
            <View className="appre-info-title-text">{this.state.store.sname}</View>
          </View>
          <View className="appre-info-price">
            <View className="appre-price-info">
              <View className="appre-price-info-text">优惠价￥</View>
              <View className="appre-price-info-new">00</View>
              <View className="appre-price-info-old">￥==</View>
            </View>
            <View className="appre-price-discounts">已优惠￥100.00</View>
          </View>

        </View>
        <Image className="appre-banner-img" src="http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png" />

        <View className="appre-store-info">
          <ApplyToTheStore
            isTitle={true}
            img="http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png"
            name={'许某人'}
            phone={'18814342424'}
            address={'啊大苏打撒大'}
            location={{ xpoint: 111, ypoint: 222 }}
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
            <View className="rules-words">99</View>
          </View>
          <View className="appre-rules-item" >
            <View className="rules-key">有效期：</View>
            <View className="rules-words">成团后00日内可用</View>
          </View>
          <View>
            <View className="appre-rules-list-title" >使用规则：</View>

            <View className="appre-rules-list-text" >-jiiu</View>
            <View className="appre-rules-list-text" >-jiiu</View>
            <View className="appre-rules-list-text" >-jiiu</View>

          </View>

        </View>
        <View className="appre-buy-box" >
          <View className="appre-buy-price-box" >
            <View className="appre-buy-price-icon" >￥</View>
            <View className="appre-buy-price-num" >99</View>
          </View>
          <View className="appre-buy-btn-box" >
            <View className="appre-buy-btn-left" onClick={() => this.setState({ showShare:true})}>分享活动</View>

            <View className="appre-buy-btn-right" >立即购买</View>

          </View>
        </View>

        {
          this.state.recommend.length > 0 ?
            (<View className="more_goods">
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
                          <View className="good_desc_info">购买后{this.state.recommend[0].total_fee}天内有效</View>
                        </View>
                      </View>
                      <View className="good_money">
                        {/* <View className="good_new_money">{this.state.recommend[0].new_money}</View> */}
                        {/* <View className="good_old_money">{this.state.recommend[0].old_money}</View> */}
                      </View>
                    </View>
                  </View>

                  <View className="good_btn">
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
                          <View className="good_cash">{this.state.recommend[0].sname}</View>
                        </View>
                        <View className="good_desc">
                          <View className="good_desc_info">购买后{this.state.recommend[0].total_fee}天内有效</View>
                        </View>
                      </View>
                      <View className="good_money">
                        {/* <View className="good_new_money">{this.state.recommend[1].new_money}</View> */}
                        {/* <View className="good_old_money">{this.state.recommend[1].old_money}</View> */}
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
                            <View className="good_desc_info">购买后{item.total_fee}天内有效</View>
                          </View>
                        </View>
                        <View className="good_money">
                          {/* <View className="good_new_money">{item.new_money}</View> */}
                          {/* <View className="good_old_money">{item.old_money}</View> */}
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
                this.state.recommend.length <= 2 ? "" : (
                  <View className="load_more" onClick={() => this.setState({ showAll: !this.state.showAll })}>
                    {
                      !this.state.showAll ? (
                        <View><AtIcon value='chevron-down' size="18" color='#999'></AtIcon>点击查看更多</View>
                      ) : <View><AtIcon value='chevron-up' size="18" color='#999'></AtIcon>收起</View>
                    }
                  </View>
                )
              }
            </View>) : ""
        }



        {/* {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '50%', right: '0px', zIndex: 88 }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../assets/go-home/go_home.png')} style={{ width: '80px', height: '80px' }} />
            </View>
          ) : ''
        } */}

      </View>
    );
  }
}
