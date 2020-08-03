// pages/live-broadcast/index.js
const app = getApp();
import api from './../../utils/api.js'
import NIM from './../../utils/NIM_Web_Chatroom_weixin_v7.5.0.js'
const util = require('./../../utils/util.js')
let logData = {
  behaviorType: 3,
  behaviorObject: "直播：从进入到离开",
};
var chatroom;
var customIds = [];
Page({
  data: {
    roomId: '10517689', //直播间id
    Description: '资深量化分析团队，专家在线指导，精准捕捉每一个盈利机会。', //直播间简介
    recommendedVideoList: [], //往期视频列表
    isPsdShow: false, //是否显示口令弹框
    isVideo: true, //是否播放直播
    liveUrl: '', //直播播放连接
    videoUrl: '', //视频播放连接
    isLiveing: false, //当前是直播还是视频
    isOverlayShow: false, // 是否显示留言弹框
    introduce: null, //简介
    lastListId: 0, //留言列表的第一个id
    detail: [], //留言列表
    toView: '', //留言滑动位置
    isback: false,
    content: '', //发言框内容
    inputHeight: 0, //发言框的位置高度
    isEncryption: true, //加密
    inputShow: true,
    avatarUrl: 'https://img.inquant.cn/live/chat/system/visitor.png',
    emojiCode: ['1f60a', '1f60c', '1f60f', '1f601', '1f604',
      '1f609', '1f612', '1f614', '1f616', '1f618', '1f621', '1f628',
      '1f630', '1f631', '1f633', '1f637', '1f603', '1f61e', '1f620',
      '1f61c', '1f60d', '1f613', '1f61d', '1f62d', '1f602', '1f622',
      '1f61a', '1f623', '1f632', '1f62a', '263a', '1f4aa', '1f44a',
      '1f44d', '1f44e', '1f44f', '1f64f', '1f446', '1f447', '261d',
      '270c', '1f44c', '270b', '270a', '1f440', '1f444', '1f35a',
      '1f382', '1f37b', '2615', '1f451', '1f494', '1f339', '1f4a3',
      '1f004', '1f437', '1f3b5', '2600', '1f319', '1f525', '1f47b',
      '1f489', '1f4a9', '1f47c', '1f52b', '1f3c6', '26bd', '1f680',
    ],
    emojiShow: false //是否显示表情窗
  },
  onLoad(options) {
    if (options.liveToken) {
      app.BehaviorLog({
        behaviorType: 1,
        behaviorObject: "分享进入(直播间)",
        startTime: util.formatTime(new Date()),
        endTime: util.formatTime(new Date())
      });
    }
    this.detail();
    this.RecommendedVideo();
    this.getactiveMan();
    this.RequestAddr();
  },
  PlayLive(videoUrl) { //获取直播
    let password = app.globalData.password;
    api.PlayLive({
      roomid: this.data.roomId
    }).then(res => {
      let data = res.data.data;
      if (res.data.code === 0) {
        if (data.length === 1) {
          this.setData({
            isLiveing: true,
            isback: true,
            liveUrl: data[0].HLSUrl
          });
          if (password != '') {
            this.yklogin(password);
          } else {
            this.isNeedEncry();
          }
        } else {
          this.setData({
            isLiveing: false,
            videoUrl: videoUrl
          });
        }
      }
    })
  },
  isNeedEncry() {
    api.isneedencrypt({
      clientUId: app.globalData.liveToken,
      type: 2
    }).then(res => {
      this.setData({
        isPsdShow: res.data.liveEncrypt,
        isEncryption: res.data.strategyEncrypt,
        isVideo: !res.data.liveEncrypt
      });
    })
  },
  psdBtn(e) { //口令提交
    let password = e.detail.value.password
    this.yklogin(password);
  },
  psdHide() { //取消口令弹框
    this.setData({
      isPsdShow: false
    });
  },
  yklogin(password) { //口令请求
    api.yklogin({
      password: password
    }).then(res => {
      if (res.data.result === 1) {
        app.globalData.password = password;
        this.setData({
          isPsdShow: false,
          isEncryption: false,
          isVideo: true
        });
      } else {
        wx.showToast({ title: res.data.msg, icon: "none" });
      }
    })
  },
  strategy() {
    let { isVideo, isEncryption } = this.data;
    if (isVideo && isEncryption){
      wx.navigateTo({
        url: '/pages/live-broadcast/strategy/index?encryption=false'
      })
    }else{
      if (!isEncryption) {
        wx.navigateTo({
          url: '/pages/live-broadcast/strategy/index?encryption=true'
        })
      } else {
        this.setData({
          isPsdShow: true
        });
      }
    }
  },
  overlayShow() { //显示留言弹框
    this.setData({
      isOverlayShow: true
    });
  },
  overlayHide() { //隐藏留言弹框
    this.setData({
      isOverlayShow: false
    });
  },
  noop() { },//防止点击弹框冒泡
  overlay(e) { //留言提交
    let data = e.detail.value;
    if (/^1[3456789]\d{9}$/.test(data.phone)){
      if (data.content != "") {
        api.Add({
          phone: data.phone,
          content: '解码交易【' + data.content +'】'
        }).then(res => {
          this.setData({
            isOverlayShow: false
          });
        })
      } else {
        wx.showToast({ title: '请输入您的描述问题', icon: 'none' });
      }
    }else{
      wx.showToast({ title: '请输入正确的手机号码', icon: 'none' });
    }
  },
  detail() { //获取留言
    api.detail({
      direction: -1,
      order: 1,
      dataType: 2,
      roomid: 10517689,
      id: this.data.lastListId
    }).then(res => {
      let newDetail = [];
      res.data.im_data.forEach((cur, index) => {
        if (cur.ext.other){
          cur.attach = this.replaceEmoji("@" + cur.ext.other.to + "：" + cur.attach);
          cur.ext.other.content = this.replaceEmoji(cur.ext.other.to + "：" + cur.ext.other.content);
        }else{
          cur.attach = this.replaceEmoji(cur.attach);
        }
        newDetail.push(cur)
      })
      let detail = newDetail.concat(this.data.detail);
      this.setData({
        detail: detail,
        lastListId: res.data.im_data[0].id
      },()=>{
        this.setData({
          toView: res.data.im_data.length - 1
        })
      });
    })
  },
  replaceEmoji(content) {// 转换表情
    return content.replace(/\[([0-9a-f]{4,5})\]/g, (match, group) => {
      if (group.length < 6) {
        return '<img style="width:20px;height:20px;" src="https://i0.niuguwang.com/emoji/emoji_' + group + '.png"/>';
      }
      return match;
    });
  },
  onChange(e) {
    this.setData({
      inputShow: e.detail.index === 0 ? true :false
    });
  },
  preview(e) { //点击放大图片
    let url = e.currentTarget.id;
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },
  RecommendedVideo() { //获取往期视频
    api.RecommendedVideo({
      roomid: this.data.roomId
    }).then(res => {
      let page = 1;
      let data = res.data.data.slice((page-1)*20, page*20);
      this.PlayLive(data[0].videoUrl);
      this.setData({
        recommendedVideoList: data
      })
    })
  },
  getactiveMan() { //获取直播间介绍
    api.getactiveMan({
      roomId: this.data.roomId
    }).then(res => {
      this.setData({
        introduce: res.data.data.personnel[0]
      })
    })
  },
  curriculum(e) { //切换视频
    let { recommendedVideoList, isLiveing } = this.data;
    this.setData({
      videoUrl: recommendedVideoList[e.currentTarget.id].videoUrl,
      isLiveing: false
    });
  },
  inputFocus(e) { //键盘弹起时输入框上移
    if (e.detail.height) {
      this.setData({
        inputHeight: e.detail.height
      });
    }
  },
  blur() { //键盘失去焦点时输入框回到底部
    this.setData({
      inputHeight: 0
    });
  },
  emojiShow() { //展开表情面板
    this.setData({
      emojiShow: true
    });
  },
  onClose() { //关闭表情面板
    this.setData({
      emojiShow: false
    });
  },
  emoji(e) { //选择表情
    let { content, emojiCode } = this.data;
    this.setData({
      content: content + '[' + emojiCode[e.currentTarget.id] + ']'
    }, () => {
      this.onClose();
    });
  },
  getContent(e) { //获取即将发生的消息内容
    this.setData({
      content: e.detail.value
    });
  },
  send() { //发送消息
    api.sendmsg({
      content: this.data.content,
      roomid: this.data.roomId,
      username: app.globalData.userData.phone
    }).then(res => {
      this.setData({
        content: ''
      });
    })
  },
  RequestAddr() { //获取用户信息
    api.RequestAddr({
      roomid: this.data.roomId
    }).then(res => {
      this.initIM(res.data);
    })
  },
  initIM(data) { //聊天室初始化
    const conf = {
      appKey: "3b95e461fd9bbc17dc72e638d5a5fcf8",
      account: data.accId,
      token: data.accToken,
      db: false,
      chatroomId: data.roomId,
      chatroomAddresses: data.im_addr
    }

    chatroom = NIM.getInstance({
      ...conf,
      onconnect: (chatroom) =>{
        console.log('进入聊天室', chatroom);
      },
      onerror: (err, obj) => {
        console.log('发生错误', error, obj);
      },
      onwillreconnect: (obj) => {
        console.log('即将重连', obj);
      },
      ondisconnect: (err) => {
        console.log('连接断开', err);
      },
      onmsgs: (msg) => {
       console.log("收到消息", msg);
        this.handleOnmsgs(msg);
      }
    })
  },
  handleOnmsgs(msg){ //接收到新消息处理
    if (msg.length > 0) {
      for (let x = 0; x < msg.length; x += 1) {
        const msgItem = msg[x];
        if (msgItem.type === 'custom') {
          const custom = JSON.parse(msgItem.custom);
          switch (custom.ext.mstype) {
            case 10:
              console.log('直播结束 播放录播！');
              break;
            case 9:
              console.log('直播开始 开始直播！');
              break;
            case 11:

              return;
            default:
              //  显示自己的消息(未审核)或显示审核后的消息
              console.log("custom:", custom)
              let { detail } = this.data;
              let add = [];
              if (custom.ext.other) { //回复消息
                custom.attach = this.replaceEmoji("@" + custom.ext.other.to + "：" + custom.attach);
                custom.ext.other.content = this.replaceEmoji(custom.ext.other.to + "：" + custom.ext.other.content);
              } else { //普通消息
                custom.attach = this.replaceEmoji(custom.attach);
              }
              add[0] = custom; //将custom赋值给add数组
              if (custom.isAudit === 0 && custom.name == app.globalData.userData.phone) {
                customIds.push(custom.Id);
                this.setData({
                  detail: detail.concat(add)
                }, () => {
                  this.setData({
                    toView: detail.length - 1
                  })
                })
              } else if (custom.isAudit === 1) {
                if (customIds.indexOf(custom.Id) == -1) {
                  this.setData({
                    detail: detail.concat(add)
                  }, () => {
                    this.setData({
                      toView: detail.length - 1
                    })
                  })
                } else {
                  customIds.splice(customIds.indexOf(custom.Id), 1);
                }
              }
              break;
          }
        }
      }
    }
  },
  onShow() {
    logData.startTime = util.formatTime(new Date());
  },
  onUnload() { //退出页面时销毁云信
    logData.endTime = util.formatTime(new Date());
    app.BehaviorLog(logData);
    chatroom.disconnect();
  },
  onHide() {
    logData.endTime = util.formatTime(new Date());
    app.BehaviorLog(logData);
  },
  onShareAppMessage() {
    app.BehaviorLog({
      behaviorType: 6,
      behaviorObject: "分享出去(直播间)",
      startTime: util.formatTime(new Date()),
      endTime: util.formatTime(new Date())
    });
    return {
      path: '/pages/live-broadcast/index?liveToken=' + app.globalData.liveToken
    }
  }
})