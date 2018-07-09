var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      songArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    var data=wx.getStorageSync('fav_song')
    //console.log(data);
    var openid = wx.getStorageSync('openid')

    var id = data.id
    var name = data.name
    var src = data.src
    var poster = data.poster
    var author = data.author
    if(!openid)
    {
      wx.showToast({
        title: '账号未登录',
        duration: 500
      });
      return;
    }
    //  wx.request({
    //   url: `${config.service.host}/weapp/Favorite`,
    //   data: {
       
    //     openid:openid,
    //     update:'get_song'
    //   },
    //   //login: true,
    //   success(result) {
    //     console.log(result);
    //     that.setData({ 
    //       songArr: result
    //     })  
       
    //     wx.showToast({
    //       title: '保存成功',
    //       duration: 500
    //     });
    //     // 等待半秒，toast消失后返回上一页
    //     setTimeout(function () {
    //       //wx.navigateBack();
    //     }, 500);
    //   },
    //   fail(error) {
    //     util.showModel('失败', error);
    //   }
    // })
    // return;
    wx.request({
      url: `${config.service.host}/weapp/Favorite`,
      data: {
        id: data.id,
        name: data.name,
        src: data.src,
        poster: data.poster,
        author: data.author,
        openid:openid,
        update:'fav_song'
      },
      //login: true,
      success(result) {
        console.log(result);

        wx.showToast({
          title: '保存成功',
          duration: 500
        });
        // 等待半秒，toast消失后返回上一页
        setTimeout(function () {
          //wx.navigateBack();
        }, 500);
      },
      fail(error) {
        util.showModel('失败', error);
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