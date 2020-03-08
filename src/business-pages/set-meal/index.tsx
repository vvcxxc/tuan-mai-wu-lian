import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.styl";
import CashCoupon from './cash-coupon/index'
import request from '../../services/request'
import MobileImg from '../../assets/dianhua.png'
import AddressImg from '../../assets/address.png'
import starImg from '../../assets/starcollect.png'
import LoginAlert from '@/components/loginAlert';export default class PaySuccess extends Component {
  config = {
    navigationBarTitleText: "特惠商品"
  };

  state = {
    yPoint: '',
    xPoint: '',
    keepCollect_data: "",
    //表面收藏
    keepCollect_bull: false,
    coupon: {
      begin_time: "",
      brief: "",
      //真正的收藏
      collect: "",
      description: [],
      end_time: "",
      icon: "",
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
      image: "",
      list_brief: "",
      open_time: "",
      pay_money: "",
      return_money: "",
      sname: "",
      yname: "",
      youhui_type: '',
      expire_day: '',
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
      mask: true
    })
    // console.log(this.$router.params)
    Taro.getLocation({ type: 'gcj02' }).then(res => {
      this.setState({
        yPoint: res.latitude,
        xPoint: res.longitude
      }, () => {
        request({
          url: 'v3/discount_coupons/' + this.$router.params.id, method: "GET", data: { xpoint: this.state.xPoint, ypoint: this.state.yPoint }
        })
          .then((res: any) => {
            console.log(res);
            if (res.code !== 200) {
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
        url: 'v3/discount_coupons/' + this.$router.params.id, method: "GET", data: { xpoint: '', ypoint: '' }
      })
        .then((res: any) => {
          console.log(res);
          if (res.code !== 200) {
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
          Taro.hideLoading();
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
      title: this.state.store.sname + '送福利啦！' + this.state.coupon.return_money + '元兑换券下单立刻抵扣，快点抢！',
      path: '/business-pages/set-meal/index?id=' + this.state.coupon.id,
      imageUrl: this.state.coupon.image
    }
  }

handleClick = (id, e) => {
  console.log(3123123)
  let phone_status = Taro.getStorageSync('phone_status')
  if (phone_status == 'binded' || phone_status == 'bind_success') {
    Taro.navigateTo({
      url: '../../business-pages/confirm-order/index?id=' + id
    })
  }else {
    this.setState({is_alert: true})
  }

};
handleClick2 = (_id, e) => {
  Taro.navigateTo({
    // url: '/detail-pages/business/index?id=' + _id
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
  //     //     keepCollect_data: res.data,
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
        this.state.keepCollect_bull ? <AtToast isOpened text={this.state.keepCollect_data} duration={2000} ></AtToast> : ""
      }
      {/* <Swiper
          className="swiper"
          indicatorColor="#999"
          indicatorActiveColor="#333"
          circular
          indicatorDots
          autoplay
        >
          <SwiperItem>
            <View className="demo-text-1"><Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" /></View>
          </SwiperItem>
          <SwiperItem>
            <View className="demo-text-2"><Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" /></View>
          </SwiperItem>
          <SwiperItem>
            <View className="demo-text-3"><Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" /></View>
          </SwiperItem>
        </Swiper> */}
        <View className="demo-text-3"><Image style={{ width: "100%" }} src={this.state.coupon.image} /></View>

        <View className="info bcff">
          {/* <Image className="image" src={starImg} onClick={this.keepCollect.bind(this)} /> */}

          {/* {
            this.state.coupon.collect == "1" ? <AtIcon className="image" value="star-2" color="#FFBF00" size="24px" />
              :
              (
                this.state.keepCollect_bull ?
                  <AtIcon className="image" value="star-2" color="#FFBF00" size="24px" />
                  :
                  <AtIcon className="image" value="star" color="#999" size="24px" onClick={this.keepCollect.bind(this)} />
              )
          } */}
          <View className="tit">{this.state.coupon.yname} </View>

          <View className="desc" style={{ height: "auto" }}></View>

          <View className="tags">
            {/* <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('可叠加') !== -1 ? '' : '#fff' }}>可叠加</Text>
            <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('随时退') !== -1 ? '' : '#fff' }}>随时退</Text>
            <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('免预约') !== -1 ? '' : '#fff' }}>免预约</Text> */}

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



        {/* <View className="shop mt20 pd30 bcff" onClick={this.handleClick2.bind(this, this.state.store.id)}>
          <View className="set-meal__tit">
            <Text className="fwb">适用店铺</Text>
          </View>
          <View className="flex center">
            <Image className="image" src={this.state.store.shop_door_header_img} />
            <View className="item">
              <View className="tit" style={{ fontWeight: "bold", fontSize: "16px" }}>{this.state.store.sname}</View>
              <View className="money" ></View>
            </View>
            <AtIcon value="chevron-right" color="#999" size="24px" />
          </View>
          <View className="address-view flex center">

            <Image className="address-image" src={AddressImg} onClick={this.routePlanning.bind(this)} />
            <View className="distance" onClick={this.routePlanning.bind(this)}>{this.state.store.distance}</View>
            <View className="text flex-item" style={{ width: "80%" }} onClick={this.routePlanning.bind(this)}>{this.state.store.saddress}</View>
            <Image className="mobile-image" src={MobileImg} onClick={this.makePhoneCall.bind(this)} />
          </View>
        </View> */}
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

        <View className="remark mt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">购买须知</Text>
          </View>
          <View>
            <View className="label">有效期：</View>
            <View className="label-value">购买后{this.state.coupon.expire_day}天有效</View>
            <View className="label">使用规则：</View>

            <View className="label-value">
              <ul>
                {
                  this.state.coupon.description.map((item) => (
                    <li className="label-value"><View >. {item}</View ></li>
                  ))
                }
              </ul>
            </View>
          </View>
          {/* <View className="ft-more flex center">查看更多<AtIcon value="chevron-right" color="#999" size="16px" /></View> */}
        </View>

        {
          this.state.goods_album.length != 0 ?
            <View className="examine-more mt20 pd30 bcff">
              <View className="set-meal__tit">
                <Text className="fwb">图文详情</Text>
              </View>
              {
                this.state.goods_album.map((item) => (
                  <Image src={item.image_url} style={{ width: "100%", borderRadius: "8rpx" }} key={item.id} />
                ))
              }

            </View> : ""
        }
        <View className="examine-more mt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">更多本店宝贝</Text>
          </View>
          {
            this.state.recommend.map((item) => (
              <View key={item.id} >
                <CashCoupon _id={item.id} return_money={item.return_money} pay_money={item.pay_money} youhui_type={item.youhui_type} timer={item.begin_time + "-" + item.end_time} list_brief={item.list_brief} yname={item.yname} sname={item.sname} _image={item.image} expire_day={item.expire_day} />
              </View>
            ))
          }

          {/* <CashCoupon _id={"1"} return_money={"11"} pay_money={"22"} youhui_type={"1"} timer={"1111"} list_brief={"5555555"} sname={"222"} /> */}
          {
          this.state.is_alert ? <LoginAlert onChange={this.loginChange} /> : null
        }

        </View>
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
