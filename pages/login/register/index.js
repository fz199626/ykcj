// pages/login/register/index.js
const app = getApp();
import api from './../../../utils/api.js'
Page({
  data: {
    password1Show: true,
    password2Show: true,
    disabled: false,
    tel: '',
    second: 60,
    btnValue: "获取验证码",
    btnDisabled: false,
    isShowGetPhoneNumberBtn: true
  },
  iconBtn1() {
    this.setData({
      password1Show: !this.data.password1Show
    });
  },
  iconBtn2() {
    this.setData({
      password2Show: !this.data.password2Show
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
      if (res.data.error_no === 0){
        this.setData({
          tel: res.data.data.phone
        })
      }
    })
  },
  getTel(e) { //实时获取输入的手机号
    this.setData({
      tel: e.detail
    });
  },
  getCodeBtn(){ //获取验证码按钮
    if (/^1[3456789]\d{9}$/.test(this.data.tel)) {
      if (!this.data.btnDisabled){
        this.timer();
        this.getCode();
      }
    } else {
      wx.showToast({ title: "请输入正确的手机号", icon: "none" });
    }
  },
  timer() { //倒计时
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(() => {
        var second = this.data.second - 1;
        this.setData({
          second: second,
          btnValue: second + ' 秒',
          btnDisabled: true
        })
        if (this.data.second <= 0) {
          this.setData({
            second: 60,
            btnValue: '获取验证码',
            btnDisabled: false
          })
          resolve(setTimer)
        }
      }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  getCode() { //发送验证码
    let data = [{
      key: "mobile",
      value: this.data.tel,
      type: "string"
    }, {
      key: "verifyCodeType",
      value: "2",
      type: "int"
    },{
      key: "packType",
      value: "1009",
      type: "int"
    }]
    api.GetCryption({ //后台加密
      formParameters: data
    }).then(res => {
      api.getverifycode({ //请求验证码
        param: res.data.data
      }).then(res => {
        api.DeCryption({ //后台解密
          request: res.data
        }).then(res => {
          
        })
      })
    })
  },
  resBtn(e) { //注册按钮
    let formData = e.detail.value;
    if (/^1[3456789]\d{9}$/.test(formData.tel)){
      if (formData.psd === formData.psd2){
        if (formData.code){
          this.reg(formData);
        }else{
          wx.showToast({ title: "请输入验证码", icon: "none" });
        }
      }else{
        wx.showToast({ title: "两次密码输入不相同", icon: "none" });
      }
    }else{
      wx.showToast({ title: "请输入正确的手机号", icon: "none" });
    }
  },
  reg(formData) { //注册
    let data = [{
      key: "mobile",
      value: formData.tel,
      type: "string"
    }, {
      key: "password",
      value: formData.psd,
      type: "string"
    }, {
      key: "verifyCode",
      value: formData.code,
      type: "int"
    },{
      key: "inviteCode",
      value: "",
      type: "string"
    }]
    api.GetCryption({ //后台加密
      formParameters: data
    }).then(res => {
      api.reg({ //请求注册
        param: res.data.data
      }).then(res => {
        api.DeCryption({ //后台解密
          request: res.data
        }).then(res => {
          let data = JSON.parse(res.data.data);
          if (data.error_no === 0){
            this.UserRegister(data.userToken);
            wx.showToast({ title: '注册成功,请稍等~', icon: "none" });
          }else{
            wx.showToast({ title: data.error_info, icon: "none" });
          }
        })
      })
    })
  },
  UserRegister(userToken) {
    let wxOpenId = app.globalData.userData.wxOpenId;
    api.UserRegister({ //微信注册
      userToken: userToken,
      phone: this.data.tel,
      wxOpenId: wxOpenId,
      userInfo: app.globalData.userInfo
    }).then(res => {
      if (data.error_no === 0) {
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
  }
})