import Taro, { Component, Config } from "@tarojs/taro"
import {
  Block,
  View,
  Swiper,
  SwiperItem,
  Navigator,
  Image,
} from "@tarojs/components"
import { AtIcon } from 'taro-ui';
import { getActivityCenter } from "@/api"
import { activitys } from "./data"
import carousel from "@/static/images/img_carousel.png"
import Coupon from "@/components/coupon/coupon"
import { ACTION_JUMP } from "@/utils/constants"
import { getLocation } from "@/utils/getInfo"
import "./activity.styl"

// import { connect } from "@tarojs/redux"

interface State {
  banner?: any[];
  recommend: any[];
  seckill?: any[];
  menu: number;
}
interface ActivityProps {
  handleChange: any;
}

export default class Activity extends Component<ActivityProps> {
  state: State = {
    recommend: [],
    menu: 0,
  }
  config: Config = {
    navigationBarTitleText: "活动中心",
  }

  /**
   * 搜索
   */
  handleSearch = () => {
    Taro.navigateTo({ url: '../index/search/index' });
  }


  render() {
    const { recommend } = this.state;
    return (
      <Block>
        <View className="activity">
          <View className="head">
            <View className="search">
              <View className="flex center container">
                <View className="long-string" style="margin-right:15px;" />
                <AtIcon className="search-icon" value="search" color="#666666" size={14} />
                <View className="item search-input" onClick={this.handleSearch}>
                  请输入商家/分类或商圈
							</View>
              </View>
            </View>
          </View>
        </View>
      </Block>
    )
  }
}
