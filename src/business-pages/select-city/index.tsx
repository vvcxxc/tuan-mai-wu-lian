import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { AtSearchBar, AtIcon, AtIndexes } from "taro-ui";
import "./index.styl";

export default class SelectCity extends Component {
  state = { value: "" };

  handlerChange(value) {
    this.setState({ value });
  }

  render() {
    const list = [
      {
        title: "A",
        key: "A",
        items: [
          {
            name: "阿坝"
            // 此处可加其他业务字段
          },
          {
            name: "阿拉善"
          }
        ]
      },
      {
        title: "B",
        key: "B",
        items: [
          {
            name: "北京"
          },
          {
            name: "保定"
          }
        ]
      }
    ];
    return (
      <View className="search-wrap">
        <AtIndexes list={list}>
          <AtSearchBar
            value={this.state.value}
            onChange={this.handlerChange.bind(this)}
          />
          <View className="current-tip">当前定位</View>
          <View className="current-position flex center">
            <AtIcon value="map-pin" color="#FF6654" size={12} />
            <View className="item name">广州市</View>
            <View className="btn">重新定位</View>
          </View>
          <View className="bg" />
          <View className="current-tip">当前定位</View>
          <View className="hot-list">
            <View className="city">上海市</View>
            <View className="city">上海市</View>
            <View className="city">上海市</View>
            <View className="city">上海市</View>
            <View className="city">上海市</View>
            <View className="city">上海市</View>
            <View className="city">上海市</View>
            <View className="city">上海市</View>
            <View className="city">上海市</View>
            <View className="city">上海市</View>
            <View className="city">上海市</View>
            <View className="city">上海市</View>
          </View>
        </AtIndexes>
      </View>
    );
  }
}
