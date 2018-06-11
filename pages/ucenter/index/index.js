var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
  data: {
    userInfo: {},
    
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(app.globalData)
  },
  onReady: function () {

  },
  onShow: function () {

    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    // 页面显示
    if (userInfo && token) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
    }

    this.setData({
      userInfo: app.globalData.userInfo,
    });

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  goLogin(){
    // this.setData({
    //   flag:!this.data.flag
    // })
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo
      });
  
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      console.log(res.data.token)
    }).catch((err) => {
      console.log(err)
    });
  },
  exitLogin: function () {
    var _this=this;
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          console.log(app.globalData)
          var exitiInfo={
            nickName: 'Hi,游客',
            userName: '点击去登录',
            avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
          }
          app.globalData.userInfo = exitiInfo;
          app.globalData.token = '';

          // _this.setData({
          //   flag: !_this.data.flag
          // })

          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  }
})