import Taro, { Component, ComponentOptions } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';

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
	handleTap = () => this.props.onClick(this.props.merchant.id);
	render() {
		return (
			<View className={this.props.type === 'activity' ? 'merchant inset' : 'merchant'} onClick={this.handleTap}>
				<View className="content flex">
					{this.props.type !== 'activity' && <Image className="img" src="" />}
					<View className="item">
						<View className="flex">
							<View className="title item">{this.props.merchant.name}</View>
							<Image src={require('./arrow-right.png')} className="right-icon" />
						</View>
						<View className="flex label">
							<View className="item">便利店</View>
							<View>660m</View>
						</View>
						<View className="flex">
							<View className="tag">免费礼品</View>
							<View className="tag">免费礼品</View>
							<View className="tag">免费礼品</View>
						</View>
					</View>
				</View>
				<View className="banner flex">
					<View className="shop item">
						<Image
							className="img"
							mode="widthFix"
							src="http://s6.sinaimg.cn/mw690/0026X9ckgy6YSgCJVqJd5&690"
						/>
					</View>
					<View className="shop item">
						<Image
							className="img"
							mode="widthFix"
							src="http://s6.sinaimg.cn/mw690/0026X9ckgy6YSgCJVqJd5&690"
						/>
					</View>
				</View>
				<View className="give flex center">
					<View className="icon">礼</View>
					<View className="title item">
						拼西西咖啡店(珞喻路)餐券送<Text className="strong">价值3000</Text>元耳机...
					</View>
					<View className="info">1.4万已领</View>
				</View>
				<View className="more flex center">
					更多活动 <Image src={require('./arrow-down.png')} className="img" />
				</View>
			</View>
		);
	}
}
