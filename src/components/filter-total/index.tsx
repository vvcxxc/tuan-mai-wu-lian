import Taro, { PureComponent, Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui'
import request from '../../services/request';
import './index.scss';
// import { type } from 'os';

interface Props {
  onClick: (type, id?, res?) => any;
}
export default class filterTotal extends Component<Props> {

  state = {
    titleClick: null,//点击的索引
    titleList: [
      { name: '美食', type: 1, titleShow: false },
      { name: '附近', type: 2, titleShow: false },
      { name: '智能排序', type: 3, titleShow: false }
    ],
    selectData: [{ name: '', id: '', type: '', choose: false, icon: '' }],
    listClick: 333,
  };

  constructor() {
    super(...arguments)
  }
  componentWillMount() {
  }
  componentDidMount() {
  }

  titleClick = (type?, index?) => () => {
    let that = this.state
    if (that.titleClick === index) { // 判断点击了两次
      console.log('点击两次')
      this.setState({ titleClick: null })
      this.setState({ selectData: [{}] })
      return
    }
    console.log('点击一次')
    that.titleList[index].titleShow = false //每行不显示
    this.setState({ titleClick: index })
    this.getSelect(type)
  };











  listClick = (index, type, name, id, res, item) => () => {

    if (this.state.listClick === index) {
      console.log('点击22次')
      this.setState({ selectData: [{}] })
      this.setState({ listClick: undefined }) //设置为空 保证第三次点击
      this.setState({ titleClick: undefined })
      this.state.titleList[type - 1] = { name: name, type: type, titleShow: true }
      // Taro.setStorage({ key: `${'type' + type}`, data: type })
      Taro.removeStorage({ key: `${'type' + type}` })
      //   .then(res => console.log(res))
      return
    }
    console.log('点击11次')
    Taro.setStorageSync(`${'type' + type}`, type)
    // Taro.setStorage({ key: `${'type' + type}`, data: {id} })

    // Taro.getStorage({ key: `${'type' + type}` })
    //   .then(res => {
    //       console.log(res.data, '存储2')
    //   })
    
    this.setState({ selectData: [{}] })
    // Taro.setStorageSync(`${'type' + type}`, type)

    //替换掉 title的数据
    this.state.titleList[type - 1] = { name: name, type: type, titleShow: true }
    this.setState({ titleList: this.state.titleList })
    this.setState({ iconData: { icon: name } })

    // 更改上面的点击按钮 
    this.setState({ listClick: index })
    this.setState({ titleClick: null })

    this.props.onClick(type, id, res)

    console.log(type, '真实type2')

    // 异步存储
    // console.log(`${ 'type' + type }`,55555)
    // this.saveData(type)
    // Taro.setStorage({ key: `${'type' + type}`, data: type })

    // Taro.setStorage({ key: `'type'+${type}`, data: {['data'+`${type}`]:type} })
  }

  // 本地存储数据 
  // saveData(type) {
  //   Taro.getStorage({ key: `${type}` })
  //     .then(res => {
  //       if (res) {
  //         console.log(res.data, '存储2')
  //         return res.data
  //       }
  //       return ''
  //     })
  // }

  getSelect = (type: number) => {
    request({
      url: 'v3/select',
      data: { type: type }
    })
      .then((res: any) => {
        this.setState({ selectData: res })
      })
      .catch(() => {
      })
  }

  render() {
    return <View className="page">
      <View className="title">
        {
          this.state.titleList.map((item, index) => {
            let titleShow = this.state.titleList[index].titleShow
            return <View
              className="line"
              key={' '}
              onClick={this.titleClick(item.type, index)}
              style={{ color: titleShow ? '#fe7b70' : '#666666' }}>
              {item.name}
              <AtIcon value={titleShow ? 'chevron-up' : 'chevron-down'} size='12' color={titleShow ? '#fe7b70' : '#666666'}></AtIcon>
            </View>
          })
        }
      </View>
      {
        this.state.selectData.map((item, index) => {
          let that = this.state.selectData[index]
          // let then = this.state.iconData
          var then = {}

          return <View className={that.id ? 'list' : 'mt-5'} onClick={this.listClick(index, item.type, item.name, item.id,
            { ['type' + item.type]: item.id }, item
          )}
          >
            <View>{item.name}</View>
            <AtIcon value='check' size={(then === item.name ? '12' : '0')} color='#fe7b70'></AtIcon>
          </View>
        })
      }
    </View>
  }
}
