// pages/web-view/index.js
Page({
  data: {
    url: "https://www.baidu.com/"
  },
  onLoad(option) {
    if (option.url) {
      this.setData({
        url: option.url
      });
    }
  }
})