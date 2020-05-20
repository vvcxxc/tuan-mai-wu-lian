import Taro, { Component } from "@tarojs/taro";
import { AtIcon } from 'taro-ui';
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import ApplyToTheStore from '@/components/applyToTheStore';
import './index.less'
import dayjs from 'dayjs'

// import ShareBox from '@/components/share-box';
export default class SnapGift extends Component {
  config = {
    navigationBarTitleText: "现金券",
    enablePullDownRefresh: false
  };

  state = {
    showCode: false,
    ApeakerlogisticsContentShow: false,
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
  }



  render() {
    return (
      <View className="snap-gift">
        <Image className="snap-gift-banner" src="http://oss.tdianyi.com/front/h5mHiFXn7ikmij7SnANwzcKjxPQyidnS.png" />
        <View className="snap-gift-info-list">
          <View className="snap-gift-info-list-item">
            <View className="snap-gift-info-list-item-key">礼品名称</View>
            <View className="snap-gift-info-list-item-word">XXX现金券XXX现金券XXX现金券XXX现金券XXX现金券</View>
          </View>
          <View className="snap-gift-info-list-item">
            <View className="snap-gift-info-list-item-key">礼品面额</View>
            <View className="snap-gift-info-list-item-word">￥123.00</View>
          </View>
          <View className="snap-gift-info-list-item">
            <View className="snap-gift-info-list-item-key">使用门槛</View>
            <View className="snap-gift-info-list-item-word">消费满200可用</View>
          </View>
          <View className="snap-gift-info-list-item">
            <View className="snap-gift-info-list-item-key">使用状态</View>
            <View className="snap-gift-info-list-item-word-green">已核销</View>
          </View>
          <View className="snap-gift-info-list-item">
            <View className="snap-gift-info-list-item-key">使用状态</View>
            <View className="snap-gift-info-list-item-word-yellow">未核销</View>
          </View>
          <View className="snap-gift-info-list-item">
            <View className="snap-gift-info-list-item-key">礼品面额</View>
            <View className="snap-gift-info-list-item-word">￥123.00</View>
          </View>
          <View className="snap-gift-info-list-item">
            <View className="snap-gift-info-list-item-key">有效期</View>
            <View className="snap-gift-info-list-item-word">领取7天后</View>
          </View>
          <View className="snap-gift-info-list-item">
            <View className="snap-gift-info-list-item-key">发放限制</View>
            <View className="snap-gift-info-list-item-word">1个/人</View>
          </View>
          <View className="snap-gift-info-list-item">
            <View className="snap-gift-info-list-item-key">使用说明</View>
            <View className="snap-gift-info-list-item-word">XXXXXXXXX15个字XXXXXXXXX15个字XXXXXXXXX15个字</View>
          </View>
        </View>

        <View className="snap-store-info">
          <ApplyToTheStore
            store_id={this.state.store.id}
            isTitle={true}
            img={this.state.store.shop_door_header_img}
            name={this.state.store.sname}
            phone={this.state.store.tel}
            address={this.state.store.saddress}
            location={{ xpoint: this.state.store.xpoint, ypoint: this.state.store.ypoint }}
            meter={this.state.store.distance}
          />
        </View>

        <View className="snap-logistics">
          <View className="snap-title-box">
            <View className='snap-title-left'></View>
            <View className='snap-title'>配送信息</View>
          </View>
          <View className="snap-logistics-info-list-item">
            <View className="snap-logistics-info-list-item-key">配送状态</View>
            <View className="snap-logistics-info-list-item-word">配送中</View>
          </View>
          <View className="snap-logistics-info-list-item">
            <View className="snap-logistics-info-list-item-key">物流公司</View>
            <View className="snap-logistics-info-list-item-word">韵达</View>
          </View>
          <View className="snap-logistics-info-list-item">
            <View className="snap-logistics-info-list-item-key">物流单号</View>
            <View className="snap-logistics-info-list-item-word">123456789987654321</View>
          </View>
        </View>


        <View className="snap-order">
          <View className="snap-title-box">
            <View className='snap-title-left'></View>
            <View className='snap-title'>关联订单</View>
          </View>
          <View className='snap-store'>
            <View className='snap-store-left'>
              <Image className="store-icon1" src="http://oss.tdianyi.com/front/h5mHiFXn7ikmij7SnANwzcKjxPQyidnS.png" />
              <View className="store-num">多美蛋糕店</View>
              <Image className="store-icon2" src="http://oss.tdianyi.com/front/2EyBMiQH8N7m6cKa43caZ3B3xwXCR3WF.png" />
            </View>
            <View className='snap-store-right'>下单时间:2020-10 19:30:30</View>
          </View>
          <View className='snap-gift-content'>
            <Image className="snap-gift-content-img" src="http://oss.tdianyi.com/front/h5mHiFXn7ikmij7SnANwzcKjxPQyidnS.png" />
            <View className='snap-gift-content-right'>
              <View className='snap-gift-content-right-left'>
                <View className='snap-gift-content-right-left-top'>此页面未作省略此页面未作省略此页面未作省略此页面未作省略此页面未作省略</View>
                <View className='snap-gift-content-right-left-bottom'>
                  <View className='snap-gift-content-right-left-bottom-key'>消费金额：</View>
                  <View className='snap-gift-content-right-left-bottom-icon'>￥</View>
                  <View className='snap-gift-content-right-left-bottom-num'>80.00</View>
                </View>
              </View>
              <View className='snap-gift-content-right-right'>未核销</View>
            </View>
          </View>
        </View>

        <View className="snap-order">
          <View className="snap-title-box">
            <View className='snap-title-left'></View>
            <View className='snap-title'>核销记录</View>
          </View>
          <View className='snap-verification-time'>核销时间:2020-10 19:30:30</View>
          <View className='snap-gift-content2'>
            <Image className="snap-gift-content-img" src="http://oss.tdianyi.com/front/h5mHiFXn7ikmij7SnANwzcKjxPQyidnS.png" />
            <View className='snap-gift-content-right'>
              <View className='snap-gift-content-right-left'>
                <View className='snap-gift-content-right-left-top'>此页面未作省略此页面未作省略此页面未作省略此页面未作省略此页面未作省略</View>
                <View className='snap-gift-content-right-left-middle'>订单号：cchhchchh03231</View>
                <View className='snap-gift-content-right-left-bottom'>
                  <View className='snap-gift-content-right-left-bottom-key'>消费金额：</View>
                  <View className='snap-gift-content-right-left-bottom-icon'>￥</View>
                  <View className='snap-gift-content-right-left-bottom-num'>80.00</View>
                </View>
              </View>
              <View className='snap-gift-content-right-right'>未核销</View>
            </View>
          </View>
        </View>
        <View className="snap-order-btn-box">
          <View className="snap-order-btn">立即使用</View>
        </View>
        <View className="snap-order-btn-box">
          <View className="snap-order-btn">物流信息</View>
        </View>

        {
          this.state.showCode ? <View className="tips-mask">
            <View className='code-content'>
              <Image className='code-img' src={require('@/assets/member/code.jpg')} />
              <View className='code-use-text'> 商家扫码核销进行使用</View>
              <Image className='code-close' src={require('@/assets/member/close.png')} onClick={() => { this.setState({ showCode: false }) }} />
            </View>
          </View> : null
        }


        {/* {
          this.state.ApeakerlogisticsContentShow ?
            <View className={"ApeakerlogisticsContent"} onClick={() => { this.setState({ ApeakerlogisticsContentShow: false }) }} >
              <View className={"ApeakerlogisticsContentBox"} onClick={(e) => { e.stopPropagation() }}>
                <View className={"Apeakerlogisticspages"}>
                  <View className={"ApeakerlogisticsContentBoxTop"}>
                    <Image className={"topInfoBox-img"} src={'http://oss.tdianyi.com/' + this.state.expGiftImg} />
                    <View className={"InfoContent"}>
                      <View className={"InfoName"}>{this.state.expGiftName}</View>
                      <View className={"InfoCompany"}>物流快递:{this.state.expName}</View>
                      <View className={"InfoNumber"}>快递单号:{this.state.expNumber}
                        <Image className={"InfoNumber-img"} src='http://oss.tdianyi.com/front/AeDfZdwfppksiMzNKwxK8e2K5DEfsbpp.png' />
                      </View>
                    </View>
                  </View>
                  <View className={"ApeakerlogisticsContentBoxBottom"}>
                    <View className={"BottomContent"}>
                      {
                        explist.length ? explist.map((item: any, index: any) => {
                          return (
                            <View className={"adderessItem"} key={index}>
                              <View className={"adderessItemTime-img-area"}>
                                {
                                  deliverystatus == '3' && index == 0 ? <Image className={"adderessItemTime-red"} src='http://oss.tdianyi.com/front/6NEZBSt27xps2Mr6GjsRzGA4f7NXSmyQ.png' />
                                    : ((deliverystatus == '3' && index == 1) || (deliverystatus != '3' && index == 0) ? <Image className={"adderessItemTime-img"} src='http://oss.tdianyi.com/front/TtSZSBCcajzFeSkmQ8TrBaiYhAcAQwyc.png' />
                                      : null)
                                }
                              </View>                                        <View className={"adderessItemTime"}>
                                <View className={"ItemTime"}>{dayjs(item.time).format('HH:mm')}</View>
                                <View className={"ItemDate"}>{dayjs(item.time).format('MM-DD')}</View>
                              </View>
                              <View className={"adderessItemMsg"}>{item.status}</View>
                            </View>
                          )
                        }) : null
                      }
                    </View>
                  </View>
                </View>
                <View className="ApeakerlogisticsIcon" onClick={() => { this.setState({ ApeakerlogisticsContentShow: false }) }} >
                  <Image className="ApeakerlogisticsIcon-img" src='http://oss.tdianyi.com/front/m5ZnPzzxbKxPtnHtx8xEz62QN6jfcxiB.png' />
                </View>
              </View>
            </View> : null
        } */}

      </View>
    );
  }
}
