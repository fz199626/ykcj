// pages/login/getUserInfo/index.js
const app = getApp();
Page({
  bindGetUserInfo(res) {
    if (res.detail.userInfo){
      app.globalData.userInfo = res.detail.userInfo;
      wx.reLaunch({
        url: '/pages/login/index'
      })
    }
  },
  cancelLogin() {
    wx.switchTab({
      url: '/pages/union/index'
    });
  }
})