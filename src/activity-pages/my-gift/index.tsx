import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { groupListInfo } from './service';

export default class AppreActivity extends Component {
    config = {
        navigationBarTitleText: "我的礼品",
        enablePullDownRefresh: false
    };

    state = {
        ApeakerlogisticsContentShow: false,
        current: 0,
        dataList: [[], [], [], []],
        pageList: [1, 1, 1, 1],
        totalPageList: [1, 1, 1, 1],
        showList: [],
    }

    componentDidShow() {
        this.getList(0);
    }

    //改tab
    changeCurrent = (index: number | string) => {
        if (this.state.dataList[index].length == 0) {
            this.setState({ showList: [], current: index }, () => {
                this.getList(index);
            })
        } else {
            this.setState({ showList: this.state.dataList[index], current: index })
        }
    }
    //拿数据
    getList = (delivery_status: string | number) => {
        if (this.state.pageList[this.state.current] > this.state.totalPageList[this.state.current]) {
            return;
        }
        Taro.showLoading({ title: 'loading', mask: true });
        groupListInfo({ page: this.state.pageList[this.state.current], limit: 2, delivery_status })
            .then((res: any) => {
                Taro.hideLoading();
                if (res.code == 200) {
                    //列表数据
                    let tempDataList = this.state.dataList;
                    tempDataList[this.state.current] = tempDataList[this.state.current].length == 0 ? res.data.data : tempDataList[this.state.current].concat(res.data.data)
                    //tab对应页数
                    let tempPage = this.state.pageList;
                    tempPage[this.state.current] = Number(tempPage[this.state.current]) + 1;
                    //tab对应总页数
                    let tempTotalPageList = this.state.totalPageList;
                    tempTotalPageList[this.state.current] = res.data.last_page;//last_page可能不是总页数

                    this.setState({ dataList: tempDataList, showList: tempDataList[this.state.current], pageList: tempPage, totalPageList: tempTotalPageList })
                } else {
                    Taro.showToast({ title: res.message, icon: 'none', })
                }
            }).catch((err: any) => {
                Taro.hideLoading();
                Taro.showToast({ title: err.message, icon: 'none', })
            })
    }

    render() {
        const List = [{ id: 1, key: '全部' }, { id: 2, key: '待发货' }, { id: 3, key: '进行中' }, { id: 4, key: '已签收' }];
        const { showList } = this.state;
        return (
            <View className="my-gift">
                <View className="gift-tab-area" >
                    {
                        List.length && List.map((item: any, index: any) => {
                            return (
                                <View className={this.state.current == index ? "gift-tab-item-select" : "gift-tab-item"} onClick={this.changeCurrent.bind(this, index)}>
                                    <View className={this.state.current == index ? "tab-word-select" : "tab-word"} >{item.key}</View>
                                    {this.state.current == index ? <View className="tab-word-border" ></View> : null}
                                </View>
                            )
                        })
                    }
                </View>

                {
                    !showList.length ? <View className="fan-nodata-box">
                        <View className="fan-nodata">
                            <Image className="fan-nodata-img" src="http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png" />
                            <View className="fan-nodata-info">暂无礼品数据，快去逛逛吧</View>
                        </View>
                    </View> : null

                }
                {
                    showList.length ? showList.map((item: any, index: any) => {
                        return (
                            <View className="gift-store" key={index}>
                                <Image className="gift-member-left" src={"http://oss.tdianyi.com/" + item.gift_image} />
                                <View className="gift-member-right">
                                    <View className="gift-member-title">{item.gift_name}</View>


                                    <View className="gift-member-method">获取途径:{item.order_type == 1 ? '拼团活动' : (item.order_type == 2 ? '增值活动' : (item.order_type == 3 ? '优惠券' : ''))}</View>
                                    <View className="gift-member-time">获取时间:{item.created_at}</View>
                                    {
                                        item.delivery_status == 0 ? <View className="gift-member-type postColor1"> 待接单</View> : null
                                    }
                                    {
                                        item.delivery_status == 1 ? <View className="gift-member-type postColor1"> 已接单</View> : null
                                    }
                                    {
                                        item.delivery_status == 2 ? <View className="gift-member-type postColor2"> 配送中</View> : null
                                    }
                                    {
                                        item.delivery_status == 3 ? <View className="gift-member-type postColor3"> 配送成功</View> : null
                                    }
                                    {
                                        item.delivery_status == 4 ? <View className="gift-member-type postColor3"> 配送失败</View> : null
                                    }
                                    {/* <View className="gift-member-type postColor1">{item.delivery_status == 0 ? '待接单' : (item.delivery_status == 1 ? '已接单' : (item.delivery_status == 2 ? '配送中' : (item.delivery_status == 3 ? '配送成功' : (item.delivery_status == 4 ? '配送失败' : ''))))}</View> */}
                                    {item.delivery_status == 0 ? <View className="gift-member-btn1">查看物流</View> : <View className="gift-member-btn2">查看物流</View>}
                                </View>
                            </View>
                        )
                    }) : null
                }
                {
                    this.state.pageList[this.state.current] <= this.state.totalPageList[this.state.current] ? <View className="getMore" onClick={this.getList.bind(this, this.state.current)} >查看更多</View> : null
                }

                {
                    this.state.ApeakerlogisticsContentShow ?
                        <View className={"ApeakerlogisticsContent"} onClick={() => { this.setState({ ApeakerlogisticsContentShow: false }) }} >
                            <View className={"ApeakerlogisticsContentBox"} onClick={(e) => { e.stopPropagation() }}>
                                <View className={"Apeakerlogisticspages"}>
                                    <View className={"ApeakerlogisticsContentBoxTop"}>

                                        <Image className={"topInfoBox-img"} src={"http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png"} />
                                        <View className={"InfoContent"}>
                                            <View className={"InfoName"}>就换个号</View>
                                            <View className={"InfoCompany"}>物流快递:顺丰速运</View>
                                            <View className={"InfoNumber"}>快递单号:SF102345678968
                                        <Image className={"InfoNumber-img"} src='http://oss.tdianyi.com/front/AeDfZdwfppksiMzNKwxK8e2K5DEfsbpp.png' />
                                            </View>
                                        </View>
                                    </View>
                                    <View className={"ApeakerlogisticsContentBoxBottom"}>
                                        <View className={"BottomContent"}>

                                            <View className={"adderessItem"}>
                                                <View className={"adderessItemTime-img-area"}>
                                                    <Image className={"adderessItemTime-red"} src='http://oss.tdianyi.com/front/6NEZBSt27xps2Mr6GjsRzGA4f7NXSmyQ.png' />
                                                </View>
                                                <View className={"adderessItemTime"}>
                                                    <View className={"ItemTime"}>15:19 </View>
                                                    <View className={"ItemDate"}>02-29</View>
                                                </View>
                                                <View className={"adderessItemMsg"}>快件交给小陈，正在派送途中（联系电话，顺丰已开启“安全呼叫”保 护您的电话隐私，请放心接听）</View>
                                            </View>

                                            <View className={"adderessItem"}>
                                                <View className={"adderessItemTime-img-area"}>
                                                    <Image className={"adderessItemTime-img"} src='http://oss.tdianyi.com/front/TtSZSBCcajzFeSkmQ8TrBaiYhAcAQwyc.png' />
                                                </View>
                                                <View className={"adderessItemTime"}>
                                                    <View className={"ItemTime"}>15:19 </View>
                                                    <View className={"ItemDate"}>02-29</View>
                                                </View>
                                                <View className={"adderessItemMsg"}>快件交给小陈，正在派送途中（联系电话，顺丰已开启“安全呼叫”保 护您的电话隐私，请放心接听）</View>
                                            </View>
                                            <View className={"adderessItem"}>
                                                <View className={"adderessItemTime-img-area"}>
                                                    {/* <Image className={"adderessItemTime-img"} src='http://oss.tdianyi.com/front/TtSZSBCcajzFeSkmQ8TrBaiYhAcAQwyc.png' /> */}
                                                </View>                                        <View className={"adderessItemTime"}>
                                                    <View className={"ItemTime"}>15:19 </View>
                                                    <View className={"ItemDate"}>02-29</View>
                                                </View>
                                                <View className={"adderessItemMsg"}>快件交给小陈，正在派送途中（联系电话，顺丰已开启“安全呼叫”保 护您的电话隐私，请放心接听）</View>
                                            </View>
                                            <View className={"adderessItem"}>
                                                <View className={"adderessItemTime-img-area"}>
                                                    {/* <Image className={"adderessItemTime-img"} src='http://oss.tdianyi.com/front/TtSZSBCcajzFeSkmQ8TrBaiYhAcAQwyc.png' /> */}
                                                </View>                                        <View className={"adderessItemTime"}>
                                                    <View className={"ItemTime"}>15:19 </View>
                                                    <View className={"ItemDate"}>02-29</View>
                                                </View>
                                                <View className={"adderessItemMsg"}>快件交给小陈，正在派送途中（联系电话，顺丰已开启“安全呼叫”保 护您的电话隐私，请放心接听）</View>
                                            </View>
                                            <View className={"adderessItem"}>
                                                <View className={"adderessItemTime-img-area"}>
                                                    {/* <Image className={"adderessItemTime-img"} src='http://oss.tdianyi.com/front/TtSZSBCcajzFeSkmQ8TrBaiYhAcAQwyc.png' /> */}
                                                </View>                                        <View className={"adderessItemTime"}>
                                                    <View className={"ItemTime"}>15:19 </View>
                                                    <View className={"ItemDate"}>02-29</View>
                                                </View>
                                                <View className={"adderessItemMsg"}>快件交给小陈，正在派送途中（联系电话，顺丰已开启“安全呼叫”保 护您的电话隐私，请放心接听）</View>
                                            </View>

                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View> : null
                }

            </View>
        );
    }
}
