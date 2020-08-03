// pages/accurate-series/details/index.js
const app = getApp();
import api from './../../../utils/api.js'
const util = require('./../../../utils/util.js')
let logData = {
  behaviorType: 5,
  behaviorObject: "视频(单篇或多篇)：从进入到离开",
};
Page({
  data: {
    id: 0,
    currentVideo: null,
    videoList: [],
    isRole: false,
    page: 1
  },
  onLoad(options) {
    if (options.liveToken) {
      app.BehaviorLog({
        behaviorType: 1,
        behaviorObject: "分享进入(视频)",
        startTime: util.formatTime(new Date()),
        endTime: util.formatTime(new Date())
      });
    }
    if (!app.globalData.liveToken) {
      wx.reLaunch({
        url: app.globalData.userInfo ? '/pages/login/index' : '/pages/login/getUserInfo/index'
      })
    } else {
      if (options.id) {
        this.setData({
          id: parseInt(options.id)
        }, res => {
          this.GetVideo();
        });
      }
    }
  },
  GetVideo() { //获取视频
    api.GetVideo({
      id: this.data.id,
      isRole: false
    }).then(res => {
      this.setData({
        currentVideo: res.data.data
      },()=>{
        let groupIds = res.data.data.groupIds.split(',');
        this.videoRole();
        this.GetVideoList(this.data.page, groupIds[groupIds.length - 1]);
      });
    })
  },
  GetVideoList(page, groupIds) { //获取视频列表
    let group = app.globalData.userData.columnGroupsModels[1].children;
    api.GetVideoList({
      page: page,
      pageSize: 20,
      teacherId: 0,
      startTime: '',
      endTime: '',
      title: '',
      groupId: parseInt(groupIds)
    }).then(res => {
      let videos = [];
      res.data.data.videos.forEach((cur) => {
        let groupIds = cur.groupIds.split(',');
        group.forEach((cur1) => { //遍历栏目
          if (cur1.id == groupIds[groupIds.length - 1]) {
            cur.checked = cur1.checked;
            videos.push(cur)
          } else if (cur1.children.length > 0) {
            cur1.children.forEach((cur2) => { //遍历栏目
              if (cur2.id == groupIds[groupIds.length - 1]) {
                cur.checked = cur2.checked;
                videos.push(cur)
              }
            })
          }
        })
      })
      this.setData({
        videoList: this.data.videoList.concat(videos)
      });
    })
  },
  changeVideo(e){ //切换课程
    this.setData({
      id: this.data.videoList[e.currentTarget.id].id,
      currentVideo: this.data.videoList[e.currentTarget.id],
      isRole: false
    },()=>{
      this.videoRole();
      api.GetVideo({
        id: this.data.id,
        isRole: false
      }).then(res => { })
    });
  },
  videoRole(e) { //验证权限
    let currentVideo = this.data.currentVideo;
    let group = app.globalData.userData.columnGroupsModels[1].children;
    let specialRole = JSON.parse(currentVideo.specialRole);
    let userRole = app.globalData.userData.userRoleIds;
    let intersection = specialRole.filter(v => userRole.includes(v));
    if (specialRole.length !== 0) {
      if (intersection.length !== 0){
        this.setData({
          isRole: true
        });
      }else{
        wx.showToast({title: '暂无权限！',icon: 'none'});
      }
    } else {
      group.forEach((cur, index) => { //遍历栏目
        let groupIds = currentVideo.groupIds.split(',');
        if (cur.id == groupIds[groupIds.length - 1]) {
          if (cur.checked) { //栏目是否免费
            this.setData({
              isRole: true
            });
          } else {
            wx.showToast({ title: '暂无权限！', icon: 'none' });
          }
        } else if (cur.children.length > 0) {
          cur.children.forEach((cur, index) => { //遍历栏目
            let groupIds = currentVideo.groupIds.split(',');
            if (cur.id == groupIds[groupIds.length - 1]) {
              if (cur.checked) { //栏目是否免费
                this.setData({
                  isRole: true
                });
              } else {
                wx.showToast({ title: '暂无权限！', icon: 'none' });
              }
            }
          })
        }
      })
    }
  },
  onReachBottom() {
    let { page } = this.data;
    this.setData({
      page: page + 1
    }, res => {
      this.GetVideoList(page + 1);
    });
  },
  onShow() {
    logData.startTime = util.formatTime(new Date());
  },
  onUnload() {
    logData.endTime = util.formatTime(new Date());
    app.BehaviorLog(logData);
  },
  onHide() {
    logData.endTime = util.formatTime(new Date());
    app.BehaviorLog(logData);
  },
  onShareAppMessage() {
    app.BehaviorLog({
      behaviorType: 6,
      behaviorObject: "分享出去(视频)",
      startTime: util.formatTime(new Date()),
      endTime: util.formatTime(new Date())
    });
    return {
      path: '/pages/accurate-series/details/index?liveToken=' + app.globalData.liveToken+'&id='+this.data.id
    }
  }
})