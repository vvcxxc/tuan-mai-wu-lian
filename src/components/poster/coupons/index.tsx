import Taro, { Component, Config } from "@tarojs/taro"
import { View } from "@tarojs/components"
import '../index.styl'
interface Props {
  show:boolean,
  list: any,
  onClose: () => void
}

export default class CouponsPoster extends Component<Props>{
  config: Config = {
    usingComponents: {
      "painter": "../../painter/painter"
    }
  }
  state = {
    show:false,
    image: '',
    listData: {
      image: '',
      pay_money: '',
      return_money: '',
      name: '',
      store_name: '',
      store_address: '',
      link: '',
      wx_img: ''
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.show && !this.state.show) {
      const { list } = nextProps
      console.log(list,'list')
      this.setState({
        show: true,
        listData: {
          image: list.image,
          pay_money: list.pay_money,
          return_money: list.return_money,
          name: list.name,
          store_name: list.store.name,
          store_address: list.store.address,
          link: list.link,
          wx_img: list.wx_img
        }
      })
    } else {
      if (this.state.show) {
        this.setState({ show: false })
      }
    }
  }

  getmeta = (e) => {
    Taro.saveImageToPhotosAlbum({ filePath: this.state.image }).then(() => {
      Taro.showToast({ title: '图片保存成功' });
    }).finally(() => {
      Taro.showToast({ title: '图片保存失败', icon: 'none' });
    })
    e.stopPropagation()
  }

  onImgOK(e: any) {
    this.setState({
      image: e.detail.path
    })
  }

  onImgErr = (e) => {
    console.log(e,'报错')
  }
  render() {
    const { listData }= this.state
    let data= {
      background: '#fff',
      width: '700rpx',
      height: '1166rpx',
      views: [
        {
          type: 'image',
          url: 'https://oss.tdianyi.com/front/tiDd8wiT68yDJ7tsKJWbRz3W7R5DMXWP.png',
          css: {
            top: '0rpx',
            left: '0rpx',
            width: '700rpx'
          }
        },
        {
          type: 'text',
          text: ' ',
          css: {
            bottom: '10rpx',
            left: '21rpx',
            width: '656rpx',
            lineHeight: '500rpx',
            height: '500rpx',
            borderWidth: '0.5rpx',
            borderColor: '#E2E2E2'
          }
        },
        {
          type: 'image',
          url: listData.image,
          css: {
            top: '143rpx',
            left: '20rpx',
            height: '700rpx',
            width: '660rpx',
            mode: 'scaleToFill'
          }
        },
        {
          type: 'text',
          text: '活动价',
          css: {
            left: '57rpx',
            bottom: '232rpx',
            fontSize: '20rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: '¥',
          css: {
            left: '121rpx',
            bottom: '232rpx',
            fontSize: '20rpx',
            color: 'red'
          }
        },
        {
          type: 'text',
          text: '' + listData.pay_money,
          css: {
            left: '134rpx',
            bottom: '232rpx',
            fontSize: '35rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: '¥' + listData.return_money,
          css: {
            left: '190rpx',
            bottom: '232rpx',
            color: '#B3B3B3',
            fontSize: '25rpx',
            textDecoration: 'line-through'
          }
        },
        {
          type: 'text',
          text: '' + listData.name,
          css: {
            bottom: '135rpx',
            left: '57rpx',
            width: '380rpx',
            maxLines: '2',
            lineHeight: '30rpx',
            fontSize: '30rpx'
          }
        },
        {
          type: 'text',
          text: '适用店铺：' + listData.store_name,
          css: {
            bottom: '85rpx',
            left: '57rpx',
            width: '380rpx',
            maxLines: '1',
            color: '#B3B3B3',
            fontSize: '20rpx'
          }
        },
        {
          type: 'text',
          text: '店铺地址：' + listData.store_address,
          css: {
            bottom: '60rpx',
            left: '57rpx',
            width: '380rpx',
            maxLines: '1',
            color: '#B3B3B3',
            fontSize: '20rpx'
          }
        },
        // {
        //   type: 'qrcode',
        //   content: listData.link,
        //   css: {
        //     bottom: '107rpx',
        //     right: '59rpx',
        //     borderWidth: '10rpx',
        //     borderColor: '#F7F7F7',
        //     width: '156rpx',
        //     height: '156rpx',
        //   },
        // },
        {
          type: 'image',
          url: listData.wx_img,
          css: {
            bottom: '107rpx',
            right: '59rpx',
            // borderWidth: '10rpx',
            // borderColor: '#F7F7F7',
            width: '156rpx',
            height: '156rpx',
            mode: 'scaleToFill',
          }
        },
        {
          type: 'text',
          text: '长按查看活动详情',
          css: {
            bottom: '60rpx',
            right: '64rpx',
            color: '#555555',
            fontSize: '20rpx'
          }
        },

      ]
    }
    return (
      this.state.show?<View className="poster" onClick={() => { this.props.onClose() }}>
        <painter
          widthPixels="275"
          palette={data}
          onImgOK={this.onImgOK}
          onImgErr={this.onImgErr}
        />
        <View className="save-img" onClick={this.getmeta.bind(this)}>保存图片到相册</View>
      </View >:null
    )
  }
}
