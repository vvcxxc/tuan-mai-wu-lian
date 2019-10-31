import Taro, { Component, hideToast } from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { AtSearchBar } from 'taro-ui';
import './index.styl';
import request from '../../services/request';
import no_value_img from '../../assets/no_value.png'
import FilterTotal from "src/components/filter-total";

export default class MerChantPage extends Component {
  config = {
    navigationBarTitleText: '商家',
    enablePullDownRefresh: true
  };

  state = {
    search: '',
    stores: [],
    filter: [],
    locationPosition: {},//存储获取到的地理位置
    select: [],
    selectData: { name: '', type: "" },
    page: 1,
    deal_cate_id: null,
    distance_id: null,
    sort_id: null,
    telescopic: false,
    telescopicBox: 'auto',
    banScroll: false,  //是否禁止滚动
    no_value:false //新增 显示搜索无结果的背景图
  };

  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.getPosition();// 经纬度
    Taro.showLoading({ title: 'loading', mask: true })//显示loading
  }

  componentDidMount() {
    if (this.state.banScroll) {
      // Taro.stopPullDownRefresh()
      // console.log('333')
      this.config.enablePullDownRefresh = false
    }
    // document.body.addEventListener('touchmove', function (e) {
    //   e.preventDefault();
    // }, { passive: false });
  }

  // 搜索赋值
  handlerSearch = (value) => {
    this.setState({ search: value });
  }


  getPosition() {
    Taro.getStorage({ key: 'router' }).then((res: any) => {
      let data: any = this.state.locationPosition
      data.xpoint = res.data.xpoint
      data.ypoint = res.data.ypoint
      data.city_id = res.data.city_id
      data.pages = 1
      this.setState({ locationPosition: data }, () => {
        if (this.$router.params.value) {
          this.setState({ search: this.$router.params.value })
          this.requestSearch(this.$router.params.value)//路由渲染
          // let data = this.state.locationPosition
          // data.ke
          return
        }
        this.requestData(this.state.locationPosition)
      })
    })

    Taro.getLocation({
      type: 'gcj02',
      fail: () => {
        console.log('323321')
        Taro.getStorage({ key: 'router' }).then((res: any) => {
          console.log(res.data, 'dat  a')
          let data: any = this.state.locationPosition
          data.xpoint = res.data.xpoint
          data.ypoint = res.data.ypoint
          data.city_id = res.data.city_id
          data.pages = 1
          this.setState({ locationPosition: data }, () => {
            if (this.$router.params.value) {
              this.requestSearch(this.$router.params.value)//路由渲染
              return
            }
            //         this.requestSearch(this.$router.params.value)//路由渲染
            this.requestData(this.state.locationPosition)
          })
        })

      }
    })
  }

  //处理 路由跳转 和 搜索
  requestSearch = (search) => {
    if (!search) return
    Taro.showLoading({ title: 'loading', mask: true })
    request({
      url: 'v3/stores',
      data: {
        xpoint: this.state.locationPosition.xpoint,
        ypoint: this.state.locationPosition.ypoint,
        keyword: search
      },
    })
      .then((res: any) => {
        if (res.data.store_info.data.length < 1) {
          this.setState({ 
            no_value:true
           })
        } else {
          this.setState({ 
            no_value:false
           })

        }
        this.setState({ stores: res.data.store_info.data })
        Taro.hideLoading()
      });
  }


  filterClick(index, id1?, id2?, id3?) {
    // let define: defineType = {}
    let define: any = this.state.locationPosition
    if (id1) {
      define.deal_cate_id = id1
      this.setState({ deal_cate_id: id1 })
    } else {
      this.setState({ deal_cate_id: null })
    }
    if (id2) {
      define.distance_id = id2
      this.setState({ distance_id: id2 })
    } else {
      this.setState({ distance_id: null })
    }
    if (id3) {
      define.sort_id = id3
      this.setState({ sort_id: id3 })
    } else {
      this.setState({ sort_id: null })
    }
    if (this.$router.params.value) {
      define.keyword = this.$router.params.value
      this.setState({ search: this.$router.params.value })
    }
    if (this.state.search) {
      define.keyword = this.state.search
    } else {
      delete define['keyword']
    }
    if (!id1 && !id2 && !id3) {
      if (define.deal_cate_id) delete define['deal_cate_id']
      if (define.distance_id) delete define['distance_id']
      if (define.sort_id) delete define['sort_id']
    }
    define.pages = this.state.page
    this.setState({
      locationPosition: define
    })
    request({
      url: 'v3/stores',
      data: define
    })
      .then((res: any) => {
        if (res.data.store_info.data.length < 1) {
          this.setState({ 
            show_bottom: true,
            no_value:true
           })
        } else {
          this.setState({ 
            show_bottom: false,
            no_value:false
           })

        }
        if (index === 1) {
          this.setState({ stores: [...this.state.stores, ...res.data.store_info.data], storeHeadImg: res.data.banner });
        } else {
          this.setState({ page: 1 })
          this.setState({ stores: res.data.store_info.data })
        }
        Taro.hideLoading()
      })
  }

  // 微信自带监听 滑动事件
  onPullDownRefresh() {
    this.setState({ page: 1 }, () => {
      let data: any = this.state.locationPosition
      data.pages = 1
      this.setState({ locationPosition: data }, () => {
        this.requestData(this.state.locationPosition)
      })
    }
    )
  }

  // 触底事件
  onReachBottom() {
    // if(this.state.show_bottom) return
    Taro.showLoading({ title: 'loading', mask: true })//显示loading
    this.setState({ page: this.state.page + 1 }, () => {
      this.filterClick(1, this.state.deal_cate_id, this.state.distance_id, this.state.sort_id)
    })
  }

  // 首页页面渲染
  requestData = (data, search?) => {
    if (search) return
    request({
      url: 'v3/stores',
      data
    })
      .then((res: any) => {
        Taro.stopPullDownRefresh()
        this.setState({ stores: res.data.store_info.data })
        Taro.hideLoading()
      })
  }


  // 标题点击
  titleOnClick = (index, deal_cate_id, distance_id, sort_id) => { // 点击事件
    this.setState({ page: 1 }, () => {
      this.filterClick(0, deal_cate_id, distance_id, sort_id)
    })
  }

  filteronScroll = (scroll) => {
    Taro.hideNavigationBarLoading()
    Taro.hideLoading()
    console.log('7878787')
    this.config.enablePullDownRefresh = false
    this.setState({ banScroll: scroll })
  }

  // 点击搜索触发
  onActionClick = () => {
    this.$router.params.value = null
    this.setState({ page: 1 }, () => {
      this.filterClick(0, this.state.deal_cate_id, this.state.distance_id, this.state.sort_id)
    })
  }


  onClearSearch = () => {
    this.setState({ search: '' }, () => {
      this.$router.params.value = null
      this.setState({ page: 1 }, () => {
        this.filterClick(0, this.state.deal_cate_id, this.state.distance_id, this.state.sort_id)
      })
    });
  }

  handleClick = (_id, e) => {
    Taro.navigateTo({
      url: '/pages/business/index?id=' + _id
    })
  };

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
      let data: any = this.state.stores
      this.state.telescopic ? data[index].height = 'auto' : data[index].height = '3.6rem'
      this.setState({ stores: data })
    })
    e.stopPropagation();
  }


  render() {
    const { no_value } = this.state
    return (
      <View>
        <View style="position:relative; z-index:2;">
          <AtSearchBar
            value={this.state.search}
            onActionClick={this.onActionClick.bind(this)}
            onClear={this.onClearSearch.bind(this)}
            onChange={this.handlerSearch.bind(this)}
          />
        </View>
        <FilterTotal onClick={this.titleOnClick.bind(this, 0)} onscroll={this.filteronScroll.bind(this)} />
        
        {
          no_value ? <View className="no_value">
            <View>
              <Image src={no_value_img} className="no_value_img" mode="widthFix"/>
              <View className="no_value_foot">
                暂无搜索内容
          </View>
            </View>
          </View>:null
        }
        <View className="merchant-list" style={{
          height: no_value ?'0vh': '100vh',
          backgroundColor:'#fff'
        }}>
          <View style={{ minHeight: no_value ?'0vh': '100vh', height: 'auto', background: '#f4f4f4' }}>
            {
              this.state.stores.map((item2: any, index: any) => {
                return <View className="new_box">
                  <View className="box" style={{ paddingBottom: item2.activity ? '' : '4px' }} onClick={this.handleClick.bind(this, item2.id)}>
                  <View className="box_title" style={{ borderBottom: item2.activity_num ? '0.5px solid #eeeeee' : 'none',  paddingBottom:  item2.activity_num ? '12rpx' : 'none'}}>
                      <View className="title_l">
                        <Image className="Image" src={item2.preview} />
                      </View>
                      <View className="title_r">
                        <View className="view_name1 ellipsis-one"
                          style={{ width: '12.2rem', display: 'block' }}>{item2.name}</View>
                        <View className="view_name2">
                          <View style={{ color: '#999' }}>
                            {
                              item2.deal_cate ? item2.deal_cate : null
                            }
                          </View>
                          <View style={{ color: '#999', paddingRight: '5rpx' }}>{item2.distance}</View>
                        </View>
                        <View className='view'>
                          {
                            item2.label.map((item3: any, index1: any) => {
                              return <View key={''}
                                className={this.labelColor(item3) === '#FFFFFF' ? 'span' : ''}
                                style={{ border: this.labelColor(item3) == '#FFFFFF' ? '1px solid #ff6654' : 'none', backgroundColor: this.labelColor(item3) }}>{item3}</View>
                            })
                          }
                        </View>
                      </View>
                    </View>
                    <View className="box_bottom" id="box_bottom"
                      style={{
                        position: 'relative',
                        height:
                          !this.state.stores[index].height ?
                            item2.activity_num > 2 ? '3.6rem' : 'auto' : this.state.stores[index].height,
                        marginBottom: item2.activity_num >= 1 ? '-1px' : '15px',
                        overflow: 'hidden',
                      }}
                    >

                      <View onClick={this.telescopicBox.bind(this, index)}
                        style={{ position: 'absolute', top: '0', right: '0', display: item2.activity_num > 2 ? '' : 'none', borderBottom: 0 }}
                      >
                        <View style={{ paddingRight: '13rpx', fontSize: '20rpx', display: 'flex', alignItems: 'center', color: '#999', borderBottom: 0 }}>
                          {
                            item2.activity_num ? item2.activity_num + '个活动' : null
                          }
                        </View>
                        <Image src={
                          this.state.stores[index].height !== 'auto' ?
                            "http://oss.tdianyi.com/front/wRftjWN2D3aZwiHQjfH64ba27FXRBFCR.png" : "http://oss.tdianyi.com/front/NMKeBjaajWYJxRSmcjXYFEGxXFkGE7BA.png"
                        }
                          style={{ marginRight: 0 }}
                        />
                      </View>

                      <View
                        style={{
                          display: item2.activity ? item2.activity.group ? '' : 'none' : 'none',
                          justifyContent: 'space-between'
                        }}
                      >
                        <View>
                          < Image src={
                            item2.activity ?
                              (item2.activity.group ? item2.activity.group.icon : null)
                              : null}
                          />
                          <View className=" ellipsis-one asd"
                            style={{ width: '12rem', display: 'block', height: '30rpx', overflow: 'hidden' }}
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
                        style={{ display: item2.activity ? item2.activity.cash_coupon ? '' : 'none' : 'none' }}
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
          </View>

        </View>
      </View>
    );
  }
}
