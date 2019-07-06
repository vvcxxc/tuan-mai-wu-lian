import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtTabs, AtTabsPane } from 'taro-ui'
import "taro-ui/dist/style/components/tabs.scss";
import CashCoupon1 from "./cash-coupon1/index";
import CashCoupon2 from "./cash-coupon2/index";

import "./index.styl";
import request from "../../services/request";
import img1 from "./1.png";
import img2 from "./2.png";
import img3 from "./3.png";
import img4 from "./4.png";
interface State {
  coupon1:couponArray,
  current:number,
  coupon2:couponArray,
  coupon3:couponArray,
  page1: number,
  page2: number,
  page3: number,
  page4: number,
  loading:boolean
}
interface couponType {
    coupons_log_id?:string | number,
    coupons_id?: string | number,
    expiration?:string | number,
    coupons_name?: string | number,
    money?: string | number,
    suppliername?:string | number,
    image?: string | number,
    coupons_type?:string | number,
    confirm_time?:string | number,
    total_fee?:string | number,
}

interface couponArray {
  couponType?:couponType[]
}
export default class Order extends Component<State> {
  config: Config = {
    navigationBarTitleText: "我的订单"
  };
  state = {
    current: 0,//taro组件用的
    coupon: [],//taro组件用的
    coupon1 : [
     { coupons_log_id: "",
        coupons_id: "",
        expiration: "",
        coupons_name: "",
        money: "",
        suppliername: "",
        image: "",
        coupons_type: "",
        confirm_time: "",
        total_fee: "",}], // <this.couponType>
    coupon2:[], // <this.couponType>
    coupon3:[], // <this.couponType>
    // coupon1: [
    //   {
    //     coupons_log_id: "",
    //     coupons_id: "",
    //     expiration: "",
    //     coupons_name: "",
    //     money: "",
    //     suppliername: "",
    //     image: "",
    //     coupons_type: "",
    //     confirm_time: "",
    //     total_fee: "",
    //   }
    //  ],//4个tab的数据分开算
    // coupon2: [{
    //   coupons_log_id: 880,
    //   coupons_id: 936,
    //   expiration: "2019-08-08 18:33:06",
    //   coupons_name: "多美优惠券",
    //   money: 100.0000,
    //   suppliername: "多美蛋糕店",
    //   image: "http://oss.tdianyi.com/front/Bpn8iRjEmWid5yQJ8iWpNDrFNMJ8Ja6D.jpg",
    //   coupons_type: 0,
    //   confirm_time: "2018-12-10 15:07:43",
    //   total_fee: 0
    // }],
    // coupon3: [{
    //   coupons_log_id: "",
    //   coupons_id: "",
    //   expiration: "",
    //   coupons_name: "",
    //   money: "",
    //   suppliername: "",
    //   image: "",
    //   coupons_type: "",
    //   confirm_time: "",
    //   total_fee: ""
    // }],
    // coupon4: [{
    //   coupons_log_id: "",
    //   coupons_id: "",
    //   expiration: "",
    //   coupons_name: "",
    //   money: "",
    //   suppliername: "",
    //   image: "",
    //   coupons_type: "",
    //   confirm_time: "",
    //   total_fee: ""
    // }],
    page1: 1,
    page2: 0,
    page3: 0,
    page4: 0,
    // pages: [
    //   { page: 1 },
    //   { page: 0 },
    //   { page: 0 },
    //   { page: 0 }
    // ],
    // coupons: [
    //   [{
    //     coupons_log_id: "",
    //     coupons_id: "",
    //     expiration: "",
    //     coupons_name: "",
    //     money: "",
    //     suppliername: "",
    //     image: "",
    //     coupons_type: "",
    //     confirm_time: "",
    //     total_fee: ""
    //   }
    //   ],//4个tab的数据分开算
    //   [{
    //     coupons_log_id: "",
    //     coupons_id: "",
    //     expiration: "",
    //     coupons_name: "",
    //     money: "",
    //     suppliername: "",
    //     image: "",
    //     coupons_type: "",
    //     confirm_time: "",
    //     total_fee: ""
    //   }],
    //   [{
    //     coupons_log_id: "",
    //     coupons_id: "",
    //     expiration: "",
    //     coupons_name: "",
    //     money: "",
    //     suppliername: "",
    //     image: "",
    //     coupons_type: "",
    //     confirm_time: "",
    //     total_fee: ""
    //   }],
    //   [{
    //     coupons_log_id: "",
    //     coupons_id: "",
    //     expiration: "",
    //     coupons_name: "",
    //     money: "",
    //     suppliername: "",
    //     image: "",
    //     coupons_type: "",
    //     confirm_time: "",
    //     total_fee: ""
    //   }],
    // ],

    loading: false
  };

  componentWillMount() {
    console.log("order--componentWillMount")
    this.getData1();
  }

  // getData(_coupons_status, e) {
  //   let temp0 = this.state.pages;
  //   temp0[_coupons_status].page + 1;
  //   this.setState({ loading: true, pages: temp0 });
  //   request({
  //     url: "v3/user/coupons",
  //     data: {
  //       coupons_status: _coupons_status,
  //       page: temp0[_coupons_status].page
  //     }
  //   })
  //     .then((res: any) => {
  //       let temp = this.state.coupons[_coupons_status].concat(res);
  //       let temp2 = this.state.coupons;
  //       temp2[_coupons_status] = temp;
  //       this.setState({ coupon: temp, coupons: temp2, loading: false })
  //     })
  //     .catch(() => this.setState({ loading: false }));
  // }




  getData1() {
    this.setState({ loading: true, page1: this.state.page1 + 1 });
    request({
      url: "v3/user/coupons",
      data: {
        coupons_status: 1,
        page: this.state.page1
      }
    })
      .then((res: any) => {
        console.log(res)
        console.log(this.state.coupon.length)
        let temp = this.state.coupon1.concat(res);
        console.log(temp.length)

         this.setState({ coupon: temp, coupon1: temp, loading: false })
      })
      .catch(() => this.setState({ loading: false }));
  }

  getData2() {
    this.setState({ loading: true, page2: this.state.page2 + 1 });
    request({
      url: "v3/user/coupons",
      data: {
        coupons_status: 2,
        page: this.state.page2
      }
    })
      .then((res: any) => {
        let temp = this.state.coupon2.concat(res);
        this.setState({ coupon: temp, coupon2: temp, loading: false })
      })
      .catch(() => this.setState({ loading: false }));
  }
  getData3() {
    this.setState({ loading: true, page3: this.state.page3 + 1 });
    request({
      url: "v3/user/coupons",
      data: {
        coupons_status: 3,
        page: this.state.page3
      }
    })
      .then((res: any) => {
        let temp = this.state.coupon3.concat(res);
        this.setState({ coupon: temp, coupon3: temp, loading: false })
      })
      .catch(() => this.setState({ loading: false }));
  }
  getData4() {
    this.setState({ loading: true, page4: this.state.page4 + 1 });
    request({
      url: "v3/user/coupons",
      data: {
        coupons_status: 4,
        page: this.state.page4
      }
    })
      .then((res: any) => {
        let temp = this.state.coupon4.concat(res);
        this.setState({ coupon: temp, coupon4: temp, loading: false })
      })
      .catch(() => this.setState({ loading: false }));
  }
  handleClick0(value) {
    this.setState({
      current: value
    })
    console.log(this.state.coupon.length)
  }

  render() {
    const tabList = [{ title: '未使用' }, { title: '已使用' }, { title: '已过期' }, { title: '已退款' }]
    return (
      <View className="order flex column">
        {
          this.state.coupon.length == 0 ?
            <View>
              {/* {
                this.state.current == 0 ?
                  <View className="msgBox">
                    <View className="imgBox">
                      <Image className="logo" src={img1} />
                    </View>
                    <View className="_msg">没有可使用的订单，快去逛逛吧！</View>
                    <View className="toHome"
                      onClick={() => {
                        Taro.switchTab({
                          url: '../../pages/index/index'
                        })
                      }}>去首页</View>
                  </View> : (this.state.current == 1 ? <View className="msgBox">
                    <View className="imgBox">
                      <Image className="logo" src={img2} />
                    </View>
                    <View className="_msg">您还没有使用过的订单哦</View>
                  </View> : (this.state.current == 2 ?
                    <View className="msgBox">
                      <View className="imgBox">
                        <Image className="logo" src={img3} />
                      </View>
                      <View className="_msg">您还没有已过期的订单哦</View>
                    </View> :
                    <View className="msgBox">
                      <View className="imgBox">
                        <Image className="logo" src={img4} />
                      </View>
                      <View className="_msg">您还没有已退款的订单哦</View>
                    </View>))
              } */}11111111111111111111111111
            </View> : ""
        }
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick0.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            <View className="tiket_box">
              {this.state.coupon1.map((item) => (
                item.coupons_type.toString() == "1" ?
                  <CashCoupon2 bg_img_type={1} _id={item.coupons_log_id} return_money={item.money} _total_fee={item.total_fee} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} /> : ""
              ))}
              {this.state.coupon1.map((item) => (
                item.coupons_type.toString() == "0" ?
                  <CashCoupon1 bg_img_type={0} type={1} _id={item.coupons_log_id} return_money={item.money} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} _image={item.image} /> : ""
              ))}
              {/* <CashCoupon2 bg_img_type={1} _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon1 bg_img_type={0} _id="1" type={1} return_money="100" pay_money="20" youhui_type="1" timer="100" sname="ddddd" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" /> */}
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View className="tiket_box">
              {/* <CashCoupon2 bg_img_type={2} _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon1 bg_img_type={1} type={0} _id="1" return_money="100" pay_money="300" youhui_type="1" timer="100" sname="广告费个" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" /> */}
              {this.state.coupon2.map((item) => (
                item.coupons_type.toString() == "1" ?
                  <CashCoupon2 bg_img_type={2} _id={item.coupons_log_id} return_money={item.money} _total_fee={item.total_fee} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} /> : ""
              ))}
              {this.state.coupon2.map((item) => (
                item.coupons_type.toString() == "0" ?
                  <CashCoupon1 bg_img_type={1} type={0} _id={item.coupons_log_id} return_money={item.money} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} _image={item.image} /> : ""
              ))}
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            <View className="tiket_box">
              {/* <CashCoupon2 bg_img_type={0} _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon1 bg_img_type={0} type={0} _id="1" return_money="100" pay_money="20" youhui_type="1" timer="100" sname="ddddd" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" /> */}
              {this.state.coupon3.map((item) => (
                item.coupons_type.toString() == "1" ?
                  <CashCoupon2 bg_img_type={0} _id={item.coupons_log_id} return_money={item.money} _total_fee={item.total_fee} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} /> : ""
              ))}
              {this.state.coupon3.map((item) => (
                item.coupons_type.toString() == "0" ?
                  <CashCoupon1 bg_img_type={0} type={0} _id={item.coupons_log_id} return_money={item.money} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} _image={item.image} /> : ""
              ))}
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={3}>
            <View className="tiket_box">
              {/* <CashCoupon2 bg_img_type={1} _id="0" return_money="50" pay_money="150" youhui_type="1" timer="654564" sname="滴滴滴" list_brief="解放萨哈林岛" />
              <CashCoupon1 bg_img_type={0} type={2} _id="1" return_money="100" pay_money="20" youhui_type="1" timer="100" sname="ddddd" list_brief="解放萨哈林岛" _image="http://oss.tdianyi.com/front/mCAEJZbM3kmRGGJtDpnhKNzdEtWAnBEf.jpg" /> */}
              {this.state.coupon4.map((item) => (
                item.coupons_type.toString() == "1" ?
                  <CashCoupon2 bg_img_type={1} _id={item.coupons_log_id} return_money={item.money} _total_fee={item.total_fee} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} /> : ""
              ))}
              {this.state.coupon4.map((item) => (
                item.coupons_type.toString() == "0" ?
                  <CashCoupon1 bg_img_type={0} type={2} _id={item.coupons_log_id} return_money={item.money} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} _image={item.image} /> : ""
              ))}
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}
