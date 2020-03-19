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
      {
        img: "http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png",
        type: "现金券",
        cash: "800元现金券",
        desc: "购买后3天内有效",
        new_money: "￥99.99",
        old_money: "￥199.99"
      },
      {
        img: "http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png",
        type: "现金券",
        cash: "800元现金券",
        desc: "购买后3天内有效",
        new_money: "￥99.99",
        old_money: "￥199.99"
      },
      {
        img: "http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png",
        type: "现金券",
        cash: "800元现金券",
        desc: "购买后3天内有效",
        new_money: "￥99.99",
        old_money: "￥199.99"
      }
    ],
    showAll: false,
  }

  /**
     * 回首页
     */
  handleGoHome = () => { Taro.navigateTo({ url: '/' }) }


  render() {

    return (
      <View className="appre-activity-detail">
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
            <View className="appre-info-title-label">增值券</View>
            <View className="appre-info-title-text">ipi</View>
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
            <View className="appre-buy-btn-left" >分享活动</View>

            <View className="appre-buy-btn-right" >立即购买</View>

          </View>
        </View>

        {
          this.state.dataList.length > 0 ?
            (<View className="more_goods">
              <View className="title-box">
                <View className='title-left'></View>
                <View className="title">更多本店宝贝</View>
              </View>
              {
                this.state.dataList.length > 0 && !this.state.showAll ? <View className="good_info">
                  <View className="good_msg">
                    <Image className="good_img" src={this.state.dataList[0].img} />

                    <View className="good_detail">
                      <View className="good_detail_info">
                        <View className="good_title">
                          <View className="good_type">{this.state.dataList[0].type}</View>
                          <View className="good_cash">{this.state.dataList[0].cash}</View>
                        </View>
                        <View className="good_desc">
                          <View className="good_desc_info">{this.state.dataList[0].desc}</View>
                        </View>
                      </View>
                      <View className="good_money">
                        <View className="good_new_money">{this.state.dataList[0].new_money}</View>
                        <View className="good_old_money">{this.state.dataList[0].old_money}</View>
                      </View>
                    </View>
                  </View>

                  <View className="good_btn">
                    <View className="text">抢购</View>
                  </View>
                </View> : null
              }
              {
                this.state.dataList.length > 1 && !this.state.showAll ? <View className="good_info">
                  <View className="good_msg">
                    <Image className="good_img" src={this.state.dataList[1].img} />

                    <View className="good_detail">
                      <View className="good_detail_info">
                        <View className="good_title">
                          <View className="good_type">{this.state.dataList[1].type}</View>
                          <View className="good_cash">{this.state.dataList[1].cash}</View>
                        </View>
                        <View className="good_desc">
                          <View className="good_desc_info">{this.state.dataList[1].desc}</View>
                        </View>
                      </View>
                      <View className="good_money">
                        <View className="good_new_money">{this.state.dataList[1].new_money}</View>
                        <View className="good_old_money">{this.state.dataList[1].old_money}</View>
                      </View>
                    </View>
                  </View>
                  <View className="good_btn">
                    <View className="text">抢购</View>
                  </View>
                </View> : null
              }
              {
                this.state.showAll && this.state.dataList.map((item) => (
                  <View className="good_info">
                    <View className="good_msg">
                      <Image className="good_img" src={item.img} />

                      <View className="good_detail">
                        <View className="good_detail_info">
                          <View className="good_title">
                            <View className="good_type">{item.type}</View>
                            <View className="good_cash">{item.cash}</View>
                          </View>
                          <View className="good_desc">
                            <View className="good_desc_info">{item.desc}</View>
                          </View>
                        </View>
                        <View className="good_money">
                          <View className="good_new_money">{item.new_money}</View>
                          <View className="good_old_money">{item.old_money}</View>
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
                this.state.dataList.length <= 2 ? "" : (
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
