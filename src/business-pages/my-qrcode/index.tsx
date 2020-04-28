import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import request from '../../services/request'
import Qrcode from "./Qrcode"                     //使用二维码

import { getImg } from './saveImg';

import './index.less';

export default class MyQRCode extends Component {
  config = {
    navigationBarTitleText: "我的邀请店铺二维码",
  };
  state = {
    avatarImage: "",
    qrCodeImage: "",
    user_name: ''
  }


  componentDidMount() {
    request({
      url: "/v3/user/invitation_store_code"
    }).then(async (res: any) => {
      // console.log('res', res);
      if (res.status_code == 200) {
        await this.setState({
          avatarImage: res.data.avatar,
          user_name: res.data.user_name
        })
        this.showQrCodeURL(res.data.phone);
      }
    })
  }

  showQrCodeURL = (phone) => {
    let qrCodeURL = `${process.env.SUPPLIER_URL}?phone=${phone}`
    let imgData = Qrcode.createQrCodeImg(qrCodeURL);
    this.setState({
      qrCodeImage: imgData
    })
  }

  getmeta = (e) => {
    let save = wx.getFileSystemManager();
    let number = Math.random();
    let imgSrc = this.state.qrCodeImage;
    save.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
      data: imgSrc.slice(22),
      encoding: 'base64',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
          success: function (res) {
            Taro.showToast({ title: '图片保存成功' });
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }, fail: err => {
        console.log(err)
      }
    })
  }

  render() {
    const { avatarImage, qrCodeImage, user_name } = this.state;
    return (
      <View className='my-code-page'>
        <View className='code-main'>
          <View className='header'>
            <View className="avatar_img">
              <Image src={avatarImage} className="avatar_image_url" />
            </View>
            <View className="user_name">{user_name}</View>
          </View>
          <View className="qrcode">
            <Image src={qrCodeImage} className="qrcode_image_url" />
          </View>
          <View className="download_qrcode">
            <View className="btn" onClick={this.getmeta.bind(this)}>下载保存二维码</View>
          </View>
        </View>

        <View className="code-desc">
          <View className="desc_title">邀请店铺入驻可获得以下收益：</View>
          <View className="desc_info">
            <View className="item">1.订单收益：入驻店铺通过小熊敬礼平台所达成的商品、卡券等销售，邀请人均可获得佣金，佣金比例为创客分享该产品所获销售收益的40%；</View>
            <View className="item">2.直属店铺广告收益分佣；</View>
            <View className="item">3.直属店铺线下扫码支付费率收益分佣</View>
          </View>
        </View>
      </View>
    )
  }
}
