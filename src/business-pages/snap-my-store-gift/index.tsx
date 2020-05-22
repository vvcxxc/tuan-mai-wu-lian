import Taro, { Component } from "@tarojs/taro";
import { AtIcon } from 'taro-ui';
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import ApplyToTheStore from '@/components/applyToTheStore';
import './index.less'
import list from "dist/pages/activity/pages/list/list";

export default class SnapMyStoreGift extends Component {
    config = {
        navigationBarTitleText: "我的礼品",
        enablePullDownRefresh: false
    };

    state = {
        appointmentCurrent: 0,//0已发放/1预计发放
        selectType: 0,//0,1(2)
        selectTypeList: [0, 0],//[已发放选中下标,预计发放选中下标]
        selectListShow: false,//下拉是否显示
        selectList: [
            {
                label: '已发放', value: 0, isChoose: true, list: [
                    { label: '现金券', value: 0, isChoose: true, list: [{ label: '现金券', value: 0 }, { label: '商品券', value: 1 }] },
                    { label: '行业', value: 0, isChoose: false, list: [{ label: '丽人', value: 1 }, { label: '美食', value: 1 }] },
                    { label: '核销状态', value: 0, isChoose: false, list: [{ label: '已核销', value: 1 }, { label: '未核销', value: 1 }] }
                ]
            }
            , {
                label: '预计发放', value: 1, isChoose: false, list: [
                    { label: '现金券', value: 0, isChoose: true, list: [{ label: '现金券', value: 1 }, { label: '商品券', value: 1 }] },
                    { label: '行业', value: 0, isChoose: false, list: [{ label: '丽人', value: 1 }, { label: '美食', value: 1 }] }
                ]
            }
        ],
        dataList: [[[], [], []], [[], []]]
    }
    /**
     * 切换0已发放/1预计发放
     */
    changeAppointmentCurrent = (current: any) => {
        const { selectList, appointmentCurrent } = this.state;
        let tempList = selectList;
        for (let i in tempList) {
            tempList[i].isChoose = false;
        }
        tempList[current].isChoose = true;
        this.setState({ appointmentCurrent: current, selectListShow: false, selectList: tempList })
    }
    /**
        * 切换下拉
        */
    changeSelset = (current: any) => {
        const { selectList, appointmentCurrent, selectType } = this.state;
        let tempList = selectList;
        this.setState({ selectType: current, selectList: tempList, selectListShow: true })
    }
    /**
    * 选下拉
    */
    chooseSelset = (current: any, e: any) => {
        const { selectList, appointmentCurrent, selectType } = this.state;
        let tempList = selectList;
        let tempSelectTypeList = this.state.selectTypeList;
        tempSelectTypeList[appointmentCurrent] = selectType;
        for (let i in tempList[appointmentCurrent].list) {
            tempList[appointmentCurrent].list[i].isChoose = false;
        }
        tempList[appointmentCurrent].list[selectType].isChoose = true;
        tempList[appointmentCurrent].list[selectType].label = tempList[appointmentCurrent].list[selectType].list[current].label;
        tempList[appointmentCurrent].list[selectType].value = tempList[appointmentCurrent].list[selectType].list[current].value;
        this.setState({ selectList: tempList, selectTypeList: tempSelectTypeList, selectListShow: false });
        e.stopPropagation();
        console.log(tempSelectTypeList)
    }
    /**
    * 取消下拉
    */
    cancleSelset = (e: any) => {
        const { selectList, appointmentCurrent, selectType } = this.state;
        let tempList = selectList;
        this.setState({ selectList: tempList, selectListShow: false })
    }

    render() {
        const { appointmentCurrent, selectType, selectListShow, selectList } = this.state
        return (
            <View className="snap-my-gift">
                <View className="snap-gift-tab">
                    <View className="snap-gift-tab-ul">
                        {
                            selectList.map((item: any, index: any) => {
                                return (
                                    <View className="snap-gift-tab-li" key={item} onClick={this.changeAppointmentCurrent.bind(this, index)}>
                                        <View className={item.isChoose ? "snap-gift-title-select" : "snap-gift-title"}>{item.label}</View>
                                        {item.isChoose ? <View className="snap-gift-line"></View> : null}
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View className="snap-gift-select-ul">
                        {
                            selectList[appointmentCurrent].list.map((item: any, index: any) => {
                                return (
                                    <View className="snap-gift-select-li" key={item} onClick={this.changeSelset.bind(this, index)}>
                                        <View className={item.isChoose ? "snap-gift-select-title-red" : "snap-gift-select-title"}>{item.label}</View>
                                        {
                                            item.isChoose ? <Image className="snap-gift-select-icon" src={"http://oss.tdianyi.com/front/cyxNEPMtpAxHNGnraScTteJM8KHnkyeY.png"} /> :
                                                <Image className="snap-gift-select-icon" src={"http://oss.tdianyi.com/front/aHhs273Emifky8rJkTi5rBTdatTDnWG7.png"} />
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
                {
                    selectListShow ? <View className="snap-selsct-tab" onClick={this.cancleSelset.bind(this)}>
                        <View className="snap-selsct-ul">
                            {
                                selectList[appointmentCurrent].list[selectType].list.map((item: any, index: any) => {
                                    return (
                                        <View className="snap-selsct-tab-li" key={item} onClick={this.chooseSelset.bind(this, index)}>{item.label}</View>
                                    )
                                })
                            }
                        </View>
                    </View> : null
                }

                <View className="snap-gift-content">


                    {/* <View className="snap-nodata-box">
                        <View className="snap-nodata">
                            <Image className="snap-nodata-img" src="http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png" />
                            <View className="snap-nodata-info">暂无数据，快去逛逛吧</View>
                        </View>
                    </View> */}

                    <View className="snap-gift-item">
                        <View className="gift-coupon-item">
                            <Image className="coupon-item-img" src={"http://oss.tdianyi.com/front/YCCjMcz78NenNAzeQ2QtWZTbKJ8XTHFQ.png"} />
                            <View className="gift-coupon-item-content">
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

                </View>
            </View>
        );
    }
}
