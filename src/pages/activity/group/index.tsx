import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtNoticebar } from 'taro-ui';
import { View, Image, Swiper, SwiperItem, Button, Canvas } from "@tarojs/components";
import request from '../../../services/request'
import share from '../../../assets/share.png';
import AddressImg from '../../../assets/address.png';
import MobileImg from '../../../assets/dianhua.png';
import Zoom from '../../../components/zoom/index';
import './index.scss';
import AlertLogin from '@/components/alertLogin'
interface Props {
  id: any;
}

export default class Group extends Component<Props>{


  state = {
    ruleMore: false,
    imgZoom: false,
    imgZoomSrc: '',
    xPoint: 0,
    yPoint: 0,
    imagesList: [],
    imagesCurrent: 0,
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
      tel: "",
      xpoint: '',
      youhui_id: 0,//活动id
      youhui_name: "",//活动名
      ypoint: ""
    },
    imagePath: '',
    isPostage: true,
    is_login: false,

    isFromShare: false
  };

  componentDidMount = () => {
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) {
      this.setState({
        isFromShare: true
      })
    }
    console.log('params:', this.$router.params);
    Taro.showLoading({
      title: 'loading',
    })
    Taro.getLocation({
      type: 'wgs84',
      success: res => {
        this.setState({
          yPoint: res.latitude,
          xPoint: res.longitude
        }, () => {
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
              let { image, images } = res.data;
              let imgList;
              if (image && images) {
                imgList = new Array(image).concat(images);
              } else {
                imgList = [];
              }
              if (res.data.gift_id) {
                if (res.data.gift.mail_mode == 2) {
                  this.setState({ isPostage: true })
                }
              } else {
                this.setState({ isPostage: false })
              }
              this.setState({ data: res.data, imagesList: imgList }, () => {
                this.draw();
              });
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
              let { image, images } = res.data;
              let imgList;
              if (image && images) {
                imgList = new Array(image).concat(images);
              } else {
                imgList = [];
              }
              if (res.data.gift_id) {
                if (res.data.gift.mail_mode == 2) {
                  this.setState({ isPostage: true })
                }
              } else {
                this.setState({ isPostage: false })
              }
              this.setState({ data: res.data, imagesList: imgList }, () => {
                this.draw();
              });
              Taro.hideLoading()
            }).catch(err => {
              console.log(err);
            })
        })
      }
    })
    Taro.showShareMenu();
  };

  draw = () => {
    let that = this;
    var ctx = Taro.createCanvasContext('canvas01', this)
    var addressStr = "地址：" + that.state.data.address;
    var telStr = "电话：" + that.state.data.tel;
    // ctx.setFillStyle("rgba(0,0,0,.2)");
    // ctx.fillRect(0, 0, 460, 360);
    console.log("apprepreview", that.state.data.preview);
    Taro.downloadFile({
      url: that.state.data.preview,
      success: function (res) {
        console.log("downloadFile", res.tempFilePath);
        ctx.drawImage(res.tempFilePath, 0, 0, 460, 360);
        // ctx.stroke();
        ctx.setFillStyle("rgba(0,0,0,.5)");
        ctx.fillRect(0, 200, 460, 360);
        ctx.setFillStyle("rgba(255,255,255,.9)");//文字颜色：默认黑色
        ctx.setFontSize(26);//设置字体大小，默认10s
        ctx.lineWidth = 1;
        var lineWidth = 0;
        var canvasWidth = 420; //计算canvas的宽度
        var initHeight = 240; //绘制字体距离canvas顶部初始的高度
        var lastSubStrIndex = 0; //每次开始截取的字符串的索引
        for (let i = 0; i < addressStr.length; i++) {
          lineWidth += ctx.measureText(addressStr[i]).width;
          if (lineWidth > canvasWidth) {
            ctx.fillText(addressStr.substring(lastSubStrIndex, i), 20, initHeight); //绘制截取部分
            initHeight += 35; //为字体的高度
            lineWidth = 0;
            lastSubStrIndex = i;
          }
          if (i == addressStr.length - 1) { //绘制剩余部分
            ctx.fillText(addressStr.substring(lastSubStrIndex, i + 1), 20, initHeight);
          }
        }
        ctx.fillText(telStr, 20, initHeight + 40);
        //调用draw()开始绘制
        console.log("draw");

        ctx.draw()

        setTimeout(function () {
          Taro.canvasToTempFilePath({
            canvasId: 'canvas01',
            success: function (res) {
              console.log("drawres", res.tempFilePath);
              var tempFilePath = res.tempFilePath;
              that.setState({
                imagePath: tempFilePath,
              });
            },
            fail: function (res) {
              console.log(res);
            }
          });
        }, 200);
      },
      fail: function (res) {
        that.setState({
          imagePath: that.state.data.preview
        });
      }
    })
  }

  /**
  * 回首页
  */
  handleGoHome = () => {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }

  onShareAppMessage() {
    const userInfo = Taro.getStorageSync("userInfo");
    const { name, youhui_name, gift, pay_money, participation_money, preview } = this.state.data;
    const { id, activity_id, gift_id, type } = this.$router.params;
    let title, imageUrl;
    if (gift) {
      title = `只需${participation_money}元即可领取价值${pay_money}元的拼团券，还有超值礼品等着你`;
      imageUrl = this.state.imagePath ? this.state.imagePath : preview;
    } else {
      title = `${name}正在发起${youhui_name}拼团活动，速来！`;
      imageUrl = this.state.imagePath ? this.state.imagePath : preview;
    }
    return {
      title: title,
      path: '/pages/activity/group/index?id=' + id + '&type=1&gift_id=' + gift_id + '&activity_id=' + activity_id,
      imageUrl: imageUrl
    }
  }

  //去图文详情
  toImgList = () => {
    Taro.navigateTo({
      url: '/detail-pages/gift/gift?gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id
    })
  }
  //去商店
  handleClick2 = (e) => {
    Taro.navigateTo({
      // url: '/detail-pages/business/index?id=' + _id
      url: '/pages/business/index?id=' + this.state.data.id
    })
  };
  //打电话
  makePhoneCall = (e) => {
    Taro.makePhoneCall({
      phoneNumber: this.state.data.tel
    })
      .then((res: any) => {
        console.log(res)
      });
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

  // 是否选择礼品
  chooseGift = () => {
    this.setState({ isPostage: !this.state.isPostage })
  }

  payment = () => {
    // 改前必看：本页面与众不同的傻狗命名一览
    // 活动ID：this.$router.params.id===this.state.data.youhui_id;
    // 店ID:store_id==this.state.data.id;
    // 店名==this.state.data.name

    //一般进来：id，type == 5 ，gift_id，activity_id，
    //参团进来：id，type == 55 ，gift_id，activity_id，publictypeid
    if (!Taro.getStorageSync("unionid")) {
      this.setState({
        is_login: true
      })
      return
    }
    Taro.showLoading({
      title: 'loading',
    });
    let data = {};
    if (this.state.isPostage) {
      data = {
        public_type_id: this.$router.params.publictypeid ? this.$router.params.publictypeid : this.$router.params.id,
        activity_id: this.$router.params.activity_id,
        gift_id: this.$router.params.gift_id,
        open_id: Taro.getStorageSync("openid"),
        unionid: Taro.getStorageSync("unionid"),
        type: this.$router.params.type,
        xcx: 1,
        number: 1
      }
    } else {
      data = {
        public_type_id: this.$router.params.publictypeid ? this.$router.params.publictypeid : this.$router.params.id,
        open_id: Taro.getStorageSync("openid"),
        unionid: Taro.getStorageSync("unionid"),
        type: this.$router.params.type,
        xcx: 1,
        number: 1
      }
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
            url: '/activity-pages/my-activity/my.activity',
            success: () => {
              var page = Taro.getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })

        },
        fail(err) {
          // Taro.showToast({ title: '支付失败', icon: 'none' })
        }
      })
    })
  }


  render() {
    const { images, description } = this.state.data;
    return (
      <View className="d_appre" >

        <Button className="group_head_bottom_share" open-type="share" >
          <Image className="shareimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/TTbP3DjHQZPhRCxkcY7aSBAaSxKKS3Wi.png" />
          分享
        </Button >

        {
          this.state.imagesList.length > 0 ? <Swiper
            onChange={(e) => {
              // console.log(e.detail.current)
              this.setState({ imagesCurrent: e.detail.current })
            }}
            onClick={() => {
              this.setState({ imgZoom: true, imgZoomSrc: this.state.imagesList[this.state.imagesCurrent] })
            }}
            className='test-h'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            indicatorDots
            autoplay>
            {
              this.state.imagesList ? this.state.imagesList.map((item, index) => {
                return (
                  <SwiperItem key={item} >
                    <View className='demo-text'
                    // onClick={() => { this.setState({ imgZoom: true, imgZoomSrc: item }) }}
                    >
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
            {/* <View className="group_head_bottom_list">24小时</View> */}
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
                  onClick={() => { this.setState({ imgZoom: true, imgZoomSrc: this.state.data.gift.cover_image }) }}
                  src={this.state.data.gift.cover_image} />
              </View>
            </View> : null
        }
        <View className="appre_process2" >
          <Image className="appre_process2_Image" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/x2WBTiwQwdap5ktNYYTyrGeP7E4zD5Qk.png" />
        </View>


        {/* <View className="group_num" >
          <View className="group_num_titlebox" >
            <View className="group_num_title" >4人正在拼</View>
            <View className="group_num_now" >正在拼团</View>
          </View>
          <View className="group_listbox" >
            <View className="group_list" >
              <View className="group_list_img" >
                <Image className="listImg" src={this.state.data.preview} />
              </View>
              <View className="group_list_name" >杨大富</View>
              <View className="group_list_btnbox" >
                <View className="group_list_btn" >立即参团</View>
              </View>
              <View className="group_list_timesbox" >
                <View className="group_list_lack" >
                  <View className="group_list_lackredblack1" >还差</View>
                  <View className="group_list_lackred" >1人</View>
                  <View className="group_list_lackredblack2" >拼成</View>
                </View>
                <View className="group_list_times" >23.50.30</View>
              </View>
            </View>
            <View className="group_list" >
              <View className="group_list_img" >
                <Image className="listImg" src={this.state.data.preview} />
              </View>
              <View className="group_list_name" >杨大富</View>
              <View className="group_list_btnbox" >
                <View className="group_list_btn" >立即参团</View>
              </View>
              <View className="group_list_timesbox" >
                <View className="group_list_lack" >
                  <View className="group_list_lackredblack1" >还差</View>
                  <View className="group_list_lackred" >1人</View>
                  <View className="group_list_lackredblack2" >拼成</View>
                </View>
                <View className="group_list_times" >23.50.30</View>
              </View>
            </View>
          </View>
        </View> */}


        <View className="appre_rule" >



          <View className="appre_rule_titlebox" >
            <View className="appre_rule_title" >使用规则</View>
            {/* <View className="appre_rule_Imagelist" >?</View> */}
          </View>


          <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >拼团人数:</View>
            <View className="appre_rule_time_data" >{this.state.data.number}人团</View>
          </View>
          {/* <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >时间限制:</View>
            <View className="appre_rule_time_data" >24小时内</View>
          </View> */}
          {
            (description) ?
              <View className="appre_rule_list" style={{ height: description.length <= 4 ? "auto" : (this.state.ruleMore ? "auto" : "5.4rem") }}>
                <View className="appre_rule_list_key" >详情描述:</View>
                <View className="appre_rule_list_data" >
                  {
                    (description) ? description.map((item) => {
                      return (
                        <View className="appre_rule_list_msg" >. {item}</View>
                      )
                    }) : null
                  }
                </View>

              </View> : null
          }
          {
            (description && description.length > 4) ?
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
        {
          (this.state.data.gift && this.state.data.gift.mail_mode == 2) ? (
            <View className='choose_postage' onClick={this.chooseGift}>

              <View>
                {
                  this.state.isPostage ? <Image src={require('@/assets/choose.png')} className='choose' /> : <Image src={require('@/assets/nochoose.png')} className='choose' />
                }
              </View>
              （邮费 {this.state.data.gift.postage}元）
          <View className='lbmsg' >
                <AtNoticebar marquee> {this.state.data.gift.title}</AtNoticebar>
              </View>
            </View>) : null
        }

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
            this.$router.params.type == "55" ? <View className="paymoney_buynow" onClick={this.payment.bind(this)}>参加拼团</View> : <View className="paymoney_buynow" onClick={this.payment.bind(this)}>发起拼团</View>
          }

        </View>

        <Zoom
          src={this.state.imgZoomSrc}
          showBool={this.state.imgZoom}
          onChange={() => { this.setState({ imgZoom: !this.state.imgZoom }) }}
        />

        <View style={{ position: "fixed", top: "-1000px", zIndex: -1, opacity: 0 }}>
          <Canvas style='width: 460px; height: 360px;' canvasId='canvas01' />
        </View>
        {
          this.state.is_login ? <AlertLogin is_login={this.state.is_login} onClose={() => { this.setState({ is_login: false }) }} /> : null
        }

        {/* 去首页 */}
        {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '70px', right: '20px' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../../assets/go_home.png')} className="go_home" />
            </View>
          ) : ''
        }

      </View>
    );
  }
}
