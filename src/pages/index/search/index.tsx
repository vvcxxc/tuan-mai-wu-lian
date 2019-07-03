import Taro, { PureComponent } from '@tarojs/taro';
import { View, Image, Canvas } from '@tarojs/components';
import { AtSearchBar, AtIndexes, AtIcon } from 'taro-ui';
import './index.scss';
import request from '../../../services/request'
// import { Search } from "../../../../defienGlobal";

interface Props {
	/**默认当前高亮的索引值 */
	// defaultCurrent?: number;
	// list: any;
	history: {
		push: (number) => any;
	}
	onSearch: (number) => any;
}

class IndexSearchPage extends PureComponent<Props> {
	config = {
		navigationBarTitleText: '团卖物联'
	};

	state = {
		searchStr: '',
		locationList: [],
		list:['上海市', '杭州市', '北京市', '广州市', '天津市', '南京市', '武汉市', '苏州市', '福州市']
	};

	constructor(props) {
		super(props);//把this轉會

	}

	componentWillMount() {
		this.requestLocation()
		// this.requestLoading()
	}

	componentDidMount() {
	}

	// 往下滚动触发
	onPageScroll = (e) => {
		console.log(e, 'e')
	}

	requestLoading = () => {
		Taro.showLoading({
			title: 'loading',
			mask: true
		})
	}
	onClick(item, event) {
		console.log(item, event)
	}
	onDelete() {
		this.setState({list:[]})
	}

	requestLocation = () => {
		request({ url: 'v3/district', data: { model_type: '2' } })
			.then((res: any) => {
				let define = res.city_list.filter((item, index) => {
					// if (item.length !== 0) {
				})
				// console.log(define)
				this.setState({ locationList: [res.city_list[0]] }, () => {
					// res.city_list ? Taro.hideLoading() : this.requestLoading()
					console.log(this.state.locationList)
				})

			})
	}

	handleSearchBarChange = value => {
		console.log(value, 'value')
		this.setState({ searchStr: value });
	}

	onActionClick() {
		Taro.navigateTo({
			url: '../../../components/filter-tab/index?search' + this.state.searchStr,
		})
	}

	handleSearch = () => { };

	render() {
		return (
			<View style='height:100vh; background-color:#fff;'>
				<View className="flex column page">
					<AtSearchBar
						placeholder="请输入城市名/拼音"
						value={this.state.searchStr}
						onChange={this.handleSearchBarChange}
						onConfirm={this.handleSearch}
						onActionClick={this.onActionClick.bind(this)}
					/>
					<View className="item content">
						<View className="head flex center">
							<View className="text item" style=" display:flex;  justify-content:space-between;">
								<View style="color:#999999;">历史搜索</View>
								<AtIcon value='trash' size='20' color='#999999'
									onClick={this.onDelete.bind(this)}
								></AtIcon>
							</View>
						</View>
						<View className="history">
							{
								this.state.list.map((item, index) => {
									return <View className="item" key={index}>{item}</View>
								})
							}
						</View>
					</View>
					<View >
						<View style="color:#999999; padding-left:20px;margin-bottom:20px;">大家都在搜</View>
						<View className="history" style="padding:0px 20px 0px 20px;">
							{
								this.state.list.map((item, index) => {
									return <View className="item" key={index}>{item}</View>
								})
							}
						</View>
					</View>
				</View>
				<View>
				</View>
			</View>
		);
	}
}
export default IndexSearchPage;
