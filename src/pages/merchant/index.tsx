import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtSearchBar } from 'taro-ui';
import './index.styl';
import request from '../../services/request';
import List from './list';
import FilterTab from 'src/components/filter-tab';
import LiftList from 'src/components/lift-list';

import FilterTotal from "src/components/filter-total";

export default class MerChantPage extends Component {
	config = {
		navigationBarTitleText: '商家'
	};

	state = {
		search: '',
		stores: [],
		filter: [],
		locationPosition: { longitude: '', latitude: '' },//存储获取到的地理位置
		select: [],
		selectData: { name: '', type: "" },
	};

	constructor(props) {
		super(props);
	}
	componentWillMount() {
		this.getPosition();// 经纬度
		Taro.showLoading({ title: 'loading', mask: true })//显示loading
		
		// this.requestSearch(this.$router.params.value);//路由搜索 渲染页面
	}



	componentDidMount() {
		// console.log(this.$router.params.value,'路由')
		// this.requestSort()
	}

	
		
	

	// 搜索赋值
	handlerSearch = (value) => {
		this.setState({ search: value });
	}

	// 点击搜索触发
	onActionClick = () => {
		this.requestSearch(this.state.search)// 搜索渲染
	}


	// 获取经纬度
	getPosition() {
		Taro.getLocation({ type: 'wgs84' }).then(res => {
			this.setState({ locationPosition: res }, () => {
				this.requestSearch(this.$router.params.value)//路由渲染
				let that = this.state.locationPosition
				this.requestData(that.longitude, that.latitude, this.$router.params.value) //渲染页面
			})
		})
	}

	//处理 路由跳转 和 搜索
	requestSearch = (search) => {
		if (!search) return
		Taro.showLoading({ title: 'loading', mask: true })
		request({
			url: 'v3/stores',
			data: {
				xpoint: this.state.locationPosition.longitude,
				ypoint: this.state.locationPosition.latitude,
				keyword: search
			},
		})
			.then((res: any) => {
				this.setState({ stores: res.store_info.data })
				Taro.hideLoading()
			});
	}

	// 首页页面渲染
	requestData = (xpoint, ypoint, search?) => {
		if (search) return
		request({
			url: 'v3/stores',
			data: {
				xpoint: xpoint,
				ypoint: ypoint
			}
		})
			.then((res: any) => {
				this.setState({ stores: res.store_info.data })
				Taro.hideLoading()
			})
	}

	getData(xpoint, ypoint, id?) {
		// const data1 = Taro.getStorageSync('type1')
		// const data2 = Taro.getStorageSync('type2')
		// const data3 = Taro.getStorageSync('type3')
		// var meta: dataType = {}
		// if (data1) {
		// 	meta.deal_cate_id = id
		// }
		// if (data2) {
		// 	meta.distance_id = id
		// }
		// if (data3) {
		// 	meta.sort_id = id
		// }
		// request({
		// 	url: 'v3/stores',
		// 	data: {
		// 		xpoint: xpoint,
		// 		ypoint: ypoint,
		// 		...meta
		// 	},
		// })
		// 	.then((res: any) => this.setState({ stores: res.store_info.data }));
	}




	filterClick = (type, id, res) => {
		// let that = this.state.locationPosition
		// let data = {
		// 	[1]: 'deal_cate_id',
		// 	[2]: 'distance_id',
		// 	[3]: 'sort_id'
		// }
		// this.getData(that.longitude, that.latitude, id)
	}

	// 跳转详情
	handleClick = id => {
		Taro.navigateTo({
			url: '/pages/business/index?id=' + id
		})
	};

	render() {
		return (
			<View>
				<AtSearchBar value={this.state.search}
					onActionClick={this.onActionClick.bind(this)}
					onChange={this.handlerSearch.bind(this)}
				/>
				<FilterTotal onClick={this.filterClick.bind(this)} />
				<View className="merchant-list">
					<List onClick={this.handleClick} list={
						this.state.stores
					} />
				</View>
			</View>
		);
	}
}
