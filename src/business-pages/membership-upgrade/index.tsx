import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem, Input } from "@tarojs/components";
import "./index.less";
import upload from '@/services/oss';
import { getUserInfo, loadImg } from "./service";
export default class Member extends Component {
    config = {
        navigationBarTitleText: "会员升级",
        enablePullDownRefresh: false
    };
    state = {
        id: 0,
        name: '',
        grade: '',
        active: '',
        user_add_at: '2019/04/01',
        invitation_code: '',
        chooseImglist: [],
        tipsShow: false,
        upgrade: false,//可升级
    }
    componentDidMount() {
        getUserInfo().then((res: any) => {
            if (res.status_code == 200) {
                this.setState({
                    id: res.data.id, name: res.data.user_name, grade: res.data.grade, active: res.data.active_value, invitation_code: res.data.invitation_code,
                    user_add_at: res.data.user_add_at, upgrade: res.data.upgrade
                })
            }
        }).catch(err => {
            Taro.showToast({ title: err.message || '请求失败', icon: 'none', })
        })
    }
    inputCode = (e: any) => {
        this.setState({ invitation_code: e.target.value })
    }
    seeExample = () => {
        Taro.navigateTo({
            url: '/business-pages/uploadImg-example/index'
        })
    }

    changeImg = () => {
        let that = this;
        Taro.showLoading({ title: 'loading', mask: true });
        Taro.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res0) {
                let templist: any = that.state.chooseImglist;
                let tempFilePaths = res0.tempFilePaths[0];
                upload(tempFilePaths).then((res: any) => {
                    Taro.hideLoading();
                    let path = JSON.parse(res.data).data.path;
                    templist.push(path);
                    that.setState({ chooseImglist: templist });
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
        console.log(this.state.chooseImglist)
        let data = {
            name: this.state.name,
            grade: this.state.grade,
            active: this.state.active,
            user_add_at: this.state.user_add_at,
            invitation_code: this.state.invitation_code,
            imgs: JSON.stringify(this.state.chooseImglist),
        };
        loadImg(data).then((res: any) => {
            console.log(res)
            if (res.status_code == 200) {
                Taro.showToast({ title: res.message, icon: 'none' })
                setTimeout(() => {
                    Taro.switchTab({
                        url: '/pages/member/index'
                    })
                }, 1500)
            }
        }).catch(err => {
            Taro.showToast({ title: err.message || '提交失败', icon: 'none' })
        })
    }

    render() {
        const { chooseImglist } = this.state;
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
                        <View className="member-upgrade-nowInfo-word">普通会员</View>
                    </View>
                    <View className="member-upgrade-nowInfo">
                        <View className="member-upgrade-nowInfo-key">可升级：</View>
                        <View className="member-upgrade-nowInfo-word">普通创客、超级创客、合伙人</View>
                    </View>
                    <View className="member-upgrade-title">
                        <View className="member-upgrade-title-left">
                            <View className="member-upgrade-title-left-line"></View>
                            <View className="member-upgrade-title-left-word">*填写邀请码</View>
                        </View>
                        <View className="member-upgrade-title-right" onClick={() => { this.setState({ tipsShow: true }) }}>如何填写邀请码？</View>
                    </View>
                    <Input className="member-upgrade-title-input" type="text" placeholder="请输入邀请人邀请码" onInput={this.inputCode} value={this.state.invitation_code} />
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

                {/* <View className="in-the-review">
                    <View className="in-the-review-content">
                        <Image className="in-the-review-img" src="http://oss.tdianyi.com/front/QdBDtfeytCxdwkhhAZK2fKkERT8Q4dbk.png" />
                        <View className="in-the-review-text">当前你的审核已提交，等待平台审核</View>
                        <View className="in-the-review-text">预计审核时间24小时内</View>
                        <View className="in-the-review-returnBtn">返回首页</View>
                    </View>
                </View> */}

                {/* <View className="in-the-review">
                    <View className="in-the-review-content">
                        <Image className="in-the-review-img" src="http://oss.tdianyi.com/front/xGYed4pbwa54fDpeMiMBcJcYeDjrzJYy.png" />
                        <View className="in-the-review-text">审核失败</View>
                        <View className="in-the-review-text">很遗憾，当前审核失败</View>
                        <View className="in-the-review-text">您当前提交截图群人数角色，而且不满足拓客条件</View>
                        <View className="in-the-review-returnBtn">返回首页</View>
                        <View className="in-the-review-againBtn">重新提交</View>
                    </View>
                </View> */}

                {/* <View className="in-the-review">
                    <View className="in-the-review-content">
                        <Image className="in-the-review-img" src="http://oss.tdianyi.com/front/P4Q7EeKnpC8DGhFKTwyrhhKmiJZDiJcf.png" />
                        <View className="in-the-review-text">审核成功</View>
                        <View className="in-the-review-text">恭喜您，当前审核通过</View>
                        <Image className="in-the-review-successImg" src="http://oss.tdianyi.com/front/w8MPhyBtTFniYEjXAtQ5Yp6px8aikMah.png" />
                        <View className="in-the-review-returnBtn">返回首页</View>
                    </View>
                </View> */}

                {
                    this.state.tipsShow ? <View className='mark'>
                        <View className='mark-main'>
                            <View className='title'>如何填写邀请码</View>
                            <View className='text'>请填写获得的邀请码或 手机号码/跳过</View>
                            <View className='button' onClick={() => this.setState({ tipsShow: false })}>确定</View>
                        </View>
                    </View> : null
                }



            </View>
        );
    }
}
