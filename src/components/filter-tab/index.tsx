import Taro, { PureComponent } from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.scss';
import { AtIcon } from 'taro-ui';

class FilterTab extends PureComponent {
	state = {
		current: 0
	};

	handleClick = current => () => this.setState({ current });

	render() {
		const tabs = ['美食', '附近', '智能排序'];

		const tabsEle = tabs.map((_, index) => {
			const checked = index === this.state.current;
			return (
				<View
					key={_}
					className={(checked ? 'checked' : '') + ' item flex center'}
					onClick={this.handleClick(index)}
				>
					<View className="title">{_}</View>
					<AtIcon value="chevron-down" color={checked ? '#FF6654' : '#999'} size={12} />
				</View>
			);
		});

		return <View className="filter flex">{tabsEle}</View>;
	}
}
export default FilterTab;
