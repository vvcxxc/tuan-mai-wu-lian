import Taro, { Component, Config } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import Tabs from "../../components/tabs";
import Content from "./content";
import "./index.styl";
import request from "../../services/request";

export default class Order extends Component {
  config: Config = {
    navigationBarTitleText: "我的订单"
  };
  state = {
    current: 0,
    coupon: [],
    currentShowList:[],
    page: 1,
    loading: false
  };

  handlerTabChange(current:number) {
    this.setState({
       current ,
       currentShowList : this.handerListType(current),
    });
  }
  //判断四种优惠券的类型
  handerListType=(type:number)=>{
     const { coupon } = this.state
     let now = Date.parse( String( new Date() ) )
     switch(type){
        case 0: //未使用 ---->当前时间早于过期时间 ， 且没有使用时间
         return coupon.filter( (i:any)=> Date.parse( i.expiration ) > now && i.status * 1 === 1    )
        case 1: //已使用 ---->有使用时间
         return coupon.filter((i:any) => i.status * 1 === 2 )
        case 2: //已过期 ---->当前时间晚于过期时间 ， 且没有使用时间
         return coupon.filter((i:any) => now >  Date.parse( i.expiration ) && i.status * 1 === 1    )
        case 3: //已退款
         return coupon.filter((i:any) => i.status * 1 === 3 )
        default : return []
     }
  }
  componentWillMount() {
    this.getData();
  }

  getData() {
    this.setState({ loading: true });
    request({
      url: "v3/user/coupons",
      data: { coupons_status: this.state.current + 1, page: this.state.page }
    })
      .then((res: any) => this.setState({ coupon: res.data, loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const { current , currentShowList } = this.state
    const list = ["未使用", "已使用", "已过期", "已退款"];
    return (
      <View className="order flex column">
        <Tabs list={list} onChange={this.handlerTabChange.bind(this)} />
        <ScrollView scrollY className="item content-wrap">
          <Content   type={current}   list={currentShowList} loading={this.state.loading} />
        </ScrollView>
      </View>
    );
  }
}
