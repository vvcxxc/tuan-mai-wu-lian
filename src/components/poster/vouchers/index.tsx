import Taro, { Component, Config } from "@tarojs/taro"
import { View } from "@tarojs/components"
import '../index.styl'
interface Props {
  list?: any,
  show?: Boolean,
  onClose:()=>void
}

export default class VouchersPoster extends Component<Props>{
  config: Config = {
    usingComponents: {
      "painter": "../../painter/painter"
    }
  }
  state = {
    image: '',
    show: false,
    listData: {
      return_money:'',
      total_fee:'',
      expire_day: '',
      pay_money: '',
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
      console.log(list, 'list')
      this.setState({
        show: true,
        listData: {
          return_money: list.return_money,
          total_fee: list.total_fee,
          expire_day: list.expire_day,
          pay_money: list.pay_money,
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
    console.log(e, 'onImgErr')
  }
  render() {
    const { listData } = this.state
    let data = {
      background: '#fff',
      width: '544rpx',
      height: '854rpx',
      views: [
        {
          type: 'image',
          url: 'https://oss.tdianyi.com/front/tiDd8wiT68yDJ7tsKJWbRz3W7R5DMXWP.png',
          css: {
            top: '0rpx',
            left: '0rpx',
            width: '544rpx'
          }
        },
        {
          type: 'text',
          text: ' ',
          css: {
            bottom: '10rpx',
            left: '21rpx',
            width: '496rpx',
            lineHeight: '500rpx',
            height: '500rpx',
            borderWidth: '0.5rpx',
            borderColor: '#E2E2E2'
          }
        },
        {
          type: 'image',
          url: "https://oss.tdianyi.com/front/NWk3npDCMQfHx2G8JMMe4F7EF7d6HpWp.png",
          css: {
            top: '110rpx',
            left: '20rpx',
            height: '500rpx',
            width: '500rpx'
          }
        },
        {
          type: 'image',
          url: "https://oss.tdianyi.com/front/ExebSGpSecxPwNFa43i7wRxwJjZftasn.png",
          css: {
            top: '220rpx',
            left: '200rpx',
            height: '30rpx'
          }
        },
        {
          type: 'image',
          url: 'https://oss.tdianyi.com/front/BAHcaGjG55b68wnR3HfNQF6eDz7StdXz.png',
          css: {
            top: '300rpx',
            left: '80rpx',
            width: '380rpx'
          }
        },
        {
          type: 'text',
          text: '¥',
          css: {
            left: '95rpx',
            top: '352rpx',
            fontSize: '18rpx',
            color: '#EE2633'
          }
        },
        {
          type: 'text',
          text: '' + listData.return_money,
          css: {
            left: '105rpx',
            top: '345rpx',
            fontSize: '40rpx',
            color: '#C32429'
          }
        },
        {
          type: 'text',
          text: '通用券',
          css: {
            right: '197rpx',
            top: '345rpx',
            fontSize: '19rpx',
            color: '#C32429'
          }
        },
        {
          type: 'text',
          text: '满' + listData.total_fee + '元可用',
          css: {
            left: '255rpx',
            top: '385rpx',
            fontSize: '14rpx',
            color: '#C32429'
          }
        },
        {
          type: 'text',
          text: ' ',
          css: {
            left: '90rpx',
            top: '485rpx',
            borderWidth: '1rpx',
            borderColor: '#fff',
            width: '360rpx',
            height: '33rpx',
            lineHeight: '33rpx'
          }
        },
        {
          type: 'text',
          text: '使用时间：领券后' + listData.expire_day + '天有效',
          css: {
            left: '90rpx',
            top: '490rpx',
            fontSize: '17rpx',
            color: '#FFFFFF',
            width: '360rpx',
            textAlign: 'center'
          }
        },
        {
          type: 'text',
          text: '活动价 ¥',
          css: {
            left: '40rpx',
            bottom: '161rpx',
            fontSize: '14rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: '' + listData.pay_money,
          css: {
            left: '100rpx',
            bottom: '162rpx',
            fontSize: '35rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: ' 扫二维码支付时使用 ',
          css: {
            bottom: '120rpx',
            left: '45rpx',
            color: 'red',
            borderWidth: '1rpx',
            borderColor: 'red',
            borderRadius: '13rpx',
            fontSize: '14rpx',
            lineHeight: '21rpx'
          }
        },
        {
          type: 'text',
          text: ' ' + listData.name,
          css: {
            bottom: '85rpx',
            left: '40rpx',
            width: '300rpx',
            maxLines: '2',
            lineHeight: '22rpx',
            fontSize: '22rpx'
          }
        },
        {
          type: 'text',
          text: '适用店铺：' + listData.store_name,
          css: {
            bottom: '45rpx',
            left: '40rpx',
            width: '300rpx',
            maxLines: '1',
            color: '#B3B3B3',
            fontSize: '14rpx'
          }
        },
        {
          type: 'text',
          text: '店铺地址：' + listData.store_address,
          css: {
            bottom: '30rpx',
            left: '40rpx',
            width: '300rpx',
            maxLines: '1',
            color: '#B3B3B3',
            fontSize: '14rpx'
          }
        },
        // {
        //   type: 'qrcode',
        //   content: listData.link,
        //   css: {
        //     bottom: '67rpx',
        //     right: '45rpx',
        //     borderWidth: '10rpx',
        //     borderColor: '#F7F7F7',
        //     width: '130rpx',
        //     height: '130rpx',
        //   }
        // },
        {
          type: 'image',
          url: listData.wx_img,
          css: {
            bottom: '67rpx',
            right: '45rpx',
            // borderWidth: '10rpx',
            // borderColor: '#F7F7F7',
            width: '130rpx',
            height: '130rpx',
            mode: 'scaleToFill',
          }
        },
        {
          type: 'text',
          text: '长按查看活动详情',
          css: {
            bottom: '30rpx',
            right: '60rpx',
            color: '#555555',
            fontSize: '14rpx'
          }
        },

      ]
    }
    return (
      this.state.show ? <View className="poster" onClick={() => this.props.onClose()}
      >
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
