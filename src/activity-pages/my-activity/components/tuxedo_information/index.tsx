import Taro, { Component } from "@tarojs/taro"
import request from '../../../../services/request'
import "./index.styl"
// import { spawn } from "child_process"
import TimeUp from '../../../../pages/activity/group/TimeUp'
import wx from 'weixin-js-sdk';
// import QRCode from 'qrcode'
import { AtCurtain, AtButton } from 'taro-ui'
import { Block, View, Image, Text, Button } from "@tarojs/components"
import Qrcode from "./Qrcode"
export default class TuxedoInformation extends Component<any> {

  state = {
    listData: [],
    codeImg: '',
    isOpened: false,
    my_share: ''
  }

  componentDidMount() {
    this.clearTimeOut()

    request({
      url: 'api/wap/user/getMeGroupList',
      method: "GET"
    })
      .then((res: any) => {
        if (res.code === 200) {
          let meta: any = []
          res.data.map((item: any) => {
            // .filter(item =>item.number- item.participation_number < 5)
            let head_list = item.head_list
            let length = item.number - item.participation_number

            for (let index = 0; index < length; index++) {
              head_list.push('http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/S24YwKYiSj3x5bSEQeps6bW2MwmcKkhR.png')
            }
            if(head_list.length>5){
              head_list.length =5
            }
            item['head_list_img'] = head_list

            meta.push(item)
            
          })
          this.setState({ listData: meta })
        }
      })

  }

  clearTimeOut = () => {
    var end = setTimeout(function () { }, 1);
    var start = (end - 100) > 0 ? end - 100 : 0;
    for (var i = start; i <= end; i++) {
      clearTimeout(i);
    }
  }

  againGroup = (youhui_id, gift_id, activity_id) => {
    Taro.navigateTo({
      url: '/pages/activity/group/index?id=' + youhui_id + '&type=5&gift_id=' + gift_id + '&activity_id=' + activity_id
    })

  }

  shopDetails = (location_id) => {
    Taro.navigateTo({
      url: '/pages/business/index?id=' + location_id
    })
  }

  routerShare = (id, e) => {
    Taro.navigateTo({
      url: '/pages/activity/pages/group/group?id=' + id
    })
    e.stopPropagation()
  }

  //使用卡券
  userCard = (data) => {
    var imgData = Qrcode.createQrCodeImg(JSON.stringify(data))
    this.setState({ codeImg: imgData, isOpened: true })
  }

  handleChange() {
    this.setState({
      isOpened: true
    })
  }
  onClose() {
    this.setState({
      isOpened: false
    })
  }



  render() {

    const { listData, my_share } = this.state

    return (
      <View className="tuxedo_box">
        {
          listData.map((item: any, index: number) => {
            return <View className="message" >
              <View className="tuxedo_title" onClick={this.shopDetails.bind(this, item.location_id)}>
                <Image src={require('../../../../assets/shop_head.png')} />
                <View className="title_right" >{item.supplier_name}
                </View>
              </View>
              <View className="tuxedo_content" onClick={this.againGroup.bind(this, item.youhui_id, item.gift_id, item.activity_id)}>
                <View className="message_left">
                  <Image src={item.image} />
                </View>
                <View className="message_right">
                  <View className="full_name">
                    <Text>{item.name}</Text>
                  </View>
                  <View className="residue_time">
                    {
                      item.end_at == '' && item.number !== item.participation_number || item.number !== item.participation_number && new Date(item.end_at).getTime()
                        <= new Date().getTime() ? <View className="failure">拼团失败</View> : null
                    }
                    {
                      item.number === item.participation_number ? <View>拼团成功</View> : null
                    }

                    {
                      item.number !==
                        item.participation_number && new Date(item.end_at).getTime()
                        > new Date().getTime() ? <View>剩余时间</View> : null
                    }
                    {
                      item.number !==
                        item.participation_number && new Date(item.end_at).getTime()
                        > new Date().getTime() ? <TimeUp itemtime={item.end_at} /> : null
                    }
                  </View>
                  <View className="group">
                    <View className="group_left">
                      <Image src={item.cover_image} />
                    </View>
                    <View className="group_right">
                      <View className="original_price">原价：￥{item.pay_money}</View>
                      <View className="group_price">
                        <Text>拼团价：</Text>
                        <Text>￥{item.participation_money}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View className="foot">
                <View className="left">
                  {
                    item.head_list_img.length>0 && item.head_list_img.map((item2: any, index2: number) => {
                     return <View className={index2 == 0 ? '' : 'tuxedo_people'} style={{ zIndex: 1+index2 }}>
                       <View className={!index2 ? 'user_head' :'no_user_head'}>
                          <Image src={item2} />
                        </View>
                        {index2 == 0 ? <Text>团长</Text> : null}
                      </View>
                    })
                  }
                </View>
                <View className="right">
                  {
                    item.number !==
                      item.participation_number && new Date(item.end_at).getTime()
                      > new Date().getTime() ? <View className="invite" onClick={this.routerShare.bind(this, item.id)}>邀好友参团</View> : null
                  }

                  {
                    item.number ==
                      item.participation_number &&
                      new Date(item.youhui_end_time).getTime()
                      > new Date().getTime() ? <View className="userCoupon" onClick={this.userCard.bind(this, item.qr_code)}>使用卡券</View> : null
                  }
                  {
                    item.end_at == '' || item.number == item.participation_number
                      && new Date(item.youhui_end_time).getTime()
                      <= new Date().getTime() ? <View className="invalid" onClick={this.userCard.bind(this, item.qr_code)}>卡券已过期</View> : null
                  }

                  {
                    new Date(item.active_end_time).getTime() < new Date().getTime() ? <View className="invalid">活动已过期</View> : null

                  }
                  {

                    item.number > item.participation_number && new Date(item.active_end_time).getTime() > new Date().getTime() && new Date(item.end_at).getTime() < new Date().getTime() ? <View className="userCoupon"
                      onClick={this.againGroup.bind(this, item.youhui_id, item.gift_id, item.activity_id)}>再次拼团</View> : null
                  }

                </View>
              </View>
            </View>
          })
        }

        <AtCurtain
          isOpened={this.state.isOpened}
          onClose={this.onClose.bind(this)}
        >
          <View className="user_prompt_box">
            <View className="user_prompt">商家扫码/输码验证即可消费</View>
            <Image
              src={this.state.codeImg}
            />
          </View>
        </AtCurtain>

      </View>
    )
  }
}