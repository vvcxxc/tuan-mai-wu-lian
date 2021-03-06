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
      if(list.name){
        Taro.hideLoading()
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
          type: 'image',
          url: 'https://oss.tdianyi.com/front/pRmPefzbk2QeJMikjFbcpMpaAZE7Zb72.png',
          css: {
            bottom: '30rpx',
            left: '20rpx',
            height: '500rpx',
            width: '660rpx',
            mode: 'scaleToFill'
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
            mode: 'scaleToFill',
            background:'red'
          }
        },
        {
          type: 'text',
          text: '活动价',
          css: {
            left: '57rpx',
            bottom: '212rpx',
            fontSize: '20rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: '¥',
          css: {
            left: '121rpx',
            bottom: '212rpx',
            fontSize: '20rpx',
            color: 'red'
          }
        },
        {
          id:'pay_money',
          type: 'text',
          text: '' + listData.pay_money,
          css: {
            left: '134rpx',
            bottom: '212rpx',
            fontSize: '35rpx',
            color: 'red',
          }
        },
        {
          type: 'text',
          text: '¥' + listData.return_money,
          css: {
            left: ['146rpx','pay_money'],
            bottom: '212rpx',
            color: '#B3B3B3',
            fontSize: '25rpx',
            textDecoration: 'line-through'
          }
        },
        {
          type: 'text',
          text: '' + listData.name,
          css: {
            top:'980rpx',
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
        {
          type: 'image',
          url: listData.wx_img,
          css: {
            bottom: '107rpx',
            right: '59rpx',
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
      </View >:null
    )
  }
}
