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
            display: 2
        },
        differ_time: []
    };

    componentDidMount() {
        console.log(this.props.itemtime, this.props.itemid, this.props.real_name);
        let temp_time = new Date(this.props.itemtime).getTime()/ 1000;
        console.log(temp_time);
        let time = {
            date: temp_time,
            display: 2
        };
        this.setState({ time: time })
    }

    componentWillReceiveProps (){
        console.log(this.props.itemtime, this.props.itemid, this.props.real_name);
        let temp_time = new Date(this.props.itemtime).getTime()/ 1000;
        console.log(temp_time);
        let time = {
            date: temp_time,
            display: 2
        };
        this.setState({ time: time })
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
                let time = getTime(this.props.itemtime)
                this.setState({
                    time
                })
                this.setTime()
            }, 1000)
        }
    }
    componentWillUnmount() {
        clearTimeout(timer)
    }



    tempTime = () => {
        let temp_Time = new Date(this.props.itemtime).getTime() - new Date().getTime();   //时间差的毫秒数        
        //计算出相差天数  
        var days = Math.floor(temp_Time / (24 * 3600 * 1000))
        //计算出小时数  
        var leave1 = temp_Time % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数  
        var hours = Math.floor(leave1 / (3600 * 1000))
        console.log('小时', days, hours)
        //计算相差分钟数  
        var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数  
        var minutes = Math.floor(leave2 / (60 * 1000))
        //计算相差秒数  
        var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数  
        var seconds = Math.round(leave3 / 1000)
        var differ_time = [days, hours, minutes, seconds]
        this.setState({ differ_time: differ_time });
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
