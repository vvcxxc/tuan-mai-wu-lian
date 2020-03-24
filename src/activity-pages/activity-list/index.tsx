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
    page: 1,
    is_more: true,
    bannerImg: ''
  };

  componentDidMount() {
    let id = this.$router.params.id;
    let that = this;
    switch (id) {
      case '1':
        Taro.setNavigationBarTitle({ title: '网红店推荐活动列表' });
        console.log(id, this)
        that.setState({ bannerImg: "http://oss.tdianyi.com/front/hSBhjxfpWprBHmJijdaGwtWPfSsJ6X4y.png" });
        break
      case '2':
        Taro.setNavigationBarTitle({ title: '低到爆活动列表' });
        that.setState({ bannerImg: "http://oss.tdianyi.com/front/tTGybaH684mCNzTbidr5YsFAwzQrw2dZ.png" });
        break
      case '3':
        Taro.setNavigationBarTitle({ title: '抢得快活动列表' });
        that.setState({ bannerImg: "http://oss.tdianyi.com/front/rrZEs58MPxi7YPYGh4xY5MHCS6pyCJzG.png" });
        break
      case '4':
        Taro.setNavigationBarTitle({ title: '值得购活动列表' });
        that.setState({ bannerImg: "http://oss.tdianyi.com/front/RkE8pbFxHXB8imKPmmPjTnxxPsHfC8jy.png" });
        break
      case '5':
        Taro.setNavigationBarTitle({ title: '品牌连锁推荐活动列表' });
        that.setState({ bannerImg: "http://oss.tdianyi.com/front/aSFeTMpP5dSFTKX3YAf6xYzFhFzAaDGe.png" });
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
  onReachBottom() {
    if (!this.state.is_more) { // 下一页没数据
      return
    }
    let id = this.$router.params.id
    this.setState({ page: this.state.page + 1 }, () => {
      Taro.getLocation({
        type: 'gcj02',
        success: res => {
          let data = {
            xpoint: res.longitude,
            ypoint: res.latitude,
            channel_id: id,
            page: this.state.page,
            from: 'detail'
          }
          getList(data).then(res => {
            if (res.data.data.length) {
              this.getNewList([...this.state.list, ...res.data.data])
            } else {
              this.setState({ is_more: false })
            }
          })
        },
        fail: err => {
          let data = {
            xpoint: '',
            ypoint: '',
            channel_id: id,
            page: this.state.page,
            from: 'detail'
          }
          getList(data).then(res => {
            if (res.data.data.length) {
              this.getNewList([...this.state.list, ...res.data.data])
            } else {
              this.setState({ is_more: false })
            }
          })
        }
      })
    })

  }

  // 变历数组
  getNewList(arr) {
    let list = []
    arr.map(res => {
      let { is_share } = res
      if (is_share == 1) {
        // 增值
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

  handleAction(item: any) {
    const { is_share } = item
    switch (is_share) {
      case 1:
        // 增值
        Taro.navigateTo({
          url: '/pages/activity/appreciation/index?id=' + item.youhui_id + '&type=1&gift_id=' + item.gift_id + '&activity_id=' + item.activity_id
        })
        break
      case 4:
        // 现金券兑换券
        if (item.youhui_type) {
          // 现金券
          Taro.navigateTo({
            url: '/business-pages/ticket-buy/index?id=' + item.youhui_id
          })
        } else {
          // 兑换券
          Taro.navigateTo({
            url: '/business-pages/set-meal/index?id=' + item.youhui_id
          })
        }
        break
      case 5:
        // 拼团
        Taro.navigateTo({
          url: '/pages/activity/group/index?id=' + item.youhui_id + '&type=5&gift_id=' + item.gift_id + '&activity_id=' + item.activity_id
        })
        break
    }
  }
  handleClick = (_id, e) => {
    Taro.navigateTo({
      url: '/pages/business/index?id=' + _id
    })
  };


  render() {
    const { list } = this.state
    return (
      <View className="activity-list">
        <View className="activity-banner">
          <Image className="activity-banner-img" src={this.state.bannerImg} />
        </View>
        {
          list.length ? <View className="activity-content">
            {
              list.map((item: any) => {
                return (
                  <View className="activity-item-padding">
                    <View className="store-info" onClick={this.handleClick.bind(this, item.store.id)}>
                      <View className="store-name-info">
                        <Image className="item-shop-icon" src="http://oss.tdianyi.com/front/JhGtnn46tJksAaNCCMXaWWCGmsEKJZds.png" />
                        <View className="item-store-name">{item.store.name}</View>
                        <Image className="item-go-icon" src="http://oss.tdianyi.com/front/fpsw5CyhYJQTDEABZhs4iFDdC48ZGidn.png" />
                      </View>
                      <View className="store-distance">{item.store.distance}</View>
                    </View>
                    <ActivityItem
                      imgIconType={item.activity_type}
                      img={'http://oss.tdianyi.com/' + item.icon}
                      label={''}
                      name={item.name}
                      brief={'有效期：' + item.expire_day + '天有效'}
                      oldPrice={item.is_share == 5 ? item.participation_money : item.pay_money}
                      newPrice={item.is_share == 5 ? item.pay_money : item.return_money}
                      btnText={'抢购'}
                      handleClick={this.handleAction}
                      item={item}
                    />
                  </View>
                )
              })
            }
          </View> : null
        }
        {
          !list.length ?
            <View className='list-no-data'>
              <View className='no-data-box'>
                <Image className='no-data-img' src={require('@/assets/index/no-data.png')} />
                <View>暂时没有活动，看看其他吧</View>
              </View>
            </View> : null
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
    );
  }
}
