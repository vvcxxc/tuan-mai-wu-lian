import Taro, { Component, Config } from "@tarojs/taro"
import { View } from "@tarojs/components"
import '../index.styl'
interface Props {
  list?: any,
  onClose: () => void,
  show: boolean,
  type:string
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
      const { list, type } = nextProps
      if(list.name){
        Taro.hideLoading()
        this.setState({
          show: list.youhui_type && type =='NoGift' ? true : false,
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
  onClose = (e) => {

  }
  render() {
    const { listData } = this.state
    let meta = {
      background: '#fff',
      width: '544rpx',
      height: '854rpx',
      views: [
        {
          type: 'image',
          url: 'https://oss.tdianyi.com/front/5QkwdPibGbd4BEN4GyPTBR6ySdw8p2FK.png',
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
        },
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
            maxLines: '1'
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
          text: '' + listData.pay_money,
          css: {
            left: '110rpx',
            bottom: '172rpx',
            fontSize: '35rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: '扫二维码支付时使用',
          css: {
            bottom: '138rpx',
            left: '40rpx',
            color: 'red',
            height: '26rpx',
            width: '160rpx',
            textAlign: 'center',
            fontSize: '14rpx',
          }
        },
        {
          type: 'image',
          url: 'https://oss.tdianyi.com/front/WKDeMsYpHetTntQcRcNeQWdD6WifKYeM.png',
          css: {
            bottom: '130rpx',
            left: '40rpx',
            height: '26rpx',
            width: '160rpx',
            mode: 'scaleToFill'
          }
        },
        {
          type: 'text',
          text: '' + listData.name,
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
        {
          type: 'image',
          url: listData.wx_img,
          css: {
            bottom: '67rpx',
            right: '45rpx',
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
      this.state.show ? <View className="poster" onClick={() => {
        this.props.onClose()
        this.setState({ show: false })
      }}>
        <painter
          widthPixels="250"
          palette={meta}
          onImgOK={this.onImgOK}
          onImgErr={this.onImgErr}
        />
        <View className="save-img" onClick={this.getmeta.bind(this)}>保存图片到相册</View>
      </View >: null
    )
  }
}
