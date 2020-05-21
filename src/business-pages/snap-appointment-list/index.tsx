import Taro, { Component } from "@tarojs/taro";
import { AtIcon } from 'taro-ui';
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import ApplyToTheStore from '@/components/applyToTheStore';
import './index.less'

export default class AppointmentSnap extends Component {
    config = {
        navigationBarTitleText: "现金券",
        enablePullDownRefresh: false
    };

    state = {
        appointmentCurrent: 0,
    }

    changeTab = (current: number) => {
        this.setState({ appointmentCurrent: current })
    }

    render() {
        const appointmentTab = ['已开抢', '即将开始', '已结束'];
        const { appointmentCurrent } = this.state;
        return (
            <View className="appointment-gift">
                <View className="appointment-tab-ul">
                    <View className="appointment-tab-ul-box">
                        {
                            appointmentTab.map((item: any, index: any) => {
                                return (
                                    <View className="appointment-tab-li" key={index} onClick={this.changeTab.bind(this, index)}>
                                        <View className={appointmentCurrent == index ? "appointment-tab-word-select " : "appointment-tab-word"}>{item}</View>
                                        {
                                            appointmentCurrent == index ? <View className="appointment-tab-line"></View> : null
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
                <View className="appointment-content">


                    <View className="snap-ltem">
                        <Image className="snap-item-img" src={"http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png"} />
                        <View className="snap-ltem-content">
                            <View className="snap-ltem-title">2人拼团抢汽车美容一套服拼团抢汽 车美容一套服务服务服务车美容一套服务服务服务服务</View>

                            <View className="appointment-list-info-box">
                                <View className="appointment-list-info-right">
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
                            <View className="snap-up-btn-yellow">取消预约</View>
                        </View>
                    </View>

                    <View className="snap-ltem">
                        <Image className="snap-item-img" src={"http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png"} />
                        <View className="snap-ltem-content">
                            <View className="snap-ltem-title">2人拼团抢汽车美容一套服拼团抢汽 车美容一套服务服务服务车美容一套服务服务服务服务</View>

                            <View className="appointment-list-info-box">
                                <View className="appointment-list-info-right">
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

                            <View className="appointment-list-info-box">
                                <View className="appointment-list-info-right">
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
                            <View className="snap-up-btn-grey">已结束</View>
                        </View>
                    </View>

                </View>



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
