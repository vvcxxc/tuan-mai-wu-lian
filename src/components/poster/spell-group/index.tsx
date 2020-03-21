import Taro, { Component, Config } from "@tarojs/taro"
import { View } from "@tarojs/components"
import '../index.styl'
interface Props {
  list?: any,
  show: boolean,
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
    let giftImg = list.gift.gift_pic? [
      {
        type: 'image',
        url: list.gift.gift_pic,
        css: {
          top: '635rpx',
          right: '38rpx',
          height: '145rpx',
          width: '195rpx',
          mode: 'scaleToFill'
        }
      },
      {
        type: 'text',
        text: ' ',
        css: {
          top: '634rpx',
          right: '39rpx',
          height: '148rpx',
          lineHeight: '148rpx',
          width: '195rpx',
          background: 'rgba(0,0,0,0.3)'
        }
      },
      {
        type: 'image',
        url: "http://oss.tdianyi.com/front/tnzrTCT5iccXe6BMYMRJWdYstM5EWKxF.png",
        css: {
          top: '580rpx',
          right: '39rpx',
          height: '209rpx',
          width: '196rpx'
        }
      },
      {
        type: 'image',
        url: "http://oss.tdianyi.com/front/KMhXfRRbBCswfnZTDQ5AFiKC2766fezr.png",
        css: {
          top: '640rpx',
          right: '50rpx',
          height: '49rpx',
          width: '49rpx'
        }
      },
      {
        type: 'text',
        text: '¥',
        css: {
          left: '490rpx',
          bottom: '412rpx',
          fontSize: '20rpx',
          color: '#fff',
        }
      },
      {
        type: 'text',
        text: ' ' + list.gift.gift_price,
        css: {
          left: '507rpx',
          bottom: '412rpx',
          fontSize: '35rpx',
          color: '#fff',
          width: '150rpx',
          maxLines: '1',
        }
      }
    ]:[]
    let data = {
      background: '#fff',
      width: '700rpx',
      height: '1166rpx',
      views: [
        {
          type: 'image',
          url: 'http://oss.tdianyi.com/front/YxDizX5ihR4NBwFN7KbtjRehX6kai2tb.png',
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
          url: "http://oss.tdianyi.com/front/nN7DYYrkniHdYsseYF4iYBTGxzHsxyyc.png?x-oss-process=image/crop,x_175,y_0,w_450,h_450",
          css: {
            top: '143rpx',
            left: '20rpx',
            height: '700rpx',
            width: '660rpx'
          }
        },
        ...giftImg,
        {
          type: 'text',
          text: '拼团价',
          css: {
            left: '57rpx',
            bottom: '262rpx',
            fontSize: '20rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: '¥',
          css: {
            left: '121rpx',
            bottom: '262rpx',
            fontSize: '20rpx',
            color: 'red'
          }
        },
        {
          id:'participation_money',
          type: 'text',
          text: ''+list.participation_money,
          css: {
            left: '134rpx',
            bottom: '262rpx',
            fontSize: '35rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: '¥' + list.pay_money,
          css: {
            left: ['150rpx','participation_money'],
            bottom: '262rpx',
            color: '#B3B3B3',
            fontSize: '25rpx',
            textDecoration: 'line-through'
          }
        },
        {
          type: 'text',
          text: ' ' + list.number+'人团 ',
          css: {
            bottom: '214rpx',
            left: '57rpx',
            color: 'red',
            borderWidth: '1rpx',
            borderColor: 'red',
            borderRadius: '13rpx',
            lineHeight: '25rpx'
          }
        },
        {
          type: 'text',
          text: '' + list.name,
          css: {
            bottom: '135rpx',
            left: '57rpx',
            width: '380rpx',
            maxLines: '2',
            lineHeight: '30rpx'
          }
        },
        {
          type: 'text',
          text: '适用店铺：' + list.store.name,
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
          text: '店铺地址：' + list.store.address,
          css: {
            bottom: '60rpx',
            left: '57rpx',
            width: '380rpx',
            maxLines: '1',
            color: '#B3B3B3',
            fontSize: '20rpx'
          }
        },
        {
          type: 'qrcode',
          content:  list.link,
          css: {
            bottom: '107rpx',
            right: '59rpx',
            borderWidth: '10rpx',
            borderColor: '#F7F7F7',
            width: '156rpx',
            height: '156rpx',
          },
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
      show? <View className="poster" onClick={() => {this.props.onClose()}}>
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
