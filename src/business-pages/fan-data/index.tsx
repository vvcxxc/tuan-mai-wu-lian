import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { getRelationChain, getStoreList } from './service'
export default class Member extends Component {
    config = {
        navigationBarTitleText: "粉丝数据",
        enablePullDownRefresh: false
    };
    state = {
        fanTabIndex: 0,
        total: 0,
        last_page: 0,
        per_page: 0,
        from: 0,
        data: [
            {
                avatar: "",
                nickName: "",
                registerTime: "",
                todayIncome: "",
                totalIncome: "",
                todayPlatformReward: ""
            },
        ],
        dataList: [[], [], [], []],
        pageList: [1, 1, 1, 1],
        pageTotalList: [1, 1, 1, 1],
        showList: [],
    }

    componentDidShow() {
        this.getList(1, 1, 0)
    }
    /**
     * 改变tab
     */
    changeTab = (index, e) => {
        console.log(e)
        this.setState({ fanTabIndex: index, showList: this.state.dataList[index] }, () => {
          console.log(this.state.pageList[0],'this.state.pageList[0]')
            if (index == 0 && this.state.dataList[0].length == 0) {
                this.getList(1, this.state.pageList[0], 0)
            } else if (index == 1 && this.state.dataList[1].length == 0) {
                this.getList(2, this.state.pageList[1], 1)
            } else if (index == 2 && this.state.dataList[2].length == 0) {
                this.getList(3, this.state.pageList[2], 2)
            } else if (index == 3) {
                this.getStore();
            }
        })
    }
    /**
     * 加载更多
     */
    loadMore = () => {
        if (this.state.fanTabIndex == 3) {
            this.getStore();
        } else {
            this.getList(Number(this.state.fanTabIndex) + 1, this.state.pageList[this.state.fanTabIndex], this.state.fanTabIndex)
        }
    }
    /**
     * 获取数据
     */
    getList = (type: number, page: number, index: number) => {
        let that = this;
        let mobile = Taro.getStorageSync('mobile');
        if (this.state.pageTotalList[index] > 1 && this.state.pageTotalList[index] < page) {
          console.log(43434)
            return
        }

        Taro.showLoading({ title: 'loading', mask: true });
        getRelationChain({
            phone: mobile,
            type,
            page
        })
            .then((res: any) => {
                Taro.hideLoading();
                if (res.status_code == 200) {
                    let tempData = this.state.dataList;
                    let tempPageTotalList = this.state.pageTotalList;
                    let tempPage = this.state.pageList;
                    let tempShowList = tempData[index].length == 0 ? res.data.data : tempData[index].concat(res.data.data);
                    tempData[index] = tempShowList;
                    tempPageTotalList[index] = res.data.last_page;
                    tempPage[index] += 1;
                    that.setState({ dataList: tempData, showList: tempShowList, pageTotalList: tempPageTotalList, pageList: tempPage })
                } else {
                    Taro.showToast({ title: res.message || '请求失败', icon: 'none' })
                }
            }).catch((err: any) => {
                Taro.hideLoading();
                Taro.showToast({ title: err.message || '请求失败', icon: 'none' })
            })
    }
    getStore = () => {
        let that = this;
        Taro.showLoading({ title: 'loading', mask: true });
        getStoreList({ page: this.state.pageList[3] })
            .then((res: any) => {
                Taro.hideLoading();
                if (res.status_code == 200) {
                    let tempData = this.state.dataList;
                    let tempPageTotalList = this.state.pageTotalList;
                    let tempPage = this.state.pageList;
                    let tempShowList = tempData[3].length == 0 ? res.data : tempData[3].concat(res.data);
                    tempData[3] = tempShowList;
                    tempPageTotalList[3] = res.last_page;
                    tempPage[3] += 1;
                    that.setState({ dataList: tempData, showList: tempShowList, pageTotalList: tempPageTotalList, pageList: tempPage })
                } else {
                    Taro.showToast({ title: res.message || '请求失败', icon: 'none' })
                }
            }).catch((err: any) => {
                Taro.hideLoading();
                Taro.showToast({ title: err.message || '请求失败', icon: 'none' })
            })
    }

    render() {
        return (
            <View className="fan-data-page">
                {
                    this.state.showList.length == 0 ? <View className="fan-nodata-box">
                        <View className="fan-nodata">
                            <Image className="fan-nodata-img" src="http://oss.tdianyi.com/front/k8ZSCiyS82z8NdnFeKfHSwChcdSfsXwd.png" />
                            <View className="fan-nodata-info">暂无邀请店铺，快去逛逛吧</View>
                        </View>
                    </View> : null
                }

                <View className="fan-data-page-tabBar">
                    <View className="fan-data-page-tabBar-item" onClick={this.changeTab.bind(this, 0)}>
                        <View className={this.state.fanTabIndex == 0 ? "fan-data-page-tabBar-item-words-select" : "fan-data-page-tabBar-item-words"}>注册会员</View>
                        <View style={{ opacity: this.state.fanTabIndex == 0 ? 1 : 0 }} className="fan-data-page-tabBar-item-lines"> </View>
                    </View>
                    <View className="fan-data-page-tabBar-item" onClick={this.changeTab.bind(this, 1)}>
                        <View className={this.state.fanTabIndex == 1 ? "fan-data-page-tabBar-item-words-select" : "fan-data-page-tabBar-item-words"}>直属创客</View>
                        <View style={{ opacity: this.state.fanTabIndex == 1 ? 1 : 0 }} className="fan-data-page-tabBar-item-lines"> </View>
                    </View>
                    <View className="fan-data-page-tabBar-item" onClick={this.changeTab.bind(this, 2)}>
                        <View className={this.state.fanTabIndex == 2 ? "fan-data-page-tabBar-item-words-select" : "fan-data-page-tabBar-item-words"}>创客总数</View>
                        <View style={{ opacity: this.state.fanTabIndex == 2 ? 1 : 0 }} className="fan-data-page-tabBar-item-lines"> </View>
                    </View>
                    <View className="fan-data-page-tabBar-item" onClick={this.changeTab.bind(this, 3)}>
                        <View className={this.state.fanTabIndex == 3 ? "fan-data-page-tabBar-item-words-select" : "fan-data-page-tabBar-item-words"}>邀请店铺</View>
                        <View style={{ opacity: this.state.fanTabIndex == 3 ? 1 : 0 }} className="fan-data-page-tabBar-item-lines"> </View>
                    </View>
                </View>

                <View className="fan-data-page-content" >
                    {
                        this.state.showList.length > 0 && this.state.fanTabIndex == 0 ? this.state.showList.map((item: any, index: any) => {
                            return (
                                <View className="fan-data-member" key={index}>
                                    <Image className="fan-data-member-left" src={item.avatar} />
                                    <View className="fan-data-member-right">
                                        <View className="fan-data-member-item">
                                            <View className="fan-data-member-key">昵称：</View>
                                            <View className="fan-data-member-words">{item.nickName}</View>
                                        </View>
                                        <View className="fan-data-member-item">
                                            <View className="fan-data-member-key">注册时间：</View>
                                            <View className="fan-data-member-words">{item.registerTime}</View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }) : null
                    }
                    {
                        this.state.showList.length > 0 && (this.state.fanTabIndex == 1 || this.state.fanTabIndex == 2) ? this.state.showList.map((item: any, index: any) => {
                            return (
                                <View className="fan-data-store" key={index}>
                                    <Image className="fan-data-member-left" src={item.avatar} />
                                    <View className="fan-data-member-right">
                                        <View className="fan-data-member-item">
                                            <View className="fan-data-member-key">昵称：</View>
                                            <View className="fan-data-member-words">{item.nickName}</View>
                                        </View>
                                        <View className="fan-data-member-item">
                                            <View className="fan-data-member-key">注册时间：</View>
                                            <View className="fan-data-member-words">{item.registerTime}</View>
                                        </View>
                                        <View className="fan-data-member-item-box-row">
                                            <View className="fan-data-member-item-row">
                                                <View className="fan-data-member-key-row">今日销售收益：</View>
                                                <View className="fan-data-member-words-row">{item.todayIncome}</View>
                                            </View>
                                            <View className="fan-data-member-item-row">
                                                <View className="fan-data-member-key-row">总销售收益：</View>
                                                <View className="fan-data-member-words-row">{item.totalIncome}</View>
                                            </View>
                                        </View>
                                        <View className="fan-data-member-item">
                                            <View className="fan-data-member-key">我今日获得平台奖励：</View>
                                            <View className="fan-data-member-words">{item.todayPlatformReward}</View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }) : null
                    }
                    {
                        this.state.showList.length > 0 && this.state.fanTabIndex == 3 ? this.state.showList.map((item: any, index: any) => {
                            return (
                                <View className="fan-data-store" key={index}>
                                    <Image className="fan-data-member-left" src={item.preview} />
                                    <View className="fan-data-member-right">
                                        <View className="fan-data-member-item">
                                            <View className="fan-data-member-key">昵称：</View>
                                            <View className="fan-data-member-words">{item.name}</View>
                                        </View>
                                        <View className="fan-data-member-item">
                                            <View className="fan-data-member-key">注册时间：</View>
                                            <View className="fan-data-member-words">{item.created_at}</View>
                                        </View>
                                        <View className="fan-data-member-item">
                                            <View className="fan-data-member-key">总销售收益：</View>
                                            <View className="fan-data-member-words">{item.money}</View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }) : null
                    }
                    {
                        this.state.pageTotalList[this.state.fanTabIndex] >= this.state.pageList[this.state.fanTabIndex] ? <View className="fan-data-more" onClick={this.loadMore}>加载更多</View> : null
                    }
                </View>
            </View>
        );
    }
}
