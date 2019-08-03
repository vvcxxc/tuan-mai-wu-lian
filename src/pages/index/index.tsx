import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.styl';
import request from '../../services/request';
import questTwo from '../../services/requesTwo'
import { connect } from '@tarojs/redux'

@connect(
  state => ({
    serchName: state.search.get('serchName'),
  }),
  dispatch => ({
    getDataList(payload: any): void {
      dispatch({
        type: 'search/getDataList',
        payload,
      })
    },
    onIncrement(): void {
      dispatch({
        type: 'search/searchname',
        payload: {
          serchName: '444444'
        }
      })
    },
  })
)

export default class Index extends Component<any> {
	/**
	 * 指定config的类型声明为: Taro.Config
	 *
	 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
	 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
	 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
	 */
  config: Config = {
    navigationBarTitleText: '小熊敬礼',
    enablePullDownRefresh: true,
  };

  state = {
    storeList: [],
    storeHeadImg: '',
    titleList: [], // title列表
    locations: { longitude: null, latitude: null },//存储地理位置
    routerId: '', //路由传递的id
    cityName: '',
    page: 1,
    meta: {},
    deal_cate_id: null,
    current: 0,
    showLine: false,
    cityId: null,
    indexImg: '',
    showGift: null,
    indexImgId: null,
    adLogId: null,
    need_jump: null
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  // componentDidMount() {
  //   this.showLoading();
  //   this.requestTab(); //经营列表
  //   this.localStorageData();
  //   this.showGift();
  // }



  // localStorageData = () => {
  //   if (Object.keys(this.$router.params).length < 1) {
  //     this.getLocation();
  //     return
  //   }
  //   Taro.getStorage({ key: 'router' }).then((res: any) => {
  //     if (res.data.city_name && res.data.city_id) {
  //       this.setState({ cityName: res.data.city_name })
  //       this.setState({ cityId: res.data.city_id })
  //       if (this.state.deal_cate_id) {

  //         this.setState({ meta: { city_id: res.data.city_id, deal_cate_id: this.state.deal_cate_id } }, () => {
  //           Taro.getLocation({
  //             type: 'wgs84',
  //             success: (res)=>{
  //               this.requestHomeList({...this.state.meta, xpoint: res.longitude || '', ypoint: res.latitude || ''})

  //             }
  //           })
  //         })
  //       } else {
  //         this.setState({ meta: { city_id: res.data.city_id} }, () => {
  //           // this.requestHomeList(this.state.meta)
  //           Taro.getLocation({
  //             type: 'wgs84',
  //             success: (res)=>{
  //               this.requestHomeList({...this.state.meta, xpoint: res.longitude || '', ypoint: res.latitude || ''})
  //             },
  //             fail: ()=> {
  //               this.requestHomeList({...this.state.meta, xpoint: '', ypoint: ''})
  //             }
  //           })
  //         })
  //       }
  //     }
  //     if (res.data.xpoint || res.data.ypoint) {
  //       console.log(3)
  //       if (this.state.deal_cate_id) {
  //         this.setState({
  //           meta: {
  //             xpoint: res.data.xpoint,
  //             ypoint: res.data.ypoint,
  //             deal_cate_id: this.state.deal_cate_id
  //           }
  //         }, () => {
  //           this.requestHomeList(this.state.meta)
  //         })
  //       } else {
  //         this.setState({ meta: { xpoint: res.data.xpoint, ypoint: res.data.ypoint } }, () => {
  //           request({
  //             url: 'v3/city_name',
  //             data: { xpoint: res.data.xpoint, ypoint: res.data.ypoint }
  //           })
  //             .then((res: any) => {
  //               this.setState({ cityName: res.data.city })
  //             })
  //           this.requestHomeList(this.state.meta)
  //           this.getCityId()
  //         })
  //       }
  //     }
  //   })

  // }
  // // get location
  // getLocation = () => {
  //   Taro.getLocation({
  //     type: 'wgs84',
  //     success: (res)=> {
  //       this.setState({ meta: { xpoint: res.longitude, ypoint: res.latitude } })
  //       this.setState({ locations: res }, () => {
  //         request({
  //           url: 'v3/city_name',
  //           data: { xpoint: this.state.locations.longitude, ypoint: this.state.locations.latitude }
  //         })
  //           .then((rr: any) => {
  //             // console.log(res)
  //             // this.setState({ cityName: res.data.city, city_id: res.data.city_id }, () => {
  //             //   this.getCityId()
  //             // });
  //             if (this.state.deal_cate_id == null) {
  //               // console.log(' 4')
  //               this.requestHomeList({ xpoint: res.longitude || '', ypoint: res.latitude || '', city_id: rr.data.city_id })
  //             } else {
  //               console.log('5')
  //               this.setState({
  //                 meta: {
  //                   xpoint: this.state.locations.longitude,
  //                   ypoint: this.state.locations.latitude,
  //                   deal_cate_id: this.state.deal_cate_id
  //                 }
  //               }, () => {
  //                 this.requestHomeList(this.state.meta)
  //               })
  //             }
  //           })


  //       })
  //     },
  //     fail: ()=>{
  //       this.requestHomeList({xpoint: '', ypoint: '', city_id: 1942});
  //       Taro.setStorageSync("location", {xpoint: '', ypoint: ''})
  //     }
  //   })
  // }

  // // 获取城市
  // getCity = () => {
  //   request({
  //     url: 'v3/city_name',
  //     data: { xpoint: this.state.locations.longitude, ypoint: this.state.locations.latitude }
  //   })
  //     .then((res: any) => {
  //       console.log(res)
  //       this.setState({ cityName: res.data.city, city_id: res.data.city_id }, () => {
  //         this.getCityId()
  //       })
  //     })
  // }


  // getCityId = () => {
  //   request({
  //     url: 'v3/citys',
  //     data: { keyword: this.state.cityName }
  //   })
  //     .then((res: any) => {
  //        this.setState({meta:{city_id: res.data[0].id}})

  //       this.setState({ cityId: res.data[0].id }, () => {
  //         this.showImage()
  //       })
  //     })
  // }

  // // 首页数据 初始渲染
  // requestHomeList = (meta) => {
  //   this.showLoading();
  //   Taro.stopPullDownRefresh()
  //   request({
  //     url: 'v3/stores',
  //     data: { ...meta }
  //   })
  //     .then((res: any) => {
  //       Taro.hideLoading()
  //       this.setState({ storeList: res.data.store_info.data, storeHeadImg: res.data.banner });
  //     })
  //     .catch(() => {
  //       this.showLoading()
  //     })
  // }


  // onPullDownRefresh = () => { // 自带 下拉事件
  //   this.localStorageData();
  // }

  // onReachBottom = () => { 	// 自带 触底事件
  //   this.showLoading()
  //   request({
  //     url: 'v3/city_name',
  //     data: { xpoint: this.state.locations.longitude, ypoint: this.state.locations.latitude }
  //   })
  //     .then((res: any) => {
  //       console.log(res)
  //       this.setState({ page: this.state.page + 1 }, () => {
  //         let miss = {
  //           ...this.state.meta, pages: this.state.page, city_id: res.data.city_id
  //         }
  //         if (this.state.deal_cate_id) {
  //           miss['deal_cate_id'] = this.state.deal_cate_id
  //         }
  //         request({
  //           url: 'v3/stores',
  //           data: {
  //             ...miss
  //           }
  //         })
  //           .then((res: any) => {
  //             Taro.stopPullDownRefresh()
  //             Taro.hideLoading()
  //             console.log(res.data, 'data')
  //             this.setState({ storeList: [...this.state.storeList, ...res.data.store_info.data], storeHeadImg: res.data.banner });
  //           })
  //       })
  //     })

  // }

  // // show loading
  // showLoading = () => {
  //   Taro.showLoading({
  //     title: 'loading',
  //     mask: true
  //   })
  // }

  // // 获取title数据
  // requestTab = () => {
  //   request({
  //     url: 'v3/manage_type'
  //   })
  //     .then((res: any) => {
  //       let mete = [{ name: '全部', id: 'all' }, ...res.data]
  //       this.setState({ titleList: mete })
  //     })
  // }

  // handleActivityClick = () => { };

  // // 跳转 搜索商家列表页面
  // handleSearch = () => Taro.navigateTo({ url: './search/index' });
  // // 跳转 搜素城市页面
  // showSelectCity = () => Taro.navigateTo({ url: '/business-pages/select-city/index' });

  // handlerTablChange(current, id, _this) {
  //   this.setState({ current });
  //   if (id == 'all' || this.state.deal_cate_id == 'all') {
  //     this.setState({ deal_cate_id: null })
  //     this.requestHomeList({ ...this.state.meta })
  //     return
  //   }
  //   this.setState({ deal_cate_id: id })
  //   this.requestHomeList({ ...this.state.meta, deal_cate_id: id })
  // }

  componentDidMount() {
    let id = this.$router.params.id;
    if (id) {
      sessionStorage.setItem('payStore', id)
    }
    this.requestLocation();
    this.recognizer();
    // this.getPayStore();//获取中奖门店信息
  }

  // 识别器
  recognizer = () => {
    this.requestTab(); //经营列表
    // this.getLocationxy()// 获取定位和 城市id 城市名字
    Taro.getStorage({ key: 'router' }).then((res: any) => {
      if (Object.keys(res.data).length < 1) {
        console.log(1)
        this.requestTab(); //经营列表
        this.getLocationxy()// 获取定位和 城市id 城市名字
        return
      }
      this.requestTab();
      if (res.data.city_id || res.data.city_name) {
        console.log(2)

        Taro.getLocation(
          {
            type: 'wgs84',
            success: (res2) => {
              let data: any = this.state.meta
              data.xpoint = res2.longitude
              data.ypoint = res2.latitude
              data.city_id = res.data.city_id
              data.city_name = res.data.city_name
              data.pages = 1
              this.setState({ cityName: res.data.city_name })
              this.setState({ meta: data }, () => {
                this.requestHomeList(data)
              })
            },
            fail:()=>{
                  this.setState({cityName:res.data.city_name})
                  let data:any = this.state.meta
                  data.pages = 1
                  data.city_id =  res.data.city_id
                  data.xpoint = ''
                  data.ypoint = ''
                  this.setState({meta:data})
                  this.requestHomeList(data);
            }
          })
        return
      }

      if (res.data.xpoint && res.data.ypoint) {
        console.log(3)

        let data: any = this.state.meta
        data.xpoint = res.data.xpoint
        data.ypoint = res.data.ypoint
        this.getCity(data)
        data.pages = 1
        this.setState({ meta: data })
      }
    }).catch((res: any) => {
      console.log(4)

      this.getLocationxy()// 获取定位和 城市id 城市名字
    })
  }

  getLocationxy = () => {
    Taro.getLocation(
      {
        type: 'wgs84',
        success: (res) => {
      this.setState({ meta: { xpoint: res.longitude, ypoint: res.latitude } }, () => {
        // if (res.longitude.length < 1 && res.latitude.length < 1) {
        //   let data: any = this.state.meta
        //   data.city_id = 1924
        //   this.setState({ meta: data })
        //   return
        // }
        this.getCity()
      })
    }, fail:()=>{
      console.log(222)
      this.setState({meta:{xpoint: '', ypoint: '', city_id: 1942,pages:1}},()=>{
        Taro.setStorage({
          key: 'router',
          data: this.state.meta
        })
      })
       this.setState({page:1})
      this.requestHomeList({xpoint: '', ypoint: '', city_id: 1942});
      Taro.setStorageSync("location", {xpoint: '', ypoint: ''})

    }
    })
  }

  // 获取城市
  getCity = (data?: any) => {
    let datas = data ? data : this.state.meta
    request({
      url: 'v3/city_name',
      data: datas
    })
      .then((res: any) => {
        this.setState({ cityName: res.data.city }) //城市名字
        this.setState({ // 保存了城市id 和经纬度
          meta: {
            city_id: res.data.city_id,
            xpoint: this.state.meta.xpoint,
            ypoint: this.state.meta.ypoint,
            pages: this.state.page
          }
        }, () => {
          this.showImage();
          this.requestHomeList(this.state.meta)
        })
      })
  }
  requestHomeList = (data?: any) => {
    let define = data ? data : this.state.meta
    this.showLoading();
    Taro.stopPullDownRefresh()
    request({
      url: 'v3/stores',
      data: define
    })
      .then((res: any) => {
        Taro.hideLoading()
        this.setState({ storeList: res.data.store_info.data, storeHeadImg: res.data.banner });
        if (this.state.meta.pages > 1) {
          this.setState({ storeList: [...this.state.storeList, ...res.data.store_info.data], storeHeadImg: res.data.banner });
        }
      })
      .catch(() => {
        this.showLoading()
      })

    Taro.setStorage({
      key: 'router',
      data: this.state.meta
    })
  }

  // 获取所有城市列表
  requestLocation = () => {
    request({ url: 'v3/district', data: { model_type: '2' } })
      .then((res: any) => {
        Taro.setStorage({ key: 'allCity', data: res.data.city_list })
      })
  }

  // 获取title数据
  requestTab = () => {
    request({
      url: 'v3/manage_type'
    })
      .then((res: any) => {
        this.setState({ titleList: [{ name: '全部', id: 'all' }, ...res.data] })
      })
  }

  handlerTablChange(current, id, _this) {
    this.setState({ current });
    let data = this.state.meta
    data.pages = 1
    this.setState({ meta: data })

    if (id == 'all' || this.state.deal_cate_id == 'all') {
      delete (this.state.meta['deal_cate_id'])
      this.requestHomeList({ ...this.state.meta })
      return
    }
    this.setState({ meta: { ...this.state.meta, deal_cate_id: id } })
    this.requestHomeList({ ...this.state.meta, deal_cate_id: id })
  }

  onPullDownRefresh() { // 自带 下拉事件
    let data = this.state.meta
    data.pages = 1
    this.setState({ meta: data })
    this.requestHomeList(this.state.meta)
  }

  onReachBottom() {
    this.setState({ page: this.state.page + 1 }, () => {
      this.requestHomeList({ ...this.state.meta })
    })
    let data:any = this.state.meta
    data.pages = data.pages + 1
    this.setState({ meta: data })
  }

  showLoading = () => {
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
  }

  handleActivityClick = () => { };

  // 跳转 搜索商家列表页面
  handleSearch = () =>{
    console.log(this.state.meta,'meta')
    Taro.navigateTo({ url: './search/index' });
  }
  // 跳转 搜素城市页面
  showSelectCity = () => {

    Taro.navigateTo({ url: '/business-pages/select-city/index' });
  }

  styleControl = (item) => {
    if (item.merchant) {
      if (
        item.exchange_coupon_name === null &&
        item.gift_coupon_name === null &&
        item.gift_name === null) {
        return false
      }
      return true
    }
  }


  handleClick = (_id, e) => {
    Taro.navigateTo({
      url: '/pages/business/index?id=' + _id
    })
  };

  judgeData = (value1) => {
    return typeof (value1) === 'string' ? (value1.length > 1 ? '' : 'none') : 'none'
  }

  controlPicture = (gift, coupon, preview?) => { // 控制图片显示
    if (!coupon && !gift) return false //两个图片都没有 显示门头照preview
    if (!gift) return 1 //礼品图不存在 只显示一张coupon
    return 2 //两张都显示
  }

  showGift = () => {
    request({
      url: 'v3/user/home_index'
    })
      .then((res: any) => {
        this.setState({ showGift: res.data.have_gift })
      })
  }

  showImage = () => {
    request({
      url: 'v3/ads',
      data: {
        position_id: '3',
        city_id: this.state.cityId
      }
    })
      .then((res: any) => {
        console.log(res, 'res')
        this.setState({ indexImg: res.data.pic })
        this.setState({ indexImgId: res.data.id })
        this.setState({ adLogId: res.data.adLogId })
        this.setState({ need_jump: res.data.need_jump })
      })
  }

  // 跳转到我的礼品
  routerGift = () => {
    // Taro.reLaunch(
    // 	{ url: '../../pages/my/index' }
    // )
    Taro.navigateTo({ url: '/activity-pages/my-welfare/pages/gift/welfare.gift' });
  }
  gotoGroup = () => {
    Taro.navigateTo({
      url: '/pages/activity/pages/list/list?type=5'
    })
  }
  gotoAppre = () => {
    Taro.navigateTo({
      url: '/pages/activity/pages/list/list?type=1'
    })
  }

  // 点击广告
  advertOnclick = () => {
    console.log(this.state.need_jump, '0-00099099')
    if (!this.state.need_jump) return
    request({
      url: 'v3/ads/onclick',
      data: {
        ad_id: this.state.indexImgId, //广告id
        ad_log_id: this.state.adLogId //广告日志id
      }
    })
      .then((res: any) => {
        let define: any = {
          [1]: '/pages/business/index?id=' + res.data.store_id,//店铺
          [2]: '/business-pages/ticket-buy/index?id=' + res.data.coupon_id,//现金券
          [3]: '/business-pages/set-meal/index?id=' + res.data.coupon_id,//兑换券
          [4]: '/pages/activity/pages/detail/detail?id=' + res.data.activity_id + '&type=1',//拼团
          [5]: '/pages/activity/pages/detail/detail?id=' + res.data.activity_id + '&type=5'//增值
        }
        Taro.navigateTo({
          url: define[res.data.popularize_type]
        })
      })
  }


  render() {
    return (
      <View className="index">
        <View className="head">
          <View className="search">
            <View className="flex center container">

              <View className="city" style="padding-right:10px; width: 22%" onClick={this.showSelectCity}>
                <View className='ellipsis-one flex' style='width:70%; display: inline-block'>
                  {this.state.cityName || '广州市'}
                </View>
                <AtIcon
                  onClick={this.showSelectCity}
                  className="chevron-down"
                  value="chevron-down"
                  color="#313131"
                  size="12"
                />
              </View>
              {/* <View className="city" style="padding-right:15px;" onClick={this.showSelectCity}>
                {this.state.cityName}
                <AtIcon
                  onClick={this.showSelectCity}
                  className="chevron-down"
                  value="chevron-down"
                  color="#313131"
                  size="12"
                />
              </View> */}
              <View className="long-string" style="margin-right:15px;" />
              <AtIcon className="search-icon" value="search" color="#666666" size={14} />
              <View className="item search-input" onClick={this.handleSearch}>
                请输入商家名、品类
							</View>
            </View>
          </View>
          <View className="swiper" onClick={this.advertOnclick.bind(this)}>
            <Image

              src={
                this.state.indexImg ? this.state.indexImg : "http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/dHBc2GQi27cjhNpsYpAnQYxybxPdADHG.png"
              } className="image" />
          </View>
        </View>
        <View className="advert">
          <Image src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MfwcW2Qn5hC8T4mfJT8t5NcAEh7pTQRb.png"} onClick={this.gotoGroup}></Image>
          <Image src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/wWmWHKBjWZbkxYNPGPRZAst8CKbfNsGk.png"} onClick={this.gotoAppre}></Image>
        </View>
        <View className="no_receive" style={{ display: this.state.showGift == 1 ? '' : 'none' }}
        >你还有未领取的礼品 去
					<Text style="color:#FF6654" onClick={this.routerGift}>“我的礼品”</Text>	看看
				</View>
        <View className="tab flex" style="background-color:#f6f6f6 ;white-space: nowrap; overflow-x:scroll;overflow-y: hidden; padding-left: 16px">
          {this.state.titleList.map((item: any, index) => (
            <View
              key={" "}
              className={
                "item flex center " +
                (this.state.current === index ? "active" : "")
              }
              onClick={this.handlerTablChange.bind(this, index, item.id)}
            >
              <View className="label" style="margin-right:30px;">{item.name}</View>
            </View>
          ))}
        </View>
        {
          this.state.storeList.map((item: any, index: any) => {
            return <View className='merchant  activity inset '
              style={{
                paddingBottom: this.styleControl(item) ? '5px' : '0px',
                borderRadius: this.styleControl(item) ? '' : '20px'
              }}>
              <View className="content flex" onClick={this.handleClick.bind(this, item.id)}>
                <View className="item">
                  <View className="flex" style="margin-bottom:5px;">
                    <View className="title item" style="font-weight:500;">{item.name}</View>
                    <AtIcon value="chevron-right" color="#999" size="16px" />
                  </View>

                  <View style="display:flex; justify-content:space-between; margin:5px 0px;">
                    <View style="display:flex;">
                      {
                        item.label.map((item1: any, index1: any) => {
                          return <View className="tag" key={index1} style="background-color:#fff;border: 1px solid rgba(255, 102, 84, 1);">{item1}</View>
                        })
                      }
                    </View>
                    <View>{item.distance} </View>
                  </View>
                  {/* <View className="flex " style="position:relative; height:40px">
										{
											item.label.map((item1: any, index1: any) => {
												return <View className="tag" style="background-color:#fff; position: relative; z-index:99">{item1}</View>
											})
										}
										<View style="position:absolute; right:0px; line-height:1; bottom:2px;font-size:12px;" >{item.distance}
										</View>
									</View> */}
                </View>
              </View>
              <View className="content_box" onClick={this.handleClick.bind(this, item.id)}
              >
                <View className='content_img' 	>
                  <Image src={
                    this.controlPicture(item.gift_pic, item.coupon_image_url) === false ||
                      this.controlPicture(item.gift_pic, item.coupon_image_url) === 1 ?
                      item.preview : item.coupon_image_url} />
                </View>
                <View className={this.controlPicture(item.gift_pic, item.coupon_image_url) === 2 ?
                  'content_img' : 'hidden_content_img'} style="position:relative;  padding-left:2px; margin-left:5px; ">
                  <Image src={require("./border.png")} style="position:absolute; top:0px;left:0px;" />
                  <Image src={require("./qiu.png")} style="position:absolute; top:-4px;left:41%; width:25px;height:25px;" />
                  <Image src={item.gift_pic} />
                </View>
              </View>
              <View>
                <View className="give flex center" style={{ display: this.judgeData(item.gift_name) }}>
                  <View className="icon">礼</View>
                  <View className="title item ellipsis-one">
                    <Text>{item.gift_name}</Text>
                  </View>
                </View>
                <View className="give flex center"
                  style={{ display: typeof (item.cash_coupon_name) === 'string' ? '' : 'none' }}>
                  <View className="icon" style="background: #5d84e0">券</View>
                  <View className="title item">
                    <Text>{item.cash_coupon_name}</Text>
                  </View>
                </View>
                <View className="give flex center"
                  style={{
                    display: typeof (item.exchange_coupon_name) === 'string' ? '' : 'none'
                  }}>
                  <View className="icon" style="background: #5dd8a5">惠</View>
                  <View className="title item ellipsis-one">
                    {item.exchange_coupon_name}
                  </View>
                </View>
              </View>
            </View>
          })
        }
      </View>
    );
  }
}
