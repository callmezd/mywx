var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    addressList:[],
    
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0
  },

  getAddressList(id) {
    let that = this;
    util.request(api.AddressList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          addressList: res.data
        });
        console.log(that.data.addressList)
        // wx.setStorageSync('addressId', event.currentTarget.dataset.addressId);


        var addressList = that.data.addressList;
        if(addressList.length>0){
          for (var i = 0; i < addressList.length; i++) {
            if (addressList[i].is_default == 1) {
              wx.setStorageSync('addressId', addressList[i].id);
            }else{
              wx.setStorageSync('addressId', addressList[0].id);
            }
          }
        }
   
        
        if(!id){
          that.setData({
            checkedAddress:{id:-1}
          })
        }
        for (var i = 0; i < addressList.length;i++){
          if (addressList[i].id==id){
            console.log('等')
            console.log(addressList[i].id, id)
            that.setData({
              checkedAddress: addressList[i]
            })
          }
        }
      }
    });
  },
  onLoad: function (options) { 
    // this.getAddressList(this.data.addressId)  
  },
  getCheckoutInfo: function () {
    console.log(this.data.addressId)
    console.log(this.data.addressId)
    console.log(this.data.addressId)
    console.log(this.data.addressId)
    console.log(this.data.addressId)
    console.log(this.data.addressId)
    let that = this;
    util.request(api.CartCheckout, { addressId: that.data.addressId, couponId: that.data.couponId }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          // checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon,
          couponList: res.data.couponList,
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice
        });
      }  
      // console.log(res.data.checkedAddress)     
      if (res.data["checkedAddress"].id==null){
        console.log(res.data.checkedAddress)       
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    try {
      let that = this;
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }
      console.log(this.data.addressList)
      console.log(addressId)

      var couponId = wx.getStorageSync('couponId');
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
    } catch (e) {
      // Do something when catch error
    }
    this.getAddressList(this.data.addressId)  
    console.log(this.data)
    if (this.data.addressList.length>0){
      
    }
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    console.log(this.data.addressId)    
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
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
  }
})