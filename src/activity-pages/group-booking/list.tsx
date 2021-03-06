import Taro, { PureComponent } from '@tarojs/taro';
import { View } from '@tarojs/components';
import ActivityItem from 'src/components/activity-item';

interface Props {
	list: any[];
	onClick: (any) => any;
}

class List extends PureComponent<Props> {
	render() {
		const list = this.props.list.map(_ => <ActivityItem key={_} item={_} onClick={this.props.onClick} />);
		return <View>{list}</View>;
	}
}
export default List;
