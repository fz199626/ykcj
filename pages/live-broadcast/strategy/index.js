// pages/live-broadcast/strategy/index.js
const app = getApp();
import api from './../../../utils/api.js'
var day = new Date();
  day.setTime(day.getTime());
var time = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
Page({
  data: {
    strategyList: [{
      id: 1,
      text: "今日策略"
    },{
      id: 2,
      text: "历史策略"
    }],
    strategyIndex: 1,
    endTime: '',
    startTime: '',
    teacherList: [{
      userId: 0,
      realName: "全部"
    },{
      userId: 32,
      realName: "姚恒"
    },{
      userId: 33,
      realName: "张茂福"
    },{
      userId: 34,
      realName: "孙宇鹏"
    },{
      userId: 35,
      realName: "孔原鲁"
    },{
      userId: 26,
      realName: "沈坤"
    },{
      userId: 66,
      realName: "范文涛"
    }],
    teacherId: 0,
    strategies: [],
    encryption: false
  },
  onLoad(options) {
    this.setData({
      startTime: time,
      encryption: options.encryption === 'true'?true:false
    }, () => {
      this.getstrategylist();
    })
  },
  strategy(e) { //切换策略
    let id = e.currentTarget.id;
    if (this.data.strategyIndex != id){
      if(id == 1) {
        this.setData({
          strategyIndex: id,
          endTime: '',
          startTime: time
        }, () => {
          this.getstrategylist();
        })
      }else{
        this.setData({
          strategyIndex: id,
          endTime: time,
          startTime: ''
        }, () => {
          this.getstrategylist();
        })
      }
    }
  },
  onChange(e) { //切换老师
    let teacherId = this.data.teacherList[e.detail.name].userId;
    this.setData({
      teacherId: teacherId
    },()=>{
      this.getstrategylist();
    })
  },
  getstrategylist() { //获取策略列表
    let { teacherId, endTime, startTime } = this.data;
    api.getstrategylist({
      page: 1,
      pageSize: 20,
      teacherId: teacherId,
      encryption: !this.data.encryption,
      endTime: endTime,
      startTime: startTime
    }).then(res => {
      this.setData({
        strategies: res.data.data.strategies
      })
    })
  }
})