// pages/recent/recent.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
      lists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    if(options.id==1)
    {
        var song = wx.getStorageSync('recent');
        console.log(song);

        var result=wx.getStorageSync('recentlist')
        if(result)
        {
          that.setData({
            index: result.index,
            lists: result.lists,
            info: result.song,
            time: result.time
          })
        }

        var time = util.formatTime(new Date());
        if (song) {

          var index = that.data.index
          var name = "lists[" + index + "].name"
          var author = "lists[" + index + "].author"
          var duration = "lists[" + index + "].duration"
          var poster = "lists[" + index + "].poster"
          var time = "lists[" + index + "].time"
          var index = this.data.index + 1;
        }
        
        that.setData({
          index:index,
          
          [name] : song.name,
          [author] :song.author,
          [duration] :song.duration,
          [poster] :song.poster,
          [time]:time,
          info : song
        }) 
        wx.setStorageSync('recentlist', that.data)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  
  }
})