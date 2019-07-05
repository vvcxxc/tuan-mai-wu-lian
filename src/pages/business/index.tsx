import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.styl";
import request from '../../services/request'
import MobileImg from '../../assets/dianhua.png'
// import starImg from '../../assets/starcollect.png'
import AddressImg from '../../assets/address.png'
import "taro-ui/dist/style/components/toast.scss";
// import "taro-ui/dist/style/components/icon.scss";
// import 'taro-ui/dist/style/index.scss'

import ActivityGroupComponent from './ActivityGroup'
import ActivityAppreComponent from './ActivityAppre'
import CashCouponListComponent from './cashCouponList'
import ExchangeCouponComponent from './ExchangeCouponList'

interface Props {
  store_id: any;
}

export default class PaySuccess extends Component<Props> {
  config = {
    navigationBarTitleText: "商家详情"
  };


  state = {
    business_list: {//自家店铺
      id: "",
      name: '',
      address: '',
      store_img_one: "",
      store_img_three: "",
      store_img_two: "",
      collect: "0"
    },
    recommend: [//本店其它的推荐
      {
        id: "",
        shop_door_header_img: '',
        name: '',
        address: '',
        label: ['免费礼品']
      }
    ],
    activity_group: [
      {
        //拼团活动
        name: '',
        activity_brief: '	',
        image_url: "",
        pay_money: '',
        return_money: '',
        participation_number: '',
        participation_money: '',
        market_price: '',
        gift_pic: ""
      }
    ],
    activity_appre: [
      {
        //增值活动
        name: "",
        activity_brief: '',
        image_url: "",
        pay_money: '',
        return_money: '',
        market_price: '',
        init_money: '',
        gift_pic: ""
      }
    ],
    cashCouponList: [
      //{//优惠券列表
      //   id: '',
      //   name: '',
      //   image: "",
      //   image_type: '',
      //   address: '',
      //   list_brief: '',
      //   brief: '',
      //   youhui_type: '1',
      //   begin_time: '',
      //   end_time: '',
      //   pay_money: "",
      //   expire_day: ""
      // }
    ],
    exchangeCouponList: [
      //   {
      //   begin_time: "",
      //   brief: "",
      //   end_time: "",
      //   id: 1590,
      //   image: "",
      //   list_brief: "",
      //   name: "",
      //   youhui_type: 0,
      //   pay_money: ""
      // }
    ]
    ,
    activity_group_bull: false,
    activity_appre_bull: false,


    keepCollect_bull: false,
    keepCollect_data: "收藏成功"
  };

  componentWillMount() {
    Taro.showLoading({
      title: 'loading',
    })
    let that = this;
    request({ url: 'v3/stores/' + this.$router.params.id })
      .then((res: any) => {
        that.setState({
          business_list: res.store.Info,
          recommend: res.recommend,
          activity_group: res.store.activity_group,
          activity_appre: res.store.activity_appreciation,
          cashCouponList: res.store.cashCouponList,
          exchangeCouponList: res.store.exchangeCouponList
        })
        Taro.hideLoading()
      });
  }
  componentDidMount() {
  }
  handleClick = (_id, e) => {
    Taro.navigateTo({
      url: '../../business-pages/ticket-buy/index?id=' + _id
    })
  }
  handleClick2 = (_id, e) => {
    Taro.navigateTo({
      url: '../../business-pages/set-meal/index?id=' + _id
    })
  }
  handleClick3 = (_id, e) => {
    Taro.navigateTo({
      url: './index?id=' + _id
    })
  }
  keepCollect(e) {
    let _id = this.state.business_list.id;
    request({ url: 'v3/stores/collection', method: "PUT", data: { store_id: _id } })
      .then((res: any) => {
        if (res) {
          this.setState({
            keepCollect_data: res,
            //控制AtToast显示，set为true就好了，每次set都会触发AtToast
            keepCollect_bull: true
          })
        }
      })
  }
  render() {
    return (
      <View className="merchant-details">
        {

          this.state.keepCollect_bull ? <AtToast isOpened text={this.state.keepCollect_data} icon={"star-2"} duration={2000} ></AtToast> : ""
        }

        <View className="shop bcfff">
          <View className="flex center top-view">
            <View className="item">
              <View className="name">{this.state.business_list.name}</View>
              {/* <View className="money">人均：￥62</View> */}
            </View>
            {/* <Image className="image" src={starImg} onClick={this.keepCollect.bind(this)} /> */}
            {
              this.state.business_list.collect == "1" ?
                <AtIcon className="image" value="star-2" color="#FFBF00" size="24px" />
                :
                (
                  this.state.keepCollect_bull ?
                    <AtIcon className="image" value="star-2" color="#FFBF00" size="24px" />
                    :
                    <AtIcon className="image" value="star" color="#999" size="24px" onClick={this.keepCollect.bind(this)} />
                )
            }
          </View>
          <ScrollView scrollX className="scroll-view">
            <View className="flex">
              {/* {
                this.state.image.map((item) => (<Image className="image" src={item} />))
              } */}
              <Image className="image" src={this.state.business_list.store_img_one} />
              <Image className="image" src={this.state.business_list.store_img_three} />
              <Image className="image" src={this.state.business_list.store_img_two} />
            </View>
          </ScrollView>
          <View className="address flex center">
            <Image className="address-img" src={AddressImg} />
            <View className="text item" >{this.state.business_list.address}</View>
            <Image className="mobile-img" src={MobileImg} />
          </View>
        </View>



        {this.state.activity_group.length == 0 ? "" : (<View>
          {/* 拼团活动 */}
          {
            this.state.activity_group_bull ? this.state.activity_group.map((item) => (
              <View className="group-purchase bcfff">
                <View style={{ height: "5px" }}></View>
                <View className="hd">
                  <View className="merchant-details__tit">
                    <Text className="mark">礼</Text>
                    <Text className="fwb">拼团送好礼</Text>
                  </View>
                  <View className="flex center">
                    <View className="item desc">{item.activity_brief}</View>
                    {/* <View className="count">{item.participation_number}人团</View> */}
                  </View>
                </View>
                {this.state.activity_group[0].gift_pic == null ?
                  <View className="image-list0">
                    <Image className="image0" src={item.image_url} />
                  </View> :
                  <View className="image-list0">
                    <Image className="image" src={item.image_url} />
                    <Image className="image" src={item.gift_pic} />
                  </View>
                }
                <View className="ft ">
                  <View className="flex center">
                    <View className="item">
                      <Text className="money">￥{item.pay_money}</Text>
                      <Text className="count">已拼{item.participation_number}件</Text>
                    </View>
                    <Button className="btn-go">立刻开团</Button>
                  </View>
                </View>
              </View>
            )) : <View className="group-purchase bcfff">
                <View className="hd">
                  <View className="merchant-details__tit">
                    <Text className="mark">礼</Text>
                    <Text className="fwb">拼团送好礼</Text>
                  </View>
                  <View className="flex center">
                    <View className="item desc">{this.state.activity_group[0].activity_brief}</View>
                    <View className="count">{this.state.activity_group[0].participation_number}人团</View>
                  </View>
                </View>
                {this.state.activity_group[0].gift_pic == null ?
                  <View className="image-list0">
                    <Image className="image0" src={this.state.activity_group[0].image_url} />
                    {/* <Image className="image" src={this.state.activity_group[0].image_url} />
                  <Image className="image" src={this.state.activity_group[0].image_url} /> */}
                  </View> :
                  <View className="image-list0">
                    <Image className="image" src={this.state.activity_group[0].image_url} />
                    <Image className="image" src={this.state.activity_group[0].gift_pic} />
                  </View>
                }
                <View className="ft ">
                  <View className="flex center">
                    <View className="item">
                      <Text className="money" >￥{this.state.activity_group[0].pay_money}</Text>
                      <Text className="count">已拼{this.state.activity_group[0].participation_number}件</Text>
                    </View>
                    <Button className="btn-go">立刻开团</Button>
                  </View>
                </View>
              </View>
          }
          <View className="ft-more flex center" style={{ textAlign: "center", margin: "0", width: "100%", background: "#fff" }}
            onClick={() => { this.setState({ activity_group_bull: !this.state.activity_group_bull }); }}>
            {this.state.activity_group_bull ? "收回" : "查看更多"}
            {this.state.activity_group_bull ?
              <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />}</View>
          <hr />
        </View>)}





        {this.state.activity_appre.length == 0 ? "" : (<View>
          {/* 增值活动 */}
          {
            this.state.activity_appre_bull ? this.state.activity_appre.map((item) => (
              <View className="group-purchase bcfff">
                <View style={{ height: "5px" }}></View>
                <View className="hd">
                  <View className="merchant-details__tit">
                    <Text className="mark">增</Text>
                    <Text className="fwb">增值低价买</Text>
                  </View>
                  <View className="flex center">
                    <View className="item desc">{item.name}</View>
                  </View>
                </View>
                <View className="image-list" style={{ position: "relative", marginBottom: "5px" }}>
                  <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/andhNY3XKEWrW8nYBK5pyAptaJWeJz68.png"} />
                  <View className="img" style={{ width: "100%" }}   >
                    <View className="box_left">
                      <View className="box_left_price">￥{item.return_money}</View>
                      <View className="box_left_return">最高可抵{item.return_money}元</View>
                    </View>
                    <View className="box_center">
                      <View className="present">{item.activity_brief}</View>
                      {/* <View className="present_recommend">送价值3000元耳机</View> */}
                    </View>
                    <View className="box_right" style={{ overflow: "hidden" }}>
                      <Image className="image" src={item.image_url} style={{ width: "100%", height: "100%" }} />
                    </View>
                  </View>
                </View>
                <View className="ft ">
                  <View className="flex center">
                    <View className="item">
                      <Text className="money">￥{item.pay_money}</Text>
                      <Text className="count">{item.activity_brief}</Text>
                    </View>
                    <Button className="btn-go">立刻增值</Button>
                  </View>
                </View>
              </View>
            )) : <View className="group-purchase bcfff">
                <View className="hd">
                  <View className="merchant-details__tit">
                    <Text className="mark">增</Text>
                    <Text className="fwb">增值低价买</Text>
                  </View>
                  <View className="flex center">
                    <View className="item desc">{this.state.activity_appre[0].name}</View>
                  </View>
                </View>
                <View className="image-list" style={{ position: "relative", marginBottom: "5px" }}>
                  <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/andhNY3XKEWrW8nYBK5pyAptaJWeJz68.png"} />
                  <View className="img" style={{ width: "100%" }}   >
                    <View className="box_left">
                      <View className="box_left_price">￥{this.state.activity_appre[0].return_money}</View>
                      <View className="box_left_return">最高可抵{this.state.activity_appre[0].return_money}元</View>
                    </View>
                    <View className="box_center">
                      <View className="present">{this.state.activity_appre[0].activity_brief}</View>
                      {/* <View className="present_recommend">送价值3000元耳机</View> */}
                    </View>

                    <View className="box_right" style={{ overflow: "hidden" }}>
                      <Image className="image" src={this.state.activity_appre[0].image_url} style={{ width: "100%", height: "100%" }} />
                    </View>
                  </View>
                </View>
                <View className="ft ">
                  <View className="flex center">
                    <View className="item">
                      <Text className="money">￥{this.state.activity_appre[0].pay_money}</Text>
                      <Text className="count">{this.state.activity_appre[0].activity_brief}</Text>
                    </View>
                    <Button className="btn-go">立刻增值</Button>
                  </View>
                </View>
              </View>
          }

          <View className="ft-more flex center"
            style={{ textAlign: "center", margin: "0", width: "100%", background: "#fff" }}
            onClick={() => { this.setState({ activity_appre_bull: !this.state.activity_appre_bull }) }}
          >{this.state.activity_appre_bull ? "收回" : "查看更多"}
            {this.state.activity_appre_bull ? <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />}</View>
          <View style={{ height: "10px" }}></View>
          <hr />
        </View>)}


        {/* 拼团活动 */}        {/* 增值活动 */}

        {/* {
          this.state.activity_group.length == 0 ? <View></View> : <View style={{ background: "#fff" }}>
            <ActivityGroupComponent activity_group={this.state.activity_group} />
          </View>
        }
        {
          this.state.activity_appre.length == 0 ? <View></View> : <View style={{ background: "#fff" }}>
            <ActivityAppreComponent activity_appre={this.state.activity_appre} />
          </View>
        } */}
        {/* 优惠券 */}
        {
          this.state.cashCouponList.length == 0 ? <View></View> : <View style={{ background: "#fff" }}>
            <CashCouponListComponent cashCouponList={this.state.cashCouponList} />
          </View>
        }
        {/* 优惠信息*/}
        {
          this.state.exchangeCouponList.length == 0 ? <View></View> : <View style={{ background: "#fff" }}>
            <ExchangeCouponComponent exchangeCouponList={this.state.exchangeCouponList} />
          </View>
        }

        <View className="recommend-view bcfff">
          <View className="merchant-details__tit">
            <Text className="fwb">附近推荐</Text>
          </View>
          <View className="recommend-cells">
            {
              this.state.recommend.map((item) => (
                <View className="recommend-cell flex center" onClick={this.handleClick3.bind(this, item.id)}>
                  <Image className="image" src={item.shop_door_header_img} />
                  <View className="recommend-cell__bd item">
                    <View className="tit">{item.name}</View>
                    <View className="flex center mb33">
                      {/* <Text className="ellipsis-one ">{item.address}</Text> */}
                      {/* <Text>洛溪 923m</Text> */}
                    </View>
                    <View className="flex center">
                      <View className="tags">
                        <Text className="tag-text" style={{ backgroundColor: item.label.indexOf('免费礼品') !== -1 ? '#fde8e5' : '#fff' }}>免费礼品</Text>
                        <Text className="tag-text" style={{ backgroundColor: item.label.indexOf('优秀商家') !== -1 ? '#fde8e5' : '#fff' }}>优秀商家</Text>
                        <Text className="tag-text" style={{ backgroundColor: item.label.indexOf('现金券') !== -1 ? '#fde8e5' : '#fff' }}>现金券</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            }
          </View>
        </View>
      </View>
    );
  }
}
