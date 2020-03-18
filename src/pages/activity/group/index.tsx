import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtNoticebar } from 'taro-ui';
import { View, Image, Swiper, SwiperItem, Button, Canvas, ScrollView } from "@tarojs/components";
import request from '../../../services/request'
import TimeUp from './TimeUp';
import AddressImg from '../../../assets/address.png';
import MobileImg from '../../../assets/dianhua.png';
import './index.scss';
import LoginAlert from '@/components/loginAlert';
interface Props {
  id: any;
}


let interval;
export default class Group extends Component<Props>{


  state = {
    ruleMore: false,
    xPoint: 0,
    yPoint: 0,
    imagesCurrent: 0,
    is_alert: false, //登录弹窗
    data: {
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
      ypoint: ""
    },
    data2: {
      data: [
        {
          avatar: "",
          id: 0,
          number: 0,
          participation_number: 0,
          real_name: "",
          activity_end_time: '',
          end_at: '',
          is_team: false
        }
      ],
      page: 1,
      pageRow: 2,
      total: 0,
    },
    newGroupList: [],
    isPostage: true,
    isFromShare: false,
    groupListShow: false,
    groupListPages: 1
  };


  clearTimeOut = () => {
    var end = setTimeout(function () { }, 1);
    var start = (end - 100) > 0 ? end - 100 : 0;
    for (var i = start; i <= end; i++) {
      clearTimeout(i);
    }
  }
  componentWillUnmount() {
    this.clearTimeOut();
  }
  componentDidShow = () => {
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) {
      this.setState({
        isFromShare: true
      })
    }
    Taro.showLoading({
      title: 'loading',
    })
    Taro.getLocation({
      type: 'gcj02',
      success: res => {
        this.setState({
          yPoint: res.latitude,
          xPoint: res.longitude
        }, () => {
          request({
            url: 'api/wap/user/getGroupbuyings',
            method: "GET",
            data: {
              group_info_id: this.$router.params.id,
              page: 1
            }
          })
            .then((res: any) => {
              let newGroupList = this.chunk(res.data.data, 2);
              this.setState({ data2: res.data, newGroupList: newGroupList });
            });

          request({
            url: 'api/wap/user/getGroupYouhuiInfo',
            method: "GET",
            data: {
              group_info_id: this.$router.params.id,
              is_xcx: 1,
              xpoint: this.state.xPoint,
              ypoint: this.state.yPoint
            }
          })
            .then((res: any) => {
              if (res.data.gift_id) {
                if (res.data.gift.mail_mode == 2) {
                  this.setState({ isPostage: true })
                }
              } else {
                this.setState({ isPostage: false })
              }
              this.setState({ data: res.data });
              Taro.hideLoading()
            }).catch(err => {
              console.log(err);
            })
        })
      },
      fail: () => {
        this.setState({
          yPoint: '',
          xPoint: ''
        }, () => {
          request({
            url: 'api/wap/user/getGroupbuyings',
            method: "GET",
            data: {
              group_info_id: this.$router.params.id,
              page: 1
            }
          })
            .then((res: any) => {
              let newGroupList = this.chunk(res.data.data, 2);
              this.setState({ data2: res.data, newGroupList: newGroupList });
            });

          request({
            url: 'api/wap/user/getGroupYouhuiInfo',
            method: "GET",
            data: {
              group_info_id: this.$router.params.id,
              is_xcx: 1,
              xpoint: this.state.xPoint,
              ypoint: this.state.yPoint
            }
          })
            .then((res: any) => {
              if (res.data.gift_id) {
                if (res.data.gift.mail_mode == 2) {
                  this.setState({ isPostage: true })
                }
              } else {
                this.setState({ isPostage: false })
              }
              this.setState({ data: res.data });
              Taro.hideLoading()
            }).catch(err => {
              console.log(err);
            })
        })
      }
    })
    Taro.showShareMenu();
  }

  /**
  * 回首页
  */
  handleGoHome = () => {
    this.clearTimeOut(); Taro.switchTab({ url: '/pages/index/index' })
  }

  onShareAppMessage() {
    const userInfo = Taro.getStorageSync("userInfo");
    const { name, youhui_name, gift, pay_money, participation_money, preview } = this.state.data;
    const { id, activity_id, gift_id, type } = this.$router.params;
    let title, imageUrl;
    if (gift) {
      title = `只需${participation_money}元即可领取价值${pay_money}元的拼团券，还有超值礼品等着你`;
      imageUrl = preview;
    } else {
      title = `${name}正在发起${youhui_name}拼团活动，速来！`;
      imageUrl = preview;
    }
    return {
      title: title,
      path: '/pages/activity/group/index?id=' + id + '&type=5&gift_id=' + gift_id + '&activity_id=' + activity_id,
      imageUrl: imageUrl
    }
  }

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


  //去图文详情
  toImgList = () => {
    this.clearTimeOut();
    Taro.navigateTo({ url: '/detail-pages/gift/gift?gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id })
  }
  //去商店
  handleClick2 = (e) => {
    this.clearTimeOut();
    Taro.navigateTo({ url: '/pages/business/index?id=' + this.state.data.id })
  };
  //打电话
  makePhoneCall = (e) => {
    Taro.makePhoneCall({
      phoneNumber: this.state.data.tel
    })
    e.stopPropagation();
  }
  //地图
  routePlanning = (e) => {
    Taro.openLocation({
      latitude: Number(this.state.data.ypoint),
      longitude: Number(this.state.data.xpoint),
      scale: 18,
      name: this.state.data.name,
      address: this.state.data.address,
    });
    e.stopPropagation();
  }

  payment = () => {
    let phone_status = Taro.getStorageSync('phone_status')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      let _tempid = this.$router.params.publictypeid ? this.$router.params.publictypeid : undefined;
      let _temptype = this.$router.params.type;
      // 改前必看：本页面与众不同的傻狗命名一览
      // 活动ID：this.$router.params.id===this.state.data.youhui_id;
      // 店ID:store_id==this.state.data.id;
      // 店名==this.state.data.name

      //一般进来：id，type == 5 ，gift_id，activity_id，
      //参团进来：id，type == 55 ，gift_id，activity_id，publictypeid

      Taro.showLoading({
        title: 'loading',
      });
      let data = {
        public_type_id: this.$router.params.publictypeid ? this.$router.params.publictypeid : this.$router.params.id,
        activity_id: this.$router.params.activity_id,
        open_id: Taro.getStorageSync("openid"),
        unionid: Taro.getStorageSync("unionid"),
        type: this.$router.params.type,
        xcx: 1,
        number: 1
      }
      request({
        url: 'payCentre/toWxPay',
        method: "POST",
        data
      }).then((res: any) => {
        if (res.code == 200) {
          let order_sn = res.channel_order_sn;//比增值少一层data
          Taro.hideLoading();
          // 发起支付
          Taro.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success(res) {
              if (_temptype == 5) {
                //开团要得到开团活动id再跳转活动详情
                Taro.showLoading({
                  title: 'loading',
                  mask: true
                });
                interval = setInterval(() => {
                  request({
                    url: 'api/wap/user/getUserYouhuiGroupId',
                    method: "GET",
                    data: { order_sn: order_sn }
                  }).then((res: any) => {
                    if (res.code == 200) {
                      clearInterval(interval);
                      Taro.hideLoading();
                      Taro.navigateTo({
                        url: '/pages/activity/pages/group/group?id=' + res.data.id,
                        success: () => {
                          var page = Taro.getCurrentPages().pop();
                          if (page == undefined || page == null) return;
                          page.onLoad();
                        }
                      })
                    }
                  })
                }, 1000);
              } else if (_temptype == 55) {
                Taro.navigateTo({
                  url: '/pages/activity/pages/group/group?id=' + _tempid,
                  success: () => {
                    var page = Taro.getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  }
                })
              } else {
                console.log('类型出错');
                return;
              }
            },
            fail(err) {
              Taro.showToast({ title: '支付失败', icon: 'none' })
            }
          })
        }
      })
    } else {
      this.setState({ is_alert: true })
    }

  }


  payment2 = (_groupid) => {
    let phone_status = Taro.getStorageSync('phone_status')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      Taro.showLoading({
        title: 'loading',
      });
      let data = {
        public_type_id: _groupid,
        activity_id: this.$router.params.activity_id,
        open_id: Taro.getStorageSync("openid"),
        unionid: Taro.getStorageSync("unionid"),
        type: this.$router.params.type,
        xcx: 1,
        number: 1
      }

      request({
        url: 'payCentre/toWxPay',
        method: "POST",
        data
      }).then((res: any) => {
        Taro.hideLoading();
        // 发起支付
        Taro.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(res) {
            Taro.navigateTo({
              url: '/pages/activity/pages/group/group?id=' + _groupid,
              success: () => {
                var page = Taro.getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          },
          fail(err) {
            Taro.showToast({ title: '支付失败', icon: 'none' })
          }
        })
      })
    } else {
      this.setState({ is_alert: true })
    }

  }

  addGroupList = () => {
    if ((this.state.data2.total / this.state.data2.pageRow) > this.state.groupListPages) {
      let thePage = this.state.groupListPages + 1;
      this.setState({ groupListPages: thePage }, () => {
        request({
          url: 'api/wap/user/getGroupbuyings',
          method: "GET",
          data: {
            group_info_id: this.$router.params.id,
            page: thePage
          }
        })
          .then((res: any) => {
            let newDate = this.state.data2.data.concat(res.data.data);
            let newObj = this.state.data2;
            newObj.data = newDate;
            this.setState({ data2: newObj });
          });

      });
    } else {
      return;
    }
  }

  goToaConfirm = (e) => {
    let phone_status = Taro.getStorageSync('phone_status')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      if (this.state.data.gift_id) {
        this.clearTimeOut();
        if (this.$router.params.type == '5') {
          //列表页或商家页进入拼团，路由params带过来的为活动id,id为活动id
          Taro.navigateTo({
            url: '/activity-pages/confirm-address/index?activityType=' + this.$router.params.type + '&id=' + this.$router.params.id + '&storeName=' + this.state.data.name
          })
        } else if (this.$router.params.type == '55') {
          //打开分享链接进入参团，接口的youhui_id为活动id，路由过来的id为团id
          Taro.navigateTo({
            url: '/activity-pages/confirm-address/index?activityType=' + this.$router.params.type + '&id=' + this.$router.params.id + '&groupId=' + this.$router.params.publictypeid + '&storeName=' + this.state.data.name
          })
        }
      } else {
        this.payment();
      }
    } else {
      this.setState({ is_alert: true })
    }
  }
  goToaConfirmAddGroup = (_id, e) => {
    let phone_status = Taro.getStorageSync('phone_status')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      if (this.state.data.gift_id) {
        this.clearTimeOut();
        //轮播列表参团,路由params带过来的id为活动id, 接口传过来的id为团id
        console.log(this.$router.params.id, _id)
        Taro.navigateTo({
          url: '/activity-pages/confirm-address/index?activityType=55&id=' + this.$router.params.id + '&groupId=' + _id + '&storeName=' + this.state.data.name
        })
      } else {
        this.payment2(_id);
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
  render() {
    const { description } = this.state.data;
    const { data2 } = this.state;
    return (
      <View className="d_appre" >
        {
          this.state.groupListShow ? <View className="d_appre_groupList" onClick={(e) => { this.setState({ groupListShow: false }); e.stopPropagation(); }} onTouchMove={(e) => { this.setState({ groupListShow: false }); e.stopPropagation(); }} >
            <View className="d_appre_groupList_box">
              <View className="d_appre_groupList_box_title">正在拼团</View>
              <View className="d_appre_groupList_box_slideBox">
                <ScrollView
                  className='d_appre_groupList_box_slideBox_content'
                  scrollY
                  scrollWithAnimation
                  onScrollToLower={this.addGroupList}
                >
                  {
                    data2.data.map((item) => {
                      return (
                        <View className="group_list0" >
                          <View className="group_list_img0" >
                            <Image className="listImg0" src={item.avatar} />
                          </View>
                          <View className="group_list_name0" >{item.real_name}</View>
                          <View className="group_list_timesbox0" >
                            <View className="group_list_lack0" >
                              <View className="group_list_lackredblack10" >还差</View>
                              <View className="group_list_lackred0" >{item.number - item.participation_number}人</View>
                              <View className="group_list_lackredblack20" >拼成</View>
                            </View>
                            <View className="group_list_times0" >
                              <TimeUp itemtime={item.end_at} />
                            </View>
                          </View>
                          <View className="group_list_btnbox0" >
                            {
                              item.is_team ? <View className="group_list_btn0" style={{ background: '#999999' }} >您已参团</View> :
                                <View className="group_list_btn0" onClick={this.goToaConfirmAddGroup.bind(this, item.id)} >立即参团</View>
                            }
                          </View>
                        </View>
                      )
                    })
                  }
                </ScrollView>
              </View>
              <View className="group_list_toast" >上滑查看更多</View>
            </View>
            <View className="group_list_closebtn" >
              <AtIcon value='close-circle' size="30px" color='#fff'></AtIcon>
            </View>
          </View> : null
        }
        <Button className="group_head_bottom_share" open-type="share" >
          <Image className="shareimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/TTbP3DjHQZPhRCxkcY7aSBAaSxKKS3Wi.png" />
          分享
        </Button >

        {
          this.state.data.images.length > 0 ? <Swiper
            onChange={(e) => { this.setState({ imagesCurrent: e.detail.current }) }}
            className='test-h'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            indicatorDots
            autoplay>
            {
              this.state.data.images ? this.state.data.images.map((item, index) => {
                return (
                  <SwiperItem key={item} >
                    <View className='demo-text' >
                      <Image className="demo-text-Img" src={item} />
                    </View>
                  </SwiperItem>
                )
              }) : null
            }
          </Swiper> : null
        }
        <View className="coupon_box_title">
          <View className="group_coupon_title" >{this.state.data.youhui_name}</View>
          <View className="group_rule_time" >
            <View className="group_rule_time_key" >活动时间:</View>
            <View className="group_rule_time_data" > {this.state.data.activity_begin_time}-{this.state.data.activity_end_time}</View>
          </View>
          <View className="group_head_bottom" style={{ borderBottom: "none" }}>
            {this.state.data.gift ? <View className="group_head_bottom_gift">送价值{this.state.data.gift.price}{this.state.data.gift.title}</View> : null}
            <View className="group_head_bottom_list">{this.state.data.number}人团</View>
            <View className="group_head_bottom_list">{this.state.data.team_set_end_time}小时</View>
          </View>
          {/* <View className="group_msg" >
            <View className="group_msg_titlebox" >商品详情</View>
            <View className="group_msgBox" >
              <View className="group_msgTitle_Box" >
                <View className="group_msgTitle" >名称</View>
                <View className="group_msgTitle" >数量</View>
                <View className="group_msgTitle" >价格</View>
              </View>
              <View className="group_msgContent_Box" >
                <View className="group_msgContent" >番茄炒蛋</View>
                <View className="group_msgContent" >2</View>
                <View className="group_msgContent" >￥200</View>
              </View>
              <View className="group_msgContent_Box" >
                <View className="group_msgContent" >麦当劳开心乐园儿童套餐</View>
                <View className="group_msgContent" >1</View>
                <View className="group_msgContent" >￥150</View>
              </View>
            </View>
          </View> */}
        </View>
        {
          this.state.data.gift_id ?
            <View className="appre_gift" >
              <View className="appre_gift_titlebox" >
                <View className="appre_gift_title" >赠送礼品</View>
                <View className="appre_gift_Imagelist" onClick={this.toImgList.bind(this)}>图文详情</View>
              </View>
              <View className="appre_gift_giftinfo" >{this.state.data.gift.title}</View>
              <View className="appre_gift_giftmsgbox" >
                <View className="appre_gift_giftmsg" >{
                  this.state.data.gift.mail_mode == 1 ? '免运费' : `运费${this.state.data.gift.postage}元`
                }</View>
              </View>
              <View className="appre_gift_giftlist" >
                <Image className="appre_gift_giftlistImg"
                  mode="widthFix"
                  src={this.state.data.gift.cover_image} />
              </View>
            </View> : null
        }
        <View className="appre_process2" >
          <Image className="appre_process2_Image" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/x2WBTiwQwdap5ktNYYTyrGeP7E4zD5Qk.png" />
        </View>
        {
          data2.data && data2.data.length > 0 ? <View className="group_num" >
            <View className="group_num_titlebox" >
              <View className="group_num_title" >{data2.total}人正在拼</View>
              <View className="group_num_now" onClick={() => this.setState({ groupListShow: true })}>查看更多</View>
            </View>
            <View className="group_listbox" >
              <Swiper
                className='test-h'
                vertical
                autoplay
                circular={true}
                interval={3000}
              >
                {
                  this.state.newGroupList.map((item: any, index) => {
                    return (
                      <SwiperItem>
                        <View className="group_list" >
                          <View className="group_list_img" >
                            <Image className="listImg" src={item[0].avatar} />
                          </View>
                          <View className="group_list_name" >{item[0].real_name}</View>
                          <View className="group_list_btnbox" >
                            {
                              item[0].is_team ? <View className="group_list_btn" style={{ background: '#999999' }} >您已参团</View> :
                                <View className="group_list_btn" onClick={this.goToaConfirmAddGroup.bind(this, item[0].id)} >立即参团</View>
                            }
                          </View>
                          <View className="group_list_timesbox" >
                            <View className="group_list_lack" >
                              <View className="group_list_lackredblack1" >还差</View>
                              <View className="group_list_lackred" >{item[0].number - item[0].participation_number}人</View>
                              <View className="group_list_lackredblack2" >拼成</View>
                            </View>
                            <View className="group_list_times" >
                              <TimeUp itemtime={item[0].end_at} />
                            </View>
                          </View>
                        </View>
                        {
                          item[1] ? <View className="group_list" >
                            <View className="group_list_img" >
                              <Image className="listImg" src={item[1].avatar} />
                            </View>
                            <View className="group_list_name" >{item[1].real_name}</View>
                            <View className="group_list_btnbox" >
                              {
                                item[1] && item[1].is_team ? <View className="group_list_btn" style={{ background: '#999999' }} >您已参团</View> :
                                  <View className="group_list_btn" onClick={this.goToaConfirmAddGroup.bind(this, item[1].id)} >立即参团</View>
                              }
                            </View>
                            <View className="group_list_timesbox" >
                              <View className="group_list_lack" >
                                <View className="group_list_lackredblack1" >还差</View>
                                <View className="group_list_lackred" >{item[1].number - item[1].participation_number}人</View>
                                <View className="group_list_lackredblack2" >拼成</View>
                              </View>
                              <View className="group_list_times" >
                                <TimeUp itemtime={item[1].end_at} />
                              </View>
                            </View>
                          </View> : null
                        }
                      </SwiperItem>
                    )
                  })
                }
              </Swiper>
            </View>
          </View> : null
        }
        <View className="appre_rule" >
          <View className="appre_rule_titlebox" >
            <View className="appre_rule_title" >使用规则</View>
          </View>
          <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >拼团人数:</View>
            <View className="appre_rule_time_data" >{this.state.data.number}人团</View>
          </View>
          <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >时间限制:</View>
            <View className="appre_rule_time_data" >{this.state.data.team_set_end_time}小时内</View>
          </View>
          {
            description.length > 0 ?
              <View className="appre_rule_list" style={{ height: description.length <= 4 ? "auto" : (this.state.ruleMore ? "auto" : "5.4rem") }}>
                <View className="appre_rule_list_key" >详情描述:</View>
                <View className="appre_rule_list_data" >
                  {
                    description.map((item) => {
                      return (
                        <View className="appre_rule_list_msg" >. {item}</View>
                      )
                    })
                  }
                </View>
              </View> : null
          }
          {
            description && description.length > 4 ?
              <View className="appre_rule_list_more" onClick={() => { this.setState({ ruleMore: !this.state.ruleMore }) }}>
                {this.state.ruleMore ? "收回" : "查看更多"}
                {
                  this.state.ruleMore ?
                    <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />
                }
              </View> : null
          }
        </View>
        <View className="setMeal_store">
          <View className="setMeal_store_box" onClick={this.handleClick2.bind(this)}>
            <View className="setMeal_store_title">适用店铺</View>
            <View className="setMeal_store_storebox">
              <View className="setMeal_store_Image">
                <Image className="setMeal_store_img" src={this.state.data.preview} />
              </View>
              <View className="setMeal_store_msg">
                <View className="setMeal_store_name">{this.state.data.name}</View>
                {/* <View className="setMeal_store_price">人均：￥222</View> */}
              </View>
              <View className="setMeal_store_icon">
                <AtIcon value='chevron-right' size='20' color='#ccc'></AtIcon>
              </View>
            </View>
            <View className="setMeal_store_addressbox">
              <View className="setMeal_store_distance" onClick={this.routePlanning.bind(this)}>
                <View className="setMeal_store_distance_Image" >
                  <Image className="setMeal_store_distance_AddressImg" src={AddressImg} />
                </View>
                <View className="setMeal_store_distance_info" > {this.state.data.distances}</View>
              </View>
              <View className="setMeal_store_address" onClick={this.routePlanning.bind(this)}>{this.state.data.address}</View>
              <View className="setMeal_store_mobile" onClick={this.makePhoneCall.bind(this)}>
                <Image className="setMeal_store_MobileImg" src={MobileImg} />
              </View>
            </View>
          </View>
        </View>
        <View className="paymoney_box">
          <View className="paymoney_price">
            <View className="paymoney_price_icon">￥</View>
            <View className="paymoney_price_num">{this.state.data.participation_money}</View>
            <View className="paymoney_price_oldprice">￥{this.state.data.pay_money}</View>
            {
              this.state.isPostage ? <View className='paymoney_price_info'> {
                this.state.data.gift.mail_mode == 1 ? null :
                  '+' + this.state.data.gift.postage}</View> : null
            }
          </View>
          {
            this.$router.params.type == "55" ? <View className="paymoney_buynow" onClick={this.goToaConfirm.bind(this)}>参加拼团</View> : <View className="paymoney_buynow" onClick={this.goToaConfirm.bind(this)}>发起拼团</View>
          }
        </View>

        <View style={{ position: "fixed", top: "-1000px", zIndex: -1, opacity: 0 }}>
          <Canvas style='width: 460px; height: 360px;' canvasId='canvas01' />
        </View>


        {
          this.state.is_alert ? <LoginAlert onChange={this.loginChange} /> : null
        }
        {/* 去首页 */}
        {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '50%', right: '20px' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../../assets/go_home.png')} className="go_home" />
            </View>
          ) : ''
        }

      </View>
    );
  }
}
