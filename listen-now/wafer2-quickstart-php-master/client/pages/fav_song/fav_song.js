var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var api = require('../../utils/api.js');
var Common = require('../../common')
var util = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[],
    song_list:[],
      songArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

     console.log("进入收藏歌单")
    var oper=e.oper
    var that = this
    var data = wx.getStorageSync('fav_song')
    //console.log(data);
    var openid = wx.getStorageSync('openid')

    var id = data.id
    var name = data.name
    var src = data.src
    var poster = data.poster
    var author = data.author
  
    var song_list = []
    if (!openid) {
      wx.showToast({
        title: '账号未登录',
        duration: 500
      });
      return;
    }

    wx.request({
      url: `${config.service.host}/weapp/Favorite`,
      data: {
        oper:oper,
        id: id,
        openid: openid,
        update: 'insert_song'
      },
      success(result) {
        console.log(result);
        song_list = result.data.data.list
       var song_lists = [{ id: '', name: '', mp3Url: '', picUrl: '', singer:''}]
        var flag = result.data.flag
        var list = song_list
        var count = 0
        //console.log("------------")
        //console.log(list)
        

        for (var key in list) {
         // console.log(list[key])
  
         // wx.setStorageSync('music__id', list[key])
          wx.request({
            url: "https://www.zlclclc.cn/id",
            method: 'POST',
            // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            data: {
              id: parseInt(list[key]),
              platform: "Neteasymusic",

            },
            success(res) {
              //console.log(res)
              //console.log("----------post成功，获得数据")
              //console.log(res)
              //console.log(list[key])
              //var music_id = list[key]

              //console.log(res)
             //console.log("----------post成功，获得数据")
              //console.log(res)
              //console.log(list[key])
              //var music_id = list[key]
              var songData = {
                id: res.data.song.list.music_id,
                name: res.data.song.list.music_name,
                mp3Url: res.data.song.list.play_url,
                picUrl: res.data.song.list.image_url,
                singer: res.data.song.list.artists
              }
              var name = "lists[" +count+ "].name"
              var author = "lists[" + count + "].author"
              var poster = "lists[" + count + "].poster"
              var musicId = "lists[" + count + "].musicId"
              var info = "lists[" + count + "].info"
              var c=0
              if(c==0){
                wx.setStorageSync('fav_image', res.data.song.list.image_url)
                c++;
              }
              if (res.data.song.list.music_name.length > 14) {
                res.data.song.list.music_name = res.data.song.list.music_name.slice(0, 13) + "...";
              }

              that.setData({
                [name]: res.data.song.list.music_name,
                [author]: res.data.song.list.artists,
                [poster]: res.data.song.list.image_url,
                [musicId]: res.data.song.list.music_id,
                [info]: res.data.song.list
              })
              count++;
            }
          })

        }
       
            //console.log(that.data.song_lists)

        
        that.setData({
          song_list:song_lists
        })
        console.log(that.data.song_list)
         



       if(oper==1) {flag=-1;}


        if(flag==0)
        {
          wx.showToast({
            title: '保存成功',
            duration: 500
          });
        }
        else if(flag==1){
          wx.showToast({
            title: '重复添加',
            duration: 500
          });
        }
        
        // 等待半秒，toast消失后返回上一页
        setTimeout(function () {
          //wx.navigateBack();
        }, 500);
      },
      fail(error) {
        util.showModel('失败', error);
      }
    })
    
    
  
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
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  tonow(event) {
    var s=this.data.lists
    var list=[]
    console.log(s);
    for (var key in s) {
      list[key] = s[key].info.music_id
    }
    wx.setStorageSync('nowLists', list)
    let songData = {
      id: event.currentTarget.dataset.song.music_id,
      name: event.currentTarget.dataset.song.music_name,
      mp3Url: event.currentTarget.dataset.song.play_url,
      picUrl: event.currentTarget.dataset.song.image_url,
      singer: event.currentTarget.dataset.song.artists
    }
    app.globalData.issearchlaying = true// 设置搜索结果播放状态
    // 将当前点击的歌曲保存在缓存中
    wx.setStorageSync('clickdata', songData)
    wx.switchTab({
      url: '../now/index'
    })
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
     console.log(that.data.song_list)
     var song = that.data.song_list
     return;
     var that = this
     //console.log(options)

       var timee = util.formatTime(new Date());
       //console.log(time);
     for(var key in song)
     {
       var name = "lists[" + key + "].name"
       var author = "lists[" + key + "].author"
       var duration = "lists[" + key + "].duration"
       var poster = "lists[" + key + "].poster"
       var musicId = "lists[" + key+ "].musicId"
       var time = "lists[" + key + "].time"
       that.setData({
         [name]: song.name,
         [author]: song.singer,
         [poster]: song.picUrl,
         [time]: timee,
         [musicId]: song.id,
       })
     }
       
       wx.setStorageSync('recentlist', that.data)
       wx.showToast({
         title: '收藏成功',
         duration: 500
       });
    


    
   
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