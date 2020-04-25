import Taro, { Component, Config } from '@tarojs/taro';
import { View, } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import { getCityName } from './service'
import OldIndex from './components/oldIndex'
import MarketingIndex from './components/marketingIndex'
@connect(
  state => ({
    serchName: state.search.get('serchName'),
  }),
  dispatch => ({
    getDataList(payload: any): void {
      dispatch({
        type: 'search/getDataList',
        payload,
      })
    },
    onIncrement(): void {
      dispatch({
        type: 'search/searchname',
        payload: {
          serchName: '444444'
        }
      })
    },
  })
)



export default class Index extends Component<any> {
	/**
	 * 指定config的类型声明为: Taro.Config
	 *
	 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
	 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
	 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
	 */
  config: Config = {
    navigationBarTitleText: '小熊敬礼',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#ff4444',
    navigationBarTextStyle: 'white'
  };

  state = {
    is_marketing: false,
    changePull: 0,
    changeBottom: 0,
    changeShow: 0
  };

  constructor(props) {
    super(props);
  }
  onShareAppMessage = e => {
    return {}
  }

  componentDidShow() {
    Taro.getSystemInfo().then(res => {
      if (res.model.includes('iPhone X')) {
        Taro.setStorageSync('isIPhoneX', true)
      }
    })
    let router = Taro.getStorageSync('router') || {}
    if (router.city_name) {
      if(router.type_index_id >= 1){
        console.log('触发333')
        this.setState({ is_marketing: true })
      }else {
        this.setState({ is_marketing: false })
      }
    } else {
      Taro.getLocation({
        type: 'gcj02',
        success: res => {
          let data = {
            xpoint: res.longitude,
            ypoint: res.latitude
          }
          getCityName(data).then((res: any) => {
            router.city_name = res.data.city
            router.city_id = res.data.city_id
            router.type_index_id = res.data.type_index_id
            if (res.data.type_index_id >= 1) {
              this.setState({ is_marketing: true })
            } else {
              this.setState({ is_marketing: false })
            }
            Taro.setStorageSync('router', router)
          })

        }
      })
    }
    // this.setState({is_marketing: false})
    const { changeShow } = this.state
    this.setState({ changeShow: changeShow + 1 })
  }

  // 下拉刷新
  onPullDownRefresh() {
    const { changePull } = this.state
    this.setState({ changePull: changePull + 1 })
  }

  //  触底
  onReachBottom() {
    const { changeBottom } = this.state
    this.setState({ changeBottom: changeBottom + 1 })
  }

  // 避免出现定位未切换首页情况
  handleChange = (type) => {
    console.log(2,'type change')
    if(type == 1){
      this.setState({ is_marketing: true })
    }else {
      this.setState({ is_marketing: false })
    }
  }




  render() {
    const { changeBottom, changePull, changeShow } = this.state
    return (
      <View className="index">
        {this.state.is_marketing ? <MarketingIndex changeBottom={changeBottom} changePull={changePull} changeShow={changeShow} /> : <OldIndex onChange={this.handleChange} changeShow={changeShow} changeBottom={changeBottom} changePull={changePull} />}
      </View>
    );
  }
}
