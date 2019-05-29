import Taro , { Component } from '@tarojs/taro';
import { View} from '@tarojs/components';
import Merchant from '../../components/merchant';

interface Props {
  list: Array<any>
  onClick: (id: any) => any
}

export default class List extends Component<Props> {

   config = {
       navigationBarTitleText: ''
  }

  render() {
    const list = this.props.list.map(_ => <Merchant onClick={this.props.onClick} key={_.id} merchant={_} />)
    return (
      <View>
        {list}
      </View>
    );
  }
}
