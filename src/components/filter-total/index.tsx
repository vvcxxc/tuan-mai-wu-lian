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
    titleClick: 0,//点击的索引
    // titleList: [
    //   { name: '美食', type: 1, titleShow: false },
    //   { name: '附近', type: 2, titleShow: false },
    //   { name: '智能排序', type: 3, titleShow: false }
    // ],
    selectData: [{ name: '', id: '', type: '', choose: false, icon: '' }],
    listClick: 333,
    click1: 0,
    click2: 0,
    click3: 0,
    list: null,
    // title:null
  };

  constructor() {
    super(...arguments)
  }
  componentWillMount() {
  }
  componentDidMount() {
  }

  // titleClick1 = (index?, type?) => () => {
  //   // console.log(index,'index')
  //   this.getSelect(index)
  //   // this.state.titleList[index].titleShow = true
  //   let that = this.state.titleList
  //   // this.setState({})
  //   that[index].titleShow = !that[index].titleShow
  //   // console.log(that[index].titleShow,'取反没有成男公关')
  //   // let that = this.state
  //   // if (that.titleClick === index) { // 判断点击了两次
  //   //   this.setState({ titleClick: null })
  //   //   this.setState({ selectData: [{}] })
  //   //   return
  //   // }
  //   // that.titleList[index].titleShow = false //每行不显示
  //   // this.setState({ titleClick: index })
  //   // this.getSelect(type)
  // };
  titleClick1 = (index?, type?) => () => {
    // console.log(index,'index')
    let that = this.state
    this.setState({ click1: that.click1 + index }, () => {
      // console.log(this.state.click1, '次数')
      console.log(that.click1 % 2 !== 0, '结果')
      if (that.click1 % 2 !== 0) {

      }
    });  // 记录点击次数
    // if (this.state.click1 % 2 === 0)

    // if (this.state.click1 / 2 === 0) {

    // }

    // console.log('确实有执行',index)
    let only = false

    if (only) {
      console.log('点击第2次')
      // this.setState({ click1: false }) //点击第一次
      // only = false
      return
    }
    // only = true
    console.log('点击第一次')
    // this.setState({ click1: true }) //点击第一次
    this.getSelect(index)
  }

  titleClick2 = (index) => () => {
    let only = false
    if (only) {
      this.setState({ click2: false }) //点击第一次
      return
    }
    only = true
    this.setState({ click2: true }) //点击第一次
    this.getSelect(index)
  }

  titleClick3 = (index) => () => {
    let only = false
    if (only) {
      this.setState({ click3: false }) //点击第一次
      return
    }
    only = true
    this.setState({ click3: true }) //点击第一次
    // let 
    this.getSelect(index)//点击第一次，给数据  变红

    // 点击第二次 没数据 变黑
  }

  listClick = (index, id?) => () => {
    // this.setState({ title:index})
    // let that = this.state
    // this.setState({ title: that.title + index }, () => {
    //   // console.log(this.state.click1, '次数')
    //   console.log(that.title % 2 !== 0, '结果')
    //   if (that.click1 % 2 !== 0) {

    //   }
    // }); 
    this.setState({ click1: 1 })
    this.setState({list:index})
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
  }

  render() {
    return <View className="page">
      <View className="title">
        <View className={this.state.click1 % 2 !== 0 ? 'line linRed' : " line linWat"}
          onClick={this.titleClick1(1)}  >
          美食
          <AtIcon value={this.state.click1 % 2 !== 0 ? 'chevron-up' : 'chevron-down'} size='12'
            color={this.state.click1 % 2 !== 0 ? '#fe7b70' : '#666666'}></AtIcon>
        </View>
        <View className="line" onClick={this.titleClick2(2)}>
          附近
          <AtIcon value={'chevron-up'} size='12' color={'#fe7b70'}></AtIcon>
        </View>
        <View className="line" onClick={this.titleClick3(3)}>
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
      <View className="myPositing rising">
        {
          this.state.selectData.map((item, index) => {
            const checked = index === this.state.list;
            return <View className='list'
              onClick={this.listClick(index,item.id)}
            >
              <View>{item.name}</View>
              <AtIcon value='check' size={(checked  ? '12' : '0')} color='#fe7b70'></AtIcon>
            </View>
          })
        }
      </View>
    </View>
  }
}
