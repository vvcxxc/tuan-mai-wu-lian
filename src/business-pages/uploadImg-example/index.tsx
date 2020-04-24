import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";

export default class UploadImgExample extends Component {
    config = {
        navigationBarTitleText: "图片示例",
        enablePullDownRefresh: false
    };

    render() {
        return (
            <View className="uploadImg-example">
                <View className="uploadImg-example-content">
                    <View className="uploadImg-example-title">
                        <View className="uploadImg-example-title-left">
                            <View className="uploadImg-example-title-left-line"></View>
                            <View className="uploadImg-example-title-left-word">截图显示群主群人数</View>
                        </View>
                    </View>
                    <Image className="uploadImg-example-img" mode='widthFix' src='http://oss.tdianyi.com/front/AWAw8dzp4xFw48NRs47Q4T6MSKzNwjdQ.png' />
                </View>
                <View className="uploadImg-example-content">
                    <View className="uploadImg-example-title">
                        <View className="uploadImg-example-title-left">
                            <View className="uploadImg-example-title-left-line"></View>
                            <View className="uploadImg-example-title-left-word">截图显示群主群人数</View>
                        </View>
                    </View>
                    <Image className="uploadImg-example-img" mode='widthFix' src='http://oss.tdianyi.com/front/MAb6wmQ7n7dXab8b8ZbkWy8aajip66wB.png' />
                </View>
            </View>
        );
    }
}
