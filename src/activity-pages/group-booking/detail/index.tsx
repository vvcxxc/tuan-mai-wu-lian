import Taro, { PureComponent, Config } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';

import './index.scss';

class GroupBookingDetail extends PureComponent {
	config: Config = {
		navigationBarTitleText: ''
	};

	componentDidMount() {
		Taro.setNavigationBarTitle({ title: '当前详情' });
	}

	render() {
		return (
			<View className="page">
				<View className="head">
					<Swiper>
						<SwiperItem>
							<Image className="banner-img" mode="widthFix" src={require('../../../assets/banner.png')} />
						</SwiperItem>
					</Swiper>
					<View className="purchase-tip flex center left">
						<Image src="" className="img" />
						杨温饱 拼团成功
					</View>
				</View>
				<View className="content">
					<View className="title">一颗红包起司蛋糕餐券</View>
					<View className="time">活动时间：2019.3.10-2019.4.10</View>
					<View className="labels">
						<View className="item">送价值3000元蓝牙耳机</View>
						<View className="item">3人团</View>
						<View className="item">24小时</View>
					</View>
					<View className="detail">
						<View className="title">商品详情</View>
						<View className="text">
							简介详情简介详情简介详情简介详情简介详情简介详情简介
							简介详情简介详情简介详情简介详情简介详情。
						</View>
					</View>
				</View>
			</View>
		);
	}
}
export default GroupBookingDetail;
