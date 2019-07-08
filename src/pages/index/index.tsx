import Taro, { Component, Config } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Input, Image } from '@tarojs/components';
import { AtIcon,AtButton } from 'taro-ui';
import './index.styl';
import Tabs from '../../components/tabs';
import request from '../../services/request';
import questTwo from '../../services/requesTwo'
import ActivityList from './activity-list';
import { connect } from '@tarojs/redux'
// import { ComponentClass } from 'react'

@connect(
	state => ({
		serchName: state.search.get('serchName'),
	}),
	dispatch => ({
		getDataList(payload: any): void {
			dispatch({
				type: 'search/getDataList',
				payload,
			})
		},
		onIncrement(): void {
			dispatch({
				type: 'search/searchname',
				// payload: { serchName:'44343242'}
			})
		},
	})
)
	
export default class Index extends Component<any> {
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
		storeList: [],
		storeHeadImg: '',
		titleList: [], // title列表
		locations: { longitude: 1, latitude: 1 },//存储地理位置
		routerId:'', //路由传递的id
		cityName: '',
		page:1
	};

	constructor(props) {
		super(props);
	}

	/* 
		刚开始打开首页的时候， 获取一次定位 然后渲染数据  
		然后就只能通过
	*/

	componentWillMount() {
		this.showLoading();
		this.requestTab(); //经营列表
		this.requestAllCity(); //获取全国各地列表
		this.getLocation();//经纬度
		if (this.$router.params.locationsY || this.$router.params.locationsX) {
			this.setState(
				{ locations: { longitude: this.$router.params.locationsX, latitude: this.$router.params.locationsY } },
				() => {
					console.log(this.state.locations ,'uiiuiu')
				}
			)
		}
	}

	componentDidMount() {
		console.log(this.props.serchName,'这里是')
		// console.log(store.getState())
	}

	

	// show loading
	showLoading = () => {
		Taro.showLoading({
			title: 'loading',
			mask: true
		})
	}


	// get location
	getLocation = () => {
		Taro.getLocation({ type: 'wgs84' }).then(res => {
			this.setState({ locations: res }, () => {
				this.getCity();
				this.requestHomeList();
				this.searChange();
			})
		})
	}

	// 获取城市
	getCity = () => {
		let that = this.state.locations
		request({
			url: 'v3/city_name',
			data: { xpoint: that.longitude, ypoint: that.latitude }
		})
			.then((res: any) => {
				this.setState({ cityName: res.city })
			})
	}

	// 获取所有城市  只获取一次 本地存储之后， 就再也不获取了
	requestAllCity = () => {
		request({ url: 'v3/district', data: { model_type: '2' } })
			.then((res: any) => {
				Taro.setStorage({ key: 'city', data: res.city_list })
			})
	}


	// 自带 下拉事件
	onPullDownRefresh = () => {
		this.requestHomeList()
	}
	// 自带 触底事件
	onReachBottom = () => {
		this.showLoading()
		this.setState({page:this.state.page+1})
		request({
			url: 'v3/stores',
			data: { xpoint: this.state.locations.longitude, ypoint: this.state.locations.latitude, page:this.state.page }
		})
			.then((res: any) => {
				Taro.stopPullDownRefresh()
				Taro.hideLoading()
				this.setState({ storeList: [...this.state.storeList, ...res.store_info.data] , storeHeadImg: res.banner });
			})
	}
	// 往下滚动触发
	onPageScroll = (e) => {
		// console.log(e, 'e')
	}

	// 获取title数据
	requestTab = () => {
		questTwo({
			url: 'v3/manage_type'
		})
			.then((res: any) => {
				let data = [{ name: '全部', id: 'all' }]
				let mete = [...data, ...res]
				this.setState({ titleList: mete })
			})
	}



	handleActivityClick = () => { };

	// 首页数据 初始渲染
	requestHomeList = () => {
		if (this.$router.params.id) return
		request({
			url: 'v3/stores',
			data: { xpoint: this.state.locations.longitude, ypoint: this.state.locations.latitude }
		})
			.then((res: any) => {
				Taro.stopPullDownRefresh()
				Taro.hideLoading()
				this.setState({ storeList: res.store_info.data, storeHeadImg: res.banner });
			})
			.catch(() => {
				this.showLoading()
			})
	}

	// 首页标题  点击然后筛选数据
	tabChange = (id: string) => {
		this.showLoading()
		if (id === 'all') {
			this.requestHomeList()
			return
		}
		let that = this.state.locations
		request({
			url: 'v3/stores',
			data: {  xpoint: that.longitude, ypoint: that.latitude, deal_cate_id: id }
		})
			.then((res: any) => {
				Taro.hideLoading()
				this.setState({ storeList: res.store_info.data, storeHeadImg: res.banner });
			})
	};


	// 选中城市列表 使用城市id去查数据
	searChange = () => {
		if (!this.$router.params.id) {
			return
		}
		let that = this.state.locations
		request({
			url: 'v3/stores',
			data: { xpoint: that.longitude, ypoint: that.latitude, city_id: this.$router.params.id}
		})
			.then((res: any) => {
				Taro.hideLoading()
				this.setState({ storeList: res.store_info.data, storeHeadImg: res.banner });
			})
	}

	// 跳转 搜索商家列表页面
	handleSearch = () => Taro.navigateTo({ url: './search/index' });
	// 跳转 搜素城市页面
	showSelectCity = () => Taro.navigateTo({ url: '/business-pages/select-city/index' });

/* 
	刚开始的时候 获取一次经纬度  
	后面获取位置 就只能通过 点击定位的页面传位置过来 包括（重新定位 或者是点 城市名字 城市id）

	这里 给获取定位页面一个固定的 搜索和点击一个假的城市名字都给 keyName   
	重新获取定位 给经纬度 还是名字
	然后点全国列表  这里是传城市id

	需要改变 首页上面的城市显示的名字   

	限制 ： 从定位页面过来之后  首页如果刷新的话， 就再也不能重新获取经纬度  想要改变， 唯一的方法就是再去定位页面

	第二部分， 首页页面数据刷新的 时候， 餐饮 ， 全部那些选项怎么说

*/
	
	cesi = () => {
		// this.props.dispatch({
		// 	type: 'search/searchname',
		// 	payload: {
		// 		serarch : 333333333
		// 	}
		// })
		this.props.onIncrement

		setTimeout(() => {
			console.log(this.props.serchName,'1')
		}, 1000);
		}
	render() {
		return (
			<View className="index">
				<View className="head">
					{/* <button onClick={this.props.onIncrement}>按钮{console.log(this.props.serchName)}</button> */}
					<AtButton onClick={this.props.onIncrement} size='small'> 3 {this.props.serchName}333</AtButton>
					<AtButton onClick={this.cesi.bind(this)} size='small'> + {this.props.serchName}333</AtButton>
					<View className="search">
						<View className="flex center container">
							<View className="city" onClick={this.showSelectCity}>
								{this.state.cityName}
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
					{/* <Swiper
						className="swiper"
						indicatorColor="#999"
						indicatorActiveColor="#333"
						circular
						indicatorDots
						autoplay
					> */}
						{/* <SwiperItem> */}
							<View className="swiper">
								<Image src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/dHBc2GQi27cjhNpsYpAnQYxybxPdADHG.png"} className="image" />
							</View>
						{/* </SwiperItem> */}
					{/* </Swiper> */}
				</View>
				{/* flex */}
				{/* <View className="menus" style="overflow:hidden"> */}
					{/* <View className="item"> */}
						 {/* mode="widthFix" */}
						{/* <Image className="img" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MfwcW2Qn5hC8T4mfJT8t5NcAEh7pTQRb.png"} /> */}
					{/* </View> */}
					{/* <View className="item"> */}
						{/* mode="widthFix" */}
						{/* <Image  className="img" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/wWmWHKBjWZbkxYNPGPRZAst8CKbfNsGk.png"} /> */}
					{/* </View> */}
				<View  className="advert">
						<Image src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MfwcW2Qn5hC8T4mfJT8t5NcAEh7pTQRb.png"}></Image>
						<Image src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/wWmWHKBjWZbkxYNPGPRZAst8CKbfNsGk.png"}></Image>
					</View>
				{/* </View> */}
				<Tabs list={this.state.titleList} onChange={this.tabChange} />
				<ActivityList list={this.state.storeList} onClick={this.handleActivityClick} />
			</View>
		);
	}
}
