// pages/find/indexs.js
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hitokotoHitokoto: '永远相信美好的事情即将发生。',
    hitokotoFrom: '凌小汐',
    hitokotoIcon:'/images/icons/hitokoto.png',
    avatarIcon:'https://listen1.52ledao.com/music/cd.jpg',
    listenNowLogo:'/images/logo.png',
    tabs: ["网易云音乐", "QQ音乐", "虾米音乐"],
    activeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.request({
      url: "http://zlclclc.cn/Random_song_list",
      method: 'GET',
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log("post成功，获得数据");
        console.log(res);
        that.setData({
          res: res.data
        })
         console.log(that.data.res)
      },
      fail: function (err) {
        reject(err)
      },
      complete: function (res) {
        // complete
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changelist(e){
   console.log(e);
   var id=e.currentTarget.dataset.id;

   var that=this;
   wx.request({
     url: "http://zlclclc.cn/Random_song_list",
     method: 'GET',
     // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     // header: {}, // 设置请求的 header
     success: function (res) {
       //console.log("post成功，获得数据");
       //console.log(res);
       that.setData({
         res: res.data
       })
       console.log(that.data.res)
     },
     fail: function (err) {
       reject(err)
     },
     complete: function (res) {
       // complete
     }
   })
   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getHitohoto()
    this.setHitohoto()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#f24e71',
      animation: {
        duration: 1000,
        timingFunc: 'easeIn'
      }
    })
    // wx.setNavigationBarTitle({
    //   title: '当前页面'
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 分栏点击
   */
  intolist(e){
    //console.log(e)
    var that = this
    var listid = e.currentTarget.dataset.listid;
    console.log(listid);
     wx.navigateTo({
       url: '/pages/recoList/recoList',
     })
     wx.setStorageSync('listid', listid)
   
  },

  inputTyping(e) {
    this.setData({
      inputVal: e.detail.value
    })
   
  },
  search1(){
    wx.navigateTo({
      url: '/pages/search/index?inputVar='+this.data.inputVal,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /**
   * 获取hitokoto一句话
   */
  getHitohoto(){
    api.post({
      url: 'song/Hitokoto',
      data: {
      },
      success: res => {
        console.log('获取hitokoto一句话成功')
        wx.setStorage({
          key: 'hitokoto',
          data: res.data.data
        })
      }
    })
  },
  /**
   * 更新hitokoto一句话
   */
  setHitohoto(){
    let that = this
    wx.getStorage({
      key: 'hitokoto',
      success: (res) => {
        let data = res.data
        // console.log(data)
        that.setData({
          hitokotoHitokoto: data.hitokoto,
          hitokotoFrom: data.from
        })
      }
    })
    console.log('更新hitokoto一句话成功')
  }
})