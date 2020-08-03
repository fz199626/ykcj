//app.js
import api from './utils/api.js';
const util = require('./utils/util.js');
let logData = {
  behaviorType: 2,
  behaviorObject: "小程序：从进入到离开",
};
App({
  onLaunch() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已更新，请重启应用',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    
    // 登录
    wx.login({
      success: res => {
        api.UserLogin({
          wxcode: res.code
        }).then(res => {
          wx.setStorageSync('liveToken', res.data.data.liveToken);
          wx.setStorageSync('userToken', res.data.data.userToken);
          wx.setStorageSync('wxOpenId', res.data.data.wxOpenId);
          this.globalData.userData = res.data.data;
          this.globalData.liveToken = res.data.data.liveToken;
        })
      }
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回。所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow(options) {
    if (!this.globalData.liveToken){
      if (options.scene === 1007 || options.scene === 1008) {
        wx.reLaunch({
          url: this.globalData.userInfo ? '/pages/login/index' : '/pages/login/getUserInfo/index'
        })
      }
    }
    logData.startTime = util.formatTime(new Date());
  },
  onHide() {
    logData.endTime = util.formatTime(new Date());
    this.BehaviorLog(logData);
  },
  BehaviorLog(data) {
    api.BehaviorLog({
      behaviorType: data.behaviorType,
      behaviorObject: data.behaviorObject,
      startTime: data.startTime,
      endTime: data.endTime,
      allTime: new Date(data.endTime).getTime() - new Date(data.startTime).getTime()
    }).then(res => {
      
    })
  },
  globalData: {
    userInfo: null,
    userData: null,
    liveToken: '',
    password: '',
    role: '1'
  }
})