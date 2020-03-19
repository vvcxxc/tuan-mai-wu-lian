import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.less";
import request from '../../services/request'
import ActivityItem from '@/components/activity-item'
import { getList } from './service'



export default class ActivityList extends Component {
  config = {
    navigationBarTitleText: "",
    enablePullDownRefresh: false
  };


  state = {
    list: [],
    page: 1
  };

  componentDidShow() {
    let id = this.$router.params.id
    switch (id) {
      case 1:
        Taro.setNavigationBarTitle({ title: '网红店推荐活动列表' })
        break
      case 2:
        Taro.setNavigationBarTitle({ title: '低到爆活动列表' })
        break
      case 3:
        Taro.setNavigationBarTitle({ title: '抢得快活动列表' })
        break
      case 4:
        Taro.setNavigationBarTitle({ title: '值得购活动列表' })
        break
      case 5:
        Taro.setNavigationBarTitle({ title: '品牌连锁推荐活动列表' })
        break
    }
    Taro.getLocation({
      type: 'gcj02',
      success: res => {
        let data = {
          xpoint: res.longitude,
          ypoint: res.latitude,
          channel_id: id,
          page: 1,
          from: 'detail'
        }
        getList(data).then(res => {
          this.getNewList(res.data.data)
        })
      },
      fail: err => {
        let data = {
          xpoint: '',
          ypoint: '',
          channel_id: id,
          page: 1,
          from: 'detail'
        }
        getList(data).then(res => {
          this.getNewList(res.data.data)
        })
      }
    })

  }

  // 变历数组
  getNewList(arr) {
    console.log(arr)
    let list = []
    console.log(list)
    arr.map(res => {
      let { is_share } = res
      if (is_share == 1) {
        // 增值
        console.log(111)
        res.activity_type = 'appre'
      } else if (is_share == 4) {
        // 现金券兑换券
        console.log(222)
        if (res.youhui_type) {
          // 现金券
          res.activity_type = 'cash'
        } else {
          // 兑换券
          res.activity_type = 'goods'
        }
      } else if (is_share == 5) {
        // 拼团
        console.log(333)
        res.activity_type = 'group'
      }
      list.push(res)
    })

    this.setState({ list })
  }


  render() {
    const { list } = this.state
    return (
      <View className="activity-list">
        <View className="activity-banner">
          {/* <Image className="activity-banner-img" src="http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png" /> */}
          <Image className="activity-banner-img" src="http://oss.tdianyi.com/front/2tp2Gi5MjC47hd7mGBCjEGdsBiWt5Wec.png" />
        </View>
        <View className="activity-content">
          {
            list.map(item => {
              return (
                <View className="activity-item-padding">
                  <View className="store-info">
                    <View className="store-name-info">
                      <Image className="item-shop-icon" src="http://oss.tdianyi.com/front/JhGtnn46tJksAaNCCMXaWWCGmsEKJZds.png" />
                      <View className="item-store-name">多美蛋糕店</View>
                      <Image className="item-go-icon" src="http://oss.tdianyi.com/front/fpsw5CyhYJQTDEABZhs4iFDdC48ZGidn.png" />
                    </View>
                    <View className="store-distance">3000m</View>
                  </View>
                  <ActivityItem
                    imgIconType={item.activity_type}
                    img={'http://oss.tdianyi.com/' + item.icon}
                    label={''}
                    name={item.name}
                    brief={'有效期：7天有效'}
                    oldPrice={item.is_share == 5 ? item.participation_money : item.pay_money}
                    newPrice={item.is_share == 5 ? item.pay_money : item.return_money}
                    btnText={'拼团'}
                    handleClick={() => { }}
                  />
                </View>
              )
            })
          }


          {/* <View className="activity-item-padding">

            <View className="store-info">
              <View className="store-name-info">
                <Image className="item-shop-icon" src="http://oss.tdianyi.com/front/JhGtnn46tJksAaNCCMXaWWCGmsEKJZds.png" />
                <View className="item-store-name">多美蛋糕店</View>
                <Image className="item-go-icon" src="http://oss.tdianyi.com/front/fpsw5CyhYJQTDEABZhs4iFDdC48ZGidn.png" />
              </View>
              <View className="store-distance">3000m</View>
            </View>
            <ActivityItem
              imgIconType={'appre'}
              img={'http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png'}
              longName={'2人拼团抢汽车美容一二三四五六'}
              brief={'有效期：7天有效'}
              oldPrice={'19.99'}
              newPrice={'49.99'}
              btnText={'抢购'}
              unBtnText={'已参与99'}
              handleClick={() => { }}
            />
          </View> */}
        </View>
      </View>
    );
  }
}
