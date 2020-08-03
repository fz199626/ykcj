// pages/personal/index.js
const app = getApp();
import api from './../../utils/api.js'
Page({
  data: {
    userInfo: null,
    isRole: false,
    liveToken: '',
    phone: ''
  },
  onShow() {
    let userData = app.globalData.userData;
    if (userData) {
      this.setData({
        liveToken: userData.liveToken,
        userInfo: app.globalData.userInfo,
        phone: userData.phone,
        isRole: app.globalData.role == 0 ? false : true
      },()=>{
        this.getmineinfo();
      })
    }
  },
  getmineinfo() { //获取用户信息
    api.GetCryption({ //后台加密
      formParameters: []
    }).then(res => {
      api.getmineinfo({ //获取用户信息
        param: res.data.data
      }).then(res => {
        api.DeCryption({ //后台解密
          request: res.data
        }).then(res => {
          let data = JSON.parse(res.data.data);
          if (data.error_no === 0){
            this.setData({
              ['userInfo.nickName']: data.userName ? data.userName : this.data.userInfo.nickName
            });
          }
        })
      })
    })
  },
  calling() { //拨打客服电话
    wx.makePhoneCall({
      phoneNumber: '400-656-5063',
      success:()=> {
        console.log("拨打电话成功！")
      },
      fail:()=> {
        console.log("拨打电话失败！")
      }
    })
  }
})