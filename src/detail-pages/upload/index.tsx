import Taro, { Component, Config } from "@tarojs/taro"
// import { View } from "@tarojs/components";
import { AtIcon, AtToast, AtActionSheet, AtActionSheetItem } from "taro-ui"
import { Block, View, Image, Text, Navigator, Picker, Input } from "@tarojs/components"
import userRequest from '@/services/userRequest'
import { url } from "inspector"
import upload from '@/services/oss';

export default class PersonalInformation extends Component {

    config: Config = {
        navigationBarTitleText: "修改我的信息"
    }
    state = {
        list: []
    }
    changeImg = () => {
        let that = this;
        Taro.chooseImage({
            // count: 20,
            count: 4,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res0) {
                let templist: any = [];
                for (let i in res0.tempFilePaths) {
                    let tempFilePaths = res0.tempFilePaths[i];
                    // console.log('res0.tempFilePaths',res0.tempFilePaths.length)
                    upload(tempFilePaths).then((res: any) => {
                        let path = JSON.parse(res.data).data.path;
                        let path2 = 'http://oss.tdianyi.com/' + path;
                        templist.push(path2);
                        if (Number(i) == res0.tempFilePaths.length - 1) {
                            that.setState({ list: templist }, () => { console.log(that.state.list) })
                        }
                    });
                }


            },fail(err){
                console.log('err')
            }

        });
    }
    render() {
        const { list } = this.state;
        return (
            <View className='personalInformation'>
                <View style={{ width: '200rpx', height: '200rpx', background: 'yellow' }} onClick={this.changeImg}>{list.length}</View>
                {
                    list.map((item: any, index: any) => {
                        return (
                            <Image style={{ width: '200rpx', height: '200rpx' }} src={item} key={item} />
                        )
                    })
                }
            </View>
        )
    }
}
