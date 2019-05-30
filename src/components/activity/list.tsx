import Taro , { PureComponent, ComponentOptions } from '@tarojs/taro';
import { View, Text , Button} from '@tarojs/components';
import ActivityItem from './item';

interface Props {
  list: Array<any>
  onClick: (id: any) => any
}

class ActivityList extends PureComponent<Props> {
  static options: ComponentOptions = {
    addGlobalClass: true
  }
  render() {
    const list = this.props.list.map(_ => <ActivityItem item={_} key={_.id}></ActivityItem>)
    return (
      <View className="list">
        {list}
      </View>
    );
  }
}
export default ActivityList;
