//index.js
var api = require('../../utils/api.js');
var Common = require('../../common')
var app = getApp()
var that = this
var timer; // 计时器
Page({
  data: {
    margin:320,
    id: null,
    name: null,
    src: null,
    poster: "https://listen1.52ledao.com/music/bg.png",
    author: null,
    isplaying: false,
    islyric: false,
    sumduration: 0,
    lyricobj: {},
    lyricArr: [],
    isadd: false,
    items: [
      { name: 'recent', value: '最近' },
      { name: 'like', value: '我的收藏' }
    ],
    progress: 0,
    minute: 0,
    second: 0,
    percent: '100%',
    duration:''
  },


  //收藏
   recent(e){
    console.log(e)
    var id=e.currentTarget.dataset.id
    wx.setStorageSync('recent', this.data)
    if(id==0)
    {
      wx.navigateTo({
        url: '/pages/recent/recent?id=1',
      })
    }
  },

  //收藏最喜欢歌曲
  fav_song(){
    console.log(this.data)
    wx.setStorageSync('fav_song', this.data)
    wx.navigateTo({
      url: '/pages/fav_song/fav_song',
    })
    return;
  },


  //添加歌曲
  addsong: function () {
    console.log("添加歌曲")
    this.setData({
      percent: '0'
    })
  },
  //音乐切换
  radioChange: function (e) {
    console.log("音乐切换")
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      percent: '100%'
    })
  },
  //事件处理函数
  bindViewTap: function () {
    console.log("事件处理函数")
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //显示唱碟
  showCircle: function () {
    console.log("显示唱碟")
    this.setData({
      islyric: true,
      percent: '100%'
    })
  },
  //显示歌词
  showlyric: function () {
    console.log("显示歌词")
    this.setData({
      islyric: false,
      percent: '100%'
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    console.log('打开播放界面')
    let that = this;
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // }),
    wx.setNavigationBarTitle({
      title: '正在播放'
    })
  },
  //界面载入
  onShow: function () {
    let that = this;
    console.log('初始化')
    Common.asyncGetStorage('clickdata')//本地缓存
      .then(data => {
        if (!data) return;
        console.log("  ├─数据读取成功:", data.name)
        that.setData({
          id: data.id,
          name: data.name,
          src: data.mp3Url,
          poster: data.picUrl,
          author: data.singer
        })
        console.log('准备播放音乐')

        wx.getBackgroundAudioPlayerState({
          success: function (res) {
            if (res.dataUrl == data.mp3Url) {
              console.log("提示：音乐正在播放！")
            } else {
              //return Common.playMusic(data.mp3Url, data.name, data.picUrl)
              console.log('  └─开始播放')
              return myPlayMusic(data.mp3Url, data.name, data.picUrl, that)
            }
          },
          fail: function (res) {
            if (app.globalData.issearchlaying == true) {
              console.log('  └─开始播放')
              return myPlayMusic(data.mp3Url, data.name, data.picUrl, that)
            } else {
              console.log('  └─等待用户确认播放')
            }
          }
        })
      }).catch(e => {
        //wx.hideLoading()//停止加载中提示
        //this.ohShitfadeOut("播放列表为空");
        if (e.errMsg == 'getStorage:fail data not found') {
          console.log("  └─提示：数据未读取")
        } else {
          console.log("错误", e)
        }
      })
      .then(status => {
        wx.hideLoading();
        console.log('准备更新歌词')
        if (that.data.id == null) return null;
        return Common.getlyric(that.data.id)
      }).catch(e => {
        console.log("错误：", e)
      })
      .then((lyricArr) => {
        if (lyricArr == null) {
          console.log('  └─提示：歌词未更新', )
        } else {
          console.log('      └─更新歌词成功', )
          that.setData({
            lyricArr: lyricArr
          })
          console.log(lyricArr)
        }
        return Common.getMusicData()
      }).catch(e => {
        if (e.errMsg == 'getBackgroundAudioPlayerState: fail not playing') {
          console.log("提示：音乐未播放")
        } else {
          console.log("错误", e)
        }
      })
      .then(data => {
        if (data.duration) {
          console.log(data)
          let tempduration = data.duration
          this.setData({
            isplaying: true
          })
          // 设置时长
          that.setData({
            sumduration: tempduration
          })
          console.log("提示：播放时长已更新")
        }
      }).catch(e => {
        console.log("提示：播放时长未更新")
      })
      .then(() => {
        console.log("初始化完成")
      })

  },

  //音乐播放
  audioPlay: function () {
    let that = this;
    console.log("音乐播放按钮")
    //背景音乐信息
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        // var status = res.status
        // var dataUrl = res.dataUrl
        var value = wx.getStorageSync('noww')
        console.log(value)
        var currentPosition = value
        console.log(currentPosition)
        // var duration = res.duration
        // var downloadPercent = res.downloadPercent
        wx.getStorage({
          key: 'clickdata',
          success: function (res) {
            myPlayMusic(res.data.mp3Url, res.data.name, res.data.picUrl, that)
            that.setData({
              isplaying: true
            })
            console.log("  └─已切换暂停按钮")
          }
        })
        wx.seekBackgroundAudio({
          position: currentPosition
        })

      },
      fail: function (res) {
        wx.getStorage({
          key: 'clickdata',
          success: function (res) {
            myPlayMusic(res.data.mp3Url, res.data.name, res.data.picUrl, that)
            that.setData({
              isplaying: true
            })
            console.log("  └─已切换暂停按钮")
          },
          fail: function (res) {
            that.setData({
              isplaying: false
            })
            console.log("  └─没有可播放的音乐，保持播放按钮。")
          }
        })
      }
    })
  },

  //音乐暂停
  audioPause: function () {



    console.log("音乐暂停")
    //console.log(this.data);
    wx.pauseBackgroundAudio();
      
    // wx.getBackgroundAudioPlayerState({
    //   success: function (res) {
    //     console.log(res);
    //   }
    // })
   // console.log(this.data);
    console.log("暂停跟踪进度");
    clearTimeout(timer);
    this.setData({
      isplaying: false
    })
  },

  //设置当前播放时间为14秒
  audio14: function () {
  },

  //回到开头
  audioStart: function () {
  },

  //滑动进度
  slider3change: function (e) {
    console.log(e);
    console.log("滑动进度条")
    sliderToseek(e, function (dataUrl, cal) {
      // wx.playBackgroundAudio({
      //   dataUrl: dataUrl
      // })
      wx.seekBackgroundAudio({
        position: cal
      })
    })
  },
  //上一曲
  prev: function () {
    console.log("上一曲")
    prevSong(this)
  },
  //提示框
  ohShitfadeOut(title) {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: title });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  },
})

// 上一曲
function prevSong(that) {
  let id = that.data.id
  console.log('id', id)
  wx.getStorage({
    key: 'searchReault',
    success: function (res) {
      console.log(res.data)
      let currentSongIndex = res.data.findIndex((item) => {
        return item.id == id;
      })
      console.log(currentSongIndex)
      currentSongIndex--;
      console.log(res.data[currentSongIndex])
      wx.playBackgroundAudio({
        dataUrl: res.data[currentSongIndex].mp3Url
      })
      wx.switchTab({
        url: '../now/index'
      })
    }, fail: function (res) {
      console.log(res)
    }
  })
}
//滑动 音乐进度调整
function sliderToseek(e, cb) {
  var that = this
  wx.getBackgroundAudioPlayerState({
    success: function (res) {
     // console.log(res);  
      console.log("有音乐播放时：滑动调整播放音乐进度")
      var dataUrl = res.dataUrl
       var duration = res.duration
        
       // console.log(duration)
      let val = e.detail.value
      //console.log(val)
      let cal = parseInt(val * duration/ 100)
      console.log(cal)
    wx.seekBackgroundAudio({
        position: cal
      })
    wx.setStorageSync('noww', cal)
      // let progress = (100 / res.duration * res.currentPosition)

      // that.setData({
        
      //   progress: parseInt(progress)

      // })
      
    },
    fail: function (res) {
      console.log("无音乐播放时：滑动调整播放音乐进度")
      
      wx.getStorage({
        key: 'clickdata',
        success: function (res) {
          Common.playMusic(res.data.mp3Url, res.data.name, res.data.picUrl)
          let cal = parseInt(val * duration / 100)
          console.log("  └─已切换暂停按钮")
        }
      })
    }
  })
  
}

// 我的音乐播放控制器
function myPlayMusic(mp3Url, name, picUrl, that) {
  console.log("开始跟踪进度");
  Countdown(that);
  return Common.playMusic(mp3Url, name, picUrl)
}
// 音乐进度跟踪
function Countdown(that) {
  timer = setTimeout(function () {
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        if (res.status == 1){
          let progress = (100 / res.duration * res.currentPosition)
          //转化成时间
          var minute = parseInt(res.currentPosition / 60);
          var second = res.currentPosition % 60;
          console.log("进度条更新")
          that.setData({
            sumduration: res.duration,
            minute: minute,
            second: second,
            progress: parseInt(progress)
            
          })

        //控制歌词滚动
          var lists = that.data.lyricArr;
          if (lists[res.currentPosition])
          {
               that.setData({
                 margin:that.data.margin-25
               })
          }

        }else{
          let progress = (100 / res.duration * res.currentPosition)
          //转化成时间
          var minute = parseInt(res.currentPosition / 60);
          var second = res.currentPosition%60;
     
          that.setData({
            progress: parseInt(progress),
            minute:minute,
            second:second,
            isplaying: false
          })
        }
      }
    })
    Countdown(that)
  }, 1000);
};

// ----------------------------------------------------
