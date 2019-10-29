import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button, Input, Textarea } from "@tarojs/components";
import "./chooseAddress.scss";
import "taro-ui/dist/style/components/toast.scss";
import request from '../../services/request'



export default class ChooseAddress extends Component {
    config = {
        navigationBarTitleText: "我的收货地址"
    };

    state = {
        data: [
            {
                name: '杨大富',
                phone: '1111111111',
                default: 1
            }, {
                name: '杨中产',
                phone: '2222222222',
                default: 0
            }, {
                name: '杨小康',
                phone: '3333333333',
                default: 0
            }, {
                name: '杨还行',
                phone: '4444444444',
                default: 0
            },{
                name: '杨贫穷',
                phone: '55555555555',
                default: 0
            }
        ],
        currentAddress: 0

    };

    componentWillUnmount() {
        Taro.removeStorage({ key: 'cityList' })
    }

    componentDidMount() {

    }

    componentDidShow() {
    }

    editorAddress = (_id: any) => {
        Taro.navigateTo({
            url: '/activity-pages/Shipping-address/editor?type=editorItem&editorId=' + _id
        })
    }

    goToEditor = () => {
        Taro.navigateTo({
            url: '/activity-pages/Shipping-address/editor?type=addItem'
        })
    }
    chosoeCurrent = (index, e) => {
        this.setState({ currentAddress: index })
    }

    render() {
        return (

            <View className="choose-shipping-address">
                <View className="Shipping-address-content">

                    {
                        this.state.data.map((item, index) => (
                            <View className="address-chooseThis" key={item.name}>
                                <View className="address-chooseimg-box" onClick={this.chosoeCurrent.bind(this, index)}>
                                    {
                                        index == this.state.currentAddress ? <Image className="address-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/jCzizjY4Fjna5HdneGSccWChTtA4DThf.png" />
                                            : <Image className="address-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/tX8YdWMcGPYZMdJGdCjTtRPD3WsP7szh.png" />
                                    }
                                </View>
                                <View className="address-box0">
                                    <View className="address-msgBox">
                                        <View className="address-msgBox_userBox0">
                                            <View className="address-msgBox_box01">
                                                <View className="address-msgBox_userBox_name">{item.name}</View>
                                                <View className="address-msgBox_userBox_phone">{item.phone}</View>
                                            </View>
                                            {
                                                item.default ? <View className="address-msgBox_userBox_choose">默认</View> : null
                                            }
                                        </View>
                                        <View className="address-msgBox_address0">广东省广州市海珠区广东省广州市海珠区海珠创意园10栋402</View>
                                    </View>
                                    <View className="address-changeIcon_img_box0" >
                                        <Image className="address-changeIcon_img0" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/nYFTGYptxHKZwWDCiJHRy5BniRkkDQJQ.png" />
                                    </View>
                                </View>
                            </View>
                        ))
                    }








                    {/* <Image className="address-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/tX8YdWMcGPYZMdJGdCjTtRPD3WsP7szh.png" /> */}
                    {/* <View className="address-chooseThis">
                        <View className="address-chooseimg-box">
                            <Image className="address-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/jCzizjY4Fjna5HdneGSccWChTtA4DThf.png" />
                        </View>
                        <View className="address-box0">
                            <View className="address-msgBox">
                                <View className="address-msgBox_userBox0">
                                    <View className="address-msgBox_box01">
                                        <View className="address-msgBox_userBox_name">杨大富的五金店 </View>
                                        <View className="address-msgBox_userBox_phone">13546987455</View>
                                    </View>
                                    <View className="address-msgBox_userBox_choose">默认</View>
                                </View>
                                <View className="address-msgBox_address0">广东省广州市海珠区广东省广州市海珠区海珠创意园10栋402</View>
                            </View>
                            <View className="address-changeIcon_img_box0" >
                                <Image className="address-changeIcon_img0" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/nYFTGYptxHKZwWDCiJHRy5BniRkkDQJQ.png" />
                            </View>
                        </View>
                    </View> */}
                </View>






                <View className="choose-bottom_btn_box">
                    <View className="bottom_btn_submit" onClick={this.goToEditor.bind(this)} >添加新地址</View>
                </View>
            </View>
        );
    }
}
