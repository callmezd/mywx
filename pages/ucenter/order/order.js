var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

Page({
  data:{
    orderList: [],
    couponId:0,
    addressId:0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    try {
      var addressId = wx.getStorageSync('addressId');
      console.log(addressId)
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }
      console.log("====================" + addressId)
      var couponId = wx.getStorageSync('couponId');
      console.log(couponId)
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
    } catch (e) {
      // Do something when catch error
    }

  },
  getOrderList(){
    let that = this;
    util.request(api.OrderList).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderList: res.data.data
        });
        wx.hideLoading();
        console.log(res.data.data)
      }
    });
  },
  payOrder(event){
    console.log(event.target)
    var id = event.target.dataset;

    util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId }, 'POST').then(res => {
      if (res.errno === 0) {
        const orderId = res.data.orderInfo.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
    
    console.log(this.data.orderList)
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示

    wx.showLoading({
      title: '加载中...',
      success: function () {

      }
    });
    this.getOrderList();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})