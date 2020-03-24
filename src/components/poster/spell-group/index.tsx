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
    show: false,
    listData: {
      image: '',
      gift_pic: '',
      gift_price: '',
      participation_money: '',
      pay_money: '',
      number: '',
      name: '',
      store_name: '',
      store_address: '',
      link: '',
      wx_img:''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show && !this.state.show) {
      const { list } = nextProps
      this.setState({
        show: true,
        listData: {
          image: list.image,
          gift_pic: list.gift.gift_pic,
          gift_price: list.gift.gift_price,
          participation_money: list.participation_money,
          pay_money: list.pay_money,
          number: list.number,
          name: list.name,
          store_name: list.store.name,
          store_address: list.store.address,
          link: list.link,
          wx_img: list.wx_img
        }
      })
    } 
  }

  getmeta = (e) => {
    Taro.saveImageToPhotosAlbum({ filePath: this.state.image }).then(() => {
      Taro.showToast({ title: '图片保存成功'});
    })
    e.stopPropagation();
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
    let giftImg = listData.gift_pic? [
      {
        type: 'image',
        url: listData.gift_pic,
        css: {
          bottom:'286rpx',
          right: '40rpx',
          height: '145rpx',
          width: '195rpx',
          mode: 'scaleToFill'
        }
      },
      {
        type: 'text',
        text: ' ',
        css: {
          bottom: '286rpx',
          right: '39rpx',
          height: '148rpx',
          lineHeight: '148rpx',
          width: '195rpx',
          background: 'rgba(0,0,0,0.3)'
        }
      },
      {
        type: 'image',
        url: "https://oss.tdianyi.com/front/tnzrTCT5iccXe6BMYMRJWdYstM5EWKxF.png",
        css: {
          bottom: '276rpx',
          right: '39rpx',
          height: '209rpx',
          width: '196rpx'
        }
      },
      {
        type: 'image',
        url: "https://oss.tdianyi.com/front/KMhXfRRbBCswfnZTDQ5AFiKC2766fezr.png",
        css: {
          bottom: '370rpx',
          right: '50rpx',
          height: '49rpx',
          width: '49rpx'
        }
      },
      {
        type: 'text',
        text: '¥',
        css: {
          left: '330rpx',
          bottom: '302rpx',
          fontSize: '16rpx',
          color: '#fff',
        }
      },
      {
        type: 'text',
        text: ' ' + listData.gift_price,
        css: {
          left: '332rpx',
          bottom: '302rpx',
          fontSize: '35rpx',
          color: '#fff',
          width: '150rpx',
          maxLines: '1',
        }
      }
    ]:[]
    let data = {
      width:'544rpx',
      height: '884rpx',
      background: '#fff',
      views: [
        {
          type: 'image',
          url: 'https://oss.tdianyi.com/front/YxDizX5ihR4NBwFN7KbtjRehX6kai2tb.png',
          css: {
            top: '0rpx',
            left: '0rpx',
            width: '544rpx',
          }
        },
        {
          type: 'image',
          url: 'https://oss.tdianyi.com/front/pRmPefzbk2QeJMikjFbcpMpaAZE7Zb72.png',
          css: {
            bottom: '30rpx',
            left: '20rpx',
            height: '500rpx',
            width: '500rpx',
            mode: 'scaleToFill'
          }
        },
        {
          type: 'image',
          url: listData.image,
          css: {
            top:'112rpx',
            left: '20rpx',
            height: '507rpx',
            width: '507rpx',
          }
        },
        ...giftImg,
        {
          type: 'text',
          text: '拼团价',
          css: {
            left: '47rpx',
            bottom: '190rpx',
            fontSize: '20rpx',
            color: 'red'
          }
        },
        {
          type: 'text',
          text: '¥',
          css: {
            left: '111rpx',
            bottom: '190rpx',
            fontSize: '20rpx',
            color: 'red'
          }
        },
        {
          id:'participation_money',
          type: 'text',
          text: '' + listData.participation_money,
          css: {
            left: '124rpx',
            bottom: '190rpx',
            fontSize: '32rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: '¥' + listData.pay_money,
          css: {
            left: ['135rpx','participation_money'],
            bottom: '190rpx',
            color: '#B3B3B3',
            fontSize: '22rpx',
            textDecoration: 'line-through'
          }
        },
        {
          type: 'text',
          text: ' ' + listData.number+'人团 ',
          css: {
            bottom: '163.5rpx',
            left: '47rpx',
            color: 'red',
            width: '70rpx',
            textAlign:'center',
            fontSize: '14rpx',
          }
        },
        {
          type: 'image',
          url: 'https://oss.tdianyi.com/front/kkkRM6rebnNmbTazMpANJdta76YXtKXX.png',
          css: {
            bottom: '158.5rpx',
            left: '47rpx',
            height: '19rpx',
            width: '70rpx',
            mode: 'scaleToFill'
          }
        },
        {
          type: 'text',
          text: '' + listData.name,
          css: {
            top:'735rpx',
            left: '47rpx',
            width: '300rpx',
            maxLines: '2',
            lineHeight: '30rpx',
            fontSize: '20rpx'
          }
        },
        {
          type: 'text',
          text: '适用店铺：' + listData.store_name,
          css: {
            bottom: '70rpx',
            left: '47rpx',
            width: '286rpx',
            maxLines: '1',
            color: '#B3B3B3',
            fontSize: '14rpx'
          }
        },
        {
          type: 'text',
          text: '店铺地址：' + listData.store_address,
          css: {
            bottom: '50rpx',
            left: '47rpx',
            width: '286rpx',
            maxLines: '1',
            color: '#B3B3B3',
            fontSize: '14rpx'
          }
        },
        {
          type: 'image',
          url: listData.wx_img,
          css: {
            bottom: '70rpx',
            right: '33rpx',
            width: '142rpx',
            height: '142rpx',
            mode: 'scaleToFill',
          }
        },
        {
          type: 'text',
          text: '长按查看活动详情',
          css: {
            bottom: '50rpx',
            right: '46rpx',
            color: '#555555',
            fontSize: '14rpx'
          }
        },

      ]
    }
    return (
      this.state.show ? <View className="poster" onClick={() => {
        this.props.onClose()
        this.setState({show:false})
      }}>
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
