import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.styl";

interface Props {
  /**默认当前高亮的索引值 */
  defaultCurrent?: number;
  list: Array<string>;
  onChange: (number) => any;
}
export default class Tabs extends Component<Props> {
  constructor(props) {
    super(props);
    this.state.current = props.defaultCurrent || 0;
  }

  state = {
    current: 0
  };

  handlerTablChange(current) {
    this.setState({ current });
    this.props.onChange(current);
  }
  render() {
    return (
      <View className="tab flex">
        {this.props.list.map((_, index) => (
          <View
            key={index}
            className={
              "item flex center " +
              (this.state.current === index ? "active" : "")
            }
            onClick={this.handlerTablChange.bind(this, index)}
          >
            <View className="label">{_}</View>
          </View>
        ))}
      </View>
    );
  }
}
