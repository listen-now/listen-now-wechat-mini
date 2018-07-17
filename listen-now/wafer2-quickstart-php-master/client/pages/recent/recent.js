var api = require('../../utils/api.js');
var Common = require('../../common')
var util = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    lists: [],
    
   
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //console.log(options)
    
      var result = wx.getStorageSync('recentlist')
         //console.log(result)
      if (result) {
        that.setData({
          index: result.index,
          lists: result.lists,
          //info: result.info,
          
        })
      }
      if (options.id == 1) {
        var song = wx.getStorageSync('recent');
        console.log(song);
        for (var i = 0; i < this.data.index;i++)
        {
          if(song.id==this.data.lists[i].musicId)
          {
            wx.showToast({
              title: '歌曲早已收藏',
              duration: 1000
            });
            return;
          }
        }
      
        var timee = util.formatTime(new Date());
      //console.log(time);
        var index = that.data.index
        var name = "lists[" + index + "].name"
        var author = "lists[" + index + "].author"
        var duration = "lists[" + index + "].duration"
        var poster = "lists[" + index + "].poster"
        var musicId = "lists[" + index + "].musicId"
        var time = "lists[" + index + "].time"
        var info = "lists[" + index + "].info"
        var index = this.data.index + 1;
        
        if (song.name.length > 14) {
          song.name = song.name.slice(0, 13) + "...";
        }

         
      that.setData({
        index: index,
        [name]: song.name,
        [author]: song.author,
        [duration]: song.duration,
        [poster]: song.poster,
        [time]: timee,
        [musicId]: song.id,
        [info]: song
      })
      wx.setStorageSync('rec_image', song.poster)
      wx.setStorageSync('recentlist', that.data)
      wx.showToast({
        title: '收藏成功',
        duration: 500
      });
      }
  },

   tonow(event){
     console.log(event)
     let songData = {
       id: event.currentTarget.dataset.song.id,
       name: event.currentTarget.dataset.song.name,
       mp3Url: event.currentTarget.dataset.song.src,
       picUrl: event.currentTarget.dataset.song.poster,
       singer: event.currentTarget.dataset.song.author
     }
     app.globalData.issearchlaying = true// 设置搜索结果播放状态
     // 将当前点击的歌曲保存在缓存中
     wx.setStorageSync('clickdata', songData)
     wx.switchTab({
       url: '../now/index'
     })
   },
   deleted(e){
     var that=this
     //console.log(index);
     var index=e.currentTarget.dataset.index
     console.log(index);
     var list=that.data.lists
     console.log(list);
     var lists= list.splice(index, 1);
       console.log(lists);
      that.setData({
        index : that.data.index-1 ,
        lists:list,
 
      })
      wx.setStorageSync('recentlist', that.data)
 

   },

  previewImage: function (event) {
    console.log(event)
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
    })
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