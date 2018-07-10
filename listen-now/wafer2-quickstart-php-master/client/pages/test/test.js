var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util1.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: "http://zlclclc.cn/Random_song_list",
      method: 'GET',
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log("post成功，获得数据");
        console.log(res)
      
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

  },

  formSubmit: function (e) {
    // util.showBusy('请求中...')
    // var that = this
    // wx.request({
    //   url: `${config.service.host}/weapp/demo`,
    //   login: true,
    //   data: {
    //     update: 'insertMsg'
    //   },
    //   success(result) {
    //     console.log(result)
    //     util.showSuccess('请求成功完成')
    //     //that.setData({
    //     //  requestResult: JSON.stringify(result.data)
    //     //})
    //   },
    //   fail(error) {
    //     util.showModel('请求失败', error);
    //     console.log('request fail', error);
    //   }
    // })
    // return ;

    var that = this
    var name = e.detail.value.name
    var num = e.detail.value.num
    var msg = e.detail.value.msg
    wx.request({
      url: `${config.service.host}/weapp/insert`,

      data: {
        name: name,
        num: num,
        msg: msg,
        update: 'insertMsg'
      },

      header: {
        'content-type': 'application/json'
      },

      success(result) {
        util.showSuccess('请求成功完成')

        that.setData({
          requestResult: JSON.stringify(result.data)
        })
        console.log(that.data.requestResult)
      },

      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
    // 等待半秒，toast消失后返回上一页



  }
})