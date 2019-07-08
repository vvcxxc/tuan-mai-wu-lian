import Taro, { Component, getApp } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { AtSearchBar, AtIcon, AtIndexes, AtActivityIndicator } from "taro-ui";
import "./index.styl";
import request from '../../services/request'
export default class SelectCity extends Component {

  state = {
    value: '',
    locationList: [],
    locations: { longitude: 1, latitude: 1 },//存储地理位置
    cityName: '',
    showLoading: false
  };
  globalData: {
    userInfo: {}
  }

  componentWillMount() {
    this.setState({ showLoading:true})
    this.requestLocation()
    this.requestLoading()
    this.getLocation()
  }
  handlerChange(value) {
    this.setState({ value });
  }

  requestLoading = () => {
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
  }

  requestLocation = () => {
    request({ url: 'v3/district', data: { model_type: '2' } })
      .then((res: any) => {
        this.setState({ locationList: res.city_list }, () => {
          setTimeout(() => { Taro.hideLoading() }, 2000)
        })

      })
  }

  onClick(item, event) {
    Taro.reLaunch({ url: '../../pages/index/index?id=' + item.id + '&lng=' + item.lng + '&lat=' + item.lat })
  }

  // get location
  getLocation = () => {
    Taro.getLocation({ type: 'wgs84' }).then(res => {
      this.setState({ locations: res }, () => {
        this.getCity();
      })
    })
  }

  // get City
  getCity = () => {
    let that = this.state.locations
    request({
      url: 'v3/city_name',
      data: { xpoint: that.longitude, ypoint: that.latitude }
    })
      .then((res: any) => {
        this.setState({ cityName: res.city })
        this.setState({ showLoading: false })
      })
  }


  // agin location
  reLocation = (longitude, latitude) => {
    this.getLocation()
    this.setState({ showLoading: true })
    setTimeout(() => {
      this.setState({ showLoading: false })
    }, 1000);
    
    Taro.reLaunch(
      { url: '../../pages/index/index?locationsX=' + this.state.locations.longitude + '&locationsY=' + this.state.locations.latitude }
    )
  }

  // 搜索
  searchData = (item1) => {
    Taro.reLaunch(
      { url: '../../pages/index/index?search=' + this.state.locations.longitude + '&locationsY=' + this.state.locations.latitude }
    )
  }

  render() {
    const city = ['上海市', '杭州市', '北京市', '广州市', '天津市', '南京市', '武汉市', '苏州市', '福州市']
    return (
      <View className="search-wrap" style="height:100vh;">
        <AtIndexes
          list={this.state.locationList}
          isVibrate={false}
          animation={true}
          onClick={this.onClick.bind(this)}
          topKey={'#'}
        >
          <View className="current-tip">当前定位</View>
          <View className="current-position flex center">
            <AtIcon value="map-pin" color="#FF6654" size={12} />
            <View style={{ display: this.state.showLoading ? '' : 'none' }}>
              <AtActivityIndicator content='加载中...'></AtActivityIndicator></View>
            <View className="item name" style={{ visibility: !this.state.showLoading ? 'visible' : 'hidden' }}>
              {this.state.cityName}
            </View>
            <View className="btn" onClick={this.reLocation.bind(this)}>重新定位</View>
          </View>
          <View className="bg" />
          <View className="current-tip">热门城市</View>
          <View className="big-item">
            {
            }
            {
              city.map((item, index) => {
                return <View className="item" key={index} onClick={this.searchData.bind(this,item)}>{item}</View>
              })
            }
          </View>
        </AtIndexes>
      </View>
    );
  }
}
