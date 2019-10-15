import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtNoticebar, AtCountdown } from 'taro-ui';
import { View, Image, Swiper, SwiperItem, Button, Canvas } from "@tarojs/components";
import './clockup.scss';
import './index.scss';
import { getTime } from '@/utils/common';

interface Props {
    key:any,
    itemtime: any,
    avatar: any,
    itemid: any,
    number: any,
    participation_number: any,
    real_name: any,
    handleclick: any
}

let timer;
export default class ClockUp2 extends Component<Props>{

    state = {
        time: {
            date: '',
            display: 1
        },
        differ_time: []
    };

    componentDidMount() {
        this.setTime()
    }
    componentDidShow() {
        this.setTime()
    }
    componentWillReceiveProps() {
        this.setTime()
    }

    /**
       * 定时
       */
    setTime = () => {
        if (this.state.time.display <= 0) {
            clearTimeout(timer)
            return
        } else {
            timer = setTimeout(() => {
                clearTimeout(timer)
                let time = getTime(new Date(this.props.itemtime).getTime() / 1000)
                this.setState({
                    time
                })
                this.setTime()
            }, 1000)
        }
    }
    componentWillUnmount() {
        clearTimeout(timer);
    }

    render() {
        return (
            <View className="group_list0" >
                <View className="group_list_img0" >
                    <Image className="listImg0" src={this.props.avatar} />
                </View>
                <View className="group_list_name0" >{this.props.real_name}</View>
                <View className="group_list_timesbox0" >
                    <View className="group_list_lack0" >
                        <View className="group_list_lackredblack10" >还差</View>
                        <View className="group_list_lackred0" >{this.props.number - this.props.participation_number}人</View>
                        <View className="group_list_lackredblack20" >拼成</View>
                    </View>
                    <View className="group_list_times0" >
                        {this.state.time.date}
                    </View>
                </View>
                <View className="group_list_btnbox0" >
                    <View className="group_list_btn0" onClick={(e) => {
                        this.props.handleclick(this.props.itemid);
                        e.stopPropagation();
                    }}
                    >立即参团</View>
                </View>
            </View>
        );
    }
}
