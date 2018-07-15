var api = require('../../utils/api.js');
var Common = require('../../common')
var util = require('../../utils/util.js');
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
  onLoad: function () {
    var that = this
    var listid = wx.getStorageSync('listid')
    wx.request({
      url: "https://www.zlclclc.cn/song_list_requests",
      method: 'POST',
      data: {
        url: listid,
        platform:"Neteasymusic",

      },
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log("post成功，获得数据");
        //
        
        //console.log(res);
       
        var s = res.data.Songlist_detail
        console.log(s)
        var list=[]
        for(var key in s)
        {
          list[key]=s[key].id
        }
        wx.setStorageSync('nowLists', list)
        console.log(list)
      
        for (var key in s)
        {
          s[key].name=s[key].name.slice(0, 16)
       
          if (s[key].name[15]!=undefined)
          {
            //console.log(res.data.Songlist_detail[key].name[16])
            s[key].name = s[key].name+"..."
          }

          //取长

          //console.log(s[key].al[0].name.length)
       
            var i;
          // for (var i = 0; s[key].al[0].name[i]!=undefined;i++)
          // {;
          // }

          // var len  = i

          // for (var i = 0; s[key].ar[0].name[i] != undefined; i++) {
          //   ;
          // }
          // // var lena = i
  
          //   var step = 30-lena
          
     
           s[key].al.name = s[key].al.name.slice(0, 21)

          if (s[key].al.name[20]!=undefined)
          {
            s[key].al.name = s[key].al.name + "..."
          }
        }
        that.setData({
          songlist:s,
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

  },
  tonow(e) {
    //console.log(e)
    // var res = wx.getStorageSync('ge')
    // console.log('第一个'+res)
    var that = this
    var id = e.currentTarget.dataset.id
    var lists = wx.getStorageSync('nowLists')
    var position
    for(var key in lists)
    {
      if(id==lists[key])
      {
        position=key;
        break;
      }
    }
    //console.log('id是'+id)
    wx.request({
      url: "https://www.zlclclc.cn/id",
      method: 'POST',
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header

      data: {
        id: id,
        platform: "Neteasymusic",

      },
      success: function (res) {
        //console.log("post成功，获得数据")
         //console.log(res)
         var songData = {
           id: res.data.song.list.music_id,
           name: res.data.song.list.music_name,
           mp3Url: res.data.song.list.play_url,
           picUrl: res.data.song.list.image_url,
           singer: res.data.song.list.artists,
         }
         console.log(songData);
         // return;
         app.globalData.issearchlaying = true// 设置搜索结果播放状态
         // 将当前点击的歌曲保存在缓存中

         var operation = 'recoList'
         wx.setStorageSync('operation', operation)
         wx.setStorageSync('clickdata', songData)
         wx.switchTab({
           url: '../now/index'
         })


        //wx.setStorageSync('ge', res)
         //console.log(that.data.res)
      },
      fail: function (err) {
        reject(err)
      },
      complete: function (res) {
        // complete
      }
    })
  //   var res = wx.getStorageSync('ge')
  //   console.log('第二个'+res);
  // return;
  //   var songData = {
  //     id: res.data[0].music_id,
  //     name: res.data[0].music_name,
  //     mp3Url: res.data[0].play_url,
  //     picUrl: res.data[0].image_url,
  //     singer: res.data[0].artists
  //   }
  //   console.log(songData);
  //   // return;
  //   app.globalData.issearchlaying = true// 设置搜索结果播放状态
  //   // 将当前点击的歌曲保存在缓存中

  //   var operation = 'recoList'
  //   wx.setStorageSync('operation', operation)
  //   wx.setStorageSync('clickdata', songData)
  //   wx.switchTab({
  //     url: '../now/index'
  //   })


  },

})