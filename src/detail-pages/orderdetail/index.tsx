import Taro, { useState, useEffect, DependencyList, navigateBack } from "@tarojs/taro";
import { View, Text } from '@tarojs/components';

import './style.scss'
import { defaultYouhuiImg, defaultData, handerExceedTimeLimit, routeGo } from './unit'
import request from '../../services/request'
import { BuyShouldKnow } from './components/BuyShouldKnow'
import { BillingInfo } from './components/BillingInfo'
import { SuitStore } from './components/SuitStore'
import SanCode from './components/sanCode'
import CashCoupon1 from "@/pages/order/cash-coupon1/index";
import CashCoupon2 from "@/pages/order/cash-coupon2/index";
function useAsyncEffect(cb: Function, dep: DependencyList) {
  useEffect(() => {
    cb()
  }, dep)
}



function setTimeoutCallback() {
  let timer: any
  return function (fn: Function, time: number) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, time)
  }
}





function Index() {

  // console.log(this.$router)
  const cuoPonsId = this.$router.params.id
  const [dataInfo, setDataInfo] = useState(Object.assign({}, defaultData))
  const [youhuiurl, setYouhuiurl] = useState(Object.assign({}, defaultYouhuiImg))
  const [isApply, showApply] = useState(false)
  let setTimeOut = setTimeoutCallback()
  const {
    description, //["仅限本店使用"]
    begin_time,//"2019-01-07 00:00:00"
    end_time, //"2019-01-15 00:00:00"
    youhui_sn,// youhui_sn
    expiration, //过期时间
    tel, //"13026875303"
    money, //100
    create_time, // 付款时间
    refund_time, //退款时间
    confirm_time, //确认使用时间
    status, // 1未使用 2已使用 3已退款
    distance,//距离
    capita,//人均费用多少
    coupons_type,//券类型 0 兑换券 1 现金券
    location_address,//店铺地址
    store_name,//店铺名称
    image,//券图片
    coupons_name,//优惠券名称
    total_fee,
    supplier_id,
    source,
    pay_money,
    preview,
    coupons_log_id
  } = dataInfo
  const { _Imgurl } = youhuiurl;
  useAsyncEffect(async () => {
    console.log(_Imgurl);
    if (coupons_type * 1 === 0) { //兑换券获取兑换码
      request({
        url: 'api/wap/coupon/showCode',
        data: { coupons_log_id: cuoPonsId },
      })
        .then((res: any) => {
          // console.log(res);
          let youhuiurl_temp = { _Imgurl: res.data };
          // console.log(youhuiurl_temp);
          setYouhuiurl(Object.assign({}, youhuiurl, youhuiurl_temp))
        })
    }

    Taro.getLocation({ type: 'wgs84' }).then((res: any) => {
      let xPoint = res.longitude;
      let yPoint = res.latitude;
      request({
        url: "v3/user/coupons/info",
        data: { coupons_log_id: cuoPonsId, xpoint: xPoint, ypoint: yPoint }
      })
        .then((res: any) => {
          console.log(res)
          setDataInfo(Object.assign({}, dataInfo, res.data));
        })
        .catch(() => {
          Taro.showToast({ title: '数据请求失败', icon: 'none' })
          setTimeout(() => {
            Taro.navigateBack({
            })
          }, 2000)
        })
    })




  }, [cuoPonsId])





  const handerApplyShow = () => {
    showApply(!isApply)
  }

  const toReturnMoney = () => {
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
    let timeout: any;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      request({
        url: "v3/user/coupons/refund",
        method: 'POST',
        data: { coupons_log_id: cuoPonsId },
      }).then((res: any) => {
        Taro.hideLoading();
        if (res.code === 200) {
          handerApplyShow()
          Taro.showToast({ title: '退款成功' })
          routeGo('/detail-pages/orderdetail/refundProgress', cuoPonsId)
        } else {
          handerApplyShow()
          Taro.showToast({ title: '退款失败', icon: 'none' })
        }
      }).catch(() => {
        Taro.showToast({ title: '请求错误', icon: 'none' })
        handerApplyShow()
      })
    }, 1000)
  }
  return (
    <View className='index'>
      <View className='a_head' style={{ position: "relative" }}>
        <View className='a_head_content' style={{ width: "100%", height: "100%", position: "absolute", zIndex: 6 }}></View>
        {
          coupons_type == 1 ?
            <CashCoupon2 bg_img_type={status == "1" ? 1 : (status == "2" ? 2 : 0)} type={0} _id={cuoPonsId} _logid={coupons_log_id} confirm_time={confirm_time} return_money={money} _total_fee={total_fee} youhui_type={coupons_type} timer={begin_time + " - " + end_time} sname={store_name} list_brief={coupons_name} expiration={expiration} /> :
            <CashCoupon1 bg_img_type={status == "2" ? 1 : 0} type={0} _id={cuoPonsId} _logid={coupons_log_id} confirm_time={confirm_time} return_money={money} youhui_type={coupons_type} timer={begin_time + " - " + end_time} sname={store_name} list_brief={coupons_name} _image={image} clickcode={null} />
        }
      </View>
      { /* 购买须知  */}
      {
        coupons_type * 1 === 1 ?
          <View className='z_buyShouldKnow' >
            <BuyShouldKnow buyshowknowProps={{ status, description, begin_time, end_time, expiration }} />
          </View> : null
      }
      { /* 扫码输入验证  */}
      {
        coupons_type * 1 === 0 ?
          <View  >
            <View className='a_buyBox'  >

              <View className='a_one' >扫码/输入验证
                <View className='a_state' >
                  {
                    status == "2" ? "已使用" : (status == "3" ? "已退款" : (status == "4" ? "已过期" : ""))
                    // 1未使用 2已使用 3已退款}</View></View>
                  }
                </View>
              </View>

              <View className='a_sanCodeBox' style={{ opacity: status == "1" ? 1 : 0.3 }}>
                <View className='a_sancodeLast' >
                  <Text style={{ letterSpacing: '10rpx' }} >订单号:</Text>
                </View>
                <SanCode code={youhui_sn} url={_Imgurl} status={status} />
                {/* <View>{_Imgurl}</View> */}
              </View>
            </View>
          </View>
          : null
      }
      { /* 订单信息  */}
      <View className='z_billingInfo' >
        <BillingInfo billingInfoProps={{ youhui_sn, cuoPonsId, tel, money, create_time, refund_time, confirm_time, status, pay_money }} />
      </View>
      { /* 适用商铺  */}
      <View className='z_billingInfo' >
        <SuitStore suitStoreProps={{ distance, location_address, store_name, capita, image, supplier_id, preview }} />
      </View>
      { /* 申请退款 */}
      {
        status * 1 === 1 && (source == 3 || source == 4 || source == 5) ?
          <View className='z_applyReturn' >
            <View onClick={handerApplyShow}  >申请退款</View>
          </View>
          : null
      }
      {/* 确认退款 */}
      {
        isApply ?
          <View className='a_mast' >
            <View className='a_mastContent' >
              <View className='a_return' >确定要申请退款吗</View>
              <View className='a_returnB' >
                <View onClick={handerApplyShow} >取消</View>
                <View onClick={toReturnMoney} >确定</View>
              </View>
            </View>
          </View> : null
      }

    </View>
  )
}

Index.config = {
  navigationBarTitleText: '订单详情',
}

export default Index
