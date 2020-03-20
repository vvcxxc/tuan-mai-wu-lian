import Taro, { Component, Config } from "@tarojs/taro"
import { View } from "@tarojs/components"
import '../index.styl'
interface Props {
  list?: any,
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

  componentDidMount() {
    
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
  onClose = (e) => {
    
  }
  render() {
    const { list } = this.props
    let data= {
      background: '#fff',
      width: '544rpx',
      height: '854rpx',
      views: [
        {
          type: 'image',
          url: 'http://oss.tdianyi.com/front/5QkwdPibGbd4BEN4GyPTBR6ySdw8p2FK.png',
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
            top: '180rpx',
            left: '200rpx',
            height: '30rpx'
          }
        },
        {
          type: 'text',
          text: '最高可抵用' + list.return_money+'元',
          css: {
            left: '69rpx',
            top: '220rpx',
            fontSize: '42rpx',
            color: '#fff',
          }
        },
        {
          type: 'image',
          url: "http://oss.tdianyi.com/front/6M2RZst3k8rb4sWQ5mWXeDMhp2RSkEJK.png",
          css: {
            top: '280rpx',
            left: '70rpx',
            width: '403rpx',
            height: '52rpx'
          }
        }
        ,
        {
          type: 'image',
          url: 'http://oss.tdianyi.com/front/BAHcaGjG55b68wnR3HfNQF6eDz7StdXz.png',
          css: {
            top: '350rpx',
            left: '80rpx',
            width: '380rpx'
          }
        },
        {
          type: 'text',
          text: '¥',
          css: {
            left: '95rpx',
            top: '402rpx',
            fontSize: '18rpx',
            color: '#EE2633'
          }
        },
        {
          type: 'text',
          text: '' + list.return_money,
          css: {
            left: '105rpx',
            top: '395rpx',
            fontSize: '40rpx',
            color: '#C32429'
          }
        },
        {
          type: 'text',
          text: '通用券',
          css: {
            right: '197rpx',
            top: '395rpx',
            fontSize: '19rpx',
            color: '#C32429'
          }
        },
        {
          type: 'text',
          text: '满' + list.total_fee+'元可用',
          css: {
            left: '255rpx',
            top: '425rpx',
            fontSize: '14rpx',
            color: '#C32429'
          }
        },
        {
          type: 'text',
          text: ' ',
          css: {
            left: '90rpx',
            top: '515rpx',
            borderWidth: '1rpx',
            borderColor: '#fff',
            width: '360rpx',
            height: '33rpx',
            lineHeight: '33rpx'
          }
        },
        {
          type: 'text',
          text: '使用时间：领券后' + list.expire_day+'天有效',
          css: {
            left: '90rpx',
            top: '520rpx',
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
            left: '50rpx',
            bottom: '171rpx',
            fontSize: '14rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: '' + list.pay_money,
          css: {
            left: '110rpx',
            bottom: '172rpx',
            fontSize: '35rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: ' 最高可抵' + list.return_money+'元 ',
          css: {
            bottom: '124rpx',
            left: '50rpx',
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
          text: '' + list.name,
          css: {
            bottom: '95rpx',
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
    console.log(list,'list33232')
    return (
      <View className="poster" onClick={() => { this.props.onClose() }}>
        <painter
          widthPixels="250"
          palette={data}
          onImgOK={this.onImgOK}
          onImgErr={this.onImgErr}
        />
        <View className="save-img" onClick={this.getmeta.bind(this)}>保存图片到相册</View>
      </View >
    )
  }
}
