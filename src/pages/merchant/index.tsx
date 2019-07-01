import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtSearchBar } from 'taro-ui';
import './index.styl';
import request from '../../services/request';
import List from './list';
import FilterTab from 'src/components/filter-tab';

export default class MerChantPage extends Component {
	config = {
		navigationBarTitleText: '商家'
	};

	state = {
		search: '',
		stores: []
	};

	componentDidMount() {
		this.getData();
	}

	handlerSearch(value) {
		this.setState({ search: value });
	}

	getData() {
		request({
			url: 'v3/stores'
		}).then((res: any) => {
			this.setState({
				stores: res.store_info.data
			})
		});
	}

	handleClick = id => {
		console.log(id);
		Taro.navigateTo({
			// url: '/pages/business/index?id=' + id
			url: '/pages/business/index?id=717'
		})
	};

	render() {
		return (
			<View>
				<AtSearchBar value={this.state.search} onChange={this.handlerSearch.bind(this)} />
				<FilterTab />
				<View className="merchant-list">
					<List onClick={this.handleClick} list={this.state.stores} />
				</View>
			</View>
		);
	}
}
