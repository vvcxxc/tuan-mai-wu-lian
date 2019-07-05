import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.styl";
import request from '../../services/request'
import MobileImg from '../../assets/dianhua.png'
// import starImg from '../../assets/starcollect.png'
import AddressImg from '../../assets/address.png'
import ticketImg from '../../assets/ticket.png'
import "taro-ui/dist/style/components/toast.scss";
// import "taro-ui/dist/style/components/icon.scss";
// import 'taro-ui/dist/style/index.scss'

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
    activity_group: [{
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
    }],
    activity_appre: [{
      //增值活动
      name: "",
      activity_brief: '',
      image_url: "",
      pay_money: '',
      return_money: '',
      market_price: '',
      init_money: '',
      gift_pic: ""
    }],
    cashCouponList: [{//优惠券列表
      id: '',
      name: '',
      image: "",
      image_type: '',
      address: '',
      list_brief: '',
      brief: '',
      youhui_type: '1',
      begin_time: '',
      end_time: '',
      pay_money: "",
      expire_day: ""
    }],
    exchangeCouponList: [{
      begin_time: "",
      brief: "",
      end_time: "",
      id: 1590,
      image: "",
      list_brief: "",
      name: "",
      youhui_type: 0,
      pay_money: ""
    }]
    ,
    activity_group_bull: false,
    activity_appre_bull: false,
    couponList_bull: false,
    exchangeCouponList_bull: false,
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
          onClick={() => {
            this.setState({ activity_group_bull: !this.state.activity_group_bull });
          }} >{this.state.activity_group_bull ? "收回" : "查看更多"}{this.state.activity_group_bull ? <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />}</View>

        <hr />








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
                <Image className="backg-image" src={ticketImg} />
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
                <Image className="backg-image" src={ticketImg} />
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
        {/* 优惠券 */}
        <View className="ft-more flex center"
          style={{ textAlign: "center", margin: "0", width: "100%", background: "#fff" }}
          onClick={() => { this.setState({ activity_appre_bull: !this.state.activity_appre_bull }) }}
        >{this.state.activity_appre_bull ? "收回" : "查看更多"}
          {this.state.activity_appre_bull ? <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />}</View>
        <View style={{ height: "10px" }}></View>
        <hr />

        <View className="bcfff ticket" id="couponList_tiket" >
          {
            this.state.couponList_bull ? this.state.cashCouponList.map((item) => (
              <div>
                <View className="merchant-details__tit" >
                  <View style={{ height: "5px" }}></View>
                  <Text className="mark bc5D84E0">券</Text>
                  <Text className="fwb">{item.youhui_type == '1' ? '现金卷' : '兑换卷'}</Text>
                </View>
                <View className="ticket-view flex center" style={{ position: 'relative' }} onClick={this.handleClick.bind(this, item.id)}>
                  <View className="left" style={{ position: 'absolute', left: '30px' }}>
                    <View className="money">{item.name}</View>
                    {/* list_brief */}
                    <View className="desc">购买后{item.expire_day}天有效</View>
                    <View className="sales">{item.brief}</View>
                  </View>
                  <View className="right" style={{ position: 'absolute', right: '20px' }}>
                    <View className="money">￥<Text>{item.pay_money}</Text></View>
                    <Button className="btn-buy">立即购买</Button>
                  </View>
                </View>
                <br />
              </div>
            )) : <div><View className="merchant-details__tit">
              <Text className="mark bc5D84E0">券</Text>
              <Text className="fwb">{this.state.cashCouponList[0].youhui_type == '1' ? '现金卷' : '兑换卷'}</Text>
            </View>
                <View className="ticket-view flex center" style={{ position: 'relative' }} onClick={this.handleClick.bind(this, this.state.cashCouponList[0].id)}>
                  <View className="left" style={{ position: 'absolute', left: '30px' }}>
                    <View className="money">{this.state.cashCouponList[0].name}</View>
                    <View className="desc">购买后{this.state.cashCouponList[0].expire_day}天有效</View>
                    <View className="sales">{this.state.cashCouponList[0].brief}</View>
                  </View>
                  <View className="right" style={{ position: 'absolute', right: '20px' }}>
                    <View className="money">￥<Text>{this.state.cashCouponList[0].pay_money}</Text></View>
                    <Button className="btn-buy">立即购买</Button>
                  </View>
                </View>
                <br /></div>}
          <View className="ft-more flex center"
            style={{ textAlign: "center", margin: "0", width: "100%", background: "#fff" }}
            onClick={() => { this.setState({ couponList_bull: !this.state.couponList_bull }) }} >{this.state.couponList_bull ? "收回" : "查看更多"}
            {this.state.couponList_bull ? <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />}
          </View>
        </View>
        <View style={{ height: "10px" }}></View>
        {/* <hr /> */}


        {/* 优惠信息*/}
        <View className="discounts-view bcfff" >
          {
            this.state.exchangeCouponList_bull ? this.state.exchangeCouponList.map((item) => (
              <div >
                <View className="merchant-details__tit">
                  <View style={{ height: "10px" }}></View>
                  <Text className="mark bc5D84E0" style={{ background: "#58bc58" }}>惠</Text>
                  <Text className="fwb">优惠信息</Text>
                </View>
                <View className="discounts-cells">
                  <View className="discounts-cell flex center">
                    <Image className="image" src={item.image} />
                    <View className="discounts-cell__bd item">
                      <View className="tit">{item.name}</View>
                      <View className="desc">{item.brief}</View>
                      <View className="flex center" style={{ position: "relative" }}>
                        <View className="money" style={{ position: 'absolute', left: '0' }}>￥{item.pay_money}</View>
                        {/* <View className="count">本年销量 6万+</View> */}
                        <Button className="btn-buy" onClick={this.handleClick2.bind(this, item.id)} style={{ position: 'absolute', right: '20px' }}>立即购买</Button>
                      </View>
                    </View>
                  </View>

                </View>
              </div>)) :
              <div >
                <View className="merchant-details__tit">
                  <View style={{ height: "10px" }}></View>
                  <Text className="mark bc5D84E0" style={{ background: "#58bc58" }}>惠</Text>
                  <Text className="fwb">优惠信息</Text>
                </View>
                <View className="discounts-cells">
                  <View className="discounts-cell flex center">
                    <Image className="image" src={this.state.exchangeCouponList[0].image} />
                    <View className="discounts-cell__bd item">
                      <View className="tit">{this.state.exchangeCouponList[0].name}</View>
                      <View className="desc">{this.state.exchangeCouponList[0].brief}</View>
                      <View className="flex center" style={{ position: "relative" }}>
                        <View className="money" style={{ position: 'absolute', left: '20px' }}>￥{this.state.exchangeCouponList[0].pay_money}</View>
                        {/* <View className="count">本年销量 6万+</View> */}
                        <Button className="btn-buy" onClick={this.handleClick2.bind(this, this.state.exchangeCouponList[0].id)} style={{ position: 'absolute', right: '20px' }}>立即购买</Button>
                      </View>
                    </View>
                  </View>
                </View>
              </div>
          }
          <View className="ft-more flex center"
            style={{ textAlign: "center", margin: "0", width: "100%", background: "#fff" }}
            onClick={() => { this.setState({ exchangeCouponList_bull: !this.state.exchangeCouponList_bull }) }} >{this.state.exchangeCouponList_bull ? "收回" : "查看更多"}
            {this.state.exchangeCouponList_bull ? <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />}
          </View>
          <View style={{ height: "10px" }}></View>

        </View>
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
