// pages/login/forget-check/index.js
import api from './../../../utils/api.js'
Page({
  data: {
    disabled: true,
    tel: "",
    telMsg: "",
    code: "",
    verifyCodeToken: '',
    second: 60,
    btnValue: "获取验证码",
    btnDisabled: false
  },
  change(e) { //实时获取输入的手机号
    let id = e.currentTarget.id;
    this.setData({
      [id]: e.detail
    }, () => {
      if (/^1[3456789]\d{9}$/.test(this.data.tel) && this.data.code != "") {
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
  focus() {
    let isTel = /^1[3456789]\d{9}$/.test(this.data.tel);
    this.setData({
      telMsg: isTel ? "" : "请输入正确的手机号码"
    })
  },
  sendCoed(){ //获取验证码按钮
    if (/^1[3456789]\d{9}$/.test(this.data.tel)) {
      if (!this.data.btnDisabled) {
        this.timer();
        this.getCode();
      }
    } else {
      wx.showToast({ title: "请输入正确的手机号", icon: "none" });
    }
  },
  timer(){ //验证码倒计时
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
    }, {
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
          this.setData({
            verifyCodeToken: JSON.parse(res.data.data).verifyCodeToken
          })
        })
      })
    })
  },
  goReset(){ //跳转到输入密码
    let { tel, verifyCodeToken } = this.data;
    wx.navigateTo({
      url: '/pages/login/forget-reset/index?tel=' + tel + '&verifyCodeToken=' + verifyCodeToken
    })
  }
})