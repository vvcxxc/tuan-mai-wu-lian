import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import { AtModal, AtModalContent, AtModalAction, AtIcon } from "taro-ui"
import './index.styl';
import request from '@/services/request';
import { connect } from '@tarojs/redux'
import { getUserInfo } from "@/utils/getInfo"

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
    need_jump: null,
    telescopic: false,
    telescopicBox: 'auto',
    is_login: false,
    is_location: false,
    city_data: {
      city_name: '',
      city_id: ''
    }, // 用来判断定位信息
    is_one: false // 判断第一次进入
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.SilentAuthorization()
    this.requestLocation();
      this.recognizer();
      this.showGift()
      let token = Taro.getStorageSync("token");
      if (token) {
        this.setState({ is_login: false })
      }
  }

  componentWillReceiveProps(nextProps) {
    // 下拉刷新
    if (this.props.changePull != nextProps.changePull) {
      this.showGift()
      let data = this.state.meta
      data.pages = 1
      this.setState({ meta: data })
      this.requestHomeList(this.state.meta)
    }
    // 触底加载更多
    if (this.props.changeBottom != nextProps.changeBottom) {
       this.setState({ page: this.state.page + 1 }, () => {
      this.requestHomeList({ ...this.state.meta })
    })
    let data: any = this.state.meta
    data.pages = data.pages + 1
    this.setState({ meta: data })
    }
    // componentDidShow
    if(this.props.changeShow != nextProps.changeShow){
      this.requestLocation();
      this.recognizer();
      this.showGift()
      let token = Taro.getStorageSync("token");
      if (token) {
        this.setState({ is_login: false })
      }
    }
  }

  // 获取当前坐标及城市名
  getHereName = (city_name: string) => {

    Taro.getLocation({
      success: res => {
        request({
          url: 'v3/city_name',
          data: {
            xpoint: res.longitude,
            ypoint: res.latitude
          }
        }).then((res1: any) => {
          if (city_name != res1.data.city) {
            this.setState({
              city_data: { city_name: res1.data.city, city_id: res1.data.city_id },
              is_location: true,
              is_one: false
            })
          }
        })
      }
    })
  }

  // 切换城市
  changeCity = () => {
    let res = Taro.getStorageSync('router')
    res.city_name = this.state.city_data.city_name
    res.city_id = this.state.city_data.city_id
    Taro.setStorageSync('router', res)
    this.setState({ is_location: false }, () => {
      Taro.removeStorageSync('is_one')
      this.recognizer()
    })
  }


  // 识别器
  recognizer = () => {
    this.requestTab(); //经营列表
    Taro.getStorage({ key: 'router' }).then((res: any) => {
      if (Object.keys(res.data).length < 1) {
        this.requestTab(); //经营列表
        this.getLocationxy()// 获取定位和 城市id 城市名字
        return
      }
      this.requestTab();
      let is_one = Taro.getStorageSync('is_one')
      if (is_one) {
        if (res.data.city_name) {
          this.getHereName(res.data.city_name)
        }
      }
      if (res.data.city_id || res.data.city_name) {
        Taro.getLocation(
          {
            type: 'gcj02',
            success: (res2) => {
              let data: any = this.state.meta
              data.xpoint = res2.longitude
              data.ypoint = res2.latitude
              data.city_id = res.data.city_id
              data.city_name = res.data.city_name
              data.pages = 1
              this.setState({ meta: data }, () => {
                this.requestHomeList(data)
              })
            },
            fail: () => {
              let data: any = this.state.meta
              data.pages = 1
              data.city_id = res.data.city_id
              data.city_name = res.data.city_name
              data.xpoint = ''
              data.ypoint = ''
              this.setState({ meta: data })
              this.requestHomeList(data);
            }
          })
        return
      }

      if (res.data.xpoint && res.data.ypoint) {
        let data: any = this.state.meta
        data.xpoint = res.data.xpoint
        data.ypoint = res.data.ypoint
        this.getCity(data)
        data.pages = 1
        this.setState({ meta: data })
      }
    }).catch((res: any) => {

      this.getLocationxy()// 获取定位和 城市id 城市名字
    })
  }

  getLocationxy = () => {
    Taro.getLocation(
      {
        type: 'gcj02',
        success: (res) => {
          this.setState({ meta: { xpoint: res.longitude, ypoint: res.latitude } }, () => {
            this.getCity()
          })
        }, fail: () => {
          this.setState({ meta: { xpoint: '', ypoint: '', city_id: 1942, pages: 1 } }, () => {
            Taro.setStorage({
              key: 'router',
              data: this.state.meta
            })
          })
          this.setState({ page: 1 })
          this.requestHomeList({ xpoint: '', ypoint: '', city_id: 1942 });
          Taro.setStorageSync("location", { xpoint: '', ypoint: '' })

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
            pages: this.state.page,
            city_name: res.data.city
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
        this.showImage();
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

  // onPullDownRefresh = () => { // 自带 下拉事件
  //   this.showGift()
  //   let data = this.state.meta
  //   data.pages = 1
  //   this.setState({ meta: data })
  //   this.requestHomeList(this.state.meta)
  // }

  // onReachBottom() {
  //   this.setState({ page: this.state.page + 1 }, () => {
  //     this.requestHomeList({ ...this.state.meta })
  //   })
  //   let data: any = this.state.meta
  //   data.pages = data.pages + 1
  //   this.setState({ meta: data })
  // }

  showLoading = () => {
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
  }

  handleActivityClick = () => { };

  // 跳转 搜索商家列表页面
  handleSearch = () => {
    Taro.navigateTo({ url: './search/index' });
  }
  // 跳转 搜素城市页面
  showSelectCity = () => {
    Taro.removeStorageSync('is_one')
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
        city_id: this.state.meta.city_id
      }
    })
      .then((res: any) => {
        this.setState({ indexImg: res.data.pic })
        this.setState({ indexImgId: res.data.id })
        this.setState({ adLogId: res.data.adLogId })
        this.setState({ need_jump: res.data.need_jump })
      }).catch(err => {
        console.log(err)
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
      }).catch(err => {
      })
  }

  labelColor = (color: any) => {
    let data: any = {
      ['拼团送礼']: '#D97B0B',
      ['增值送礼']: '#F0634C',
      ['认证商户']: '#FFFFFF'
    }
    return data[color]
  }

  // 点击展开或者收回
  telescopicBox = (index: number, e) => {
    this.setState({ telescopic: !this.state.telescopic }, () => {
      let data: any = this.state.storeList
      this.state.telescopic ? data[index].height = 'auto' : data[index].height = '3.6rem'
      this.setState({ storeList: data })
    })
    e.stopPropagation();
  }
  /**
   * 监听授权登录按钮点击事件
   */
  // handleGetUserInfo = (e): void => {
  //   const { errMsg, userInfo, encryptedData, iv } = e.detail
  //   if (errMsg === "getUserInfo:ok") {
  //     Taro.setStorageSync("userInfo", userInfo)
  //     // Taro.setStorageSync("encryptedData", encryptedData)
  //     // Taro.setStorageSync("iv", iv)
  //     this.handleSign()
  //   }
  // }
  /**
   * 登录处理
   */
  // handleSign = async (): Promise<void> => {
  //   const { miniProgramSign } = require("@/utils/sign")
  //   // const { currentUrl, tabbar, id } = this.state
  //   // if (!currentUrl) return
  //   const userInfo = Taro.getStorageSync("userInfo")
  //   let encryptedData = Taro.getStorageSync("encryptedData")
  //   let iv = Taro.getStorageSync("iv")
  //   await Taro.login()
  //   // if (!encryptedData || !iv) {
  //     const {
  //       errMsg,
  //       encryptedData: _encryptedData,
  //       iv: _iv
  //     } = await getUserInfo()
  //     if (errMsg === "getUserInfo:ok") {
  //       // Taro.setStorageSync("encryptedData", _encryptedData)
  //       // Taro.setStorageSync("iv", _iv)
  //       encryptedData = _encryptedData
  //       iv = _iv
  //     }
  //   // }
  //   await miniProgramSign({
  //     basicApi: process.env.BASIC_API,
  //     userInfo,
  //     encryptedData,
  //     iv
  //   }).catch(err => {
  //     console.log(err)
  //     throw Error("--- 登录出错(, auth) ---")
  //   })
  //   Taro.removeStorageSync('is_login')
  //   this.setState({is_login: false})
  //   this.requestLocation();
  //   this.recognizer();
  //   this.showGift()

  // }

  // 取消切换城市
  noChangeCity = () => {
    this.setState({ is_location: false })
    Taro.removeStorageSync('is_one')
  }

  render() {
    return (
      <View className="index">
        <View className="head">
          <View className="search">
            <View className="flex center container">

              <View className="city" style="padding-right:10px; width: 22%" onClick={this.showSelectCity}>
                <View className='ellipsis-one flex' style='width:70%; display: inline-block'>
                  {/* {this.state.cityName || '1广州市'} */}
                  {this.state.meta.city_name || '广州市'}
                </View>
                <AtIcon
                  onClick={this.showSelectCity}
                  className="chevron-down"
                  value="chevron-down"
                  color="#313131"
                  size="12"
                />
              </View>
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
          <Image src={'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/sKsYDHRKBe8QyerFTyzXPGJZAerDyamG.png'} onClick={this.gotoGroup}></Image>
          <Image src={'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/kBfNBZdeYZdxJN8ty7jMdzAFMYre2XMa.png'} onClick={this.gotoAppre}></Image>
        </View>
        <View className="no_receive" style={{ display: this.state.showGift == 1 ? '' : 'none' }}
        >你还有未领取的礼品 去
					<Text style="color:#FF6654" onClick={this.routerGift}>“我的礼品”</Text>	看看
				</View>
        <View className="tab flex" style="background-color:#f6f6f6 ;white-space: nowrap; overflow-x:scroll;overflow-y: hidden; padding-left: 16px; display: flex">
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
          this.state.storeList.map((item2: any, index: any) => {
            return <View className="new_box">
              <View className="box" style={{ paddingBottom: item2.activity ? '' : '4px' }} onClick={this.handleClick.bind(this, item2.id)}>
                <View className="box_title" style={{ borderBottom: item2.activity_num ? '0.5px solid #eeeeee' : 'none', paddingBottom: item2.activity_num ? '12rpx' : 'none' }}>
                  <View className="title_l">
                    <Image className="Image" src={item2.preview} />
                  </View>
                  <View className="title_r">
                    <View className="view_name1 ellipsis-one"
                      style={{ width: '12.2rem', display: 'block' }}>{item2.name}</View>
                    <View className="view_name2">
                      <Text>
                        {
                          item2.deal_cate ? item2.deal_cate : null
                        }
                      </Text>
                      <Text style={{ paddingRight: '5rpx' }}>{item2.distance}</Text>
                    </View>
                    <View className="view">
                      {
                        item2.label.map((item3: any, index1: any) => {
                          return <View key={''}
                            className={this.labelColor(item3) === '#FFFFFF' ? 'span' : ''}
                            style={{ border: this.labelColor(item3) == '#FFFFFF' ? '1px solid #ff6654' : 'none', backgroundColor: this.labelColor(item3), marginBottom: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}
                          >{item3}</View>
                        })
                      }
                    </View>
                  </View>
                </View>

                <View
                  className="box_bottom" id="box_bottom"
                  style={{
                    position: 'relative',
                    height:
                      !this.state.storeList[index].height ?
                        item2.activity_num > 2 ? '3.6rem' : 'auto' : this.state.storeList[index].height,
                    marginBottom: item2.activity_num >= 1 ? '-0.001rem' : '15px',
                    overflow: 'hidden',
                  }}
                >

                  <View onClick={this.telescopicBox.bind(this, index)}
                    style={{ position: 'absolute', top: '0', right: '0', display: item2.activity_num > 2 ? '' : 'none', borderBottom: 0 }}
                  >
                    <View style={{ marginRight: '8px', color: '#999', borderBottom: 0 }}>
                      {
                        item2.activity_num ? item2.activity_num + '个活动' : null
                      }
                    </View>
                    <Image src={
                      this.state.storeList[index].height !== 'auto' ?
                        "http://oss.tdianyi.com/front/wRftjWN2D3aZwiHQjfH64ba27FXRBFCR.png" : "http://oss.tdianyi.com/front/NMKeBjaajWYJxRSmcjXYFEGxXFkGE7BA.png"}
                      style={{ marginRight: 0 }}
                    />
                  </View>

                  <View
                    style={{
                      display: item2.activity ? item2.activity.group ? '' : 'none' : 'none',
                      justifyContent: 'space-between'
                    }}
                  >

                    <View className="box_bottom_child">
                      < Image src={
                        item2.activity ?
                          (item2.activity.group ? item2.activity.group.icon : null)
                          : null}
                      />
                      <View className=" ellipsis-one asd"
                        style={{ width: '12rem', display: 'block', overflow: 'hidden', height: '30rpx' }}
                      >
                        <Text style={{ fontSize: '13px', lineHeight: '1' }}>
                          {
                            item2.activity ? (item2.activity.group ? item2.activity.group.activity_info : null)
                              : null
                          }
                        </Text>
                        <Text style={{ color: '#C71D0B', fontSize: '13px', lineHeight: '1' }}>
                          {
                            item2.activity ? (item2.activity.group ? item2.activity.group.gift_info : null)
                              : null
                          }
                        </Text>
                      </View>
                    </View>

                  </View>
                  <View
                    style={{
                      display: item2.activity ? item2.activity.cash_coupon ? '' : 'none' : 'none',

                    }}
                  >
                    <Image src={
                      item2.activity ?
                        (item2.activity.cash_coupon ? item2.activity.cash_coupon.icon : null)
                        : null}
                    />
                    <View className=" ellipsis-one asd"
                      style={{ width: '12rem', display: 'block', height: '30rpx', overflow: 'hidden' }}>
                      <Text style={{ fontSize: '13px', lineHeight: '1' }}>
                        {
                          item2.activity ? (item2.activity.cash_coupon ? item2.activity.cash_coupon.activity_info : null)
                            : null
                        }
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{ display: item2.activity ? item2.activity.exchange_coupon ? '' : 'none' : 'none' }}
                  >
                    <Image src={
                      item2.activity ?
                        (item2.activity.exchange_coupon ? item2.activity.exchange_coupon.icon : null)
                        : null}
                    />
                    <View className=" ellipsis-one asd"
                      style={{ width: '12rem', display: 'block', height: '30rpx', overflow: 'hidden' }}>
                      <Text style={{ fontSize: '13px', lineHeight: '1' }}>
                        {
                          item2.activity ? (item2.activity.exchange_coupon ? item2.activity.exchange_coupon.activity_info : null)
                            : null
                        }
                      </Text>
                    </View>
                  </View>

                  <View
                    className="box_bottom_child"
                    style={{ display: item2.activity ? item2.activity.zeng ? '' : 'none' : 'none' }}
                  >
                    < Image src={
                      item2.activity ?
                        (item2.activity.zeng ? item2.activity.zeng.icon : null)
                        : null}
                    />
                    <View className=" ellipsis-one asd"
                      style={{ width: '12rem', display: 'block', height: '30rpx', overflow: 'hidden' }}>
                      <Text style={{ fontSize: '13px', lineHeight: '1' }}>
                        {
                          item2.activity ? (item2.activity.zeng ? item2.activity.zeng.activity_info : null)
                            : null
                        }
                      </Text>
                      <Text style={{ color: '#C71D0B', fontSize: '13px', lineHeight: '1' }}>
                        {
                          item2.activity ? (item2.activity.zeng ? item2.activity.zeng.gift_info : null)
                            : null
                        }
                      </Text>
                    </View>
                  </View>



                </View>
              </View>
            </View>
          })
        }
        {/* <AtModal isOpened={this.state.is_login} className='confirm_box'>
          <AtModalContent>
            <Image src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/TQnWAHEBkpBtEiAW6wmfJDyGS6Kfzydj.png' className='confirm_logo'/>
            <View className='confirm_text'>登录后可访问更精彩的内容</View>
          </AtModalContent>
          <AtModalAction> <Button onClick={()=>{this.setState({is_login: false})}}>取消</Button> <Button style={{color: '#fe9692'}} openType="getUserInfo" onGetUserInfo={this.handleGetUserInfohandleGetUserInfo}>微信登录</Button> </AtModalAction>
        </AtModal>
        <AtModal isOpened={this.state.is_location}>
          <AtModalContent className='locationModal'>
      <View className='modal_text'>定位您在<Image src={require('@/assets/address.png')}/>{this.state.city_data.city_name}</View>
            <View className='modal_text'>是否切换到该城市进行查看</View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.noChangeCity}>取消</Button>
            <Button onClick={this.changeCity} style={{color: '#FE7263'}}>切换</Button>
          </AtModalAction>
        </AtModal> */}
      </View>
    );
  }
}
