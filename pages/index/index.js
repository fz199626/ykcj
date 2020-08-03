//index.js
const app = getApp();
import api from './../../utils/api.js'
const util = require('./../../utils/util.js')
Page({
  data: {
    banner: [],
    msgList: [],
    articleList: [],
    videoList: []
  },
  onLoad(options) {
    this.GetWxBanners();
    this.GetAnnouncement();
    this.GetArticleList();
    this.videoList();
    if (options) {
      app.BehaviorLog({
        behaviorType: 1,
        behaviorObject: "分享进入(首页)",
        startTime: util.formatTime(new Date()),
        endTime: util.formatTime(new Date())
      });
    }
  },
  bannerJump(e) { //banner跳转
    if (!app.globalData.liveToken) {
      wx.reLaunch({
        url: app.globalData.userInfo ? '/pages/login/index' : '/pages/login/getUserInfo/index'
      })
    }else{
      let rediceUrl = this.data.banner[e.currentTarget.id].rediceUrl;
      let rule = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/;
      wx.navigateTo({
        url: rule.test(rediceUrl) ? '/pages/web-view/index?url=' + rediceUrl : rediceUrl
      })
    }
  },
  videoDetail(e) { //视频跳转
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/accurate-series/details/index?id=' + id
    })
  },
  articleJump(e) { //专栏跳转并验证权限
    if (!app.globalData.liveToken) {
      wx.reLaunch({
        url: app.globalData.userInfo ? '/pages/login/index' : '/pages/login/getUserInfo/index'
      })
    } else {
      let article = this.data.articleList[e.currentTarget.id];
      let group = app.globalData.userData.columnGroupsModels[0].children;
      let specialRole = JSON.parse(article.specialRole);
      let userRole = app.globalData.userData.userRoleIds;
      let intersection = specialRole.filter(v => userRole.includes(v));
      if (specialRole.length !== 0) { //是否有特殊权限
        if (intersection.length !== 0) {
          wx.navigateTo({
            url: "/pages/daily-column/details/index?id=" + article.id
          })
        } else {
          wx.showToast({title: '暂无权限！',icon: 'none'});
        }
      } else {
        group.forEach((cur, index) => { //遍历栏目
          let groupIds = article.groupIds.split(',');
          if (cur.id == groupIds[groupIds.length - 1]) {
            if (cur.checked) { //栏目是否免费
              wx.navigateTo({
                url: "/pages/daily-column/details/index?id=" + article.id
              })
            } else {
              wx.showToast({ title: '暂无权限！', icon: 'none' });
            }
          } else if (cur.children.length > 0) {
            cur.children.forEach((cur, index) => { //遍历栏目
              let groupIds = article.groupIds.split(',');
              if (cur.id == groupIds[groupIds.length - 1]) {
                if (cur.checked) { //栏目是否免费
                  wx.navigateTo({
                    url: "/pages/daily-column/details/index?id=" + article.id
                  })
                } else {
                  wx.showToast({title: '暂无权限！',icon: 'none'});
                }
              }
            })
          }
        })
      }
    }
  },
  GetAnnouncement() { //获取公告列表
    api.GetAnnouncement({
      type: 2
    }).then(res => {
      this.setData({
        msgList: res.data.data
      })
    })
  },
  GetWxBanners() { //获取banner列表
    api.GetWxBanners({}).then(res => {
      this.setData({
        banner: res.data.data.bannerinfo
      }, () => {
        wx.stopPullDownRefresh();
      })
    })
  },
  GetArticleList() { //获取图文列表
    api.GetArticleList({
      page: 1,
      pageSize: 5,
      teacherId: 0,
      startTime: '',
      endTime: '',
      title: '',
      groupId: 2,
    }).then(res => {
      this.setData({
        articleList: res.data.data.articles
      })
    })
  },
  videoList() { //获取多个视频列表
    let teacher = [];
    api.getchatusername({}).then(res => {//老师列表
      teacher = res.data.data;
      teacher.forEach((cur, index) => {
        api.GetVideoList({ //视频列表
          page: 1,
          pageSize: 4,
          teacherId: cur.userId,
          startTime: '',
          endTime: '',
          title: '',
          groupId: 0,
        }).then(res => {
          teacher[index].videos = res.data.data.videos;
          if (teacher.length - 1 == index){
            this.setData({
              videoList: teacher
            })
          }
        })
      })
    })
  },
  onPullDownRefresh() {
    this.onLoad();
  },
  onShareAppMessage(){
    app.BehaviorLog({
      behaviorType: 6,
      behaviorObject: "分享出去(首页)",
      startTime: util.formatTime(new Date()),
      endTime: util.formatTime(new Date())
    });
    return {
      path: '/pages/index/index?liveToken=' + app.globalData.liveToken
    }
  },
  goArticleList() {
    if (!app.globalData.liveToken) {
      wx.reLaunch({
        url: app.globalData.userInfo ? '/pages/login/index' : '/pages/login/getUserInfo/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/daily-column/index'
      })
    }
  },
  goVideoList() {
    if (!app.globalData.liveToken) {
      wx.reLaunch({
        url: app.globalData.userInfo ? '/pages/login/index' : '/pages/login/getUserInfo/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/accurate-series/index'
      })
    }
  }
})
