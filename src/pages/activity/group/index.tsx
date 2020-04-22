import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast, AtTabs, AtTabsPane } from "taro-ui";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import {
  getGroupYouhuiInfo,
  getGroupbuyings,
  getShareSign,
  toWxPay,
  getUserYouhuiGroupId,
  getGroupPoster
} from "./service";
import { getXcxQrcode } from "@/api";
import ApplyToTheStore from '@/components/applyToTheStore';
import TimeUp from '@/components/TimeUp';
import LoginAlert from '@/components/loginAlert';
import ShareBox from "@/components/share-box";//分享组件
import SpellGroup from "@/components/poster/spell-group";//海报组件
import Zoom from '@/components/zoom';
import { accAdd, accSub } from '@/components/acc-num';
import { accSubtr } from '@/utils/common';

const H5_URL = process.env.H5_URL
const BASIC_API = process.env.BASIC_API;
export default class GroupActivity extends Component {
  config = {
    navigationBarTitleText: "拼团活动",
    enablePullDownRefresh: false
  };


  state = {
    imgZoomSrc: '',
    imgZoom: false,
    //允许参加活动
    allowGroup: '',
    //从分享进入
    isFromShare: false,
    // 登录弹窗
    is_alert: false,
    //图片轮播下标
    bannerImgIndex: 0,
    //列表轮播下标
    current: 0,
    //查看更多
    showMoreRules: false,
    showMoreImages: false,
    data: {
      invitation_user_id: '',
      activity_begin_time: "",
      activity_end_time: "",
      activity_id: 0,
      activity_time_status: 0,
      address: "",
      begin_time: "",
      description: [],
      distances: "",
      end_time: "",
      gift: { title: "", price: "", postage: "", mail_mode: 2, cover_image: '' },
      gift_id: 0,
      icon: "",
      id: 0,//店id
      image: "",
      images: [],
      brief: [],
      is_show_button: 0,
      list_brief: "",
      locate_match_row: "",
      name: "",//店名
      number: 0,
      participate_number: 0,
      participation_money: "",
      pay_money: "",
      preview: '',
      route: "",
      succeed_participate_number: 0,
      supplier_id: 0,
      team_set_end_time: '',
      tel: "",
      xpoint: '',
      youhui_id: 0,//活动id
      youhui_name: "",//活动名
      ypoint: "",
      share_text: '',//复制出去的文字
      supplier_delivery_id: 0,
      delivery_service_info: {
        delivery_end_time: '',
        delivery_radius_m: 0,
        delivery_service_money: 0,
        delivery_start_time: '',
        id: 0
      }
    },
    data2: {
      data: [],
      page: 1,
      pageRow: 2,
      total: 0,
    },
    newGroupList: [],
    showShare: false, //显示分享
    showPoster: false, //显示海报
    posterList: {
      return_money: '',
      total_fee: '',
      expire_day: '',
      name: '',
      pay_money: '',
      store: {
        name: '',
        address: ''
      }
    }
  };

  componentDidMount() {
    // console.log(this.$router.params.id, 'this.$router.params.id')
    this.setState({ securityPoster: true })
    this.getPostList()
  }

  /**
       * 获取位置信息
       */
  componentDidShow() {
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) { this.setState({ isFromShare: true }) }
    Taro.showLoading({ title: 'loading' })
    Taro.getLocation({
      type: 'gcj02',
      success: res => {
        this.getGroupInfo({ group_info_id: this.$router.params.id, is_xcx: 0, ypoint: res.latitude || '', xpoint: res.longitude || '' })
      },
      fail: () => {
        this.getGroupInfo({ group_info_id: this.$router.params.id, is_xcx: 0, ypoint: '', xpoint: '' })
      }
    })
  }

  /**
   * 获取拼团活动信息
   * @param {object} data 活动id，坐标
   */
  getGroupInfo = (data: object) => {
    let that = this;
    getGroupYouhuiInfo(data)
      .then((res: any) => {
        that.getGroupList({ group_info_id: this.$router.params.id, page: 1 });
        Taro.hideLoading();
        if (res.code == 200) {
          let isPostage = false;
          if (res.data.gift_id && res.data.gift.mail_mode == 2) { isPostage = true; }
          let new_time = new Date().getTime()//ql
          res.data.activity_time_status == 3 ? this.setState({ allowGroup: '已结束' }) : null
          res.data.activity_time_status == 1 ? this.setState({ allowGroup: '暂未开始' }) : null
          that.setState({ data: res.data, isPostage });
          // , () => { this.getPostList() }
        } else {
          Taro.showToast({ title: '请求失败', icon: 'none' });
        }
      }).catch(err => {
        Taro.hideLoading();
        Taro.showToast({ title: '请求失败', icon: 'none' });
        that.getGroupList({ group_info_id: this.$router.params.id, page: 1 });
      })
  }

  /**
    * 获取拼团列表
    * @param {object} data 活动id，页数
    */
  getGroupList = (data: object) => {
    Taro.showLoading({ title: 'loading' })
    getGroupbuyings(data).then((res: any) => {
      Taro.hideLoading();
      if (res.code == 200) {
        let newGroupList = this.chunk(res.data.data, 2);
        this.setState({ data2: res.data, newGroupList: newGroupList }, () => { this.listAtb() });
      } else {
        Taro.showToast({ title: res.message, icon: 'none' });
      }
    }).catch((err) => {
      Taro.hideLoading();
    })
  }

  /**
     * 切割数组
     * @param {object} arr 旧数组
     * @param {object} size 二维数组第二层长度
     */
  chunk = (arr, size) => {
    var arr1 = new Array();
    for (var i = 0; i < Math.ceil(arr.length / size); i++) {
      arr1[i] = new Array();
    }
    var j = 0;
    var x = 0;
    for (var i = 0; i < arr.length; i++) {
      if (!((i % size == 0) && (i != 0))) {
        arr1[j][x] = arr[i];
        x++;
      } else {
        j++;
        x = 0;
        arr1[j][x] = arr[i];
        x++;
      }
    }
    return arr1;
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
    * 底部发团参团，判断登录，判断带不带礼品
    */
  goToaConfirm = (e) => {
    let phone_status = Taro.getStorageSync('phone_status')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      if (this.state.data.gift_id || this.state.data.supplier_delivery_id) {
        if (this.$router.params.type == '5') {
          //列表页或商家页进入拼团，路由params带过来的为活动id,id为活动id
          Taro.navigateTo({
            url: '/activity-pages/group-distribution/index?activityType=' + this.$router.params.type + '&id=' + this.$router.params.id + '&storeName=' + encodeURIComponent(this.state.data.name)
          })
        } else if (this.$router.params.type == '55') {
          //打开分享链接进入参团，接口的youhui_id为活动id，路由过来的id为团id
          Taro.navigateTo({
            url: '/activity-pages/group-distribution/index?activityType=' + this.$router.params.type + '&id=' + this.$router.params.id + '&groupId=' + this.$router.params.publictypeid + '&storeName=' + encodeURIComponent(this.state.data.name)
          })
        }
      } else {
        this.payment();
      }
    } else {
      this.setState({ is_alert: true })
    }
  }

  /**
    * 列表参团，判断登录，判断带不带礼品
    */
  goToaConfirmAddGroup = (_id, e) => {
    let phone_status = Taro.getStorageSync('phone_status')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      if (this.state.data.gift_id || this.state.data.supplier_delivery_id) {
        Taro.navigateTo({
          url: '/activity-pages/group-distribution/index?activityType=55&id=' + this.$router.params.id + '&groupId=' + _id + '&storeName=' + encodeURIComponent(this.state.data.name)
        })
      } else {
        this.groupPayment(_id);
      }
    } else {
      this.setState({ is_alert: true })
    }
  }

  /**
    * 底部按钮发团或者拼团支付,不带礼品
    */
  payment() {
    let that = this;
    let _tempid = this.$router.params.publictypeid ? this.$router.params.publictypeid : undefined;
    let _temptype = this.$router.params.type;
    Taro.showLoading({ title: 'loading', mask: true });
    let datas = {
      public_type_id: this.$router.params.publictypeid ? this.$router.params.publictypeid : this.$router.params.id,
      activity_id: this.$router.params.activity_id,
      open_id: Taro.getStorageSync("openid"),
      unionid: Taro.getStorageSync("unionid"),
      type: this.$router.params.type,
      xcx: 1,
      number: 1
    }
    toWxPay(datas).then((res: any) => {
      Taro.hideLoading();
      if (res.code == 200) {
        let order_sn = res.channel_order_sn;//比增值少一层data
        Taro.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(res) {
            if (_temptype == '5') {
              //开团要得到开团活动id再跳转活动详情
              that.getLastGroupId(order_sn);
            } else if (_temptype == '55') {
              that.goToGroupInfo(_tempid);
            }
          },
          fail(err) {
            Taro.showToast({ title: '支付失败', icon: 'none' })
          }
        })
      } else {
        Taro.showToast({ title: res.message, icon: 'none' })
      }
    }).catch(err => {
      Taro.showToast({ title: '调起支付失败', icon: 'none' })
    })
  }

  /**
   * 列表参团，不带礼品
   * @param {object} _groupid 团id
   */
  groupPayment(_groupid) {
    let that = this;
    Taro.showLoading({ title: 'loading', mask: true });
    let datas = {
      public_type_id: _groupid,
      activity_id: this.$router.params.activity_id,
      open_id: Taro.getStorageSync("openid"),
      unionid: Taro.getStorageSync("unionid"),
      type: 55,
      xcx: 1,
      number: 1
    };
    toWxPay(datas).then((res: any) => {
      Taro.hideLoading();
      if (res.code == 200) {
        Taro.hideLoading();
        // 发起支付
        Taro.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(res) {
            that.goToGroupInfo(_groupid);
          },
          fail(err) {
            Taro.showToast({ title: '支付失败', icon: 'none' })
          }
        })
      } else {
        Taro.showToast({ title: res.message, icon: 'none' })
      }
    }).catch(err => {
      Taro.showToast({ title: '调起支付失败', icon: 'none' })
    })
  }


  /**
  * 发团支付后查询团id跳转
  *  @param {object} order_sn 订单号
  */
  getLastGroupId = (order_sn) => {
    let that = this;
    Taro.showLoading({ title: '支付成功，正在查询用户团活动id', mask: true });
    let timer = setTimeout(() => {
      clearTimeout(timer);
      getUserYouhuiGroupId({ order_sn: order_sn })
        .then((res: any) => {
          if (res.code == 200) {
            Taro.hideLoading();
            that.goToGroupInfo(res.data.id)
          } else {
            that.getLastGroupId(order_sn)
          }
        }).catch((err) => {
          that.getLastGroupId(order_sn)
        })
    }, 1000);
  }

  /**
   * 跳转团详情
   *  @param {object} _tempid 团id
   */
  goToGroupInfo = (_tempid: any) => {
    Taro.navigateTo({
      url: '/pages/activity/pages/group/group?id=' + _tempid
    })
  }

  /**
   * 列表轮播
   */
  listAtb = () => {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      let tempPage = this.state.current == this.state.newGroupList.length - 1 ? 0 : this.state.current + 1;
      this.setState({ current: tempPage }, () => { this.listAtb() })
    }, 5000)
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

  // 分享活动
  shareActive = () => {
    this.setState({ showShare: true })
  }

  /* 请求海报数据 */
  getPostList = () => {
    let youhui_id = this.$router.params.id
    getGroupPoster({ youhui_id, from: 'wx' })
      .then(({ data, code }) => {
        this.setState({ posterList: data })
        let link = data.link
        getXcxQrcode({ link, id: youhui_id })
          .then((res) => {
            let meta = this.state.posterList
            meta['wx_img'] = BASIC_API + res.data.url
            this.setState({ posterList: meta })
          })
      })

  }


  onShareAppMessage = () => {
    const userInfo = Taro.getStorageSync("userInfo");
    const { name, youhui_name, gift, pay_money, participation_money, preview, invitation_user_id } = this.state.data;
    const { id, activity_id, gift_id, type } = this.$router.params;
    let title, imageUrl;
    if (gift) {
      title = `只需${participation_money}元即可领取价值${pay_money}元的拼团券，还有超值礼品等着你`;
      imageUrl = this.state.data.image
    } else {
      title = `${name}正在发起${youhui_name}拼团活动，速来！`;
      imageUrl = this.state.data.image
    }
    return {
      title: title,
      path: '/pages/activity/group/index?id=' + id + '&type=5&gift_id=' + gift_id + '&activity_id=' + activity_id + '&invitation_user_id=' + invitation_user_id,
      imageUrl: imageUrl
    }

  }

  copyText = () => {
    let code = this.state.data.share_text.replace(/@#@#/, H5_URL)
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


  render() {
    const { description, delivery_service_info, brief } = this.state.data;
    const { posterList } = this.state
    return (
      <View className="group-activity-detail">
        {/* 分享 */}
        <ShareBox
          show={this.state.showShare}
          onClose={() => this.setState({ showShare: false })}
          sendText={this.copyText}
          sendLink={this.onShareAppMessage}
          createPoster={() => {
            this.setState({ showPoster: true })
          }}
        />
        {/* 海报 */}
        <SpellGroup
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
              this.state.data.images.length ? this.state.data.images.map((item, index) => {
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
          <View className="banner-number">{this.state.data.images.length}</View>
        </View>
        {/* <View className="collect-box">
                    <Image className="collect-img" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" />
                </View>
                <View className="share-box">
                    <Image className="share-img" src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
                </View> */}
        <View className="group-info-content">
          <View className="group-info-title">
            <View className="group-info-title-label">拼团券</View>
            <View className="group-info-title-text">{this.state.data.youhui_name}</View>
          </View>
          <View className="group-info-price">
            <View className="group-price-info">
              <View className="group-price-info-text">优惠价￥</View>
              <View className="group-price-info-new">{this.state.data.participation_money}</View>
              <View className="group-price-info-old">￥{this.state.data.pay_money}</View>
            </View>
            <View className="group-price-discounts">已优惠￥{accSubtr(Number(this.state.data.pay_money), Number(this.state.data.participation_money))}</View>
          </View>
          <View className="group-info-label">
            {this.state.data.supplier_delivery_id ? <View className="group-info-label-item">可配送</View> : null}
            <View className="group-info-label-item">{this.state.data.number}人团</View>
            {this.state.data.gift ? <View className="group-info-label-item">送{this.state.data.gift.title}</View> : null}
          </View>
        </View>
        <Image className="group-banner-img" src="http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png" />

        {
          this.state.newGroupList.length ? <View className="group-group-num">
            <View className='apply-title-box'>
              <View className='apply-title-left'></View>
              <View className='apply-title'>{this.state.data2.total}个团正在拼</View>
            </View>
            <View className='apply-title-right'>正在拼团</View>
          </View> : null

        }
        {
          this.state.newGroupList.length ? <AtTabs
            current={this.state.current}
            scroll
            className="swiper-group-list"
            tabDirection='vertical'
            height={'34.6vw'}
            tabList={[]}
            onClick={() => { }}>
            {
              this.state.newGroupList.map((item: any, index) => {
                return (
                  <AtTabsPane tabDirection='vertical' current={this.state.current} index={index} key={item} className="swiper-group-list-atTabsPane">
                    <View className="swiper-group-list-item">
                      <View className="swiper-item" onClick={() => { console.log(item[0]) }}>
                        <View className="group-user" >
                          <View className="group-list-img" >
                            <Image className="listImg" src={item[0].avatar} />
                          </View>
                          <View className="group-list-name" >{item[0].real_name}</View>
                        </View>
                        <View className="group-info" >
                          <View className="group-list-timesbox" >
                            <View className="group-list-lack" >
                              <View className="group-list-lackredblack1" >还差</View>
                              <View className="group-list-lackred" >{item[0].number - item[0].participation_number}人</View>
                              <View className="group-list-lackredblack2" >拼成</View>
                            </View>
                            <View className="group-list-times" >
                              <TimeUp itemtime={item[0].end_at} />
                            </View>
                          </View>
                          <View className="group-list-btnbox" >
                            {
                              item[0].is_team ? <View className="group-list-btn" style={{ background: '#999999' }}  >已参团</View> :
                                <View className="group-list-btn" onClick={this.goToaConfirmAddGroup.bind(this, item[0].id)} >参团</View>
                            }
                          </View>
                        </View>
                      </View>
                      {
                        item[1] ? <View className="swiper-item" >

                          <View className="group-user" >
                            <View className="group-list-img" >
                              <Image className="listImg" src={item[1].avatar} />
                            </View>
                            <View className="group-list-name" >{item[1].real_name}</View>
                          </View>

                          <View className="group-info" >
                            <View className="group-list-timesbox" >
                              <View className="group-list-lack" >
                                <View className="group-list-lackredblack1" >还差</View>
                                <View className="group-list-lackred" >{item[1].number - item[1].participation_number}人</View>
                                <View className="group-list-lackredblack2" >拼成</View>
                              </View>
                              <View className="group-list-times" >
                                <TimeUp itemtime={item[1].end_at} />
                              </View>
                            </View>
                            <View className="group-list-btnbox" >
                              {
                                item[1] && item[1].is_team ? <View className="group-list-btn" style={{ background: '#999999' }} >已参团</View> :
                                  <View className="group-list-btn" onClick={this.goToaConfirmAddGroup.bind(this, item[1].id)}  >参团</View>
                              }
                            </View>
                          </View>

                        </View> : null
                      }
                    </View>
                  </AtTabsPane>
                )
              })
            }
          </AtTabs>
            : null

        }
        {/* <Swiper
                    onChange={(e) => {
                        // console.log(this.state.current, e.detail.current)
                        // if (this.state.current == this.state.list.length - 2) {
                        //     this.setState({ current: 0 })
                        // }
                        // else {
                        //     this.setState({ current: e.detail.current })
                        // };
                    }}
                    className='swiper-group-list'
                    autoplay
                    // circular
                    displayMultipleItems={2}
                    vertical
                >
                    {
                        this.state.list.map((item, index) => {
                            return (
                                <SwiperItem key={item} >
                                    <View className="swiper-item" onClick={() => { console.log(item) }}>

                                        <View className="group-user" >
                                            <View className="group-list-img" >
                                                <Image className="listImg" src={"http://oss.tdianyi.com/front/2tp2Gi5MjC47hd7mGBCjEGdsBiWt5Wec.png"} />
                                            </View>
                                            <View className="group-list-name" >{index}测试测试测试测试</View>
                                        </View>

                                        <View className="group-info" >
                                            <View className="group-list-timesbox" >
                                                <View className="group-list-lack" >
                                                    <View className="group-list-lackredblack1" >还差</View>
                                                    <View className="group-list-lackred" >33人</View>
                                                    <View className="group-list-lackredblack2" >拼成</View>
                                                </View>
                                                <View className="group-list-times" >
                                                    <TimeUp itemtime={'2020-6-8'} />
                                                </View>
                                            </View>
                                            <View className="group-list-btnbox" >
                                                <View className="group-list-btn" >参团</View>
                                            </View>
                                        </View>

                                    </View>
                                </SwiperItem>
                            )
                        })
                    }
                </Swiper> */}
        {
          this.state.newGroupList.length ? <View className="group-group-bottom"></View> : null
        }

        <View className="group-store-info">
          <ApplyToTheStore
            id={this.state.data.id}
            isTitle={true}
            img={this.state.data.preview}
            name={this.state.data.name}
            phone={this.state.data.tel}
            address={this.state.data.address}
            location={{ xpoint: this.state.data.xpoint, ypoint: this.state.data.ypoint }}
            meter={this.state.data.distances}
          />
        </View>

        {this.state.data.gift ?
          <View className="group-gift">
            <View className="group-title-box">
              <View className='group-title-left-box'>
                <View className='group-title-left'></View>
                <View className='group-title'>赠送礼品</View>
              </View>
              <View className='group-title-right' onClick={this.toImgList.bind(this)}>
                <View className='group-title-right-info'>查看详情</View>
                <Image className="group-title-right-icon" src={"http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png"} />
              </View>
            </View>
            <View className='group-gift-brief'>{this.state.data.gift.title}</View>
            <View className='group-gift-label-box'>
              <View className='group-gift-label'>{this.state.data.gift.mail_mode == 1 ? '免运费' : `运费${this.state.data.gift.postage}元`}</View>
            </View>
            <Image className="group-gift-img" src={this.state.data.gift.cover_image} mode={'widthFix'} />
          </View> : null
        }
        <View className="group-rules">
          <View className="group-title-box">
            <View className='group-title-left'></View>
            <View className='group-title'>使用说明</View>
          </View>
          <View className="group-rules-item" >
            <View className="rules-key">拼团人数：</View>
            <View className="rules-words">{this.state.data.number}人成团</View>
          </View>
          <View className="group-rules-item" >
            <View className="rules-key"> 拼团时限：</View>
            <View className="rules-words">需{this.state.data.team_set_end_time}时内成团</View>
          </View>
          {
            delivery_service_info.id ? <View className="group-rules-list-margin">
              <View className="group-rules-list-title" >配送服务：</View>
              <View className="group-rules-list-text" >-配送费用：{delivery_service_info.delivery_service_money}元</View>
              <View className="group-rules-list-text" >-配送范围：{delivery_service_info.delivery_radius_m}km</View>
              <View className="group-rules-list-text" >-配送时间：{delivery_service_info.delivery_start_time + '-' + delivery_service_info.delivery_end_time}</View>
              {/* <View className="group-rules-list-text" >-联系电话：{this.state.data.tel}</View> */}
            </View> : null
          }
          {
            description && description.length && !this.state.showMoreRules ? <View>
              <View className="group-rules-list-title" >使用规则：</View>
              {
                description.length > 0 ? <View className="group-rules-list-text" >-{description[0]}</View> : null
              }
              {
                description.length > 1 ? <View className="group-rules-list-text" >-{description[1]}</View> : null
              }
              {
                description.length > 2 ? <View className="group-rules-list-text" >-{description[2]}</View> : null
              }
              {
                description.length > 3 ? <View className="group-rules-list-text" >-{description[3]}</View> : null
              }
            </View> : null
          }
          {
            description && description.length && description.length > 4 && this.state.showMoreRules ? <View>
              <View className="group-rules-list-title" >使用规则：</View>
              {
                description.map((item) => {
                  return (
                    <View className="group-rules-list-text" >-{item}</View>
                  )
                })
              }
            </View> : null
          }
          {
            description && description.length && description.length > 4 && !this.state.showMoreRules ? <View className="group-more" onClick={() => { this.setState({ showMoreRules: true }) }} >
              <Image className="group-more-icon" src={"http://oss.tdianyi.com/front/GQr5D7QZwJczZ6RTwDapaYXj8nMbkenx.png"} />
              <View className="group-more-text" >查看更多</View>
            </View> : null
          }
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

        <View className="group-buy-box" >
          <View className="group-buy-price-box" >
            <View className="group-buy-price-icon" >￥</View>
            <View className="group-buy-price-num" >{this.state.data.participation_money}</View>
          </View>
          <View className="group-buy-btn-box" >
            <View className="group-buy-btn-left" onClick={this.shareActive}>分享活动</View>
            {
              this.state.allowGroup ? <View className="group-buy-btn-right" >{this.state.allowGroup}</View>
                : <View className="group-buy-btn-right" onClick={this.goToaConfirm.bind(this)} >
                  <View className="group-buy-btn-group" > {this.$router.params.type == "55" ? '参加拼团' : '发起拼团'}</View>
                  <View className="group-buy-btn-groupnum" >{this.state.data.number}人成团</View>
                </View>
            }
          </View>
        </View>
        {
          this.state.is_alert ? <LoginAlert onChange={this.loginChange} /> : null
        }
        {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '200rpx', right: '40rpx', zIndex: 88, width: '160rpx', height: '160rpx' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../../assets/go-home/go_home.png')} style={{ width: '160rpx', height: '160rpx' }} />
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
