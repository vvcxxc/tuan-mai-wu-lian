import Taro, { Component, ComponentOptions } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtIcon } from "taro-ui";

import './index.scss';

interface Props {
	merchant: any;
	onClick: (id: number | string) => any;
	type?: string;
}


/**商店 ITEM 组件 */
export default class Merchant extends Component<Props> {
	static options: ComponentOptions = {
		addGlobalClass: true
	};
	state: {
		showLine: false,
		num:1
	}
	componentDidMount() {
	}

	heightChange = () => {
		this.setState({ showLine: !this.state.showLine })
	}

	styleControl = () => {
		const that = this.props.merchant
		if (this.props.merchant) {
			if (
				that.exchange_coupon_name ===null &&
				that.gift_coupon_name === null &&
				that.gift_name === null) {
				return false
			}
			return true
		}
	}


	handleClick = (_id, e) => {
		Taro.navigateTo({
			url: '/pages/business/index?id=' + _id
		})
	};

	judgeData = (value1) => {
		return typeof (value1) === 'string' ? (value1.length > 1 ? '' : 'none') : 'none'
	}
	render() {
		const that = this.props.merchant
		this.styleControl()
		return (
			<View className={('merchant') + ' ' + (this.styleControl() ? '' : 'update-inset')}>
				<View className="content flex" onClick={this.handleClick.bind(this, this.props.merchant.id)}>
					{this.props.type !== 'activity' && <Image className="img" src={that.shop_door_header_img} />}
					<View className="item" style="padding-top:15px">
						<View className="flex">
							<View className="title item">{that.name}</View>
							<AtIcon value="chevron-right" color="#999" size="16px" />
						</View>
						<View className="flex " style="position:relative">
							<View className="tag" style={{ backgroundColor: that.label.indexOf('免费礼品') !== -1 ? '#fde8e5' : '#fff' }}>免费礼品</View>
							<View className="tag" style={{ backgroundColor: that.label.indexOf('优秀商家') !== -1 ? '#fde8e5' : '#fff' }}>优秀商家</View>
							<View className="tag" style={{ backgroundColor: that.label.indexOf('现金卷') !== -1 ? '#fde8e5' : '#fff' }}>现金卷</View>
							<View style="position:absolute; right:0px; line-height:1; bottom:2px;font-size:12px;" >{that.distance}
							</View>
						</View>
					</View>
				</View>
				<View
					className={'all-data ' + (this.styleControl() ? '' :'pb8')}
					onClick={this.handleClick.bind(this, this.props.merchant.id)}>
					<View className='banner'
						style={{ width: typeof (that.coupon_image_url) === 'string' ? (that.coupon_image_url.length > 1 ? '50%' : '100%') : '100%' }}>
						<Image src={that.coupon_image_url} />
					</View>
					<View className="banner ml10"
						style={{ display: that.coupon_image_url ? '' : 'none' }}>
						<Image src={that.preview} />
					</View>
				</View>
				<View>
					<View className="give flex center" style={{ display: this.judgeData(that.gift_name) }}>
						<View className="icon">礼</View>
						<View className="title item ellipsis-one">
							<Text className="strong">{that.gift_name}</Text>
						</View>
					</View>
					<View className="give flex center"
						style={{ display: typeof (that.gift_coupon_name) === 'string' && this.state.showLine ? '' : 'none' }}>
						<View className="icon" style="background: #5d84e0">卷</View>
						<View className="title item">
							<Text className="strong">{that.gift_coupon_name}</Text>
						</View>
					</View>
					<View className="give flex center"
						style={{
							display: typeof (that.exchange_coupon_name) === 'string' && this.state.showLine ? '' : 'none'
						}}>
						<View className="icon" style="background: #5dd8a5">惠</View>
						<View className="title item ellipsis-one">
							{that.exchange_coupon_name}

						</View>
					</View>
					<View className="more flex center" onClick={this.heightChange} style={
						{
							display: this.styleControl() ? '' : 'none'
						}}>
						<View style="color:#939393;margin-right:3px;">{this.state.showLine ? '收起' : '更多活动'}</View>
						<AtIcon value={this.state.showLine ? 'chevron-up' : 'chevron-down'} size='12' color='#939393'></AtIcon>
					</View>
					<View  style={{height:'10px',backgroundColor:'#ededed'}}></View>
				</View>
			</View>
		);
	}
}
