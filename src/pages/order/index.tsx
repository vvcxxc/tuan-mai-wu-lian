import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import "taro-ui/dist/style/components/tabs.scss";
import CashCoupon1 from "./cash-coupon1/index";
import CashCoupon2 from "./cash-coupon2/index";

import "./index.styl";
import request from "../../services/request";

export default class Order extends Component {
  config: Config = {
    navigationBarTitleText: "我的订单",
    enablePullDownRefresh: true,
  };
  constructor(props) {
    super(props);
    Object.assign(this.state, this.props)
    this.showcode = this.showcode.bind(this)
  }
  state = {
    _codeinfo: "",
    _codeimg: "",
    _codeshow: false,
    no_login: false, // 判断是否登录
    current: 0,//taro组件用的
    coupon: [],//taro组件用的
    coupon1: [
      // {
      //   coupons_log_id: "",
      //   coupons_id: "",
      //   create_time: "",
      //   expiration: "",
      //   coupons_name: "",
      //   money: "",
      //   suppliername: "",
      //   image: "",
      //   coupons_type: "",
      //   confirm_time: "",
      //   total_fee: "",
      // }
    ],//4个tab的数据分开算
    coupon2: [],
    coupon3: [],
    coupon4: [],
    page1: 1,
    page2: 1,
    page3: 1,
    page4: 1,
    lengthbull1: true,
    lengthbull2: true,
    lengthbull3: true,
    lengthbull4: true
  };

  componentDidShow() {
    let that = this;
    let phone_status = Taro.getStorageSync('phone_status')
    console.log(phone_status)
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      this.setState({
        current: 0,
        page1: 1,
        page2: 1,
        page3: 1,
        page4: 1,
        coupon: [],
        coupon1: [],
        coupon2: [],
        coupon3: [],
        coupon4: [],
        lengthbull1: true,
        lengthbull2: true,
        lengthbull3: true,
        lengthbull4: true,
      }, () => { that.getData1() })
    } else {
      this.setState({ no_login: true })
    }

  }


  onPullDownRefresh = () => { // 自带 下拉事件
    if (!this.state.no_login) {
      if (this.state.current == 0) {
        this.setState({
          page1: 1,
          lengthbull1: true,
          coupon1: []
        }, () => {
          this.getData1();
        })
      } else if (this.state.current == 1) {
        this.setState({
          page2: 1,
          lengthbull2: true,
          coupon2: []
        }, () => {
          this.getData2();
        })

      } else if (this.state.current == 2) {
        this.setState({
          page3: 1,
          lengthbull3: true,
          coupon3: []
        }, () => {
          this.getData3();
        })
      } else if (this.state.current == 3) {
        this.setState({
          page4: 1,
          lengthbull4: true,
          coupon4: []
        }, () => {
          this.getData4();
        })
      }
      setTimeout(() => {
        Taro.stopPullDownRefresh();
      }, 1000);
    }

  }
  // 触底事件
  onReachBottom = () => {
    this.state.current == 0 ? this.getData1() : (
      this.state.current == 1 ? this.getData2() : (
        this.state.current == 2 ? this.getData3() : (
          this.state.current == 3 ? this.getData4() : "")))
  }

  getData1() {

    if (this.state.lengthbull1) {
      Taro.showLoading({
        title: "loading",
        mask: true
      });
      request({
        url: "v3/user/coupons",
        data: {
          coupons_status: 1,
          page: this.state.page1
        }
      })
        .then((res: any) => {
          console.log(5123123)
          let temp = this.state.coupon1.concat(res.data);
          console.log(temp.length)
          this.setState({ coupon: temp, coupon1: temp, page1: this.state.page1 + 1 }, () => {
            if (this.state.page1 >= res.last_page) {
              this.setState({ lengthbull1: false });
            }
          });

          Taro.hideLoading();
        })
    }
  }
  getData2() {
    if (this.state.lengthbull2) {
      Taro.showLoading({
        title: "loading",
        mask: true
      });
      request({
        url: "v3/user/coupons",
        data: {
          coupons_status: 2,
          page: this.state.page2
        }
      })
        .then((res: any) => {
          let temp = this.state.coupon2.concat(res.data);
          this.setState({ coupon: temp, coupon2: temp, page2: this.state.page2 + 1 }, () => {
            if (this.state.page2 >= res.last_page) {
              this.setState({ lengthbull2: false });
            }
          });

          Taro.hideLoading();
        })
        .catch(() => {
          Taro.hideLoading();
        });
    }
  }
  getData3() {
    if (this.state.lengthbull3) {
      Taro.showLoading({
        title: "loading",
        mask: true
      });
      request({
        url: "v3/user/coupons",
        data: {
          coupons_status: 3,
          page: this.state.page3
        }
      })
        .then((res: any) => {
          let temp = this.state.coupon3.concat(res.data);
          this.setState({ coupon: temp, coupon3: temp, page3: this.state.page3 + 1 }, () => {
            if (this.state.page3 >= res.last_page) {
              this.setState({ lengthbull3: false });
            }
          });

          Taro.hideLoading();
        })
        .catch(() => {
          Taro.hideLoading();
        });
    }
  }
  getData4() {
    if (this.state.lengthbull4) {
      Taro.showLoading({
        title: "loading",
        mask: true
      });
      request({
        url: "v3/user/coupons",
        data: {
          coupons_status: 4,
          page: this.state.page4
        }
      })
        .then((res: any) => {
          let temp = this.state.coupon4.concat(res.data);
          this.setState({ coupon: temp, coupon4: temp, page4: this.state.page4 + 1 }, () => {
            if (this.state.page4 >= res.last_page) {
              this.setState({ lengthbull4: false });
            }
          });

          Taro.hideLoading();
        })
        .catch(() => {
          Taro.hideLoading();
        });
    }
  }

  handleClick0(value) {
    this.setState({
      current: value
    }, () => {
      if(!this.state.no_login){
        if (value == 0 && this.state.coupon1.length == 0) {
          this.getData1();
        } else if (value == 1 && this.state.coupon2.length == 0) {
          this.getData2();
        } else if (value == 2 && this.state.coupon3.length == 0) {
          this.getData3();
        } else if (value == 3 && this.state.coupon4.length == 0) {
          this.getData4()
        }
      }
    })

  }

  showcode(_id) {
    // console.log("爸爸" + _id);
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
    request({
      url: "v3/user/coupons/info",
      data: { coupons_log_id: _id, xpoint: '', ypoint: '' }
    })
      .then((res: any) => {
        // console.log(res.youhui_sn);
        this.setState({ _codeinfo: res.data.youhui_sn });
      })
    request({
      url: 'api/wap/coupon/showCode',
      data: { coupons_log_id: _id },
    })
      .then((res: any) => {
        // console.log(res);
        this.setState({ _codeimg: res.data });
      })
    this.setState({ _codeshow: true });
    Taro.hideLoading();
  }

  render() {
    const {no_login} = this.state
    console.log(no_login)
    const tabList = [{ title: '未使用' }, { title: '已使用' }, { title: '已过期' }, { title: '已退款' }]
    return (
      <View className="order flex column"  >

        {this.state._codeshow ?
          <View className="code_show" onClick={() => { this.setState({ _codeshow: false, _codeimg: '', _codeinfo: '' }) }}>
            <View className="code_background"> </View>
            <View className="codeBox" >
              <View className="codeBox_info">商家扫码/输码验证即可消费</View>
              <View className="codeBox_img">
                <Image className="code_img" src={this.state._codeimg} />
              </View>
              <View className="codeBox_msg">{this.state._codeinfo}</View>
            </View>
          </View>
          : ""
        }

        <View>
          {
            no_login ?
            <View className="msgBox msgBox-no-sign">
              <View className="imgBox">
                  <Image className="logo" src={require('@/assets/no-sign.png')} />
                </View>
                <View className="_msg">登录后才可以查看订单信息哦！</View>
                <View className="toHome-no-sign "
                  onClick={() => {
                   Taro.navigateTo({url: '/pages/auth/index'})
                  }}>去登录</View>
            </View> :
            (this.state.current == 0 && this.state.coupon1.length == 0) ?
              <View className="msgBox">
                <View className="imgBox">
                  <Image className="logo" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/sXMSERHX2BaZa23cDXwfQ8JymfZSaGip.png"} />
                </View>
                <View className="_msg">没有可使用的订单，快去逛逛吧！</View>
                <View className="toHome"
                  onClick={() => {
                    Taro.switchTab({
                      url: '../../pages/index/index'
                    })
                  }}>去首页</View>
              </View> : ((this.state.current == 1 && this.state.coupon2.length == 0) ? <View className="msgBox">
                <View className="imgBox">
                  <Image className="logo" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/TXNJyF2kydtBeKkitG4xpcRYhAHiiseK.png"} />
                </View>
                <View className="_msg">您还没有使用过的订单哦</View>
              </View> : ((this.state.current == 2 && this.state.coupon3.length == 0) ?
                <View className="msgBox">
                  <View className="imgBox">
                    <Image className="logo" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/eNxGKWKYEHdGKGNh8jGGD24E8a6Tfy4r.png"} />
                  </View>
                  <View className="_msg">您还没有已过期的订单哦</View>
                </View> : ((this.state.current == 3 && this.state.coupon4.length == 0) ? <View className="msgBox">
                  <View className="imgBox">
                    <Image className="logo" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/h4jNAQHbyK8Xx6zra3fBEHwBtAepmhCz.png"} />
                  </View>
                  <View className="_msg">您还没有已退款的订单哦</View>
                </View> : "")
                ))
          }
        </View>

        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick0.bind(this)} >
          <AtTabsPane current={this.state.current} index={0} >
            <View className="tiket_box">
              {
                this.state.coupon1.map((item) => (
                  item.coupons_type == "1" ? <View key={item.coupons_log_id}>
                    <CashCoupon2 bg_img_type={1} type={0} _id={item.coupons_id} _logid={item.coupons_log_id} confirm_time={item.confirm_time} return_money={item.money} _total_fee={item.total_fee} youhui_type={item.coupons_type} timer={item.create_time + " - " + item.expiration} sname={item.suppliername} list_brief={item.coupons_name} expiration={item.expiration} />
                  </View> : <View key={item.coupons_log_id}>
                      <CashCoupon1 bg_img_type={0} type={1} _id={item.coupons_id} _logid={item.coupons_log_id} confirm_time={item.confirm_time} return_money={item.money} youhui_type={item.coupons_type} timer={item.create_time + " - " + item.expiration} sname={item.suppliername} list_brief={item.coupons_name} _image={item.image} clickcode={this.showcode} />
                    </View>
                ))
              }

            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View className="tiket_box">
              {
                this.state.coupon2.map((item) => (
                  item.coupons_type == "1" ? <View key={item.coupons_log_id}>
                    <CashCoupon2 bg_img_type={2} type={0} _id={item.coupons_id} _logid={item.coupons_log_id} confirm_time={item.confirm_time} return_money={item.money} _total_fee={item.total_fee} youhui_type={item.coupons_type} timer={item.create_time + " - " + item.expiration} sname={item.suppliername} list_brief={item.coupons_name} expiration={item.expiration} />
                  </View> : <View key={item.coupons_log_id}>
                      <CashCoupon1 bg_img_type={1} type={0} _id={item.coupons_id} _logid={item.coupons_log_id} confirm_time={item.confirm_time} return_money={item.money} youhui_type={item.coupons_type} timer={item.create_time + " - " + item.expiration} sname={item.suppliername} list_brief={item.coupons_name} _image={item.image} clickcode={null} />
                    </View>
                ))
              }

            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            <View className="tiket_box">
              {
                this.state.coupon3.map((item) => (
                  item.coupons_type == "1" ? <View key={item.coupons_log_id}>
                    <CashCoupon2 bg_img_type={0} type={0} _id={item.coupons_id} _logid={item.coupons_log_id} confirm_time={item.confirm_time} return_money={item.money} _total_fee={item.total_fee} youhui_type={item.coupons_type} timer={item.create_time + " - " + item.expiration} sname={item.suppliername} list_brief={item.coupons_name} expiration={item.expiration} />
                  </View> : <View key={item.coupons_log_id}>
                      <CashCoupon1 bg_img_type={0} type={0} _id={item.coupons_id} _logid={item.coupons_log_id} confirm_time={item.confirm_time} return_money={item.money} youhui_type={item.coupons_type} timer={item.create_time + " - " + item.expiration} sname={item.suppliername} list_brief={item.coupons_name} _image={item.image} clickcode={null} />
                    </View>
                ))
              }

            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={3}>
            <View className="tiket_box">
              {
                this.state.coupon4.map((item) => (
                  item.coupons_type == "1" ? <View key={item.coupons_log_id}>
                    <CashCoupon2 bg_img_type={1} type={1} _id={item.coupons_id} _logid={item.coupons_log_id} confirm_time={item.confirm_time} return_money={item.money} _total_fee={item.total_fee} youhui_type={item.coupons_type} timer={item.create_time + " - " + item.expiration} sname={item.suppliername} list_brief={item.coupons_name} expiration={item.expiration} />
                  </View> : <View key={item.coupons_log_id}>
                      <CashCoupon1 bg_img_type={0} type={2} _id={item.coupons_id} _logid={item.coupons_log_id} confirm_time={item.confirm_time} return_money={item.money} youhui_type={item.coupons_type} timer={item.create_time + " - " + item.expiration} sname={item.suppliername} list_brief={item.coupons_name} _image={item.image} clickcode={null} />
                    </View>
                ))
              }

            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}
