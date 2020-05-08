import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem, Input } from "@tarojs/components";
import "./index.less";
import upload from '@/services/oss';
import { getUserInfo, loadImg, examineSuccess } from "./service";
export default class Member extends Component {
  config = {
    navigationBarTitleText: "会员升级",
    enablePullDownRefresh: false
  };
  state = {
    data: {
      active_value: "",
      examine_status: 0,// 0-待审核 1-通过 2-拒绝
      grade_id: 0,
      old_grade: '',
      grade: '',
      id: "",
      invitation_code: "",
      is_notice: 1,//0-显示 1-不显示
      name: "",
      remarks: "",
      upgrade: "",
      user_add_at: "",
      is_invitation_code: 0,//0-能填写 1-不可以填写
      is_first: 0,//是否首次注册 0-是首次注册 1-不是首次注册
    },
    invitation_code: '',
    chooseImglist: [],
    tipsShow: false,
    reUpload: false,//审核失败层显示隐藏
    error: '',
    show_err: false
  }
  componentDidMount() {
    Taro.request(
      {
        url: 'https://api.supplier.tdianyi.com/api/v2/up',
        method: "GET",
      }
    ).then(res => {
      let { data } = res.data;
      let oss_data = {
        policy: data.policy,
        OSSAccessKeyId: data.accessid,
        success_action_status: 200, //让服务端返回200,不然，默认会返回204
        signature: data.signature,
        callback: data.callback,
        host: data.host,
        key: data.dir
      };
      Taro.setStorageSync("oss_data", oss_data)
    })

    // }
    // /**
    //  * is_first==0首次注册，无审核
    //  * is_first==1
    //  */
    // componentDidShow() {
    Taro.showLoading({ title: 'loading', mask: true });
    getUserInfo().then((res: any) => {
      Taro.hideLoading();
      if (res.status_code == 200) {
        this.setState({ data: res.data, invitation_code: res.data.invitation_code })
        if ((res.data.examine_status == 1 || res.data.examine_status == 2) && res.data.is_notice == 0) { this.examineSuccessUpdeat(res.data.community_examine_id) }
      } else {
        Taro.showToast({ title: res.message || '请求失败', icon: 'none' })
      }
    }).catch(err => {
      Taro.hideLoading();
      Taro.showToast({ title: err.message || '请求失败', icon: 'none', })
    })
  }
  examineSuccessUpdeat = (id: any) => {
    examineSuccess(id).then(res => console.log(res)).catch(err => console.log(err))
  }
  inputCode = (e: any) => {
    let data = this.state.data;
    data.invitation_code = e.target.value;
    this.setState({ data, invitation_code: e.target.value })
  }
  seeExample = () => {
    Taro.navigateTo({
      url: '/business-pages/uploadImg-example/index'
    })
  }
  /**
 * 回首页
 */
  handleGoHome = () => {
    Taro.switchTab({
      url: '/pages/index/index',
    })
  }
  changeImg = () => {
    let that = this;
    let invitation_code = this.state.invitation_code;
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res0) {
        Taro.showLoading({ title: 'loading', mask: true });
        let templist: any = that.state.chooseImglist;
        let tempFilePaths = res0.tempFilePaths[0];
        upload(tempFilePaths).then((res: any) => {
          Taro.hideLoading();
          let path = JSON.parse(res.data).data.path;
          templist.push(path);
          that.setState({ chooseImglist: templist, invitation_code });
        })
      },
      fail(err) {
        Taro.hideLoading();
        Taro.showToast({ title: '上传失败', icon: 'none' })
      }
    });
  }
  closeOneImg = (index: number | string, e: any) => {
    let templist = this.state.chooseImglist;
    templist.splice(Number(index), 1);
    this.setState({ chooseImglist: templist });
  }
  sumbitImg = () => {
    if (!this.state.chooseImglist.length) {
      Taro.showToast({ title: '请上传图片', icon: 'none' });
      return;
    }
    if (!this.state.invitation_code && this.state.data.is_invitation_code == 0) {
      Taro.showToast({ title: '请填写邀请码', icon: 'none' });
      return;
    }
    Taro.showLoading({ title: 'loading', mask: true });
    let obj = this.state.data;
    let data = {
      name: obj.name,
      grade: obj.grade_id,
      active: obj.active_value ? obj.active_value : undefined,
      user_add_at: obj.user_add_at,
      invitation_code: this.state.invitation_code,
      imgs: JSON.stringify(this.state.chooseImglist),
    };
    console.log(this.state.invitation_code)
    loadImg(data).then((res: any) => {
      Taro.hideLoading();
      if (res.status_code == 200) {
        Taro.showToast({ title: res.message, icon: 'none' })
        setTimeout(() => {
          Taro.navigateTo({
            url: '/pages/member/index'
          })
        }, 1500)
      } else {
        this.setState({ error: res.message, show_err: true })
        // Taro.showToast({ title: res.message || '请求失败', icon: 'none' })
      }
    }).catch(err => {
      Taro.hideLoading();
      Taro.showToast({ title: err.message || '提交失败', icon: 'none' })
    })
  }
  render() {
    const { chooseImglist, data, error, show_err } = this.state;
    return (
      <View className="membership-upgrade">
        <View className="member-upgrade-content">
          <View className="member-upgrade-title">
            <View className="member-upgrade-title-left">
              <View className="member-upgrade-title-left-line"></View>
              <View className="member-upgrade-title-left-word">升级申请</View>
            </View>
          </View>
          <View className="member-upgrade-nowInfo">
            <View className="member-upgrade-nowInfo-key">当前角色身份：</View>
            <View className="member-upgrade-nowInfo-word">  {data.grade}</View>
          </View>
          <View className="member-upgrade-nowInfo">
            <View className="member-upgrade-nowInfo-key">可升级：</View>
            <View className="member-upgrade-nowInfo-word">{data.upgrade}</View>
          </View>
          {
            data.is_invitation_code == 0 ?
              <View className="member-upgrade-title">
                <View className="member-upgrade-title-left">
                  <View className="member-upgrade-title-left-line"></View>
                  <View className="member-upgrade-title-left-word">*填写邀请码</View>
                </View>
                <View className="member-upgrade-title-right" onClick={() => { this.setState({ tipsShow: true }) }}>如何填写邀请码？</View>
              </View> : null
          }
          {
            data.is_invitation_code == 0 ? <Input className="member-upgrade-title-input" type="text" placeholder="请输入邀请人邀请码" onInput={this.inputCode} value={this.state.invitation_code} /> : null
          }
        </View>
        <View className="member-upgrade-content">
          <View className="member-upgrade-title">
            <View className="member-upgrade-title-left">
              <View className="member-upgrade-title-left-line"></View>
              <View className="member-upgrade-title-left-word">*图片上传</View>
            </View>

          </View>

          <View className="member-upgrade-img-content">
            {
              chooseImglist.length ? chooseImglist.map((item: any, index: any) => {
                return (
                  <View className="member-upgrade-img-item" onClick={this.closeOneImg.bind(this, index)}>
                    <Image className="close-img" src="http://oss.tdianyi.com/front/BR4fjNcZiCMkGrnTY76prbtYctaMKspw.png" />
                    <Image className="choose-img" src={'http://oss.tdianyi.com/' + item} />
                  </View>)
              }) : null
            }
            {
              chooseImglist.length < 20 ? <View className="member-upgrade-img-item" onClick={this.changeImg}>
                <Image className="choose-img" src="http://oss.tdianyi.com/front/w85bWiT8Sf3Tpab6GCiE5R45f8wBbKJ6.png" />
              </View> : null
            }
          </View>

          <View className="member-upgrade-upload-info-box">
            <View className="member-upgrade-upload-info-title-box" onClick={this.seeExample}>
              <View className="member-upgrade-upload-info-title-box-left">上传要求：</View>
              <View className="member-upgrade-upload-info-title-box-right">查看示例</View>
            </View>
            <View className="member-upgrade-upload-info-text">1、上传截图需要显示建群群主以及群人数</View>
            <View className="member-upgrade-upload-info-text">2、截图显示群名称</View>
          </View>
        </View>
        <View className="member-upgrade-upload-btn" onClick={this.sumbitImg}>提交审核</View>
        {
          data.is_first != 0 && data.examine_status == 0 ? <View className="in-the-review">
            <View className="in-the-review-content">
              <Image className="in-the-review-img" src="http://oss.tdianyi.com/front/QdBDtfeytCxdwkhhAZK2fKkERT8Q4dbk.png" />
              <View className="in-the-review-text">当前你的审核已提交，等待平台审核</View>
              <View className="in-the-review-text">预计审核时间24小时内</View>
              <View className="in-the-review-returnBtn" onClick={this.handleGoHome}>返回首页</View>
            </View>
          </View> : null
        }
        {
          !data.is_notice && data.is_first != 0 && data.examine_status == 1 ?
            <View className="in-the-review">
              <View className="in-the-review-content">
                <Image className="in-the-review-img" src="http://oss.tdianyi.com/front/P4Q7EeKnpC8DGhFKTwyrhhKmiJZDiJcf.png" />
                <View className="in-the-review-text">审核成功</View>
                <View className="in-the-review-text">恭喜您，当前审核通过</View>

                <View className="in-the-review-successImg" >
                  <View className="in-the-review-successImg-item" >{data.old_grade}</View>
                  <View className="in-the-review-successImg-item" >{data.grade}</View>
                </View>
                <View className="in-the-review-returnBtn" onClick={this.handleGoHome}>返回首页</View>
              </View>
            </View> : null
        }
        {
          !this.state.reUpload && data.is_first != 0 && !data.is_notice && data.examine_status == 2 ?
            <View className="in-the-review">
              <View className="in-the-review-content">
                <Image className="in-the-review-img" src="http://oss.tdianyi.com/front/xGYed4pbwa54fDpeMiMBcJcYeDjrzJYy.png" />
                <View className="in-the-review-text">审核失败</View>
                <View className="in-the-review-text">很遗憾，当前审核失败</View>
                <View className="in-the-review-text">{data.remarks}</View>
                <View className="in-the-review-returnBtn" onClick={() => this.setState({ reUpload: true })}>重新提交</View>
                <View className="in-the-review-againBtn" onClick={this.handleGoHome}>返回首页</View>
              </View>
            </View> : null
        }
        {
          this.state.tipsShow ? <View className='mark'>
            <View className='mark-main'>
              <View className='title'>如何填写邀请码</View>
              <View className='text'>请填写获得的邀请码或 手机号码/跳过</View>
              <View className='button' onClick={() => this.setState({ tipsShow: false })}>确定</View>
            </View>
          </View> : null
        }
        {
          show_err ? <View className='mark'>
            <View className='mark-main'>
              <View className='title'>提交失败</View>
              <View className='text'>{error}</View>
              <View className='button' onClick={() => this.setState({ show_err: false })}>确定</View>
            </View>
          </View> : null
        }
      </View>
    );
  }
}
