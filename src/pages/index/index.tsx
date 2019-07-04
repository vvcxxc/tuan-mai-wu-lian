import Taro, { Component, Config } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Input, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.styl';
import Tabs from '../../components/tabs';
import request from '../../services/request';
import questTwo from '../../services/requesTwo'
import ActivityList from './activity-list';
import { Current } from 'dist/npm/@tarojs/taro/dist';
// import { set as setGlobalData, get as getGlobalData } from '../../../defienGlobal'

export default class Index extends Component {
	/**
	 * 指定config的类型声明为: Taro.Config
	 *
	 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
	 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
	 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
	 */
	config: Config = {
		navigationBarTitleText: '团卖物联'
	};

	state = {
		searchValue: '',
		storeList: [],
		storeHeadImg: '',
		cityId: '',
		titleList: [],
		manageTypeId: '',
		locationPosition: { longitude: 1, latitude: 1 },//存储获取到的地理位置
		router: { cityId: '', longitude: '', latitude:''}
	};

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.requestCityId();//城市id
		this.getPosition();// 经纬度
		this.requestBusinessList(); //经营列表
		this.requestLoading(); //菊花loding
	}

	componentDidMount() {
		this.questRouter();//从路由跳转
	}

	
	// 微信自带监听 滑动事件
	onPullDownRefresh = () => {
		this.requestHomeList()
	}

	// 往下滚动触发
	onPageScroll = (e) => {
		// console.log(e, 'e')
	}

	requestLoading() {
		Taro.showLoading({
			title: 'loading',
			mask: true
		})
	}

	getPosition() {
		Taro.getLocation({ type: 'wgs84' }).then(res => {
			this.setState({ locationPosition: res }, () => {
				this.requestHomeList();
			})
		})
	}

	
	requestCityId = () => {
		if(this.state)
		request({
			url: 'v3/city/getList',
			data: { name: '广州', initial: 'G' }
		})
			.then((res: any) => {
				this.setState({ cityId: res.initial.G[0].id })
			})
	};

	requestBusinessList = () => {
		questTwo({
			url: 'v3/manage_type'
		})
			.then((res: any) => {
				let data = [{ name: '全部', id: 'all' }]
				let mete = [...data, ...res]
				this.setState({ titleList: mete })
			})
	}

	questRouter=()=> {
		this.setState({
			router:
			{
				cityId: this.$router.params.id,
				longitude: this.$router.params.lng,
				latitude: this.$router.params.lat
			}
		})
	}

	requestHomeList=()=> {
		let that
		let thatTwo
		if (typeof (this.state.router.cityId) === 'string') {
			if (this.state.router.cityId.length > 1) {
				that = this.state.router
				thatTwo = this.state.router.cityId
			} else {
				that = this.state.locationPosition
				thatTwo = this.state.cityId
			}
		} else {
			that = this.state.locationPosition
			thatTwo = this.state.cityId
		}

		request({
			url: 'v3/stores',
			data: { city_id: thatTwo, xpoint: that.longitude, ypoint: that.latitude }
		})
			.then((res: any) => {
				Taro.stopPullDownRefresh()
				Taro.hideLoading()
				this.setState({ storeList: res.store_info.data, storeHeadImg: res.banner });
			})
			.catch(() => {
				this.requestLoading()
			})
	}




	handleSearch = () => Taro.navigateTo({ url: './search/index' });

	showSelectCity = () => Taro.navigateTo({ url: '/business-pages/select-city/index' });

	requestIndexData = () => {
	};

	handleActivityClick = () => { };

	
	tabChange = (id: string) => {
		this.requestLoading()
		if (id === 'all') {
			this.requestHomeList()
			return
		}
		let that = this.state.locationPosition
		request({
			url: 'v3/stores/index',
			data: { city_id: this.state.cityId, xpoint: that.longitude, ypoint: that.latitude, deal_cate_id: id }
		})
			.then((res: any) => {
				Taro.hideLoading()
				this.setState({ storeList: res.store_info.data, storeHeadImg: res.banner });
			})
	};
	

	render() {
		return (
			<View className="index">
				<View className="head">
					<View className="search">
						<View className="flex center container">
							<View className="city" onClick={this.showSelectCity}>
								广州
							</View>
							<AtIcon
								onClick={this.showSelectCity}
								className="chevron-down"
								value="chevron-down"
								color="#313131"
								size="12"
							/>
							<View className="long-string" />
							<AtIcon className="search-icon" value="search" color="#666666" size={14} />
							<View className="item search-input" onClick={this.handleSearch}>
								请输入商家名、品类
							</View>
						</View>
					</View>
					<Swiper
						className="swiper"
						indicatorColor="#999"
						indicatorActiveColor="#333"
						circular
						indicatorDots
						autoplay
					>
						<SwiperItem>
							<Image src={require('../../assets/banner.png')} mode="widthFix" className="banner" />
						</SwiperItem>
					</Swiper>
				</View>
				<View className="menus flex">
					<View className="item">
						<Image mode="widthFix" className="img" src={require('./menu-1.png')} />
					</View>
					<View className="item">
						<Image mode="widthFix" className="img" src={require('./menu-2.png')} />
					</View>
				</View>
				<Tabs list={this.state.titleList} onChange={this.tabChange} />
				<ActivityList list={this.state.storeList} onClick={this.handleActivityClick} />
			</View>
		);
	}
}
