import Taro, { Component, Config } from '@tarojs/taro'
import {
  ScrollView, View, Block,
  Image,
} from '@tarojs/components'
import { AtIcon } from 'taro-ui';
import carousel from "@/static/images/img_carousel.png"
import "./activity.styl"

interface State {
  tabDistanceTop: any,
  tabStyle: {
    width: String,
    height: String,
    backgroundColor: String
  },
  vStyleB: {
    height: String,
    backgroundColor: String
  }
}

export default class Activity extends Component {
  constructor() {
    super(...arguments)
  }

  config: Config = {
    navigationBarTitleText: "活动中心",
    enablePullDownRefresh: true
  }

  state: State = {
    tabDistanceTop: 0,
    tabStyle: {
      width: '100%',
      height: '50px',
      backgroundColor: 'rgb(26, 173, 25)'
    },
    vStyleB: {
      height: '350px',
      backgroundColor: 'rgb(39,130,215)'
    }
  }

  componentDidMount = () => {

    // 获取Tab栏距离的高度后再进去滚动时悬浮Tab栏
    const query = this.refs.tab.boundingClientRect()
    query.exec(res => {
      this.setState({
        tabDistanceTop: res[0].top
      })
    })

  }

  onPullDownRefresh = () => {
    console.log('aa')
  }


  onScrollToUpper(e) {
    console.log(e.detail)
  }

  onScroll(e) {
    // console.log(e.detail)
    if (e.detail.scrollTop >= this.state.tabDistanceTop) {
      this.setState({
        tabStyle: {
          ...this.state.tabStyle,
          position: 'fixed',
          top: 0
        },
        vStyleB: {
          ...this.state.vStyleB,
          marginTop: '50px'
        }
      })
    } else {
      this.setState({
        tabStyle: {
          ...this.state.tabStyle,
          position: 'static'
        },
        vStyleB: {
          ...this.state.vStyleB,
          marginTop: '0px'
        }
      })
    }
  }

  /**
   * 搜索
   */
  handleSearch = () => {
    Taro.navigateTo({ url: '../index/search/index' });
  }

  render() {
    const scrollStyle = {
      height: '100vh'
    }
    const scrollTop = 0
    const Threshold = 20
    // const vStyleA = {
    //   height: '350px',
    //   'background-color': 'rgb(26, 173, 25)'
    // }
    // const vStyleB = {
    //   height: '350px',
    //   'background-color': 'rgb(39,130,215)'
    // }
    const vStyleC = {
      height: '350px',
      'background-color': 'red',
      color: '#333'
    }
    return (
      // <Block>
         <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
          style={scrollStyle}
          lowerThreshold={Threshold}
          upperThreshold={Threshold}
          onScrollToUpper={this.onScrollToUpper.bind(this)} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
          onScroll={this.onScroll}
        >
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
            <Image background-size="cover" src={carousel} className="area-banner" />
          </View>
          <View style={this.state.tabStyle} ref="tab">A</View>
          <View style={this.state.vStyleB}>B</View>
          <View style={vStyleC}>C</View>
          <View style={this.state.vStyleB}>B</View>
          <View style={vStyleC}>C</View>
          <View style={this.state.vStyleB}>B</View>
          <View style={vStyleC}>C</View>
        </ScrollView>
       
      // </Block>

    )
  }
}