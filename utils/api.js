import {
  _post,
  _get,
  _formDataPost
} from './ruquest.js';
// const ykcjwx = "http://ykcjwx.test_inquant.cn"
const devykcjwx = "https://devykcjwx.yingkuancaijing.com";
const ykcjwx = "https://ykcjwx.yingkuancaijing.com"; 
const userUrl = "https://user.inquant.cn";
const liveUrl = "https://live.inquant.cn";
const adminUrl = "https://ykcjadmin.inquant.cn";

//埋点
function BehaviorLog(data) {
  return _post(ykcjwx + '/api/Log/BehaviorLog', data)
}

//加密
function GetCryption(data) {
  return _post(ykcjwx + '/api/Encryption/GetCryption', data)
}

//解密
function DeCryption(data) {
  return _get(ykcjwx + '/api/Encryption/DeCryption', data)
}

//发送验证码
function getverifycode(data) {
  return _formDataPost(userUrl + '/userfut/client/getverifycode.ashx?packType=1010', data)
}

//获取用户手机号
function GetUserPhone(data) {
  return _post(ykcjwx + '/api/User/GetUserPhone', data)
}

//注册
function reg(data) {
  return _formDataPost(userUrl + '/userfut/clientv1/reg.ashx', data)
}

//微信注册
function UserRegister(data) {
  return _post(ykcjwx + '/api/User/UserRegister', data)
}

//微信登录
function UserLogin(data) {
  return _post(ykcjwx + '/api/User/UserLogin', data)
}

//登录
function userlogin(data) {
  return _formDataPost(userUrl + '/userfut/live/userlogin.ashx', data)
}

//重置密码
function resetpwd(data) {
  return _formDataPost(userUrl + '/userfut/client/resetpwd.ashx', data)
}

//获取我的页面信息
function getmineinfo(data) {
  return _formDataPost(userUrl + '/userfut/phone/getmineinfo.ashx', data)
}

//获取用户信息
function RequestAddr(data) {
  return _formDataPost(liveUrl + '/chatroom/chartroom/RequestAddr', data)
}

//banner列表
function GetWxBanners(data) {
  return _get(ykcjwx + '/api/Banner/GetWxBanners', data)
}

//公告列表
function GetAnnouncement(data) {
  return _get(ykcjwx + '/api/Announcement/GetAnnouncement', data)
}

//图文列表
function GetArticleList(data) {
  return _post(ykcjwx + '/api/Article/GetArticleList', data)
}

//图文详情
function GetArticle(data) {
  return _post(ykcjwx + '/api/Article/GetArticle', data)
}

//图文点赞或取消
function LikeOrNot(data) {
  return _post(ykcjwx + '/api/Article/LikeOrNot', data)
}

//视频列表
function GetVideoList(data) {
  return _post(ykcjwx + '/api/Video/GetVideoList', data)
}

//视频详情
function GetVideo(data) {
  return _post(ykcjwx + '/api/Video/GetVideo', data)
}

//视频点赞或取消
function GetVideoList(data) {
  return _post(ykcjwx + '/api/Video/GetVideoList', data)
}

//准神联盟列表
function liveList(data) {
  return _get(liveUrl+ '/video/VideoList/LiveList', data)
}

//老师列表
function getchatusername(data) {
  return _get(adminUrl+'/api/chat/getchatusername', data)
}

//策略列表
function getstrategylist(data) {
  return _post(adminUrl +'/api/strategy/getstrategylist', data)
}

//准神大户室-嘉宾观点
function detail(data) {
  return _formDataPost(liveUrl + '/chatroom/chartroom/detail', data)
}

//发表观点
function sendmsg(data) {
  return _formDataPost(liveUrl + '/chatroom/chartroom/sendmsg', data)
}

//准神大户室-介绍
function getactiveMan(data) {
  return _get(liveUrl + '/chatroom/roominfo/getactiveMan', data)
}

//直播
function PlayLive(data) {
  return _get(liveUrl + '/video/VideoList/PlayLive', data)
}

//往期课程
function RecommendedVideo(data) {
  return _get(liveUrl + '/video/videolist/RecommendedVideo', data)
}

//留言资讯
function Add(data) {
  return _post(liveUrl + '/video/Note/Add', data)
}

//口令
function yklogin(data) {
  return _formDataPost(liveUrl + '/chatroom/user/yklogin', data)
}

//定义用户更clientUid
function getUid(data) {
  return _post(liveUrl + '/chatroom/user/AnonymousLogin', data)
}

//直播间加密
function isneedencrypt(data) {
  return _post(liveUrl + '/chatroom/user/isneedencrypt', data)
}

export default {
  GetUserPhone,
  BehaviorLog,
  GetWxBanners,
  GetAnnouncement,
  UserLogin,
  GetCryption,
  DeCryption,
  getverifycode,
  reg,
  UserRegister,
  userlogin,
  getmineinfo,
  RequestAddr,
  resetpwd,
  GetArticleList,
  GetArticle,
  LikeOrNot,
  GetVideoList,
  GetVideo,
  GetVideoList,
  liveList,
  Add,
  getchatusername,
  getstrategylist,
  detail,
  getactiveMan,
  PlayLive,
  RecommendedVideo,
  yklogin,
  getUid,
  isneedencrypt,
  sendmsg,
}