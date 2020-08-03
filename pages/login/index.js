// pages/login/index.js
const app = getApp();
import api from './../../utils/api.js'
Page({
  data: {
    disabled: true,
    mobileMsg: "",
    mobile: "",
    password: "",
    passwordShow: true,
    isShowGetPhoneNumberBtn: true
  },
  iconBtn() {
    this.setData({
      passwordShow: !this.data.passwordShow
    });
  },
  getPhoneNumber(e) { //获取用户手机号
    this.setData({
      isShowGetPhoneNumberBtn: false
    })
    api.GetUserPhone({
      text: e.detail.encryptedData,
      sessionKey: app.globalData.userData.session_key,
      iv: e.detail.iv
    }).then(res => {
      if (res.data.error_no === 0) {
        this.setData({
          mobile: res.data.data.phone
        })
      }
    })
  },
  change(e) { //判断按钮是否可点击
    let id = e.currentTarget.id;
    this.setData({
      [id]: e.detail
    }, ()=>{
      if (/^1[3456789]\d{9}$/.test(this.data.mobile) && this.data.password != "") {
        this.setData({
          disabled: false
        })
      } else {
        this.setData({
          disabled: true
        })
      }
    })
  },
  focus(e) { //验证手机号是否正确
    let isMobile = /^1[3456789]\d{9}$/.test(this.data.mobile);
    this.setData({
      mobileMsg: isMobile? "" : "请输入正确的手机号码"
    })
  },
  userlogin() { //登录
    let data = [{
      key: "mobile",
      value: this.data.mobile,
      type: "string"
    },{
      key: "password",
      value: this.data.password,
        type: "string"
    }]
    api.GetCryption({ //后台加密
      formParameters: data
    }).then(res => {
      api.userlogin({ //请求登录
        param: res.data.data
      }).then(res => {
        api.DeCryption({ //后台解密
          request : res.data
        }).then(res => {
          let data = JSON.parse(res.data.data);
          if(data.error_no === 0){
            this.UserRegister(data.userToken);
            wx.showToast({ title: '登录成功,绑定中~', icon: "none" });
          } else{
            wx.showToast({ title: data.error_info, icon: "none" });
          }
        })
      })
    })
  },
  UserRegister(userToken){
    let wxOpenId = app.globalData.userData.wxOpenId;
    api.UserRegister({ //微信注册
      userToken: userToken,
      phone: this.data.mobile,
      wxOpenId: wxOpenId,
      userInfo: app.globalData.userInfo
    }).then(res => {
      if (res.data.error_no === 0) {
        wx.setStorageSync('liveToken', res.data.data.liveToken);
        wx.setStorageSync('userToken', res.data.data.userToken);
        app.globalData.liveToken = res.data.data.liveToken;
        app.globalData.userData = res.data.data;
        app.globalData.userData.wxOpenId = wxOpenId;
        wx.switchTab({
          url: '/pages/union/index'
        });
      } else {
        wx.showToast({ title: '绑定失败!', icon: "none" });
      }
    })
  },
  cancelLogin() {
    wx.switchTab({
      url: '/pages/union/index'
    });
  }
})