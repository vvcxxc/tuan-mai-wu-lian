import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.styl";
import request from '../../services/request'
import MobileImg from '../../assets/dianhua.png'
// import starImg from '../../assets/starcollect.png'
import AddressImg from '../../assets/address.png'
import "taro-ui/dist/style/components/toast.scss";
// import "taro-ui/dist/style/components/icon.scss";
// import 'taro-ui/dist/style/index.scss'



interface Props {
	cashCouponList: any;
}


/**商店 ITEM 组件 */
export default class CashCouponListComponent extends Component<Props> {

	state: {
		cashCouponList: [{//优惠券列表
			id: '',
			name: '',
			image: "",
			image_type: '',
			address: '',
			list_brief: '',
			brief: '',
			youhui_type: '1',
			begin_time: '',
			end_time: '',
			pay_money: "",
			expire_day: ""
		}],
		couponList_bull: false
	}
	componentDidMount() {
		// console.log(this.props.cashCouponList)
		this.setState({
			cashCouponList: this.props.cashCouponList
		})
	}
	handleClick = (_id, e) => {
		Taro.navigateTo({
			url: '../../business-pages/ticket-buy/index?id=' + _id
		})
	}
	handleClick2 = (id, e) => {
		Taro.navigateTo({
			url: '../../business-pages/confirm-order/index?id=' + id
		})
	}
	render() {
		return (
			<View >
				<View className="merchant-details__tit" style={{fontSize: "19px",paddingLeft:"24rpx",height:"26px",position:"relative",display:"flex",alignItems:"center"}}>
					<Text className="mark" style={{
						 fontSize: " 10px",
             color: "#fff",
             backgroundColor: "#5D84E0",
             padding: "1px 5px",
             borderRadius: " 2px",
             marginRight: "10px",
             verticalAlign:"inherit",
             bottom:"0"
					}}>券</Text>
					<Text className="fwb" style={{ fontWeight: "bold", padding: "3px 5px", position: "absolute", left: "40px", bottom: "-6px" }}>现金券</Text>
				</View>
				<View className="bcfff ticket" id="couponList_tiket" >
					{
						this.state.couponList_bull ? this.state.cashCouponList.map((item) => (
							<div key={item.id}>
								<View className="ticket-view flex center" style={{ position: 'relative' }} onClick={this.handleClick.bind(this, item.id)}>
									<View className="left" style={{ position: 'absolute', left: '30px' }}>
										<View className="money"><View style={{ fontWeight: 'bold', float: "left", marginRight: "10px" }}>￥{item.pay_money}</View>{item.name}</View>
										<View className="desc">购买后{item.expire_day}天有效</View>
										<View className="sales">{item.brief}</View>
									</View>
									<View className="right" style={{ position: 'absolute', right: '20px' }}>
										<View className="money">￥<Text>{item.pay_money}</Text></View>
										<Button className="btn-buy" onClick={this.handleClick2.bind(this, item.id)} style={{ width: "104px", height: "33px", lineHeight: "3" }}>立即购买</Button>
									</View>
								</View>
								<br />
							</div>
						)) : <div>
								<View className="ticket-view flex center" style={{ position: 'relative' }} onClick={this.handleClick.bind(this, this.state.cashCouponList[0].id)}>
									<View className="left" style={{ position: 'absolute', left: '30px' }}>
										<View className="money"><View style={{ fontWeight: 'bold', float: "left", marginRight: "10px" }}>￥{this.state.cashCouponList[0].pay_money}</View>{this.state.cashCouponList[0].name}</View>
										<View className="desc">购买后{this.state.cashCouponList[0].expire_day}天有效</View>
										<View className="sales">{this.state.cashCouponList[0].brief}</View>
									</View>
									<View className="right" style={{ position: 'absolute', right: '20px' }}>
										<View className="money">￥<Text>{this.state.cashCouponList[0].pay_money}</Text></View>
										<Button className="btn-buy" onClick={this.handleClick2.bind(this, this.state.cashCouponList[0].id)} style={{ width: "104px", height: "33px", lineHeight: "3" }} >立即购买</Button>
									</View>
								</View>
								<br /></div>}
					<View style={{ height: "20px" }}></View>
					{
						this.state.cashCouponList.length != 1 ? <View className="ft-more flex center"
							style={{ textAlign: "center", margin: "0", width: "100%", background: "#fff" }}
							onClick={() => { this.setState({ couponList_bull: !this.state.couponList_bull }) }} >{this.state.couponList_bull ? "收回" : "查看更多"}
							{this.state.couponList_bull ? <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />}
						</View> : ""
					}


				</View>
				<View style={{ height: "30px" }}></View>
				<hr />
			</View>
		);
	}
}
