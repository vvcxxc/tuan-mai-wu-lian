import Taro, { PureComponent } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtSearchBar } from 'taro-ui';
import './index.scss';

class IndexSearchPage extends PureComponent {
	config = {
		navigationBarTitleText: '团卖物联'
	};

	state = {
		searchStr: ''
	};

	handleSearchBarChange = value => this.setState({ searchStr: value });

	handleSearch = () => {};

	render() {
		return (
			<View className="flex column page">
				<AtSearchBar
					placeholder="请输入城市名/拼音"
					value={this.state.searchStr}
					onChange={this.handleSearchBarChange}
					onConfirm={this.handleSearch}
				/>
				<View className="item content">
					<View className="head flex center">
						<View className="text item">历史搜索</View>
						<Image src="" className="trash-icon" />
					</View>
					<View className="history">
						<View className="item">上海市</View>
					</View>
					<View className="head flex center">
						<View className="text item">大家都在搜</View>
					</View>
					<View className="history">
						<View className="item">上海市</View>
						<View className="item">呼和浩特</View>
						<View className="item">上海市徐家汇</View>
					</View>
				</View>
			</View>
		);
	}
}
export default IndexSearchPage;
