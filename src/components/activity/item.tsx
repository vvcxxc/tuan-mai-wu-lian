import Taro , { PureComponent, ComponentOptions } from '@tarojs/taro';
import { View, Text , Button} from '@tarojs/components';

interface Props {
  onClick: (id: any) => any
}

class ActivityItem extends PureComponent<Props | any> {
  static options: ComponentOptions = {
    addGlobalClass: true
  }
  handleClick = () => this.props.onClick(this.props.item.id)
  render() {
    return (
      <View className="activity-item">
        //
      </View>
    );
  }
}
export default ActivityItem;
