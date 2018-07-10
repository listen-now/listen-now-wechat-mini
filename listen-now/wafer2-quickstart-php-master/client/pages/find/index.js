//index.js
//获取应用实例
// 个人网易云音乐 ID  66919655
var api = require('../../utils/api.js');
var Common = require('../../common')
var app = getApp()
Page({
    data: {
        inputShowed: false,
        tabs: ["个性推荐", "歌单", "Listen1电台", "排行榜"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        imgUrls: [
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 1000,
        circular: true,
        //   歌曲搜索的结果
        searchReault: []
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        let that = this
        console.log(e.detail)
        this.setData({
            inputVal: e.detail.value
        });
        //查询音乐列表
        api.post({
          url: 'song/Search',
          data: {
            keyword: e.detail.value,
            platform: "Neteasymusic",
            page: "1",
            source: "zlclclc", //zlclclc or leanapp or ledao
            action: "default"
          },
          success: res => {
            let temp = []
            if (!res.data.songs) {
              return;
            }
            res.data.songs.forEach((song, index) => {
              temp.push({
                id: song.id,
                name: song.name,
                mp3Url: song.mp3Url,
                picUrl: song.picUrl,
                singer: song.singer
              })
              that.setData({
                searchReault: temp
              })
            })
            console.log(temp)
            // 存入搜索的结果进缓存
            wx.setStorage({
              key: "searchReault",
              data: temp
            })
          },
          fail: err => {
          }
        });
    },
    onShow: function(){
        wx.hideLoading()
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
        wx.request({
          url: "http://zlclclc.cn/Random_song_list",
          method: 'GET',
          // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {
            console.log("post成功，获得数据");
            console.log(res);
            that.setData({
              res:res
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
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    tonow: function (event) {
        let songData = {
            id: event.currentTarget.dataset.id,
            name: event.currentTarget.dataset.name,
            mp3Url: event.currentTarget.dataset.songurl,
            picUrl: event.currentTarget.dataset.picurl,
            singer: event.currentTarget.dataset.singer
        }
        app.globalData.issearchlaying = true// 设置搜索结果播放状态
        // wx.playBackgroundAudio({
        //   dataUrl:songData.mp3Url,
        //   title:songData.name,
        //   coverImgUrl:songData.picUrl
        // })
        // 将当前点击的歌曲保存在缓存中
        wx.setStorageSync('clickdata', songData)
        wx.switchTab({
            url: '../now/index'
        })
    },
    search() {// 点击搜索打开搜索
      wx.navigateTo({
        url: "/pages/search/index"
      })
    },
});
