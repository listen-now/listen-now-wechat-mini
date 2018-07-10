// pages/recoList/recoList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
     var that=this
     var listid=wx.getStorageSync('listid')
     wx.request({
       url: "http://zlclclc.cn/song_list_requests",
       method: 'POST',
       data: {
         url: listid,

       },
       // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       // header: {}, // 设置请求的 header
       success: function (res) {
         console.log("post成功，获得数据");
          console.log(res);
          that.setData({
            songlist: res.data.Songlist_detail,
            creator: res.data.creator,
            description: res.data.description,
            song_num: res.data.song_num,
          })
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