import Taro, { Component, Config } from "@tarojs/taro";
import { View, Swiper, SwiperItem, Input, Image } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import "./index.styl";
import Tabs from "../../components/tabs";
import request from "../../services/request";
import ActivityList from "src/components/activity/list";

export default class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "团卖物联"
  };

  state = {
    searchValue: "",
    storeList: [],
  };

  componentWillMount () {
    this.requestIndexData()
  }

  getPosition() {
    Taro.getLocation().then((res) => console.log(res));
  }

  handleSearchChange() {}
  showSelectCity() {
    Taro.navigateTo({ url: "/business-pages/select-city/index" });
  }

  requestIndexData = () => {
    request({url: 'v3/stores'}).then((res: any)=> this.setState({storeList: res.store_info.data}))
  }

  handleActivityClick = () => {}

  render() {
    const list = ["全部", "关注", "丽人", "餐饮", "休闲", "服饰"];
    return (
      <View className="index">
        <View className="head">
          <View className="search">
            <View className="flex center container">
              <View className="city" onClick={this.showSelectCity}>
                广州
              </View>
              <AtIcon
                onClick={this.showSelectCity}
                className="chevron-down"
                value="chevron-down"
                color="#313131"
                size="12"
              />
              <View className="long-string" />
              <AtIcon
                className="search-icon"
                value="search"
                color="#666666"
                size={14}
              />
              <Input
                className="item search-input"
                type="text"
                placeholder="请输入商家名、品类"
                value={this.state.searchValue}
                onInput={this.handleSearchChange.bind(this)}
              />
            </View>
          </View>
          <Swiper
            className="swiper"
            indicatorColor="#999"
            indicatorActiveColor="#333"
            circular
            indicatorDots
            autoplay
          >
            <SwiperItem>
              <View className="demo-text-1">1</View>
            </SwiperItem>
            <SwiperItem>
              <View className="demo-text-2">2</View>
            </SwiperItem>
            <SwiperItem>
              <View className="demo-text-3">3</View>
            </SwiperItem>
          </Swiper>
        </View>
        <View className="menus flex">
          <View className="item">
            <Image
              mode="widthFix"
              className="img"
              src={require("./menu-2.png")}
            />
          </View>
          <View className="item">
            <Image
              mode="widthFix"
              className="img"
              src={require("./menu-2.png")}
            />
          </View>
        </View>
        <Tabs list={list} onChange={this.handleSearchChange.bind(this)} />
        <ActivityList list={this.state.storeList} onClick={this.handleActivityClick}></ActivityList>
      </View>
    );
  }
}
