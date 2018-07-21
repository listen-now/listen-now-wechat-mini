// pages/add_collect_list/collect_list.js
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
  formSubmit(e) {
    var value = e.detail.value.list_name;
    wx.setStorageSync('items', 1)
    var openid = wx.getStorageSync('openid')  //新建歌单并存入数据库
    wx.request({
      url: `${config.service.host}/weapp/Collect_list`,
      data: {
        openid: openid,
        list_name: value,
        update: 'create_list'
      },
      //login: true,
      success(result) {
        console.log(result);
         if(result.data.code==0)
         {
           wx.showToast({
             title: '名字重复',
             duration: 1000
           });
           return;
         }else{
           wx.showToast({
             title: '保存成功',
             duration: 1000
           });

           // 等待半秒，toast消失后返回上一页
           setTimeout(function () {
             wx.navigateBack();
           }, 500);
         }
        
       
      },
      fail(error) {
        util.showModel('失败', error);
      }
    })
    return;
  
  },
})