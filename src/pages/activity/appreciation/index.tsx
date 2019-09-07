/**title: 增值活动预览 */
import Taro, { Component} from "@tarojs/taro";
import { AtIcon } from 'taro-ui';
import { View,Image,Swiper, SwiperItem  } from "@tarojs/components";
import share from '../../../assets/share.png'
import AddressImg from '../../../assets/address.png'
import MobileImg from '../../../assets/dianhua.png'
import briefImage from '../../../assets/brief2.png'
import './index.scss';

interface Props {
  store_id: any;
}

export default class Appre extends Component<Props>{

  state = {
  };
  componentDidMount = () => {
    console.log( this.$router.params);
  };

  render() {
    return (
      <View className="d_appre" >
         <View className="appre_head_activityTitle">
                  <View className="appre_head_activityTitle_title">北方至上</View>
                  <View className="appre_head_activityTitle_time">活动时间:2019/1/1-2019/1-2</View>
            </View>

               
     <Swiper
        className='test-h'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
        indicatorDots
        autoplay>
        <SwiperItem>
          <View className='demo-text'>
          <Image className="demo-text-Img" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/QcEQXztiHR44hjrESayHxxAznnyCwRNX.png" />
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text'>
          <Image className="demo-text-Img" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/QcEQXztiHR44hjrESayHxxAznnyCwRNX.png" />
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text'>
          <Image className="demo-text-Img" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/QcEQXztiHR44hjrESayHxxAznnyCwRNX.png" />
          </View>
        </SwiperItem>
      </Swiper>






        <View className="appre_hd" >
          <View className="appre_head">
            <View className="appre_head_ticket">
              <View className="appre_head_circle1"></View>
              <View className="appre_head_circle2"></View>
              <View className="appre_head_left">
                <View className="appre_head_left_pricebox">
                  <View className="appre_head_left_pricebox_msg">最高可抵扣</View>
                  <View className="appre_head_left_pricebox_price">￥{"110"}</View>
                </View>
                <View className="appre_head_left_pricebox_info">最高可抵{"22"}元 </View>
              </View>
              <View className="appre_head_right">
                <View className="appre_head_right_total">起始值为50元</View>
                <View className="appre_head_right_days">领取后{"2"}日内有效</View>
              </View>
            </View>
            <View style={{height:"24px"}}></View>
            {/* <View className="appre_head_bottom">
              <View className="appre_head_bottom_gift">送价值3000元耳机</View>
              <View className="appre_head_bottom_list">随时用</View>
              <View className="appre_head_bottom_share">
                <Image className="appre_head_bottom_shareimg" src={share} />
                分享</View>
            </View> */}
          </View>
        </View>
        <View className="appre_gift" >
          <View className="appre_gift_titlebox" >
            <View className="appre_gift_title" >赠送礼品</View>
            <View className="appre_gift_Imagelist" >图文详情</View>
          </View>
          <View className="appre_gift_giftinfo" >价值3000元的耳机一副</View>
          <View className="appre_gift_giftmsgbox" >
            <View className="appre_gift_giftmsg" >运费8元</View>
          </View>
          <View className="appre_gift_giftlist" >
            <Image className="appre_gift_giftlistImg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/QcEQXztiHR44hjrESayHxxAznnyCwRNX.png" />
          </View>
        </View>
        {/* <View className="appre_process" >
            <View className="appre_process_list" >
              <View className="appre_process_list_Image" ></View>
              <View className="appre_process_list_msg" >
                <View> 增值</View>
                <View>购买</View>
              </View>
              <View className="appre_process_list_icon" >
                <View className="appre_process_list_icon_tri" ></View>
              </View>
            </View>
            <View className="appre_process_list" >
              <View className="appre_process_list_Image" ></View>
              <View className="appre_process_list_msg" >
                <View> 邀请</View>
                <View>好友</View>
              </View>
              <View className="appre_process_list_icon" >
                <View className="appre_process_list_icon_tri" ></View>
              </View>
            </View>
            <View className="appre_process_list" >
              <View className="appre_process_list_Image" ></View>
              <View className="appre_process_list_msg" >
                <View> 帮助</View>
                <View>增值</View>
              </View>
              <View className="appre_process_list_icon" >
                <View className="appre_process_list_icon_tri" ></View>
              </View>
            </View>
            <View className="appre_process_list" >
              <View className="appre_process_list_Image" ></View>
              <View className="appre_process_list_msg" >
                <View> 随时</View>
                <View>可用</View>
              </View>
              <View className="appre_process_list_icon" >
              </View>
            </View>
          </View> */}
        <View className="appre_process2" >
          <Image className="appre_process2_Image" src={briefImage} />
        </View>
        <View className="appre_rule" >
          <View className="appre_rule_title" >温馨提示</View>
          <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >适用商品:</View>
            <View className="appre_rule_time_data" >全场通用</View>
          </View>
          <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >活动时间:</View>
            <View className="appre_rule_time_data" >{"1/1-1/2"}</View>
          </View>
          <View className="appre_rule_list" >
            <View className="appre_rule_list_key" >使用规则:</View>
            <View className="appre_rule_list_data" >
              <View className="appre_rule_list_msg" >. 11111111111</View>
              <View className="appre_rule_list_msg" >. 11111111111</View>
              <View className="appre_rule_list_msg" >. 之前为了解决问题百度到了一篇很好的博文，北方至上北方至上</View>
              <View className="appre_rule_list_msg" >. 2222222222222</View>
              <View className="appre_rule_list_msg" >. 11111111111</View>
            </View>
          </View>
        </View>
        <View className="setMeal_store">
          <View className="setMeal_store_box">
            <View className="setMeal_store_title">适用店铺</View>
            <View className="setMeal_store_storebox">
              <View className="setMeal_store_Image">
                <Image className="setMeal_store_img" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/QcEQXztiHR44hjrESayHxxAznnyCwRNX.png" />
              </View>
              <View className="setMeal_store_msg">
                <View className="setMeal_store_name">洛溪店</View>
                {/* <View className="setMeal_store_price">人均：￥222</View> */}
              </View>
              <View className="setMeal_store_icon">
              <AtIcon value='chevron-right' size='20' color='#ccc'></AtIcon>
              </View>
            </View>
            <View className="setMeal_store_addressbox">
              <View className="setMeal_store_distance">
                <View className="setMeal_store_distance_Image">
                  <Image className="setMeal_store_distance_AddressImg" src={AddressImg} />
                </View>
                <View className="setMeal_store_distance_info">2.6千米</View>
              </View>
              <View className="setMeal_store_address">西北来源大草原</View>
              <View className="setMeal_store_mobile">
                <Image className="setMeal_store_MobileImg" src={MobileImg} />
              </View>
            </View>
          </View>
        </View>

        <View className="paymoney_box">
          <View className="paymoney_price">
            <View className="paymoney_price_icon">￥</View>
            <View className="paymoney_price_num">{"11"}</View>
            <View className="paymoney_price_info">(含8元运费)</View>
          </View>
          <View className="paymoney_buynow">立即购买</View>
        </View>
      </View>
    );
  }
}