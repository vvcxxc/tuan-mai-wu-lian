import Taro, { Component, Config } from "@tarojs/taro"
import { View } from "@tarojs/components"
import '../index.styl'
interface Props {
  list?: any,
  show?: Boolean,
  onClose:()=>void
}

export default class HaveGiftPoster extends Component<Props>{
  config: Config = {
    usingComponents: {
      "painter": "../../painter/painter"
    }
  }
  state = {
    
    image: '',
  }

  getmeta = (e) => {
    wx.saveImageToPhotosAlbum({
      filePath: this.state.image,
    });
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
    const { show, list } = this.props
    console.log(list,'meeme')
    let data = {
      background: '#fff',
      width: '544rpx',
      height: '854rpx',
      views: [
        {
          type: 'image',
          url: 'http://oss.tdianyi.com/front/tiDd8wiT68yDJ7tsKJWbRz3W7R5DMXWP.png',
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
          url: "http://oss.tdianyi.com/front/NWk3npDCMQfHx2G8JMMe4F7EF7d6HpWp.png",
          css: {
            top: '110rpx',
            left: '20rpx',
            height: '500rpx',
            width: '500rpx'
          }
        },
        {
          type: 'image',
          url: "http://oss.tdianyi.com/front/ExebSGpSecxPwNFa43i7wRxwJjZftasn.png",
          css: {
            top: '220rpx',
            left: '200rpx',
            height: '30rpx'
          }
        },
        {
          type: 'image',
          url: 'http://oss.tdianyi.com/front/BAHcaGjG55b68wnR3HfNQF6eDz7StdXz.png',
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
          text: '' + list.return_money,
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
          text: '满' + list.total_fee + '元可用',
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
          text: '使用时间：领券后' + list.expire_day + '天有效',
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
          text: '' + list.pay_money,
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
          text: ' ' + list.name,
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
          text: '适用店铺：' + list.store.name,
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
          text: '店铺地址：' + list.store.address,
          css: {
            bottom: '30rpx',
            left: '40rpx',
            width: '300rpx',
            maxLines: '1',
            color: '#B3B3B3',
            fontSize: '14rpx'
          }
        },
        {
          type: 'qrcode',
          content: list.link,
          css: {
            bottom: '67rpx',
            right: '45rpx',
            borderWidth: '10rpx',
            borderColor: '#F7F7F7',
            width: '130rpx',
            height: '130rpx',
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
      show ? <View className="poster" onClick={() => this.props.onClose()}
      >
        <painter
          widthPixels="250"
          palette={data}
          onImgOK={this.onImgOK}
          onImgErr={this.onImgErr}
        />
        <View className="save-img" onClick={this.getmeta.bind(this)}>保存图片到相册</View>
      </View >:null
    )
  }
}
