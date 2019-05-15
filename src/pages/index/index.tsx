import Taro, { Component, Config } from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import {} from "taro-ui";
import "./index.styl";

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

  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}
  componentDidShow() {}
  componentDidHide() {}

  getPosition() {
    Taro.getLocation().then((res) => console.log(res));
  }

  render() {
    return (
      <View className="index">
        <View className="head">
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
      </View>
    );
  }
}
