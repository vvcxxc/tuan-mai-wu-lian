import Taro, { Component, Config } from "@tarojs/taro"
import { View } from "@tarojs/components"
import '../index.styl'
interface Props {
  list: any,
  onClose: () => void,
  show: boolean
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
      return_money: '',
      total_fee: '',
      expire_day: '',
      gift_pic: '',
      name: '',
      gift_price: '',
      pay_money: '',
      store_name: '',
      store_address: '',
      link: '',
      gift_name: '',
      wx_img: '',
      youhui_type: ''
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.show && !this.state.show) {
      const { list, show } = nextProps
        this.setState({
          show: list.youhui_type && list.gift.gift_pic? true:false,
          listData: {
            return_money: list.return_money,
            total_fee: list.total_fee,
            expire_day: list.expire_day,
            gift_pic: list.gift.gift_pic,
            name: list.name,
            gift_price: list.gift.gift_price,
            pay_money: list.pay_money,
            store_name: list.store.name,
            store_address: list.store.address,
            link: list.link,
            gift_name: list.gift.gift_name,
            wx_img: list.wx_img,
            youhui_type: list.youhui_type
          }
        })
      }
    }

    getmeta = (e) => {
      Taro.saveImageToPhotosAlbum({ filePath: this.state.image }).then(() => {
        Taro.showToast({ title: '图片保存成功' });
      })
      e.stopPropagation()
    }

    onImgOK(e: any) {
      this.setState({
        image: e.detail.path
      })
    }

    onImgErr = (e) => {
      console.log(e, 'onImgErr1')
    }
    render() {
      const { listData } = this.state
      let haveGiftData = {
        height: '1027rpx',
        width: '544rpx',
        background: '#fff',
        views: [
          {
            type: 'image',
            url: 'https://oss.tdianyi.com/front/5QkwdPibGbd4BEN4GyPTBR6ySdw8p2FK.png',
            css: {
              top: '0rpx',
              left: '0rpx',
              width: '544rpx',
              mode: 'scaleToFill'
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
              top: '180rpx',
              left: '200rpx',
              height: '30rpx'
            }
          },
          {
            type: 'text',
            text: '最高可抵用' + listData.return_money + '元',
            css: {
              left: '20rpx',
              top: '220rpx',
              fontSize: '42rpx',
              color: '#fff',
              width: '504rpx',
              textAlign: 'center'
            }
          },
          {
            type: 'image',
            url: "https://oss.tdianyi.com/front/6M2RZst3k8rb4sWQ5mWXeDMhp2RSkEJK.png",
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
            url: 'https://oss.tdianyi.com/front/BAHcaGjG55b68wnR3HfNQF6eDz7StdXz.png',
            css: {
              top: '350rpx',
              left: '80rpx',
              width: '380rpx'
            }
          },
          {
            type: 'text',
            text: '¥' + listData.return_money,
            css: {
              left: '86rpx',
              top: '395rpx',
              width: '150rpx',
              fontSize: '40rpx',
              color: '#C32429',
              textAlign: 'center',
              maxLines: '1',
            }
          },
          {
            type: 'text',
            text: '通用券',
            css: {
              left: '235rpx',
              top: '395rpx',
              fontSize: '19rpx',
              color: '#C32429',
              width: '130rpx',
              textAlign: 'center',
              maxLines: '1',
            }
          },
          {
            type: 'text',
            text: '满' + listData.total_fee + '元可用',
            css: {
              left: '235rpx',
              top: '425rpx',
              fontSize: '14rpx',
              color: '#C32429',
              width: '130rpx',
              textAlign: 'center',
              maxLines: '1',
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
            text: '使用时间：领券后' + listData.expire_day + '天有效',
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
            type: 'image',
            url: 'https://oss.tdianyi.com/front/bw6kYwMnDPFdy2a4Fsz2ec87GyAb7w8p.png',
            css: {
              top: '630rpx',
              left: '80rpx',
              width: '376rpx',
              height: '146rpx',
            }
          },
          {
            type: 'image',
            url: listData.gift_pic,
            css: {
              top: '641rpx',
              left: '90rpx',
              width: '121rpx',
              height: '121rpx',
              mode: 'scaleToFill'
            }
          },
          {
            type: 'image',
            url: "https://oss.tdianyi.com/front/KMhXfRRbBCswfnZTDQ5AFiKC2766fezr.png",
            css: {
              bottom: '270rpx',
              right: '110rpx',
              height: '49rpx',
              width: '49rpx'
            }
          },
          {
            type: 'text',
            text: ''+listData.gift_name,
            css: {
              top: '651rpx',
              right: '100rpx',
              width: '216rpx',
              maxLines: '2',
            }
          },
          {
            type: 'text',
            text: '¥',
            css: {
              top: '745rpx',
              left: '230rpx',
              fontSize: '16rpx',
              color: 'red',
            }
          },
          {
            type: 'text',
            text: '' + listData.gift_price,
            css: {
              top: '730rpx',
              left: '240rpx',
              fontSize: '33rpx',
              color: 'red',
            }
          },
          {
            type: 'text',
            text: '活动价 ¥',
            css: {
              left: '40rpx',
              bottom: '171rpx',
              fontSize: '14rpx',
              color: 'red',
            }
          },
          {
            type: 'text',
            text: '' + listData.pay_money,
            css: {
              left: '90rpx',
              bottom: '172rpx',
              fontSize: '35rpx',
              color: 'red',
            }
          },
          {
            type: 'text',
            text: '' + listData.name,
            css: {
              top: '875rpx',
              left: '40rpx',
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
              left: '40rpx',
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
              left: '40rpx',
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
              right: '50rpx',
              color: '#555555',
              fontSize: '14rpx'
            }
          }

        ]
      }
      return (
        this.state.show ? <View className="poster" onClick={() => {
          this.props.onClose()
          this.setState({ show: false })
        }}>
          <painter
            widthPixels="275"
            palette={haveGiftData}
            onImgOK={this.onImgOK}
            onImgErr={this.onImgErr}
          />
          <View className="save-img" onClick={this.getmeta.bind(this)}>保存图片到相册</View>
        </View > : null
      )
    }
  }
