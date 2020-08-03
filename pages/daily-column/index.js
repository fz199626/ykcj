// pages/daily-column/index.js
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
    columnList: [],
    page: 1,
    groupId: 0,
    teacherId: 0
  },
  onLoad() {
    this.menu();
    this.setData({
      groupId: app.globalData.userData.columnGroupsModels[0].children[0].id
    }, () => {
      this.GetArticleList();
    });
  },
  menu() { //栏目菜单
    let menu = app.globalData.userData.columnGroupsModels[0].children;
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
      columnList: [],
      ['value'+id]: e.detail,
      page: 1,
      groupId: app.globalData.userData.columnGroupsModels[0].children[id].id,
      teacherId: e.detail
    }, () => {
      this.GetArticleList();
    });
  },
  GetArticleList() { //获取图文列表
    let { page, groupId, teacherId, columnList } = this.data; 
    let group = app.globalData.userData.columnGroupsModels[0].children;
    api.GetArticleList({
      page: page,
      pageSize: 20,
      startTime: '',
      endTime: '',
      title: '',
      groupId: groupId,
      teacherId: teacherId
    }).then(res => {
      let articles = [];
      res.data.data.articles.forEach((cur) => {
        let groupIds = cur.groupIds.split(',');
        group.forEach((cur1) => { //遍历栏目
          if (cur1.id == groupIds[groupIds.length - 1]) {
            cur.checked = cur1.checked;
            articles.push(cur)
          } else if (cur1.children.length > 0) {
            cur1.children.forEach((cur2) => { //遍历栏目
              if (cur2.id == groupIds[groupIds.length - 1]) {
                cur.checked = cur2.checked;
                articles.push(cur)
              }
            })
          }
        })
      })
      this.setData({
        columnList: columnList.concat(articles)
      })
    })
  },
  articleJump(e) { //专栏跳转并验证权限
    let article = this.data.columnList[e.currentTarget.id];
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
        wx.showToast({ title: '暂无权限！', icon: 'none' });
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
        }else if (cur.children.length>0){
          cur.children.forEach((cur, index) => { //遍历栏目
            let groupIds = article.groupIds.split(',');
            if (cur.id == groupIds[groupIds.length - 1]) {
              if (cur.checked) { //栏目是否免费
                wx.navigateTo({
                  url: "/pages/daily-column/details/index?id=" + article.id
                })
              } else {
                wx.showToast({ title: '暂无权限！', icon: 'none' });
              }
            }
          })
        }
      })
    }
  },
  praise(e) { //点赞&取消点赞
    let index = e.currentTarget.id;
    let { columnList } = this.data;
    api.LikeOrNot({
      id: columnList[index].id,
      like: !columnList[index].isLike
    }).then(res => {
      if (res.data.error_no === 0) {
        let likedCount = columnList[index].isLike ? columnList[index].likedCount - 1 : columnList[index].likedCount + 1;
        let isLike = 'columnList['+index+'].isLike';
        let count = 'columnList[' + index + '].likedCount';
        this.setData({
          [isLike]: !columnList[index].isLike,
          [count]: likedCount
        });
      }
    })
  },
  onReachBottom() { //上拉加载下一页
    this.setData({
      page: this.data.page + 1
    },()=>{
      this.GetArticleList();
    });
  }
})