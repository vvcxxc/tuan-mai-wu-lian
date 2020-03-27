
import Taro, { Component, useEffect, DependencyList, navigateBack, useReducer } from "@tarojs/taro";
import { View, Text, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './style.scss'
import request from '../../services/request'
import CashCoupon1 from "@/pages/order/cash-coupon1/index";
import CashCoupon2 from "@/pages/order/cash-coupon2/index";
import CashCoupon3 from "@/pages/order/cash-coupon3/index";
import { getLocation } from '@/utils/getInfo';


export default class Orderdetail extends Component {
  config = {
    navigationBarTitleText: '订单详情'
  };

  state = {
    defaultData: {
      coupons_log_id: '',//优惠券记录ID
      coupons_id: '',//优惠券ID
      expiration: '',//过期时间
      coupons_name: '',//优惠券名称
      money: '',//优惠券金额
      store_name: '',//店铺名称
      image: '',//优惠券图片
      begin_time: 0,//起始时间
      end_time: 0,//使用结束时间
      coupons_type: 0,//优惠券类型 0兑换券 1现金券
      confirm_time: 0,//确认使用时间
      description: [],//使用规则
      pay_money: 0,//实际购买价格
      youhui_sn: '',//订单号 与码同一个
      create_time: 0,//付款时间
      refund_time: 0,//退款时间
      status: 0,//状态 状态 1未使用 2已使用 3已退款 只有显示已退款才可以请求查看退款进度 退款进度接口 /v3/user/coupons/refund/schedule
      location_address: '******',//店铺地址
      tel: '',//电话号码
      distance: '',//距离
      capita: '',//人均费用
      total_fee: '',
      supplier_id: '',
      source: 0,
      preview: '',
      source_name: '',
      init_money: '',
      expire_day: '',
      appreciation_money: '',
      order_delivery_log: {
        id: '',
        supplier_delivery_id: '',
        user_name: '',
        user_mobile: '',
        province: '',
        city: '',
        district: '',
        detail: '',
        delivery_status: 0,	//配送状态:0待接单 1配送中 2配送成功 3配送失败
        supplierDelivery: {
          id: '',
          delivery_phone: '',
          delivery_start_time: '',
          delivery_end_time: '',
        }
      }
    },
    _Imgurl: "",
    isApply: false,
    checkFlag: false,  // true --> 收回  false --> 查看更多
    // description: [],

  };

  componentWillMount() {
    getLocation().then((res: any) => {
      // xpoint: res.longitude, ypoint: res.latitude
      let xPoint = res.longitude;
      let yPoint = res.latitude;
      request({
        url: "v3/user/coupons/info",
        data: { coupons_log_id: this.$router.params.id, xpoint: xPoint, ypoint: yPoint }
      })
        .then((res: any) => {
          console.log(res);
          this.setState({ defaultData: res.data }, () => {
            if (this.state.defaultData.coupons_type * 1 == 0) { //兑换券获取兑换码
              request({
                url: 'api/wap/coupon/showCode',
                data: { coupons_log_id: this.$router.params.id },
              })
                .then((res: any) => {
                  this.setState({ _Imgurl: res.data })
                })
            }
          })
        })
        .catch(() => {
          Taro.showToast({ title: '数据请求失败', icon: 'none' })
        })
    })
  }

  toReturnMoney = () => {
    //loading防点击
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
    let timeout: any;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      //函数防抖
      request({
        url: "v3/user/coupons/refund",
        method: 'POST',
        data: { coupons_log_id: this.state.defaultData.coupons_log_id },
      }).then((res: any) => {
        Taro.hideLoading();
        if (res.message == '退款成功！') {
          this.setState({ isApply: !this.state.isApply }, () => {
            Taro.showToast({ title: '退款成功！' })
            Taro.navigateTo({
              url: './refundProgress?_logid=' + this.state.defaultData.coupons_log_id
            })
          })
        } else {
          this.setState({ isApply: !this.state.isApply }, () => {
            Taro.showToast({ title: '退款失败', icon: 'none' })
          })

        }
      }).catch(() => {
        this.setState({ isApply: !this.state.isApply }, () => {
          Taro.showToast({ title: '退款失败', icon: 'none' })
        })
      })
    }, 1000)
  }

  //打电话给配送员
  makePhoneCall = () => {
    Taro.makePhoneCall({
      phoneNumber: this.state.defaultData.order_delivery_log.supplierDelivery.delivery_phone
    })
      .then((res: any) => {
      })
  }

  render() {
    const descriptions = this.state.defaultData.description;
    return (
      <View className='index' >
        <View className='a_head'>
          <View className='a_head_content' onClick={(e) => { e.stopPropagation() }}></View>
          {
            this.state.defaultData.source == 4 ? <CashCoupon3 bg_img_type={this.state.defaultData.status == 1 ? 1 : (this.state.defaultData.status == 2 ? 2 : 0)} init_money={this.state.defaultData.init_money} money={this.state.defaultData.money} expire_day={this.state.defaultData.expire_day} appreciation_money={(this.state.defaultData.appreciation_money * 100 + this.state.defaultData.init_money * 100) / 100} total_fee={this.state.defaultData.total_fee} type={this.state.defaultData.coupons_type} /> :
              this.state.defaultData.coupons_type == 1 && this.state.defaultData.source != 4
                ?
                <CashCoupon2 bg_img_type={this.state.defaultData.status == 1 ? 1 : (this.state.defaultData.status == 2 ? 2 : 0)} type={0} _id={this.state.defaultData.coupons_id} _logid={this.state.defaultData.coupons_log_id} confirm_time={this.state.defaultData.confirm_time} return_money={this.state.defaultData.money} _total_fee={this.state.defaultData.total_fee} youhui_type={this.state.defaultData.coupons_type} timer={this.state.defaultData.begin_time + " - " + this.state.defaultData.end_time} sname={this.state.defaultData.store_name} list_brief={this.state.defaultData.coupons_name} expiration={this.state.defaultData.expiration} />
                :
                this.state.defaultData.coupons_type == 0 && this.state.defaultData.source != 4 ?
                  <CashCoupon1 bg_img_type={this.state.defaultData.status == 2 ? 1 : 0} type={0} _id={this.state.defaultData.coupons_id} _logid={this.state.defaultData.coupons_log_id} confirm_time={this.state.defaultData.confirm_time} return_money={this.state.defaultData.money} youhui_type={this.state.defaultData.coupons_type} timer={this.state.defaultData.begin_time + " - " + this.state.defaultData.end_time} sname={this.state.defaultData.store_name} list_brief={this.state.defaultData.coupons_name} _image={this.state.defaultData.image} clickcode={null} />
                  :
                  null
          }
        </View>
        { /* 购买须知  */}
        {
          this.state.defaultData.coupons_type * 1 == 1 ?
            <View className='z_buyShouldKnow' >
              <View className='a_buyBox' >
                <View className='a_one' >购买须知
                  {this.state.defaultData.status == 2 ? <Text className='a_outTime'  >已使用</Text> : null}
                  {this.state.defaultData.status == 3 ? <Text className='a_outTime'  >已退款</Text> : null}
                </View>
                <View className='a_two' >有效期</View>
                <View className='a_three' >{this.state.defaultData.begin_time} - {this.state.defaultData.end_time}</View>
                {this.state.defaultData.description.length ? <View>
                  <View className='a_four' >使用规则：</View>
                  {
                    this.state.defaultData.description ? this.state.defaultData.description.map((item: string, i: number) => <View key={item} className='a_item' > · {item} </View>) : null
                  }
                </View> : null}
                {/* <View className='a_last'  onClick={handerShowMore}  > { isMore ? '收起更多' : '查看更多' } </View>  */}
              </View>
            </View> : null
        }
        { /* 扫码输入验证  */}
        {
          this.state.defaultData.coupons_type * 1 == 0 ?
            <View  >
              <View className='a_buyBox'  >
                <View className='a_one' >扫码/输入验证
                <View className='a_state' >
                    {
                      this.state.defaultData.status == 2 ? "已使用" : (this.state.defaultData.status == 3 ? "已退款" : (this.state.defaultData.status == 4 ? "已过期" : ""))
                    }
                  </View>
                </View>
                <View className='a_sanCodeBox' style={{ opacity: this.state.defaultData.status == 1 ? 1 : 0.3 }}>
                  <View className='a_sancodeLast' >
                    <Text className='a_sanCodeBox_text' style={{ letterSpacing: '10rpx' }} >订单号:</Text>
                  </View>
                  <View className='z_sanCodeContent' >
                    <View className='code_box1'>
                      <Image className='code_image' src={this.state._Imgurl} />
                    </View>
                    <View className='code_box2' style={{ textDecoration: this.state.defaultData.status == 1 ? "none" : "line-through" }} >{this.state.defaultData.youhui_sn}</View>
                  </View>
                </View>
              </View>
            </View>
            : null
        }
        { /* 订单信息  */}
        <View className='z_billingInfo' >
          <View className='a_buyBox' >
            <View className='a_one' >订单信息 </View>
            <View className='a_billingInfo flex' >
              <Text className="a_billingInfo_1" >订单号</Text>:
      <View className="a_billingInfo_2" style={{ marginLeft: '9px' }}>{this.state.defaultData.youhui_sn}</View>
            </View>
            {/* <View className='a_billingInfo' >
              <Text className="a_billingInfo_1"  >手机号</Text>:
      <Text className="a_billingInfo_2" style={{ marginLeft: '9px' }}>{this.state.defaultData.tel}</Text>
            </View> */}
            <View className='a_billingInfo flex'  >
              <Text className="a_billingInfo_1" >总价</Text>:
      <View className="a_billingInfo_2" style={{ marginLeft: '9px', color: '#ED2424' }} >￥{this.state.defaultData.money}</View>
            </View>
            <View className='a_billingInfo flex'  >
              <Text className="a_billingInfo_1" >实付</Text>:
      <View className="a_billingInfo_2" style={{ marginLeft: '9px', color: '#ED2424' }} >￥{this.state.defaultData.pay_money}</View>
            </View>
            <View className='a_billingInfo flex' >
              <Text className="a_billingInfo_1" >付款时间</Text>:
      <View className="a_billingInfo_2" style={{ marginLeft: '9px' }}  >{this.state.defaultData.create_time}</View>
            </View>
            {
              this.state.defaultData.status * 1 === 2 ?
                <View className='a_billingInfo flex' >
                  <Text className="a_billingInfo_1">使用时间</Text>:
          <View className="a_billingInfo_2" style={{ marginLeft: '9px' }}  >{this.state.defaultData.confirm_time}</View>
                </View> : null
            }
            {
              this.state.defaultData.status * 1 === 3 ?
                <View className='a_billingInfo flex' >
                  <Text className="a_billingInfo_1">退款时间</Text>:
          <View className="a_billingInfo_2" style={{ marginLeft: '9px' }}  >{this.state.defaultData.refund_time}</View>
                  <Text className='a_returnState' onClick={() => {
                    // console.log(this.state.defaultData.coupons_id,this.state.defaultData.coupons_log_id)
                    Taro.navigateTo({
                      url: './refundProgress?_logid=' + this.state.defaultData.coupons_log_id
                    })
                  }}  >退款进度</Text>
                </View> : null
            }
            <View className='a_billingInfo flex'  >
              <Text className="a_billingInfo_1" >来源</Text>:
      <View className="a_billingInfo_2" style={{ marginLeft: '9px' }} >{this.state.defaultData.source_name}</View>
            </View>
          </View>
        </View>

        { /* 订单信息  */}
        <View className='z_billingInfo' >

          <View className='a_buyBox' >
            <View className='a_one' >温馨提示 </View>
            <View className='a_billingInfo' >
              <View className="flex">
                {/* <View>适合商品：</View>
                <View>
                  <View>夏季尾货服装类</View>
                  <View>夏季尾货服装类</View>
                  <View>夏季尾货服装类</View>
                </View> */}
              </View>

              <View className="flex">
                <View className='a_billingInfo_1'>使用门槛</View>:
                <View style={{ marginLeft: '9px' }}>
                  <View>满{this.state.defaultData.total_fee}元可用</View>
                </View>
              </View>

              <View className="flex">
                <View className='a_billingInfo_1'>券有效期</View>:
                <View style={{ marginLeft: '9px' }}>
                  <View>领券日起{this.state.defaultData.expire_day}天有效</View>
                </View>
              </View>

              {this.state.defaultData.description.length ? <View className="flex use_rules" style={{ overflow: "hidden", height: (this.state.checkFlag || this.state.defaultData.description.length <= 2) ? 'auto' : '4rem' }}>
                <View className='a_billingInfo_1'>使用规则</View>:
                <View style={{ marginLeft: '9px' }}>
                  {
                    descriptions.length ? (descriptions.map((item, index) => (
                      <View key={item} style={{ height: '32px' }}>{index + 1}. {item}</View>
                    ))) : null
                  }
                </View>
              </View> : null}
              {
                this.state.defaultData.description.length >= 3 ?
                  <View className="ft-more flex center" style={{ textAlign: "center", width: "100%", background: "#fff", color: "#999" }}
                    onClick={() => { this.setState({ checkFlag: !this.state.checkFlag }); }}>
                    <View className="more-box" style={{ color: "#999", fontSize: "12px" }}>
                      {this.state.checkFlag ? "收回" : "查看更多"}
                      {
                        this.state.checkFlag ?
                          <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />
                      }
                    </View>
                  </View>
                  : <View style={{ width: "100%", background: "#fff", height: "24rpx" }}></View>

              }
            </View>
          </View>
        </View>

        { /* 配送信息  */}
        {
          this.state.defaultData.order_delivery_log.id ? <View className='z_billingInfo' >
            <View className='a_buyBox' >
              <View className='a_one' >配送信息 </View>
              <View className='a_billingInfo' >
                <View className="flex">
                  <View className="a_billingInfo_1">订单状态</View>：
                  <View>{this.state.defaultData.order_delivery_log.delivery_status == 0 ? '待接单' : (
                    this.state.defaultData.order_delivery_log.delivery_status == 1 ? '配送中' : (
                      this.state.defaultData.order_delivery_log.delivery_status == 2 ? '配送成功' : (
                        this.state.defaultData.order_delivery_log.delivery_status == 3 ? '配送失败' : ''
                      )
                    )
                  )}</View>
                </View>
                <View className="flex">
                  <View className="a_billingInfo_1">收件人</View>：
                  <View>{this.state.defaultData.order_delivery_log.user_name}</View>
                </View>
                <View className="flex">
                  <View className="a_billingInfo_1">联系电话</View>：
                  <View>{this.state.defaultData.order_delivery_log.user_mobile}</View>
                </View>
                <View className="flex">
                  <View className="a_billingInfo_1">配送时间</View>：
                  <View>{this.state.defaultData.order_delivery_log.supplierDelivery.delivery_start_time + '-' + this.state.defaultData.order_delivery_log.supplierDelivery.delivery_end_time}</View>
                </View>
                <View className="flex">
                  <View className="a_billingInfo_1">收货地址</View>：
            <View className="a_billingInfo_3">{this.state.defaultData.order_delivery_log.province + this.state.defaultData.order_delivery_log.city + this.state.defaultData.order_delivery_log.district + this.state.defaultData.order_delivery_log.detail}</View>
                </View>
                <View className="call_poster_box" onClick={this.makePhoneCall.bind(this)}>
                  <View className="call_poster">联系配送员</View>
                </View>
              </View>
            </View>
          </View> : null
        }

        { /* 适用商铺  */}
        <View className='z_billingInfo' >

          <View className='a_buyBox' style={{ paddingBottom: '0' }}
            onClick={() => {
              Taro.navigateTo({
                url: '/pages/business/index?id=' + this.state.defaultData.supplier_id
              })
            }}
          >
            <View className='a_one' >适用商铺</View>
            <View className='a_imgBox'  >
              <Image className='_img' src={this.state.defaultData.preview} />
              <View className='a_imgDes'  >
                <View className="a_imgDes_info1">{this.state.defaultData.store_name}</View>
                <View className="a_imgDes_info2">人均：{this.state.defaultData.capita}</View>
                <Text className='a_text'>
                  <AtIcon value='chevron-right' size='20' color='#ccc'></AtIcon>
                </Text>
              </View>
            </View>
            <View className='a_dres' >
              <View className='_address_distance'>{this.state.defaultData.distance}</View>
              <View className='_address_icon'>|</View>
              <View className='_address' >{this.state.defaultData.location_address}</View>
              <View className='_address_icon'>|</View>
            </View>
          </View>
        </View>
        { /* 申请退款 */}
        {
          this.state.defaultData.status * 1 === 1 && (this.state.defaultData.source == 3 || this.state.defaultData.source == 4 || this.state.defaultData.source == 5) ?
            <View className='z_applyReturn' >
              <View className='z_applyReturn_info' onClick={() => { this.setState({ isApply: !this.state.isApply }) }} >申请退款</View>
            </View>
            : null
        }
        {/* 确认退款 */}
        {
          this.state.isApply ? <View className='a_mast' >
            <View className='a_mastContent' >
              <View className='a_return' >确定要申请退款吗</View>
              <View className='a_returnB' >
                <View className='a_returnB_info1' onClick={() => { this.setState({ isApply: !this.state.isApply }) }} >取消</View>
                <View className='a_returnB_info2' onClick={this.toReturnMoney.bind(this)} >确定</View>
              </View>
            </View>
          </View> : null
        }

      </View>


    );
  }
}















