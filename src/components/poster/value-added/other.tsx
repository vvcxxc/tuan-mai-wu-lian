import Taro, { Component, Config } from "@tarojs/taro"
import { View } from "@tarojs/components"
import '../index.styl'
interface Props {
  list?: any,
  onClose: () => void,
  show: boolean,
  type: string
}

export default class HaveGiftPoster extends Component<Props>{
  config: Config = {
    usingComponents: {
      "painter": "../../painter/painter"
    }
  }
  state = {
    image: '',
    show:false,
    listData: {
      image: '',
      pay_money:'',
      return_money: '',
      name: '',
      store_name: '',
      store_address: '',
      link: '',
      wx_img: '',
      gift_pic: '',
      gift_price:''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show && !this.state.show) {
      const { list, show, type } = nextProps
      if(list.name){
        Taro.hideLoading()
        this.setState({
          show: type =='Other' ? true : false,
          listData: {
          image: list.image,
          pay_money: list.pay_money,
          return_money: list.return_money,
          name: list.name,
          store_name: list.store.name,
          store_address: list.store.address,
          link: list.link,
          wx_img: list.wx_img,
          gift_pic: list.gift.gift_pic,
          gift_price: list.gift.gift_price,
        }
      })
      }else {
        Taro.showLoading({title: '海报生成中'})
      }

    }
  }

  getmeta = (e) => {
    Taro.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting["scope.writePhotosAlbum"] === false) {
          Taro.showModal({
            title: '提示',
            content: '打开保存到相册才能保存图片',
            success: res1 => {
              if(res1.confirm){
                Taro.openSetting({
                  success: (res2) => {
                    console.log(res2)
                  }
                })
              }
            }
          })
        } else {
          Taro.saveImageToPhotosAlbum({ filePath: this.state.image }).then(() => {
            Taro.showToast({ title: '图片保存成功' });
          })
        }
      }
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
    let giftImg = listData.gift_pic ? [
      {
        type: 'image',
        url: listData.gift_pic,
        css: {
          bottom: '360rpx',
          right: '30rpx',
          height: '125rpx',
          width: '155rpx',
          mode: 'scaleToFill'
        }
      },
      {
        type: 'text',
        text: ' ',
        css: {
          bottom: '360rpx',
          right: '29rpx',
          height: '128rpx',
          lineHeight: '128rpx',
          width: '155rpx',
          borderRadius: '13rpx',
          background: 'rgba(0,0,0,0.3)'
        }
      },
      {
        type: 'image',
        url: "https://oss.tdianyi.com/front/tnzrTCT5iccXe6BMYMRJWdYstM5EWKxF.png",
        css: {
          bottom: '356rpx',
          right: '29rpx',
          height: '169rpx',
          width: '156rpx'
        }
      },
      {
        type: 'image',
        url: "https://oss.tdianyi.com/front/KMhXfRRbBCswfnZTDQ5AFiKC2766fezr.png",
        css: {
          bottom: '430rpx',
          right: '40rpx',
          height: '40rpx',
          width: '40rpx'
        }
      },
      {
        type: 'text',
        text: '¥',
        css: {
          left: '370rpx',
          bottom: '382rpx',
          fontSize: '16rpx',
          color: '#fff',
        }
      },
      {
        type: 'text',
        text: ' ' + listData.gift_price,
        css: {
          left: '372rpx',
          bottom: '382rpx',
          fontSize: '35rpx',
          color: '#fff',
          width: '130rpx',
          maxLines: '1'
        }
      }
    ] : []
    let data= {
      width: '544rpx',
      height: '854rpx',
      background: '#fff',
      views: [
        {
          type: 'image',
          url: 'https://oss.tdianyi.com/front/5QkwdPibGbd4BEN4GyPTBR6ySdw8p2FK.png',
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
            height: '507rpx',
            width: '507rpx',
            mode: 'scaleToFill'
          }
        },
        {
          type: 'image',
          url: listData.image,
          css: {
            top: '112rpx',
            left: '20rpx',
            height: '507rpx',
            width: '507rpx',
          }
        },
        ...giftImg,
        {
          type: 'text',
          text: '活动价',
          css: {
            left: '47rpx',
            bottom: '170rpx',
            fontSize: '20rpx',
            color: 'red'
          }
        },
        {
          type: 'text',
          text: '¥',
          css: {
            left: '111rpx',
            bottom: '170rpx',
            fontSize: '20rpx',
            color: 'red'
          }
        },
        {
          id: 'participation_money',
          type: 'text',
          text: '' + listData.pay_money,
          css: {
            left: '124rpx',
            bottom: '170rpx',
            fontSize: '32rpx',
            color: 'red',
          }
        },
        {
          type: 'image',
          url: 'https://oss.tdianyi.com/front/aGzMhkHKFQZrFCwp7Am2ZxpKHiP8xiNB.png',
          css: {
            bottom: '253rpx',
            right: '5rpx',
            width: '200rpx',
            height: '80rpx',
            mode:'scaleToFill'
          }
        },
        {
          type: 'text',
          text: '最高可抵用' ,
          css: {
            bottom: '303rpx',
            left: '340rpx',
            fontSize: '18rpx',
            color: '#FFE1A5',
            width: '200rpx',
            textAlign: 'center'
          }
        },
        {
          id:'return_money',
          type: 'text',
          text: listData.return_money + '元 ',
          css: {
            bottom: '274rpx',
            left:'340rpx',
            fontSize: '24rpx',
            color: '#FFE1A5',
            width: '200rpx',
            textAlign: 'center',
            maxLines: '1'
          }
        },
        {
          type: 'text',
          text: '' + listData.name,
          css: {
            top: '710rpx',
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
        this.setState({ show: false })
      }}>
        <painter
          widthPixels="275"
          palette={data}
          onImgOK={this.onImgOK}
          onImgErr={this.onImgErr}
        />
        <View className="save-img" onClick={this.getmeta.bind(this)}>保存图片到相册</View>
      </View > : null
    )
  }
}
