import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtNoticebar, AtCountdown } from 'taro-ui';
import { View, Image, Swiper, SwiperItem, Button, Canvas } from "@tarojs/components";
import './clockup.scss';
import './index.scss';
import { getTime } from '@/utils/common';

interface Props {
    itemtime: any,
    avatar: any,
    itemid: any,
    number: any,
    participation_number: any,
    real_name: any,
    handleclick: any
}

let timer;
export default class ClockUp extends Component<Props>{

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
                let time = getTime(new Date(this.props.itemtime).getTime()/1000)
                this.setState({
                    time
                })
                this.setTime()
            }, 1000)
        }
    }
    componentWillUnmount() {
        console.log('unMount')
        clearTimeout(timer);
    }

    render() {
        return (
            <View className="group_list" >
                <View className="group_list_img" >
                    <Image className="listImg" src={this.props.avatar} />
                </View>
                <View className="group_list_name" >{this.props.real_name}</View>
                <View className="group_list_btnbox" >
                    <View className="group_list_btn" onClick={(e) => {
                        this.props.handleclick(this.props.itemid);
                        e.stopPropagation();
                    }} >立即参团</View>
                </View>
                <View className="group_list_timesbox" >
                    <View className="group_list_lack" >
                        <View className="group_list_lackredblack1" >还差</View>
                        <View className="group_list_lackred" >{this.props.number - this.props.participation_number}人</View>
                        <View className="group_list_lackredblack2" >拼成</View>
                    </View>
                    <View className="group_list_times" >
                        {this.state.time.date}
                    </View>
                </View>
            </View>
        );
    }
}
