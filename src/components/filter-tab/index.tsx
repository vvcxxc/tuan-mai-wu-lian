import Taro, { PureComponent } from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.scss';
import { AtIcon } from 'taro-ui';
import request from '../../services/request';

interface Props {
	type?: any;
	onChange: (number) => any;
}
class FilterTab extends PureComponent<Props> {
	state = {
		current: null,
		open: false,
		titleList: [],
		updateTitle: []
	};
	constructor() {
		super(...arguments)
	}

	componentWillMount() {
	}

	handleClick = current => () => {
	};

	render() {
		const tabsEle = this.state.titleList.map((_, index) => {
			const checked = index === this.state.current;
			return (
				<View
					style="background-color:#fff;"
					key={_}
					className={(checked ? 'checked' : '') + ' item flex center'}
					onClick={this.handleClick(index)}
				>
					<View className="title">{_}</View>
					<AtIcon value={(checked ? 'chevron-up' : 'chevron-down')} color={checked ? '#FF6654' : '#999'} size={12} />
				</View>
			);
		});

		return <View className="filter flex">{tabsEle}</View>;
	}
}
export default FilterTab;
