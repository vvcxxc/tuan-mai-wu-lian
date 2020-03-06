import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.styl";
import "../set-meal/index";
import { AtIcon, AtToast } from "taro-ui";
import CashCoupon from './cash-coupon/index'
import MobileImg from '../../assets/dianhua.png'
import AddressImg from '../../assets/address.png'
import request from '../../services/request'
import LoginAlert from '@/components/loginAlert';
export default class PaySuccess extends Component {
  config = {
    navigationBarTitleText: "优惠信息"
  };

  state = {
    yPoint: '',
    xPoint: '',
    keepCollect_data: "",
    //表面收藏
    keepCollect_bull: false,
    is_alert: false, //登录弹窗
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
      youhui_type: '',
      expire_day: '',
      total_fee: ''
    }],

    isFromShare: false
  };

  componentWillMount() {
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) {
      this.setState({
        isFromShare: true
      })
    }
    Taro.showLoading({
      title: 'loading',
      mask:true
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
  }

  componentDidMount() {
    Taro.showShareMenu({
      withShareTicket: true
    })
  }
  onShareAppMessage = (res) => {
    return {
      title: '老板送钱！' + this.state.coupon.return_money + '元现金券限时发放中，快来一起领取！',
      path: '/business-pages/ticket-buy/index?id=' + this.state.coupon.id,
      imageUrl: this.state.store.shop_door_header_img
    }
  }

  handleClick = (id, e) => {
    let phone_status = Taro.getStorageSync('phone_status')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      Taro.navigateTo({
        url: '../../business-pages/confirm-order/index?id=' + id
      })
    }else{
      this.setState({ is_alert: true })
    }

  }
  handleClick2 = (_id, e) => {
    Taro.navigateTo({
      //url: '/detail-pages/business/index?id=' + _id
      url: '/pages/business/index?id=' + _id
    })
  };
  //打电话
  makePhoneCall = (e) => {
    console.log(this.state.store.tel)
    Taro.makePhoneCall({
      phoneNumber: this.state.store.tel
    })
      .then((res: any) => {
        console.log(res)
      })
    e.stopPropagation();
  }
  //地图
  routePlanning = (e) => {
    Taro.openLocation({
      latitude: Number(this.state.store.ypoint),
      longitude: Number(this.state.store.xpoint),
      scale: 18,
      name: this.state.store.sname,
      address: this.state.store.saddress,
    })
    e.stopPropagation();
  }
  //收藏
  keepCollect(e) {
    //假接口，还没好
    // let _id = this.state.coupon.id;
    // request({ url: 'v3/coupons/collection', method: "PUT", data: { coupon_id: _id } })
    //   .then((res: any) => {
    //     console.log(res)
    //     // if (res) {
    //     //   this.setState({
    //     //     keepCollect_data: res,
    //     //     keepCollect_bull: !this.state.keepCollect_bull
    //     //   })
    //     // }
    //   })
  }
  /**
   * 回首页
   */
  handleGoHome = () => {
    Taro.switchTab({
      url: '/pages/index/index'
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
  render() {
    return (
      <View className="set-meal">
        {
          this.state.keepCollect_bull ?
            <AtToast isOpened text={this.state.keepCollect_data} duration={2000} ></AtToast> : ""
        }
        <View className=" pd30 bcff">
          <View className="ticket-buy-view">
            {/* <Image className="image" src={this.state.coupon.icon} /> */}
            {/* {
              this.state.keepCollect_bull ?
                <AtIcon className="image" value="star-2" color="#FFBF00" size="24px" />
                :
                <AtIcon className="image" value="star" color="#999" size="24px" onClick={this.keepCollect.bind(this)} />
            } */}
            <View className="_expire">购买后{this.state.coupon.expire_day}日内有效</View>
            <View className="hd tit">{this.state.store.sname}</View>
            <View className="bd money">¥{this.state.coupon.return_money}</View>
            <View className="ft" style={{ position: "relative" }}>
              <View className="desc">{this.state.coupon.yname}</View>

              <View className="tags" style={{ position: "absolute", right: "0" }}>
                {/* <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('可叠加') == -1 ? '' : '#fff' }}>可叠加</Text>
                <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('随时退') == -1 ? '' : '#fff' }}>随时退</Text>
                <Text className="tag-text" style={{ marginRight: "0", backgroundColor: this.state.coupon.label.indexOf('免预约') == -1 ? '' : '#fff' }}>免预约</Text> */}
                {
                  this.state.coupon.label.indexOf('可叠加') !== -1 ?
                    <Text className="tag-text">可叠加</Text> : null
                }
                {
                  this.state.coupon.label.indexOf('随时退') !== -1 ?
                    <Text className="tag-text">随时退</Text> : null
                }
                {
                  this.state.coupon.label.indexOf('免预约') !== -1 ?
                    <Text className="tag-text"  >免预约</Text> : null
                }
              </View>
            </View>
          </View>
        </View>

        <View className="set_Meal_store">
          <View className="setMeal_store_box" onClick={this.handleClick2.bind(this, this.state.store.id)}>
            <View className="setMeal_store_title">适用店铺</View>
            <View className="setMeal_store_storebox">
              <View className="setMeal_store_Image">
                <Image className="setMeal_store_img" src={this.state.store.shop_door_header_img} />
              </View>
              <View className="setMeal_store_msg">
                <View className="setMeal_store_name">{this.state.store.sname}</View>
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
                <View className="setMeal_store_distance_info" >{this.state.store.distance}</View>
              </View>
              <View className="setMeal_store_address" onClick={this.routePlanning.bind(this)}>{this.state.store.saddress}</View>
              <View className="setMeal_store_mobile" onClick={this.makePhoneCall.bind(this)}>
                <Image className="setMeal_store_MobileImg" src={MobileImg} />
              </View>
            </View>
          </View>
        </View>
        {/* <View className="shop mt20 pd30 bcff" onClick={this.handleClick2.bind(this, this.state.store.id)}>
          <View className="set-meal__tit">
            <Text className="fwb" >适用店铺</Text>
          </View>
          <View className="flex center">
            <Image className="image" src={this.state.store.shop_door_header_img} />
            <View className="item">
              <View className="tit" style={{ fontWeight: "bold", fontSize: "16px" }}>{this.state.store.sname}</View>
            </View>
            <AtIcon value="chevron-right" color="#999" size="24px" />
          </View>
          <View className="address-view flex center">
            <Image className="address-image" src={AddressImg} onClick={this.routePlanning.bind(this)} />
            <View className="distance" onClick={this.routePlanning.bind(this)}>{this.state.store.distance}</View>
            <View className="text flex-item" onClick={this.routePlanning.bind(this)}>{this.state.store.saddress}</View>
            <Image className="mobile-image" src={MobileImg} onClick={this.makePhoneCall.bind(this)} />
          </View>
        </View> */}
        {/* <View className="remark mt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">购买须知</Text>
          </View>
          <View>
            <View className="label">有效期：</View>
            <View className="label-value">{this.state.coupon.begin_time + "   -   " + this.state.coupon.end_time}</View>
            <View className="label">使用规则：</View>
            <View className="label-value">{this.state.coupon.description}
            </View>
          </View>
        </View> */}
        {/* <View className="graphic-details bt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">图文详情</Text>
          </View>
          <View>
            {
              this.state.goods_album.map((item) => (
                <View key={item.id}>
                <Image className="image" src={item.image_url} />))
                </View>
            }
          </View>
        </View> */}
        <View className="examine-more mt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">更多本店宝贝</Text>
          </View>
          {
            this.state.recommend.map((item) => (
              <View key={item.id}>
                <CashCoupon _id={item.id} return_money={item.return_money} pay_money={item.pay_money} youhui_type={item.youhui_type} timer={item.begin_time + "-" + item.end_time} list_brief={item.list_brief} yname={item.yname} sname={item.sname} expire_day={item.expire_day} total_fee={item.total_fee} />
              </View>
            ))
          }

        </View>
        <View className="occupied">
          <View className="layer-ft-buy flex">
            <View className="money">￥<Text className="count">{this.state.coupon.pay_money}</Text></View>
            <View><Button className="btn-buy" onClick={this.handleClick.bind(this, this.state.coupon.id)} >立即抢购</Button></View>
          </View>
        </View>

        {
          this.state.is_alert ? <LoginAlert onChange={this.loginChange} /> : null
        }

        {/* 去首页 */}
        {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '50px', right: '20px' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../assets/go_home.png')} className="go_home" />
            </View>
          ) : ''
        }
      </View>
    );
  }
}
