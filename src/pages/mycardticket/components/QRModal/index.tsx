import Taro, { Component } from "@tarojs/taro"

import { View,Text } from '@tarojs/components';


import './index.less';

interface Props {
    isShow: Boolean,
    onClose: () => void,
    name: String,
    url: String,
    order: Number
}

export default class QRModal extends Component<Props> {

    componentDidMount() {
        let ele = document.getElementById('modal');
        if(this.props.isShow) {
            ele.style.display = "flex";
        }else {
            ele.style.display = "none";
        }
    }

    componentWillReceiveProps(nextProps: any) {
        console.log(nextProps)
        if (nextProps.isShow) {
            let ele = document.getElementById('modal');
            ele.style.display = 'flex';
        }
    }

    handleClose = () => {
        let ele = document.getElementById('modal');
        ele.style.display = "none";
        this.props.onClose && this.props.onClose()
    }

    render() {
        return (
            <View id="modal" className="modal">
                <View className="modal_content">
                    <View className="qr_code_content" style={{ flex: 8 }}>
                        <View className="store_name">{this.props.name}</View>
                        {/* <img className="qr_code" src={this.props.url} alt="" /> */}
                        <View className="order_num">订单号：{this.props.order}</View>
                        <View className="gift_step">请向工作人员展示二维码领取礼品</View>
                    </View>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flex: 1 }}>
                        <View className="close_modal" onClick={this.handleClose.bind(this)}> x </View>
                    </View>
                </View>
            </View>
        )
    }
}