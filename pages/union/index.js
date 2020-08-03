// pages/union/index.js
const app = getApp();
import api from './../../utils/api.js'
const util = require('./../../utils/util.js')
Page({
  data: {
    liveList: [],
    isShowModal: false
  },
  onLoad(options) {
    if (options.liveToken) {
      app.BehaviorLog({
        behaviorType: 1,
        behaviorObject: "分享进入(准神联盟)",
        startTime: util.formatTime(new Date()),
        endTime: util.formatTime(new Date())
      });
    }
  },
  onShow() {
    this.list();
  },
  list() { //获取准神联盟列表
    api.liveList({}).then(res => {
      this.setData({
        liveList: res.data.data
      })
      app.globalData.role = res.data.data[2].auth
    }, () => {
      wx.stopPullDownRefresh();
    })
  },
  detail(e) { //点击前往直播间或准神大户室
    if (!app.globalData.liveToken) {
      wx.reLaunch({
        url: app.globalData.userInfo ? '/pages/login/index' : '/pages/login/getUserInfo/index'
      })
    } else {
      let live = this.data.liveList[e.currentTarget.id];
      let rule = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/;
      let WxBannerLink = live.WxBannerLink + '?roomId=' + live.roomId + '&Description=' + live.Description + '&WxBanner=' + live.WxBanner;
      if (live.WxBannerLink == "/pages/live-broadcast/index"){
        wx.navigateTo({
          url: WxBannerLink
        })
      }else{
        if (live.auth === "0") { //无权限
          this.setData({
            isShowModal: true
          });
        } else if (live.auth === "1") {
          wx.navigateTo({
            url: rule.test(live.WxBannerLink) ? '/pages/web-view/index?url=' + live.WxBannerLink : WxBannerLink
          })
        }
      }
    }
  },
  showModalHide() { //无权限提示框隐藏
    this.setData({
      isShowModal: false
    });
  },
  onShareAppMessage() {
    app.BehaviorLog({
      behaviorType: 6,
      behaviorObject: "分享出去(准神联盟)",
      startTime: util.formatTime(new Date()),
      endTime: util.formatTime(new Date())
    });
    return {
      path: '/pages/union/index?liveToken=' + app.globalData.liveToken
    }
  },
  onPullDownRefresh() {
    this.onShow();
  },
})