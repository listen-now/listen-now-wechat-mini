var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util1.js')

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },
  onLoad: function () {
    
  },
   torecent(){
     wx.navigateTo({
       url: '/pages/recent/recent',
       success: function(res) {},
       fail: function(res) {},
       complete: function(res) {},
     })
   },
  bindGetUserInfo: function (e) {
    var that = this;
    var userInfo = e.detail.userInfo;
    var signature = e.detail.signature
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {

          // 检查登录是否过期
          wx.checkSession({
            success: function () {
              // 登录态未过期
              util.showSuccess('登录成功');
              that.setData({
                userInfo: userInfo,
                logged: true
              })
              
             
              var nickName = userInfo.nickName

              var sex = userInfo.gender
              var city = userInfo.city
              var province = userInfo.province
              var country=userInfo.country
              var avatarUrl = userInfo.avatarUrl

              wx.login({
                success: function (res) {
                  var code = res.code;//发送给服务器的code
                
                      if (code) {
                        wx.request({
                          url: `${config.service.host}/weapp/users`,//服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
                          data: {
                            code: code,
                            nick: nickName,
                            avaurl: avatarUrl,
                            sex: sex,
                            city: city,
                            province: province,
                            country: country,
                            update: 'getOpenId'
                          },
                          header: {
                            'content-type': 'application/json'
                          },
                          success: function (res) {
                            wx.setStorageSync('name', res.data.name);//将获取信息写入本地缓存
                            wx.setStorageSync('openid', res.data.openid);
                            wx.setStorageSync('imgUrl', res.data.imgurl);
                            wx.setStorageSync('sex', res.data.sex);

                            console.log(res.data);

                          }
                        })
                      }
                },
                fail: function (error) {
                  console.log('login failed ' + error);
                }
              })
              // console.log(e);
              //return;
              if (that.data.logged) return;

              util.showBusy('正在登录');
              
            },

            fail: function () {
              qcloud.clearSession();
              // 登录态已过期，需重新登录
              var options = {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                userInfo: userInfo
              }
              that.doLogin(options);
            },
          });
        } else {
          util.showModel('用户未授权', e.detail.errMsg);
        }
      }
    });
  },

  
 

  

})