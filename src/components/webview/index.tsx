import Taro, {Component} from '@tarojs/taro'

import { WebView, View } from '@tarojs/components'
export default class WebViewUser extends Component {
  state = {

  };
  componentDidMount(){
  }
  handleChange = (e) => {
    let { data } = e.detail
    console.log(data)
    console.log(33123123)
  }
  render (){
    return (
      <View>
        <WebView src='http://127.0.0.1:8848/WXAuth/index_xcx.html' onMessage={this.handleChange}></WebView>
      </View>
    )
  }
}
