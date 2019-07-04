import Taro, { Component, getApp } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { AtSearchBar, AtIcon, AtIndexes } from "taro-ui";
import "./index.styl";
import request from '../../services/request'
export default class SelectCity extends Component {

  state = {
    value: '',
    locationList: [],
    locationPosition: { longitude: 1, latitude: 1 },//存储获取到的地理位置
    city: '',
    cityObject: ['上海市', '杭州市', '北京市', '广州市', '天津市', '南京市', '武汉市', '苏州市', '福州市'],
    allCity: []
  };

  constructor(props) {
    super(props);//把this轉會
    this.getLocation();
    this.allCity();
  }

  componentWillMount() {

  }

  // 获取经纬度  和 城市
  getLocation = () => {
    Taro.getLocation({ type: 'wgs84' }).then(res => {
      this.setState({ locationPosition: res }, () => {
        this.getCity()
      })
    })
  }

  // 获取当前城市
  getCity() {
    let that = this.state.locationPosition
    request({
      url: 'v3/city_name',
      data: {
        xpoint: that.longitude, ypoint: that.latitude
      }
    })
      .then((res: any) => {
        this.setState({ city: res.city })
      })
  }

  // 获取所有城市
  allCity = () => {
    this.requestLoading()
    Taro.getStorage({ key: 'city' })
      .then(res => {
        this.setState({ allCity: res.data }, () => {
          setTimeout(() => {
            Taro.hideLoading()
          }, 3000);
        })
      })
  }



  // 加载状态
  requestLoading = () => {
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
  }

  // 跳转回首页
  onClick = (item) => {
    Taro.reLaunch(
      { url: '../../pages/index/index?id=' + item.id }
    )
  }

  render() {
    return (
      <View className="search-wrap" style="height:100vh;">
        <AtIndexes
          list={this.state.allCity}
          isVibrate={false}
          animation={true}
          onClick={this.onClick.bind(this)}
          topKey={'#'}
        >
          <View className="current-tip">当前定位</View>
          <View className="current-position flex center">
            <AtIcon value="map-pin" color="#FF6654" size={12} />
            <View className="item name">{this.state.city ? this.state.city : '广州市'}</View>
            <View className="btn" onClick={this.getLocation.bind(this)}>重新定位</View>
          </View>
          <View className="bg" />
          <View className="current-tip">当前定位</View>
          <View className="big-item">
            {
              this.state.cityObject.map((item, index) => {
                return <View className="item" key={index}>{item}</View>
              })
            }
          </View>
        </AtIndexes>
      </View>
    );
  }
}
