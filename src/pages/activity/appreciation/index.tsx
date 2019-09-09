import Taro, { Component } from "@tarojs/taro";
import { AtIcon } from 'taro-ui';
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import request from '../../../services/request'
import share from '../../../assets/share.png';
import AddressImg from '../../../assets/address.png';
import MobileImg from '../../../assets/dianhua.png';
import Zoom from '../../../components/zoom/index';
import './index.scss';

interface Props {
  id: any;
}

export default class Appre extends Component<Props>{
  state = {
    imgZoom: false,
    imgZoomSrc: '',
    xPoint: 0,
    yPoint: 0,
    imagesList: [],
    data: {
      activity_begin_time: "",
      activity_end_time: "",
      activity_time_status: 0,
      address: "",
      begin_time: "",
      description: [],
      distances: "",
      end_time: "",
      gift: { title: "", price: "", postage: "" },
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
      supplier_id: 0,
      tel: "",
      total_fee: 0,
      type: 0,
      validity: 0,
      xpoint: "",
      ypoint: "",
    }
  };

  componentDidMount = () => {
    console.log(this.$router.params);
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
            url: 'api/wap/user/appreciation/getYouhuiAppreciationInfo',
            method: "GET",
            data: {
              // youhui_id: 3713,
              youhui_id: this.$router.params.id,
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
              console.log("lala", imgList)
              this.setState({ data: res.data, imagesList: imgList }, () => {
                console.log("lalaal", this.state.imagesList)
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
            url: 'api/wap/user/appreciation/getYouhuiAppreciationInfo',
            method: "GET",
            data: {
              // youhui_id: 3713,
              youhui_id: this.$router.params.id,
              xpoint: this.state.xPoint,
              ypoint: this.state.yPoint
            }
          })
            .then((res: any) => {
              let { image, images } = res.data;
              let imgList = new Array(image).concat(images);
              this.setState({ data: res.data, imagesList: imgList }, () => {
                console.log(this.state.imagesList)
              });
              Taro.hideLoading()
            }).catch(err => {
              console.log(err);
            })
        })
      }
    })
  };
  //去图文详情
  toImgList = () => {

    Taro.navigateTo({
                url: '/detail-pages/gift/gift?gift_id='+ this.$router.params.gift_id+'&activity_id='+ this.$router.params.activity_id
              })
  }
  //去商店
  handleClick2 = (e) => {
    Taro.navigateTo({
      // url: '/detail-pages/business/index?id=' + _id
      url: '/pages/business/index?id=' + this.state.data.supplier_id
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
      name: this.state.data.location_name,
      address: this.state.data.address,
    });
    e.stopPropagation();
  }



  payment = () => {
    Taro.showLoading({
      title: 'loading',
    });
    request({
      url: 'v1/youhui/wxXcxuWechatPay',
      method: "POST",
      data: {
        youhui_id: this.$router.params.id,
        activity_id: this.$router.params.activity_id,
        gift_id: this.$router.params.gift_id,
        open_id: Taro.getStorageSync("openid"),
        unionid: Taro.getStorageSync("unionid"),
        type: "1",
        xcx: 1
      }
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
          Taro.switchTab({
            url: '/activity-pages/my-activity/my.activity',
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
  }

  render() {
    const { images, description } = this.state.data;
    return (
      <View className="d_appre" >
        <View className="appre_head_activityTitle">
          <View className="appre_head_activityTitle_title">{this.state.data.name}</View>
          <View className="appre_head_activityTitle_time">活动时间 : {this.state.data.begin_time}-{this.state.data.end_time}</View>
        </View>

        {
          this.state.data.type == 0 ?
            <Swiper
              className='test-h'
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular
              indicatorDots
              autoplay>
              {
                this.state.imagesList ? this.state.imagesList.map((item, index) => {
                  return (
                    <SwiperItem key={item}>
                      <View className='demo-text' onClick={() => { this.setState({ imgZoom: true, imgZoomSrc: item }) }}>
                        <Image className="demo-text-Img" src={item} />
                      </View>
                    </SwiperItem>
                  )
                }) : null
              }
            </Swiper> : null
        }

        <View className="appre_hd" >
          <View className="appre_head">
            <View className="appre_head_ticket">
              <View className="appre_head_circle1"></View>
              <View className="appre_head_circle2"></View>
              <View className="appre_head_left">
                <View className="appre_head_left_pricebox">
                  <View className="appre_head_left_pricebox_msg">最高可抵扣</View>
                  <View className="appre_head_left_pricebox_price">￥{this.state.data.return_money}</View>
                </View>
                <View className="appre_head_left_pricebox_info">满{this.state.data.total_fee}可用</View>
              </View>
              <View className="appre_head_right">
                {
                  this.state.data.type != 0 ? <View className="appre_head_right_type">全场通用</View> : null
                }
                <View className="appre_head_right_total">起始值为{this.state.data.init_money}元</View>
                <View className="appre_head_right_days">领取后{this.state.data.validity}日内有效</View>
              </View>
            </View>
            <View style={{ height: "24px" }}></View>
            {/* <View className="appre_head_bottom">
              <View className="appre_head_bottom_gift">送价值3000元耳机</View>
              <View className="appre_head_bottom_list">随时用</View>
              <View className="appre_head_bottom_share">
                <Image className="appre_head_bottom_shareimg" src={share} />
                分享</View>
            </View> */}
          </View>
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
                <View className="appre_gift_giftmsg" >运费{this.state.data.gift.postage}元</View>
              </View>
              <View className="appre_gift_giftlist" >
                <Image className="appre_gift_giftlistImg"
                  onClick={() => { this.setState({ imgZoom: true, imgZoomSrc: this.state.data.gift_pic }) }}
                  src={this.state.data.gift_pic} />
              </View>
            </View> : null
        }
        <View className="appre_process2" >
          <Image className="appre_process2_Image" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/XzPRtr5xGGiEiP8xHiS8tYEwCwyQWib8.png" />
        </View>

        {
          this.state.data.type == 0 ? <View className="appre_rule" >
            <View className="appre_rule_title" >温馨提示</View>
            {/* <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >适用商品:</View>
            <View className="appre_rule_time_data" >全场通用</View>
          </View> */}
            <View className="appre_rule_time" >
              <View className="appre_rule_time_key" >券有效期:</View>
              <View className="appre_rule_time_data" >领取后{this.state.data.validity}日内有效</View>
            </View>
            {description ?
              <View className="appre_rule_list" >
                <View className="appre_rule_list_key" >使用规则:</View>
                <View className="appre_rule_list_data" >
                  {
                    description ? description.map((item) => {
                      return (
                        <View className="appre_rule_list_msg" >. {item}</View>
                      )
                    }) : null
                  }
                </View>
              </View> : null
            }
          </View> : null
        }
        <View className="setMeal_store">
          <View className="setMeal_store_box" onClick={this.handleClick2.bind(this)}>
            <View className="setMeal_store_title">适用店铺</View>
            <View className="setMeal_store_storebox">
              <View className="setMeal_store_Image">
                <Image className="setMeal_store_img" src={this.state.data.preview} />
              </View>
              <View className="setMeal_store_msg">
                <View className="setMeal_store_name">{this.state.data.location_name}</View>
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
                <View className="setMeal_store_distance_info" >{this.state.data.distances}</View>
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
            <View className="paymoney_price_num">{this.state.data.pay_money}</View>
            <View className="paymoney_price_info">(含{this.state.data.gift.postage}元运费)</View>
          </View>
          <View className="paymoney_buynow" onClick={this.payment.bind(this)}>立即购买</View>
        </View>

        <Zoom
          src={this.state.imgZoomSrc}
          showBool={this.state.imgZoom}
          onChange={() => { this.setState({ imgZoom: !this.state.imgZoom }) }}
        />

      </View>
    );
  }
}