import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtSearchBar } from "taro-ui";
import "./index.styl";

export default class SelectCity extends Component {
  state = { value: "" };

  handlerChange(value) {
    this.setState({ value });
  }

  render() {
    return (
      <View className="search-wrap">
        <AtSearchBar
          value={this.state.value}
          onChange={this.handlerChange.bind(this)}
        />
        <View className="hide" />
      </View>
    );
  }
}
