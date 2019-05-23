import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtSearchBar, AtIcon } from "taro-ui";
import Merchant from "../../components/merchant";
import "./index.styl";
import request from "../../services/request";

export default class MerChantPage extends Component {
  config = {
    navigationBarTitleText: "商家"
  };

  state = {
    search: "",
    stores: []
  };

  componentDidMount() {
    this.getData();
  }

  handlerSearch(value) {
    this.setState({ search: value });
  }

  getData() {
    request({
      url: "/v3/stores"
    }).then((res: any) => this.setState({ stores: res.store_info.data }));
  }

  render() {
    return (
      <View>
        <AtSearchBar
          value={this.state.search}
          onChange={this.handlerSearch.bind(this)}
        />
        <View className="screen-filter flex">
          <View className="item flex center">
            美食
            <AtIcon value="chevron-down" color="#999" size={12} />
          </View>
          <View className="item flex center">
            附近
            <AtIcon value="chevron-down" color="#999" size={12} />
          </View>
          <View className="item flex center">
            智能排序
            <AtIcon value="chevron-down" color="#999" size={12} />
          </View>
        </View>
        <View className="merchant-list">
          {this.state.stores.map((_: any) => (
            <Merchant key={_.id} merchant={_} />
          ))}
        </View>
      </View>
    );
  }
}
