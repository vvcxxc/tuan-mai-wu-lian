import Taro, { PureComponent, Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui'
import request from '../../services/request';
import './index.scss';

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

  titleClick = (index?, type?) => () => {
    console.log(index,'index')
    // this.state.titleList[index].titleShow = true
    let that = this.state.titleList
    // this.setState({})
    that[index].titleShow = !that[index].titleShow
    // console.log(that[index].titleShow,'取反没有成男公关')
    // let that = this.state
    // if (that.titleClick === index) { // 判断点击了两次
    //   this.setState({ titleClick: null })
    //   this.setState({ selectData: [{}] })
    //   return
    // }
    // that.titleList[index].titleShow = false //每行不显示
    // this.setState({ titleClick: index })
    // this.getSelect(type)
  };

  listClick = (index, type, name, id) => () => {
    // console.log(type, 'type')
    // // console.log(`'type'+${type}`, '你要的type', `${'type' + type}`)
    // if (this.state.listClick === index) {
    //   console.log('第2次触发')
    //   this.setState({ selectData: [{}] })
    //   this.setState({ listClick: undefined }) //设置为空 保证第三次点击
    //   this.setState({ titleClick: undefined })
    //   this.state.titleList[type - 1] = { name: name, type: type, titleShow: true }
    //   // Taro.removeStorage({ key: `${'type' + type}` })
    //   Taro.removeStorage({ key: `${'type' + type}` })
    //   return
    // }
    // console.log('第1次触发')
    // Taro.setStorage({ key: `${'type' + type}`, data: type })

    // Taro.getStorage({ key: 'type1' }).then(res => console.log(res.data, '1'))
    
    // Taro.getStorage({ key: 'type2' }).then(res => console.log(res.data,'2'))
    // Taro.getStorage({ key: 'type3' }).then(res => console.log(res.data, '3'))
    // // Taro.setStorage(`${'type' + type}`, type)
    // this.setState({ selectData: [{}] })
    // //替换掉 title的数据
    // this.state.titleList[type - 1] = { name: name, type: type, titleShow: true }
    // this.setState({ titleList: this.state.titleList })
    // this.setState({ iconData: { icon: name } })

    // // 更改上面的点击按钮 
    // this.setState({ listClick: index })
    // this.setState({ titleClick: null })

    // this.props.onClick(type, id)
  }

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
    let that = this.state.titleList
    return <View className="page">
      <View className="title">
        {/* line  line */}
        <View className={that[1].titleShow ? 'line linRed' : " line linWat"}
          onClick={this.titleClick(1,'type1')}  >
          美食
          <AtIcon value={'chevron-up'} size='12' color={that[1].titleShow ? '#fe7b70' : '#666666' }></AtIcon>
        </View>
        <View className="line" onClick={this.titleClick(1, 'type2')}>
          附近
          <AtIcon value={'chevron-up'} size='12' color={'#fe7b70'}></AtIcon>
        </View>
        <View className="line" onClick={this.titleClick(1, 'type3')}>
          智能排序
          <AtIcon value={'chevron-up'} size='12' color={'#fe7b70'}></AtIcon>
        </View>
        {/* {
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
        } */}
      </View>
      {
        this.state.selectData.map((item, index) => {
          let that = this.state.selectData[index]
          var then = {}
          return <View className={that.id ? 'list' : 'mt-5'}
            onClick={this.listClick(index, item.type, item.name, item.id)}
          >
            <View>{item.name}</View>
            <AtIcon value='check' size={(then === item.name ? '12' : '0')} color='#fe7b70'></AtIcon>
          </View>
        })
      }
    </View>
  }
}
