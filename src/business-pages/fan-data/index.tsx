import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";

export default class Member extends Component {
    config = {
        navigationBarTitleText: "粉丝数据",
        enablePullDownRefresh: false
    };
    state = {
        fanTabIndex: 0,
        noData: false,
    }

    render() {
        return (
            <View className="fan-data-page">
                {
                    this.state.noData ? <View className="fan-nodata-box">
                        <View className="fan-nodata">
                            <Image className="fan-nodata-img" src="http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png" />
                            <View className="fan-nodata-info">暂无邀请店铺，快去逛逛吧！</View>
                        </View>
                    </View> : null
                }



                {
                    this.state.fanTabIndex == 2 || this.state.fanTabIndex == 3 ? <View className="fan-nodata-box">
                        <View className="fan-nodata">
                            <Image className="fan-nodata-img" src="http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png" />
                            <View className="fan-nodata-info">暂无邀请店铺，快去逛逛吧！</View>
                        </View>
                    </View> : null
                }

                <View className="fan-data-page-tabBar">
                    <View className="fan-data-page-tabBar-item" onClick={() => this.setState({ fanTabIndex: 0 })}>
                        <View className={this.state.fanTabIndex == 0 ? "fan-data-page-tabBar-item-words-select" : "fan-data-page-tabBar-item-words"}>注册会员</View>
                        <View style={{ opacity: this.state.fanTabIndex == 0 ? 1 : 0 }} className="fan-data-page-tabBar-item-lines"> </View>
                    </View>
                    <View className="fan-data-page-tabBar-item" onClick={() => this.setState({ fanTabIndex: 1 })}>
                        <View className={this.state.fanTabIndex == 1 ? "fan-data-page-tabBar-item-words-select" : "fan-data-page-tabBar-item-words"}>直属创客</View>
                        <View style={{ opacity: this.state.fanTabIndex == 1 ? 1 : 0 }} className="fan-data-page-tabBar-item-lines"> </View>
                    </View>
                    <View className="fan-data-page-tabBar-item" onClick={() => this.setState({ fanTabIndex: 2 })}>
                        <View className={this.state.fanTabIndex == 2 ? "fan-data-page-tabBar-item-words-select" : "fan-data-page-tabBar-item-words"}>总创客</View>
                        <View style={{ opacity: this.state.fanTabIndex == 2 ? 1 : 0 }} className="fan-data-page-tabBar-item-lines"> </View>
                    </View>
                    <View className="fan-data-page-tabBar-item" onClick={() => this.setState({ fanTabIndex: 3 })}>
                        <View className={this.state.fanTabIndex == 3 ? "fan-data-page-tabBar-item-words-select" : "fan-data-page-tabBar-item-words"}>邀请店铺</View>
                        <View style={{ opacity: this.state.fanTabIndex == 3 ? 1 : 0 }} className="fan-data-page-tabBar-item-lines"> </View>
                    </View>
                </View>

                <View className="fan-data-page-content">


                    {
                        this.state.fanTabIndex == 0 ? <View className="fan-data-member">
                            <Image className="fan-data-member-left" src="http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png" />
                            <View className="fan-data-member-right">
                                <View className="fan-data-member-item">
                                    <View className="fan-data-member-key">昵称：</View>
                                    <View className="fan-data-member-words">小熊敬礼普通用户</View>
                                </View>
                                <View className="fan-data-member-item">
                                    <View className="fan-data-member-key">注册时间：</View>
                                    <View className="fan-data-member-words">2020-01-25</View>
                                </View>
                            </View>
                        </View> : null
                    }
                    {
                        this.state.fanTabIndex == 0 ? <View className="fan-data-member">
                            <Image className="fan-data-member-left" src="http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png" />
                            <View className="fan-data-member-right">
                                <View className="fan-data-member-item">
                                    <View className="fan-data-member-key">昵称：</View>
                                    <View className="fan-data-member-words">小熊敬礼普通用户</View>
                                </View>
                                <View className="fan-data-member-item">
                                    <View className="fan-data-member-key">注册时间：</View>
                                    <View className="fan-data-member-words">2020-01-25</View>
                                </View>
                            </View>
                        </View> : null
                    }



                    {
                        this.state.fanTabIndex == 1 ? <View className="fan-data-store">
                            <Image className="fan-data-member-left" src="http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png" />
                            <View className="fan-data-member-right">
                                <View className="fan-data-member-item">
                                    <View className="fan-data-member-key">昵称：</View>
                                    <View className="fan-data-member-words">小熊敬礼普通用户</View>
                                </View>
                                <View className="fan-data-member-item-box-row">
                                    <View className="fan-data-member-item-row">
                                        <View className="fan-data-member-key-row">今日销售收益：</View>
                                        <View className="fan-data-member-words-row">100.00</View>
                                    </View>
                                    <View className="fan-data-member-item-row">
                                        <View className="fan-data-member-key-row">注册时间：</View>
                                        <View className="fan-data-member-words-row">2020-01-25</View>
                                    </View>
                                </View>
                                <View className="fan-data-member-item">
                                    <View className="fan-data-member-key">总销售收益：</View>
                                    <View className="fan-data-member-words">2020-01-25</View>
                                </View>
                                <View className="fan-data-member-item">
                                    <View className="fan-data-member-key">我今日获得平台奖励：</View>
                                    <View className="fan-data-member-words">1000.00</View>
                                </View>
                            </View>
                        </View> : null
                    }
                    {
                        this.state.fanTabIndex == 1 ? <View className="fan-data-store">
                            <Image className="fan-data-member-left" src="http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png" />
                            <View className="fan-data-member-right">
                                <View className="fan-data-member-item">
                                    <View className="fan-data-member-key">昵称：</View>
                                    <View className="fan-data-member-words">小熊敬礼普通用户</View>
                                </View>
                                <View className="fan-data-member-item-box-row">
                                    <View className="fan-data-member-item-row">
                                        <View className="fan-data-member-key-row">今日销售收益：</View>
                                        <View className="fan-data-member-words-row">100.00</View>
                                    </View>
                                    <View className="fan-data-member-item-row">
                                        <View className="fan-data-member-key-row">注册时间：</View>
                                        <View className="fan-data-member-words-row">2020-01-25</View>
                                    </View>
                                </View>
                                <View className="fan-data-member-item">
                                    <View className="fan-data-member-key">总销售收益：</View>
                                    <View className="fan-data-member-words">2020-01-25</View>
                                </View>
                                <View className="fan-data-member-item">
                                    <View className="fan-data-member-key">我今日获得平台奖励：</View>
                                    <View className="fan-data-member-words">1000.00</View>
                                </View>
                            </View>
                        </View> : null
                    }


                </View>


            </View>
        );
    }
}
