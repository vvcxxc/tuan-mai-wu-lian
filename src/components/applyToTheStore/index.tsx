import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.styl";
interface Location {
  xpoint: number;
  ypoint: number;
}

interface Props {
  isTitle?: boolean; // 是否展示店铺名
  img: string; // 店铺图片
  name: string; // 店铺名称
  phone: string; // 店铺电话
  address: string; // 店铺地址
  location: Location;
  meter: string; // 距离
}
export default class ApplyToTheStore extends Component<Props> {
  ApplyToTheStore.defaultProps = {
    isTitle: false, // 是否展示店铺名
    img: '', // 店铺图片
    name: '', // 店铺名称
    phone: null, // 店铺电话
    address: '', // 店铺地址
    location: {
      xpoint: null,
      ypoint: null
    },
    meter: '0m'
  }
  state = {
  }


  //打电话
  makePhoneCall = (e) => {
    Taro.makePhoneCall({
      phoneNumber: this.props.phone
    })
      .then((res: any) => {
        console.log(res)
      });
    e.stopPropagation();
  }

  //地图
  routePlanning = (e) => {
    Taro.openLocation({
      latitude: Number(this.props.location.ypoint),
      longitude: Number(this.props.location.xpoint),
      scale: 18,
      name: this.props.name,
      address: this.props.address,
    });
    e.stopPropagation();
  }

  render() {
    return (
      <View>
        {
          this.props.isTitle ?
            (<View className='apply-page'>
              <View className='apply-title-box'>
                <View className='apply-title-left'></View>
                <View className='apply-title'>适用店铺</View>
              </View>
              <View className='apply-main'>
                <Image className='store-img small' src={this.props.img} />
                <View className='store-detail small-detail'>
                  <View className='store-name-box'>
                    <View className='store-name'>{this.props.name}</View>
                    <View className='store-icon small-icon'>
                      <Image className='icon' src={require('@/assets/store/phone.png')} onClick={this.makePhoneCall} />
                    </View>
                  </View>
                  <View className='store-text' onClick={this.routePlanning}>
                    <View className='store-address'>{this.props.address}</View>
                    <View className='meter-box'>
                      <Image className='address-icon' src={require('@/assets/store/address.png')} />
                        {this.props.meter}
                        <Image className='right-arrow' src={require('@/assets/store/right-arrow.png')} />
                    </View>
                  </View>
                </View>
              </View>
            </View>)
            : (
              <View className='apply-page'>
                <View className='apply-main'>
                  <Image className='store-img' src={this.props.img} />
                  <View className='store-detail'>
                    <View className='store-name-box'>
                      <View className='store-name'>{this.props.name}</View>
                      <View className='store-icon'>
                        <Image className='icon' src={require('@/assets/store/phone.png')} onClick={this.makePhoneCall} />
                      </View>
                    </View>
                    <View className='store-text' onClick={this.routePlanning}>
                      <View className='store-address'>{this.props.address}</View>
                      <View className='meter-box'>
                        <Image className='address-icon' src={require('@/assets/store/address.png')} />
                        {this.props.meter}
                        <Image className='right-arrow' src={require('@/assets/store/right-arrow.png')} />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )
        }
      </View>

    )
  }
}
