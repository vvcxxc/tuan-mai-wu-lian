import Taro, { Component } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';

import './index.scss';
import Tabs from 'src/components/tabs';
import List from './list';

export default class Activity extends Component {
	config = {
		navigationBarTitleText: '活动中心'
	};

	state = {};

	tabChange = () => {};

	componentWillMount() {}

	pushPage = url => () => Taro.navigateTo({ url });

	render() {
		const list = ['全部', '关注', '丽人', '餐饮', '休闲', '服饰'];
		return (
			<View>
				<View className="search-wrap">
					<View className="search-bar flex center">
						<Image src="" className="search-icon" />
						请输入商家/分类或商圈
					</View>
				</View>
				<Swiper indicator-dots circular className="swiper">
					<SwiperItem>
						<Image className="banner-image" mode="widthFix" src={require('../../assets/banner.png')} />
					</SwiperItem>
				</Swiper>
				<View className="flex hot-icon">
					<View className="item" onClick={this.pushPage('/activity-pages/appreciation/index')}>
						<Image className="img" mode="widthFix" src={require('./hot-left.png')} />
					</View>
					<View className="item" onClick={this.pushPage('/activity-pages/group-booking/index')}>
						<Image className="img" mode="widthFix" src={require('./hot-right.png')} />
					</View>
				</View>
				<Tabs list={list} onChange={this.tabChange} />
				<List list={[1, 2, 3, 4, 5, 6]} />
			</View>
		);
	}
}
