// pages/accurate-series/index.js
const app = getApp();
import api from './../../utils/api.js'
Page({
  data: {
    option0: [],
    value0: '',
    option1: [],
    value1: '',
    option2: [],
    value2: '',
    videoList: [],
    page: 1,
    groupId: 0,
    teacherId: 0
  },
  onLoad(){
    this.menu();
    this.setData({
      groupId: app.globalData.userData.columnGroupsModels[1].children[0].id
    }, () => {
      this.GetVideoList();
    });
  },
  menu() { //栏目菜单
    let menu = app.globalData.userData.columnGroupsModels[1].children;
    let teacher = [];
    api.getchatusername({}).then(res => {
      res.data.data.forEach((cur, index) => {
        teacher.push({
          value: cur.userId,
          text: cur.realName
        });
      })
      menu.forEach((cur, index) => {
        if (index < 3) {
          let column = [];
          column.push({
            value: 0,
            text: cur.title
          });
          this.setData({
            ['value'+index]: 0,
            ['option'+index]: column.concat(teacher)
          })
        }
      })
    })
  },
  valueChange(e) { //切换栏目
    let id = e.currentTarget.id;
    this.setData({
      videoList: [],
      ['value'+id]: e.detail,
      page: 1,
      groupId: app.globalData.userData.columnGroupsModels[1].children[id].id,
      teacherId: e.detail
    }, () => {
      this.GetVideoList();
    });
  },
  GetVideoList() { //获取视频列表
    let { page, groupId, teacherId, videoList } = this.data;
    let group = app.globalData.userData.columnGroupsModels[1].children;
    api.GetVideoList({
      page: page,
      pageSize: 20,
      startTime: '',
      endTime: '',
      title: '',
      groupId: groupId,
      teacherId: teacherId
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
        videoList: videoList.concat(videos)
      })
    })
  },
  onReachBottom() { //上拉加载下一页
    this.setData({
      page: this.data.page + 1
    },()=>{
      this.GetVideoList();
    });
  }
})