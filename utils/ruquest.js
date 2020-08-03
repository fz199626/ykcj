var version = "1.9.5.8";
function _post(url, params) {
  var liveToken = wx.getStorageSync('liveToken');
    liveToken = liveToken == null ? "" : liveToken;
  var userToken = wx.getStorageSync('userToken');
    userToken = userToken == null ? "" : userToken;
  var wxOpenId = wx.getStorageSync('wxOpenId');
  params = {
    ...params,
    liveToken: liveToken,
    userToken: userToken,
    wxOpenId: wxOpenId,
    version: version
  };
  return new Promise((resolve, reject, next) => {
    wx.request({
      url: url,
      method: "POST",
      data: params,
      success: resolve,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      fail: reject,
      complete: next
    })
  })
}
function _get(url, params) {
  var liveToken = wx.getStorageSync('liveToken');
    liveToken = liveToken == null ? "" : liveToken;
  var userToken = wx.getStorageSync('userToken');
    userToken = userToken == null ? "" : userToken;
  var wxOpenId = wx.getStorageSync('wxOpenId');
  params = {
    ...params,
    liveToken: liveToken,
    userToken: userToken,
    wxOpenId: wxOpenId,
    version: version
  };
  return new Promise((resolve, reject, next) => {
    wx.request({
      url: url,
      method: "GET",
      data: params,
      success: resolve,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      fail: reject,
      complete: next
    })
  })
}
function _formDataPost(url, params) {
  var liveToken = wx.getStorageSync('liveToken');
    liveToken = liveToken == null ? "" : liveToken;
  var userToken = wx.getStorageSync('userToken');
    userToken = userToken == null ? "" : userToken;
  var wxOpenId = wx.getStorageSync('wxOpenId');
  params = {
    ...params,
    liveToken: liveToken,
    userToken: userToken,
    wxOpenId: wxOpenId,
    version: version
  };
  let data = '';
  for (let key in params) {
    data += '\r\n--data\r\nContent-Disposition:form-data;name="' + key + '"\r\n\r\n' + params[key];
  }
  data += '\r\n--data--';
  return new Promise((resolve, reject, next) => {
    wx.request({
      url: url,
      method: "POST",
      header: {
        'content-type': 'multipart/form-data; boundary=data'
      },
      data: data,
      success: resolve,
      fail: reject,
      complete: next
    })
  })
}

module.exports = {
  _post,
  _get,
  _formDataPost
}