import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";

export default class AppreActivity extends Component {
    config = {
        navigationBarTitleText: "我的礼品",
        enablePullDownRefresh: false
    };

    state = {
        current: 0,
        ApeakerlogisticsContentShow: true,
    }

    render() {
        const List = [{ id: 1, key: '全部' }, { id: 2, key: '待发货' }, { id: 3, key: '进行中' }, { id: 4, key: '已签收' }]

        return (
            <View className="my-gift">
                <View className="gift-tab-area" >
                    {
                        List.length && List.map((item: any, index: any) => {
                            return (
                                <View className={this.state.current == index ? "gift-tab-item-select" : "gift-tab-item"} onClick={() => { this.setState({ current: index }) }}>
                                    <View className={this.state.current == index ? "tab-word-select" : "tab-word"} >{item.key}</View>
                                    {this.state.current == index ? <View className="tab-word-border" ></View> : null}
                                </View>
                            )
                        })
                    }
                </View>

                {/* <View className="fan-nodata-box">
                        <View className="fan-nodata">
                            <Image className="fan-nodata-img" src="http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png" />
                            <View className="fan-nodata-info">暂无邀请店铺，快去逛逛吧</View>
                        </View>
                    </View>  */}


                <View className="gift-store">
                    <Image className="gift-member-left" src={"http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png"} />
                    <View className="gift-member-right">
                        <View className="gift-member-title">很便宜的寿司</View>
                        <View className="gift-member-method">获取途径:拼团活动</View>
                        <View className="gift-member-time">获取时间:2020.10.10 11:30</View>
                        <View className="gift-member-type postColor1">待发货</View>
                        {/* <View className="gift-member-btn1">查看物流</View> */}
                        <View className="gift-member-btn2">查看物流</View>
                    </View>
                </View>


                {
                    this.state.ApeakerlogisticsContentShow ?
                        <View className={"ApeakerlogisticsContent"} onClick={() => { this.setState({ ApeakerlogisticsContentShow: false }) }} >
                            <View className={"ApeakerlogisticsContentBox"} onClick={(e) => {e.stopPropagation()}}>
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
