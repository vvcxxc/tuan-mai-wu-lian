import Taro, { Component } from "@tarojs/taro";
import { getTime } from '@/utils/common';

interface Props {
    itemtime: any
}

let timer;
export default class TimeUp extends Component<Props>{

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
            <div className="timeUp" >
                {this.state.time.date}
            </div>
        );
    }
}
