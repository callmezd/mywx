var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp()
Page({
  data: {
    name:'',
    checkid:0,
    keyword: '',
    searchStatus: false,
    goodsList: [],
    flag:false,
    goods:[],
    helpKeyword: [],
    historyKeyword: [],
    categoryFilter: false,
    currentSortType: 'default',
    filterCategory: [],
    defaultKeyword: {},
    hotKeyword: [],
    page: 1,
    size: 20,
    currentSortType: 'id',
    currentSortOrder: 'desc',
    categoryId: 0
  },
  //事件处理函数
  closeSearch: function () {
    wx.navigateBack()
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  onLoad: function () {

    // this.getSearchKeyword();
  },

  fliter() {

    

    var priceFliter = this.data.currentSortOrder;
    console.log(this.data.currentSortType)
    this.checkAdult(this.data.goodsList, priceFliter)



  },
   checkAdult(obj,priceFliter) {
     console.log(obj, priceFliter)
    var len = obj.length, temp;
      for (var i = 0; i < len - 1; i++) {
        for (var j = len - 1; j > i; j--) {
          if (obj[j].retail_price < obj[j - 1].retail_price && priceFliter == 'asc') {
            temp = obj[j];
            obj[j] = obj[j - 1];
            obj[j - 1] = temp;
          }
          if (obj[j].retail_price > obj[j - 1].retail_price && priceFliter == 'desc') {
            temp = obj[j];
            obj[j] = obj[j - 1];
            obj[j - 1] = temp;
          }
        }
      }
  this.setData({
    goodsList:obj
  })
  var arr=[];
  var goodsList = this.data.goodsList;
  var currentCategory=this.data.checkid;
  var name =this.data.name;
  if(name=='全部'){
    arr=goodsList;
  }else{
    for (var i = 0; i < goodsList.length; i++) {
      if (goodsList[i].category_id == currentCategory) {
        arr.push(goodsList[i])
      }
    }
  }

  this.setData({
    goods:arr
  })

  

},

  getSearchKeyword() {
    wx.showLoading();
    let that = this;
    var cLists=[];
    util.request(api.SearchIndex,{keyword:that.data.keyword}).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          goodsList: res.data,
          historyKeyword: res.data.historyKeywordList,
          defaultKeyword: res.data.defaultKeyword,
          hotKeyword: res.data.hotKeywordList,
          searchStatus: true
          
        });
        console.log(res.data)
        var goodsList=res.data;
        console.log(goodsList.length)


        cLists[0] = { name: "全部", id: "0", selected: true}
        for(var i=0;i<goodsList.length;i++){
          cLists[i+1] = {
            name:goodsList[i].category_name,
            id:goodsList[i].category_id
          };
        }

    　　var res1 = [];
    　　var json = {};
      for (var i = 0; i < cLists.length; i++) {
        if (!json[cLists[i]]) {
          res1.push(cLists[i]);
          json[cLists[i]] = 1;
      　　　　}
    　　}
    　　
      var hash=[]
      cLists = cLists.reduce(function (item, next) {
        hash[next.name] ? '' : hash[next.name] = true && item.push(next);
        return item
      }, [])

      console.log(cLists)
       that.setData({
         filterCategory: cLists
        })
      }

      else{
        that.setData({
          goodsList: []
        });
      }
    });

    wx.hideLoading();
  },

  inputChange: function (e) {
    this.setData({
      keyword: e.detail.value,
    });
   // this.getSearchKeyword();
  },
  getHelpKeyword: function () {
    this.getSearchKeyword();    
  },
  

  
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          'categoryFilter':true,
          'currentSortType': 'category'
        });       
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'price',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false
        });
        this.fliter()
        break;
      default:
        this.fliter()
    }
  },
  selectCategory: function (event) {
    let currentIndex = event.target.dataset.categoryIndex;
    let filterCategory = this.data.filterCategory;
    let currentCategory = null;
    for (let key in filterCategory) {
      if (key == currentIndex) {
        filterCategory[key].selected = true;
        currentCategory = filterCategory[key];
      } else {
        filterCategory[key].selected = false;
      }
    }
    console.log(currentCategory)
    this.setData({
      'filterCategory': filterCategory,
      'categoryFilter': false,
      categoryId: currentCategory.id,
      page: 1,
      // goodsList: []
    });
    var arr=[];
    this.setData({
      checkid: currentCategory.id,
      name: currentCategory.name
    })
    var goodsList = this.data.goodsList;
    if (currentCategory.name=='全部'){
      arr=goodsList
    }
    for (var i = 0; i < goodsList.length;i++){
      if (goodsList[i].category_id == currentCategory.id){
        arr.push(goodsList[i])        
      }
    }
    console.log(arr)
    this.setData({
      goods:arr,
      flag:true
    })
  },



})