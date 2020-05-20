import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { getRelationChain, getStoreList } from './service'
export default class Member extends Component {
    config = {
        navigationBarTitleText: "小熊抢购",
        enablePullDownRefresh: false
    };
    state = {
        current: 0
    }

    changeTab = (current: number) => {
        this.setState({ current })
    }

    render() {
        const tabList = ['疯抢中', '即将开始', '即将售罄']
        const { current } = this.state;
        return (
            <View className="snap-activity-list">
                <View id="preloader1"></View>
                <View id="preloader2"></View>
                <Image mode="widthFix" className="snap-banner" src="http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png" />
                <View className={current == 1 ? "snap-tab1" : current == 2 ? "snap-tab2" : "snap-tab0"}>
                    {
                        tabList.map((item: any, index: number) => { return (<View onClick={this.changeTab.bind(this, index)} className={index == this.state.current ? "snap-tab-item1" : "snap-tab-item2"} key={index}>{item}</View>) })
                    }
                </View>
                <View className="snap-list-content">
                    <View className="snap-ltem">
                        <Image className="snap-item-img" src={"http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png"} />
                        <View className="snap-ltem-content">
                            <View className="snap-ltem-title">2人拼团抢汽车美容一套服拼团抢汽 车美容一套服务服务服务车美容一套服务服务服务服务</View>
                            <View className="snap-list-label-list">
                                <View className="snap-list-label">最多可省￥12.68</View>
                            </View>
                            <View className="snap-list-info-box">
                                {/* <View className="snap-list-info-left">
                                    <View className="snap-progress-background">
                                        <View className="snap-progress-now">已抢1942</View>
                                    </View>
                                </View> */}
                                <View className="snap-list-info-right">
                                    <Image className="distance-icon" src={"http://oss.tdianyi.com/front/H8s52XJtYBy7DG3pmteCXGtJHE7JHT3W.png"} />
                                    <View className="distance-num">2.6km</View>
                                </View>

                            </View>
                            <View className="snap-up-price">
                                <View className="snap-up-info">
                                    <View className="snap-up-info-text">￥</View>
                                    <View className="snap-up-info-new">12242.00</View>
                                    <View className="snap-up-info-old">￥33300.00</View>
                                </View>
                            </View>
                            <View className="snap-up-btn-red">马上抢</View>
                        </View>
                    </View>


                    <View className="snap-ltem">
                        <Image className="snap-item-img" src={"http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png"} />
                        <View className="snap-ltem-content">
                            <View className="snap-ltem-title">2人拼团抢汽车美容一套服拼团抢汽 车美容一套服务服务服务车美容一套服务服务服务服务</View>
                            <View className="snap-list-label-list">
                                <View className="snap-list-label">最多可省￥12.68</View>
                            </View>
                            <View className="snap-list-info-box">
                                {/* <View className="snap-list-info-left">
                                    <View className="snap-progress-background">
                                        <View className="snap-progress-now">已抢1942</View>
                                    </View>
                                </View> */}
                                <View className="snap-list-info-right">
                                    <Image className="distance-icon" src={"http://oss.tdianyi.com/front/H8s52XJtYBy7DG3pmteCXGtJHE7JHT3W.png"} />
                                    <View className="distance-num">2.6km</View>
                                </View>

                            </View>
                            <View className="snap-up-price">
                                <View className="snap-up-info">
                                    <View className="snap-up-info-text">￥</View>
                                    <View className="snap-up-info-new">12242.00</View>
                                    <View className="snap-up-info-old">￥33300.00</View>
                                </View>
                            </View>
                            <View className="snap-up-btn-yellow">预约抢购</View>
                        </View>
                    </View>

                </View>



                {/* <View className="mask">
                    <View className="tips-box">
                        <View className="tips-title">预约抢购</View>
                        <View className="tips-info">请先登录，登录成功才可预约抢购 预约后平台会提前15分钟提醒您抢购哦</View>
                        <View className="tips-btn-box">
                            <View className="tips-btn-box-btn1">去登录</View>
                        </View>
                        <View className="tips-btn-box">
                            <View className="tips-btn-box-btn2">残忍离开</View>
                            <View className="tips-btn-box-btn3">继续购买</View>
                        </View>
                    </View>
                </View> */}

                {/* <View className="snap-nodata-box">
                    <View className="snap-nodata">
                        <Image className="snap-nodata-img" src="http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png" />
                        <View className="snap-nodata-info">暂无预约，快去逛逛吧</View>
                    </View>
                </View> */}

            </View>
        );
    }
}
