import Taro, { Component, Config } from "@tarojs/taro"
import { View } from "@tarojs/components"
import '../index.styl'
interface Props {
  list?: any,
  onClose: () => void
}

export default class HaveGiftPoster extends Component<Props>{
  config: Config = {
    usingComponents: {
      "painter": "../../painter/painter"
    }
  }
  state = {
    data: {
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
          type: 'text',
          text: '99',
          css: {
            left: '134rpx',
            bottom: '262rpx',
            fontSize: '35rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: '¥199',
          css: {
            left: '190rpx',
            bottom: '262rpx',
            color: '#B3B3B3',
            fontSize: '25rpx',
            textDecoration: 'line-through'
          }
        },
        {
          type: 'text',
          text: ' 90人团 ',
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
          text: '网红抖音同款会跳舞的钢铁侠 摇摆玩具机器人电玩男孩儿童一大堆的蓝鳍八角了解了可是解开了简历库简历库进口量j',
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
          text: '适用店铺：麻辣烫小人的店麻辣烫小人的店898989堆的蓝鳍八角了解了可是解开了简历库简历库进口量j',
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
          text: '店铺地址：广东省广州市海珠区琶洲会展店8898989989809809809898098',
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
          content: 'https://github.com/Kujiale-Mobile/Painter',
          css: {
            bottom: '107rpx',
            right: '59rpx',
            // color: 'red',
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
    },
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
    return (
      <View className="poster" onClick={() => { this.props.onClose() }}>
        <painter
          widthPixels="250"
          palette={this.state.data}
          onImgOK={this.onImgOK}
          onImgErr={this.onImgErr}
        />
        <View className="save-img" onClick={this.getmeta.bind(this)}>保存图片到相册</View>
      </View >
    )
  }
}
