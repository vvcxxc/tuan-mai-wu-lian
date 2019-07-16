import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";

import "taro-ui/dist/style/components/toast.scss";
// import "taro-ui/dist/style/components/icon.scss";
// import 'taro-ui/dist/style/index.scss'
// import "./index.styl";
import "./ActivityGroup.styl";

interface Props {
  activity_group: any;
}


/**商店 ITEM 组件 */
export default class ActivityGroupComponent extends Component<Props> {

  state: {
    activity_group: [
      {
        //拼团活动
        name: '',
        activity_brief: '	',
        image_url: "",
        pay_money: '',
        return_money: '',
        participation_number: '',
        participation_money: '',
        market_price: '',
        gift_pic: "",
        image_url_info: '',
        youhui_id: '',
        gift_id: '',
        activity_id: ''

      }
    ],
    activity_group_bull: false,
  }
  componentDidMount() {
    // console.log(this.props.activity_group)
    this.setState({
      activity_group: this.props.activity_group
    })
  }

  gotoGroup(_id, gift_id, activity_id) {
    Taro.navigateTo({
      url: '/pages/activity/pages/detail/detail?id=' + _id + '&type=5&gift_id=' + gift_id + '&activity_id=' + activity_id
    })
  }

  render() {
    return (
      <View >
        <View className="merchant-details__tit" style={{ fontSize: "19px", paddingLeft: "24rpx", height: "26px", position: "relative", display: "flex", alignItems: "center" }}>
          <Text className="mark" style={{
            fontSize: " 10px",
            color: "#fff",
            backgroundColor: "#D97B0B",
            padding: "1px 5px",
            borderRadius: " 2px",
            marginRight: "10px",
            verticalAlign: "inherit",
            bottom: "0"
          }}>礼</Text>
          <Text className="fwb" style={{ fontWeight: "bold", padding: "3px 5px", position: "absolute", left: "40px", bottom: "-6px" }}>拼团送豪礼</Text>
        </View>
        {/* 拼团活动 */}
        {
          this.state.activity_group_bull ? this.state.activity_group.map((item) => (
            <View className="group-purchase bcfff" key={item.name}>
              <View style={{ height: "5px" }}></View>
              <View className="hd">
                <View className="flex center">
                  <View className="item desc">{item.activity_brief}</View>
                  <View className="count">{item.participation_number}人团</View>
                </View>
              </View>
              {
                item.gift_pic == "" || item.gift_pic == null ? <View className="image-list">
                  <Image className="image" src={item.image_url} />
                  <Image className="image" src={item.image_url_info} />

                </View> :
                  <View className="image-list">
                    <Image className="image" src={item.image_url} />
                    <View className="image" style={{ position: "relative", display: "flex", background: "red" }}>
                      <Image src={require("./border.png")} style={{ width: "100%", height: "100%", position: 'absolute', top: '0px', left: '0px' }} />
                      <Image src={require("./qiu.png")} style={{ position: 'absolute', top: '-4px', left: '41%', width: '25px', height: '25px' }} />
                      <Image src={item.gift_pic} style={{ width: "100%", height: "100%", top: '0px', left: '0px', flex: "1" }} />
                    </View>
                  </View>

              }
              <View className="ft ">
                <View className="flex center">
                  <View className="item">
                    <Text className="money">￥{item.participation_money}</Text>
                    {/* <Text className="count">已拼{item.participation_number}件</Text> */}
                  </View>
                  <Button className="btn-go" style={{ width: "104px", height: "33px" }} onClick={this.gotoGroup.bind(this, item.youhui_id, item.gift_id, item.activity_id)}>立刻开团</Button>
                </View>
              </View>
            </View>
          )) : <View className="group-purchase bcfff">
              <View className="hd">
                <View className="flex center">
                  <View className="item desc">{this.state.activity_group[0].activity_brief}</View>
                  <View className="count">{this.state.activity_group[0].participation_number}人团</View>
                </View>
              </View>
              {
                this.state.activity_group[0].gift_pic == "" || this.state.activity_group[0].gift_pic == null ?
                  <View className="image-list">
                    <Image className="image" src={this.state.activity_group[0].image_url} />
                    <Image className="image" src={this.state.activity_group[0].image_url_info} />

                  </View> :
                  <View className="image-list">
                    <Image className="image" src={this.state.activity_group[0].image_url} />
                    <View className="image" style={{ position: "relative", display: "flex", background: "red" }}>
                      <Image src={require("./border.png")} style={{ width: "100%", height: "100%", position: 'absolute', top: '0px', left: '0px' }} />
                      <Image src={require("./qiu.png")} style={{ position: 'absolute', top: '-4px', left: '41%', width: '25px', height: '25px' }} />
                      <Image src={this.state.activity_group[0].gift_pic} style={{ width: "100%", height: "100%", top: '0px', left: '0px', flex: "1" }} />
                    </View>
                  </View>

              }
              <View className="ft ">
                <View className="flex center">
                  <View className="item">
                    <Text className="money" >￥{this.state.activity_group[0].participation_money}</Text>
                    {/* <Text className="count">已拼{this.state.activity_group[0].participation_number}件</Text> */}
                  </View>
                  <Button className="btn-go" style={{ width: "104px", height: "33px" }} onClick={this.gotoGroup.bind(this, this.state.activity_group[0].youhui_id, this.state.activity_group[0].gift_id, this.state.activity_group[0].activity_id)}>立刻开团</Button>
                </View>
              </View>
            </View>
        }
        {
          this.state.activity_group.length != 1 ?
            <View className="ft-more flex center" style={{ textAlign: "center", margin: "0", width: "100%", background: "#fff" }}
              onClick={() => { this.setState({ activity_group_bull: !this.state.activity_group_bull }); }}>
              {this.state.activity_group_bull ? "收回" : "查看更多"}
              {this.state.activity_group_bull ?
                <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />}
            </View>
            : ""
        }
        <hr />
      </View>


    );
  }
}
