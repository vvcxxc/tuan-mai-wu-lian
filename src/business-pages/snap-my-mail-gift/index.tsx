import Taro, { Component } from "@tarojs/taro";
import { AtIcon } from 'taro-ui';
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import ApplyToTheStore from '@/components/applyToTheStore';
import './index.less'

export default class SnapMyMailGift extends Component {
    config = {
        navigationBarTitleText: "我的礼品",
        enablePullDownRefresh: false
    };

    state = {
        appointmentCurrent: 0,//0已发放/1预计发放



    }
    /**
     * 切换0已发放/1预计发放
     */
    changeAppointmentCurrent = (current: any) => {
        this.setState({ appointmentCurrent: current })
    }


    render() {
        const changeAppointmentList = ['已发放', '预计发放'];
        const { appointmentCurrent } = this.state;
        return (
            <View className="snap-my-gift2">
                <View className="snap-gift-tab">
                    <View className="snap-gift-tab-ul">
                        {
                            changeAppointmentList.map((item: any, index: any) => {
                                return (
                                    <View className="snap-gift-tab-li" key={index} onClick={this.changeAppointmentCurrent.bind(this, index)}>
                                        <View className={appointmentCurrent == index ? "snap-gift-title-select" : "snap-gift-title"}>{item}</View>
                                        {appointmentCurrent == index ? <View className="snap-gift-line"></View> : null}
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>

                <View className="snap-gift-content">

                    <View className="snap-gift-item">
                        <View className="gift-coupon-item">
                            <Image className="coupon-item-img" src={"http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png"} />
                            <View className="gift-coupon-item-content">
                                {/* <View className="gift-coupon-item-title-long">海珠区多美蛋糕商品券海珠区多美蛋糕商品券海珠区多美蛋糕商品券</View> */}
                                <View className="gift-coupon-item-title-short">
                                    <View className="title-short-left">海珠区多美蛋糕商品券海珠区</View>
                                    <View className="short-right">还有333天到期</View>
                                </View>
                                <View className="gift-coupon-item-grey-long">2020-10-10 12:33</View>
                                <View className="gift-coupon-item-grey-middle">海珠区多美蛋糕店</View>
                                <View className="gift-distance">
                                    <Image className="distance-icon" src={"http://oss.tdianyi.com/front/H8s52XJtYBy7DG3pmteCXGtJHE7JHT3W.png"} />
                                    <View className="distance-num">2.6km</View>
                                </View>
                            </View>
                        </View>
                    </View>


                    <View className="snap-gift-item">
                        <View className="gift-coupon-item">
                            <Image className="coupon-item-img" src={"http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png"} />
                            <View className="gift-coupon-item-content">
                                <View className="gift-coupon-item-title-middle">
                                    <View className="title-middle-left">海珠区多美蛋糕商品券海珠区海珠区多美蛋糕商品券海珠区</View>
                                    <View className="middle-right">已核销</View>
                                </View>
                                <View className="gift-coupon-item-grey-long">2020-10-10 12:33</View>
                                <View className="gift-coupon-item-grey-middle">海珠区多美蛋糕店海珠区多美蛋糕店海珠区多美蛋糕店</View>
                                <View className="gift-distance">
                                    <Image className="distance-icon" src={"http://oss.tdianyi.com/front/H8s52XJtYBy7DG3pmteCXGtJHE7JHT3W.png"} />
                                    <View className="distance-num">2.6km</View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="snap-gift-item">
                        <View className="gift-coupon-item">
                            <Image className="coupon-item-img" src={"http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png"} />
                            <View className="gift-coupon-item-content-center">
                                <View className="gift-coupon-item-title-long">海珠区多美蛋糕商品券海珠区多美蛋糕商品券海珠区多美蛋糕商品券</View>
                                <View className="gift-coupon-item-grey-long">海珠区多美蛋糕店海珠区多美蛋糕店海珠区多美蛋糕店</View>
                            </View>
                        </View>
                        <View className="gift-store-title">
                            <View className='snap-title-left'></View>
                            <View className='snap-title'>订单信息</View>
                        </View>
                        <View className="gift-coupon-item">
                            <Image className="coupon-item-img" src={"http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png"} />
                            <View className="gift-coupon-item-content">
                                <View className="gift-coupon-item-title-short">
                                    <View className="title-short-left">海珠区多美蛋糕商品券海珠区</View>
                                    <View className="short-right">还有333天到期</View>
                                </View>
                                <View className="gift-coupon-item-grey-long">2020-10-10 12:33</View>
                                <View className="gift-coupon-item-grey-middle">海珠区多美蛋糕店海珠区多美蛋糕店海珠区多美蛋糕店</View>
                                <View className="gift-distance">
                                    <Image className="distance-icon" src={"http://oss.tdianyi.com/front/H8s52XJtYBy7DG3pmteCXGtJHE7JHT3W.png"} />
                                    <View className="distance-num">2.6km</View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="snap-gift-item">
                        <View className="gift-coupon-item">
                            <Image className="coupon-item-img" src={"http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png"} />
                            <View className="gift-coupon-item-content-center">
                                <View className="gift-coupon-item-title-middle">
                                    <View className="title-middle-left">马克保温水杯马克保温水杯马克保温水杯马克保温水杯</View>
                                    <View className="middle-right yellow">已完成</View>
                                </View>
                                <View className="gift-coupon-item-grey-long">2020-10-10 12:33</View>
                                <View className="gift-coupon-item-grey-long">平台礼品</View>
                            </View>
                        </View>
                    </View>

                    <View className="snap-gift-item">
                        <View className="gift-coupon-item">
                            <Image className="coupon-item-img" src={"http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png"} />
                            <View className="gift-coupon-item-content-center">
                                <View className="gift-coupon-item-title-middle">
                                    <View className="title-middle-left">马克保温水杯马克保温水杯马克保温水杯马克保温水杯</View>
                                    <View className="middle-right red">已完成</View>
                                </View>
                                <View className="gift-coupon-item-grey-long">2020-10-10 12:33</View>
                                <View className="gift-coupon-item-grey-long">平台礼品</View>
                            </View>
                        </View>
                    </View>

                    <View className="snap-gift-item">
                        <View className="gift-coupon-item">
                            <Image className="coupon-item-img" src={"http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png"} />
                            <View className="gift-coupon-item-content-center">
                                <View className="gift-coupon-item-title-middle">
                                    <View className="title-middle-left">马克保温水杯马克保温水杯马克保温水杯马克保温水杯</View>
                                    <View className="middle-right blue">派送中</View>
                                </View>
                                <View className="gift-coupon-item-grey-short">2020-10-10 12:33</View>
                                <View className="gift-coupon-item-grey-short">平台礼品</View>
                                <View className="logistics-btn">查看物流</View>
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        );
    }
}
