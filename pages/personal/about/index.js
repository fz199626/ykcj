// pages/about/index.js
const app = getApp();
const util = require('./../../../utils/util.js')
Page({
  onLoad(options) {
    if (options.liveToken) {
      app.BehaviorLog({
        behaviorType: 1,
        behaviorObject: "分享进入(关于我们)",
        startTime: util.formatTime(new Date()),
        endTime: util.formatTime(new Date())
      });
    }
  },
  onShareAppMessage() {
    app.BehaviorLog({
      behaviorType: 6,
      behaviorObject: "分享出去(关于我们)",
      startTime: util.formatTime(new Date()),
      endTime: util.formatTime(new Date())
    });
    return {
      path: '/pages/personal/about/index?liveToken=' + app.globalData.liveToken
    }
  }
})