// pages/login/forget-reset/index.js
const app = getApp();
import api from './../../../utils/api.js'
Page({
  data: {
    tel: '',
    code: '',
    pass1: "",
    pass2: "",
    pass1Msg: "",
    password1Show: true,
    password2Show: true,
    disabled: true
  },
  onLoad(option) {
    if (option){
      this.setData({
        tel: option.tel,
        code: option.code
      });
    }
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
  focus() {
    this.setData({
      pass1Msg: this.data.pass1 ? "" : "请输入密码"
    })
  },
  change (e) {
    let { pass1, pass2 } = this.data;
    let id = e.currentTarget.id;
    this.setData({
      [id]: e.detail
    }, () => {
      this.setData({
        disabled: pass1 != "" && pass2 != "" ? false : true
      })
    })
  },
  btn() {
    if(this.data.pass1 === this.data.pass2){
      this.resetpwd();
    }else{
      wx.showToast({ title: "两次密码不相同", icon: "none" });
    }
  },
  resetpwd() { //重置密码
    let data = [{
      key: "mobile",
      value: this.data.tel,
      type: "string"
    }, {
      key: "password",
      value: this.data.pass1,
      type: "string"
    }, {
      key: "verifyCodeToken",
      value: this.data.verifyCodeToken,
      type: "int"
    }]
    api.GetCryption({ //后台加密
      formParameters: data
    }).then(res => {
      api.resetpwd({ //请求重置
        param: res.data.data
      }).then(res => {
        api.DeCryption({ //后台解密
          request: res.data
        }).then(res => {
          let data = JSON.parse(res.data.data);
          if (data.error_no === 0) {
            app.globalData.userData = data;
            wx.navigateTo({
              url: '/pages/login/index',
            });
          } else if (data.error_no === -1) {
            wx.showToast({ title: data.error_info, icon: "none" });
          }
        })
      })
    })
  }
})