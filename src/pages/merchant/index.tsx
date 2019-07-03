import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtSearchBar } from 'taro-ui';
import './index.styl';
import request from '../../services/request';
import List from './list';
import FilterTab from 'src/components/filter-tab';
import LiftList from 'src/components/lift-list';

import FilterTotal from "src/components/filter-total";
interface dataType {
	deal_cate_id?: number | string,
	distance_id?: number | string,
	sort_id?: number | string
}
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
	}
	componentDidMount() {
		// this.requestSort()
	}

	handlerSearch(value) {
		this.setState({ search: value });
	}

	// 获取经纬度
	getPosition() {
		Taro.getLocation({ type: 'wgs84' }).then(res => {
			this.setState({ locationPosition: res }, () => {
				let that = this.state.locationPosition
				this.getIf(that.longitude, that.latitude)
			})
		})
	}

	getData(xpoint, ypoint, id?) {
		const data1 = Taro.getStorageSync('type1')
		const data2 = Taro.getStorageSync('type2')
		const data3 = Taro.getStorageSync('type3')
		var meta: dataType = {}
		if (data1) {
			meta.deal_cate_id = id
		}
		if (data2) {
			meta.distance_id = id
		}
		if (data3) {
			meta.sort_id = id
		}
		request({
			url: 'v3/stores',
			data: {
				xpoint: xpoint,
				ypoint: ypoint,
				...meta
			},
		})
			.then((res: any) => this.setState({ stores: res.store_info.data }));
	}



	getIf = (xpoint, ypoint) => {
		request({
			url: 'v3/stores',
			data: {
				xpoint: xpoint,
				ypoint: ypoint,
			},
		})
			.then((res: any) => {
				this.setState({ stores: res.store_info.data })
			})
	}


	// handleClick2 = () => {
	// 	request({
	// 		url: 'v3/stores'
	// 	})
	// 		.then((res: any) => {
	// 			this.setState({
	// 				stores: res.store_info.data
	// 			})
	// 		});
	// }

	handleClick = id => {
		Taro.navigateTo({
			url: '/pages/business/index?id=' + id
			// url: '/pages/business/index?id=717'
		})
	};

	filterClick = (type, id, res) => {
		let that = this.state.locationPosition
		let data = {
			[1]: 'deal_cate_id',
			[2]: 'distance_id',
			[3]: 'sort_id'
		}
		this.getData(that.longitude, that.latitude, id)
	}


	render() {
		return (
			<View>
				<AtSearchBar value={this.state.search} onChange={this.handlerSearch.bind(this)} />
				<FilterTotal onClick={this.filterClick.bind(this)} />
				{/* <FilterTab onChange={this.filterChange} type={this.state.selectData}/> */}
				{/* <LiftList merchant={this.state.select} updateData={this.updateFather.bind(this)} /> */}
				<View className="merchant-list">
					<List onClick={this.handleClick} list={
						this.state.stores
					} />
				</View>
			</View>
		);
	}
}
