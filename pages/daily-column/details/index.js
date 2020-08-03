// pages/daily-column/details/index.js
const app = getApp();
import api from './../../../utils/api.js'
const util = require('./../../../utils/util.js')
let logData = {
  behaviorType: 4,
  behaviorObject: "图文(单篇)：从进入到离开",
};
Page({
  data: {
    id: 0,
    article: null,
    isRole: true
  },
  onLoad(options) {
    if (options.liveToken) {
      app.BehaviorLog({
        behaviorType: 1,
        behaviorObject: "分享进入(图文)",
        startTime: util.formatTime(new Date()),
        endTime: util.formatTime(new Date())
      });
    }
    if(options.id){
      this.setData({
        id: parseInt(options.id)
      },res=>{
        this.GetArticle();
      });
    }
  },
  GetArticle(){
    api.GetArticle({
      id: this.data.id
    }).then(res => {
      this.articleRole(res.data.data);
      // let str = res.data.data.content;
      // str = str.replace(/<xml>[\s\S]*?<\/xml>/ig, '');
      // str = str.replace(/<style>[\s\S]*?<\/style>/ig, '');
      // console.log(str)
      this.setData({
        article: res.data.data,
        // ['article.content']: str
      })
    })
  },
  articleRole(article) { //验证权限
    let group = app.globalData.userData.columnGroupsModels[0].children;
    let specialRole = JSON.parse(article.specialRole);
    let userRole = app.globalData.userData.userRoleIds;
    let intersection = specialRole.filter(v => userRole.includes(v));
    if (specialRole.length !== 0) {
      if (intersection.length === 0) {
        this.setData({
          isRole: false
        });
      }
    } else {
      group.forEach((cur, index) => { //遍历栏目
        let groupIds = article.groupIds.split(',');
        if (cur.id == groupIds[groupIds.length - 1]) {
          if (!cur.checked) { //栏目是否免费
            this.setData({
              isRole: false
            });
          }
        } else if (cur.children.length > 0) {
          cur.children.forEach((cur, index) => { //遍历栏目
            let groupIds = article.groupIds.split(',');
            if (cur.id == groupIds[groupIds.length - 1]) {
              if (!cur.checked) { //栏目是否免费
                this.setData({
                  isRole: false
                });
              }
            }
          })
        }
      })
    }
  },
  praise() {
    let { id, article } = this.data;
    api.LikeOrNot({
      id: id,
      like: !article.isLike
    }).then(res => {
      if (res.data.error_no === 0){
        let likedCount = article.isLike ? article.likedCount - 1 : article.likedCount + 1;
        this.setData({
          ['article.isLike']: !article.isLike,
          ['article.likedCount']: likedCount
        });
      }
    })
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
      behaviorObject: "分享出去(图文)",
      startTime: util.formatTime(new Date()),
      endTime: util.formatTime(new Date())
    });
    return {
      path: '/pages/daily-column/details/index?liveToken=' + app.globalData.liveToken + '&id=' + this.data.id
    }
  }
})