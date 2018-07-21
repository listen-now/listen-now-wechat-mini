//index.js
var api = require('../../utils/api.js');
var Common = require('../../common')
var app = getApp()
var that = this
var timer; // 计时器
Page({
  data: {
    count:1,
   
    xunhuang:'列表循环',//默认列表循环
    currentPosition:0,
    currentlrc:'_',
    animation1:{},
    step:0,
    margin:40,
    id: null,
    name: null,
    src: null,
    poster: "https://listen1.52ledao.com/music/bg.png",
    author: null,
    isplaying: true,
    islyric: false,
    sumduration: 0,
    lyricobj: {},
    lyricArr: [],
    isadd: false,
    items: [
      '最近' ,
      '我的收藏' 
    ],
    progress: 0,
    minute: 0,
    second: 0,
    percent: '100%',
    duration:''
  },
  //循环模式
  changecircle(e){
    var that=this
    var count=that.data.count
    if(e!=undefined&&count!=3)
    {
      count++; 
    }else{
      count=1;
    }
    that.setData({
      count:count,
    })
    console.log(count)
     if(count==1)
     {
       wx.showToast({
         title: '列表循环',
       })
     }else if(count==2){
       wx.showToast({
         title: '随机播放',
       })
     }else{
       wx.showToast({
         title: '单曲循环',
       })
     }

  },
  //收藏
   collect(e){
    var that=this
    console.log(e)
    var id=e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx.setStorageSync('recent', this.data)
    wx.setStorageSync('fav_song', this.data)
    if(id==0)
    {
      wx.navigateTo({
        url: '/pages/recent/recent?id=1',
      })
      return;
    }else if(id==1)
    {
      that.fav_song();
      return;
    }
    wx.navigateTo({
      url: '/pages/collect_list_detail/collect_list?name='+name+'&oper=0',
    })
  },

  //收藏最喜欢歌曲
  fav_song(){
    //console.log(this.data)
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
    
    that.setData({
      // animation1: {},
      // step: -9600,
      // currentlrc: "",
       isplaying: true,
    })
   
     ////后台页面还在运行时，再进入该页面不会触发onload
    var cur = wx.getStorageInfoSync('currentPosition')
    
      clearTimeout(timer);
    

    wx.showLoading({
      title: '加载中',
      mask: true
    })

    // wx.request({
    //   url: "zlclclc.cn",
    //   data: {
    //     id: id,
    //     platform: "Neteasymusic",
    //     source: "zlclclc", //zlclclc or leanapp or ledao
    //     action: "lyric"
    //   },
    
    console.log('打开播放界面')
    let that = this;

    
    // 调用应用实例的方法获取全局数据
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
  onReady: function () {

  },

  //界面载入
  onShow: function () {
    
    let that = this;
    var id = wx.getStorageSync('clickdata');
    var id = id.id
    var operation = wx.getStorageSync('operation')
    console.log('-----操作是' + operation);
    if(id==that.data.id)
    {
      operation=''
    }
    that.setData({
      id:id
    })

    //通过进入界面的方式判定是否clear timer
    if (operation == 'recoList' || operation == 'search'||operation=='recent'||operation=='fav_song')
    {
      clearTimeout(timer);
      that.setData({
        operation: operation
      })
    }
     wx.setStorageSync('operation', '')
   
    //
    var cur = wx.getStorageInfoSync('currentPosition')
    if (cur == 0) {
      clearTimeout(timer);
    }
    
  
    var nowlists = wx.getStorageSync('nowLists')
    that.setData({
      nowlists: nowlists
    })
   
   //console.log(lists)
   //从数据库中获取该用户歌单列表
      var openid = wx.getStorageSync('openid');
      wx.request({
        url: 'https://fcmsbbc8.qcloud.la/Collect_list',
        data: {
          openid: openid,
          update: 'get_collect_list'
        },
        //login: true,
        success(result) {
          console.log(result);
          var collect_lists = result.data.data.name_list
            collect_lists = ['最近', '我的收藏'].concat(collect_lists);
            that.setData({
              items: collect_lists
            })
       
         
        },
      })

    


    

     console.log(id)
     wx.request({
       url: "https://www.zlclclc.cn/id",
       data: {
         id: id,
         platform: "Neteasymusic",
      
       },
       method: 'POST', 
       // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       // header: {}, // 设置请求的 header
       success: function (res) {
         console.log("post成功，获得数据");
         console.log(res)
        
           that.setData({
             poster: res.data.song.list.image_url,
           })

       },
       fail: function (err) {
         reject(err)
       },
       complete: function (res) {
         // complete
       }
     })
     
    console.log('初始化')
    Common.asyncGetStorage('clickdata')//本地缓存
      .then(data => {
        //onsole.log(data)
        if (!data) return;
        console.log("  ├─数据读取成功:", data.name)
        that.setData({
          id: data.id,
          name: data.name,
          src: data.mp3Url,
          poster: data.picUrl,
          author: data.singer,
          
        })
        wx.setNavigationBarTitle({title:'正在播放：'+ data.name})  
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
          //console.log(lyricArr)
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
    
    clearTimeout(timer);
    console.log("音乐播放按钮")
    //背景音乐信息
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        // var status = res.status
        // var dataUrl = res.dataUrl
        var value = wx.getStorageSync('noww')
        //console.log(value)
        if(value)
        {
          var currentPosition = value
        }else{
          currentPosition=0
        }
        
       //console.log(currentPosition)
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
        console.log(currentPosition)
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
   // console.log(e);
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
  prev(){
    var operation = this.data.operation
    console.log(operation)
    if (operation == 'search') {
      wx.showToast({
        title: "不在歌单列表中",
        duration: 1000,

      })
      return
    }
    if (this.data.count == 2) {
      this.random();
      return;
    }
    
    if (this.data.count == 3) {
      wx.showToast({
        title: "目前是单曲循环模式",
        duration: 1000,

      })
      return
    }
    var that=this
      var nowId=that.data.id
      var nowlists=that.data.nowlists
      if(nowlists)
      {
        console.log(nowlists)
        var preId
        var key
        for (key in nowlists) {
          if (nowlists[key] == nowId) {
            if (key == 0) {
              preId = nowlists[nowlists.length - 1]
              break;
            }
            preId = nowlists[key - 1]
            break;
          }
        }
        //console.log('lists是' + nowlists.length)
        wx.request({
          url: "https://www.zlclclc.cn/id",
          method: 'POST',
          // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          data: {
            id: preId,
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
            //console.log(songData);
            // return;
            app.globalData.issearchlaying = true// 设置搜索结果播放状态
            // 将当前点击的歌曲保存在缓存中
            wx.setStorageSync('clickdata', songData)
            console.log("[[[播放上一首成功")
            clearTimeout(timer);
            setTimeout(function () {
              that.onShow();
            }, 300)
            
          }
        })
      }else{
        wx.showToast({
          title: '没有上一首歌',
          icon: '',
          image: '',
          duration: 1000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
     },

//下一曲
  next() {
    var operation = this.data.operation
    console.log('+++++++++++++++++++')
    console.log(operation)
    if (operation == 'search') {
      wx.showToast({
        title: "不在歌单列表中",
        duration: 1000,

      })
      return
    }
    if(this.data.count==2)
    {
      this.random();
      return;
    }
   
    if(this.data.count==3)
    {
      wx.showToast({
        title: "目前是单曲循环模式",
        duration: 1000,
       
      })
      return
    }
    var that = this
    var nowId = that.data.id
    var nowlists = that.data.nowlists
    //console.log('-----------'+nowlists.length)
    var nextId
    //var key

    for (var i = 0; i < nowlists.length;i++)
    {
      if(nowlists[i]==nowId){
        if(i==nowlists.length-1){
          nextId=nowlists[0]
          break;
        }
        nextId=nowlists[i+1]
        break;
      }
    }
    wx.request({
      url: "https://www.zlclclc.cn/id",
      method: 'POST',
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      data: {
        id: nextId,
        platform: "Neteasymusic",

      },
      success: function (res) {
        console.log(res)
        //console.log("post成功，获得数据")
        //console.log(res)
        var songData = {
          id: res.data.song.list.music_id,
          name: res.data.song.list.music_name,
          mp3Url: res.data.song.list.play_url,
          picUrl: res.data.song.list.image_url,
          singer: res.data.song.list.artists,
        }
        //console.log(songData);
        // return;
        app.globalData.issearchlaying = true// 设置搜索结果播放状态
        // 将当前点击的歌曲保存在缓存中
        wx.setStorageSync('clickdata', songData)
        console.log("[[[播放xia一首成功")
        clearTimeout(timer);
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
        setTimeout(function () {
          that.setData({
            isplaying: true,
          })
          that.onShow();
        }, 300)
      }
    })
  },

 //随机播放函数
  random(){
    var that = this
    var operation = this.data.operation
    console.log(operation)
    if (operation == 'search') {
      wx.showToast({
        title: "不在歌单列表中",
        duration: 1000,

      })
      return
    }
    var nowId = that.data.id
    var nowlists = that.data.nowlists
    //console.log('-----------'+nowlists.length)
    var nextId
    //var key
    var a = Math.floor(Math.random() * nowlists.length + 1); 
        nextId = nowlists[a-1]
       
    wx.request({
      url: "https://www.zlclclc.cn/id",
      method: 'POST',
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      data: {
        id: nextId,
        platform: "Neteasymusic",

      },
      success: function (res) {
        console.log(res)
        //console.log("post成功，获得数据")
        //console.log(res)
        var songData = {
          id: res.data.song.list.music_id,
          name: res.data.song.list.music_name,
          mp3Url: res.data.song.list.play_url,
          picUrl: res.data.song.list.image_url,
          singer: res.data.song.list.artists,
        }
        //console.log(songData);
        // return;
        app.globalData.issearchlaying = true// 设置搜索结果播放状态
        // 将当前点击的歌曲保存在缓存中
        wx.setStorageSync('clickdata', songData)
        console.log("[[[播放xia一首成功")
        clearTimeout(timer);
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
        setTimeout(function () {
          that.setData({
            isplaying: true,
          })
          that.onShow();
        }, 300)
      }
    })
   

  },

  //控制单曲循环
  onemusic(){
     var that=this
     wx.seekBackgroundAudio({
       position: 0,
     })
      app.globalData.issearchlaying = true// 设置搜索结果播放状态
     
      wx.showLoading({
        title: '正在加载',
        mask: true
      })

      setTimeout(function () {
        that.setData({
          isplaying: true,
        })
        that.onShow();
      }, 500)
      
  },


  // prev: function () {
  //   console.log("上一曲")
  //   prevSong(this)
  // },
  //提示框
  ohShitfadeOut(title) {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: title });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  },
})




//上一曲
// function prevSong(that) {
//   let id = that.data.id
//   console.log('id', id)
//   wx.getStorage({
//     key: 'searchReault',
//     success: function (res) {
//       console.log(res.data)
//       let currentSongIndex = res.data.findIndex((item) => {
//         return item.id == id;
//       })
//       console.log(currentSongIndex)
//       currentSongIndex--;
//       console.log(res.data[currentSongIndex])
//       wx.playBackgroundAudio({
//         dataUrl: res.data[currentSongIndex].mp3Url
//       })
//       wx.switchTab({
//         url: '../now/index'
//       })
//     }, fail: function (res) {
//       console.log(res)
//     }
//   })
// }
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
     
      //console.log(cal)
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
           cal = cal.toFixed(0)
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
        that.setData({
          isplaying: true,
        })
           
        res.currentPosition = parseInt(res.currentPosition);
       
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
            //progress: progress.toFixed(0)
          })

          //控制歌词滚动
          var lists = that.data.lyricArr;
          
            //平移动画实现
          var jiange = res.currentPosition - that.data.currentPosition //间隔
          //console.log(jiange)
          var count=0;
          //console.log(count)
          if(jiange<0)
          {
            var flag=0

            for (var key in lists)
            {
              if (key< that.data.currentPosition && key > res.currentPosition)
              {
                if (lists[key]&&flag==0)
                {
                  that.setData({
                    currentlrc: lists[key]
                  })
                
                  flag=1;
                }
                count--;
              }
            }
            that.setData({
              currentPosition: res.currentPosition
            })
          }else if(jiange>1){
            for (var key in lists) {
                   
              if (key > that.data.currentPosition && key < res.currentPosition) {
                if (lists[key] && flag == 0) {
                  that.setData({
                    currentlrc: lists[key]   //控制当前歌词，用于判断是否变蓝
                  })
                  flag = 1;
                }
                count++;
              }
            }
            if (res.currentPosition!=NaN)
            {
              that.setData({
                currentPosition: res.currentPosition,
              })
              wx.setStorageSync('currentPosition', res.currentPosition)
            }
          }
              //如果间隔大于1或小于0执行
          if (count > 1.5||count < 0) {
            if(count>1)
            {
              var step = that.data.step - (count ) * 64
            }else{
              var step = that.data.step - (count) * 64
            }

            
         
            console.log(step)
            var animation = wx.createAnimation({
              duration: 1000,
              timingFunction: 'ease',
            })
            var systemInfo = wx.getSystemInfoSync();
            animation = animation.translateY(step / 750 * systemInfo.windowWidth).step({ duration: 1000 })
            that.setData({
              animation1: animation.export(),
              step: step,
             
            })
          }

          for(var key in lists)
          {
            if (key > res.currentPosition )
            {
                 that.setData({
                   jiangee: parseInt(key-that.data.currentkey)
                 })
                 //console.log('间隔是----'+that.data.jiangee)
                 break;
            }
           
          }
         
          var currentPosition = parseInt(res.currentPosition)

          //console.log(count)
          if (lists[res.currentPosition])
          {
            
            var step=that.data.step-64
            var animation = wx.createAnimation({
              duration: 1000,
              timingFunction: 'ease',
            })
            var systemInfo = wx.getSystemInfoSync();
            animation = animation.translateY(step / 750 * systemInfo.windowWidth).step({ duration: 1000 })
            that.setData({
              animation1: animation.export(),
              step:step,
              currentlrc: lists[res.currentPosition],
            
              currentkey: res.currentPosition
            })
           
            //console.log(that.data.currentlrc)

            if (res.currentPosition==0){
         
              that.setData({
                animation1:{},
                step:0,
                currentlrc: ""
              })
            }

            // for (var key in lists) {//遍历键值对
            //   if (key < res.currentPosition)
            //   {
            //     var step = 40 / (res.currentPosition-key);
            //     that.setData({
            //       step :step
            //     })
            //     break;
            //   }
            // }
         
          }
            // that.setData({
            //   margin: that.data.margin - that.data.step,
            // })
           

        }else{
          let progress = (100 / res.duration * res.currentPosition)
          //转化成时间
          var minute = parseInt(res.currentPosition / 60);//
           minute = minute*1;

          var second = res.currentPosition%60;
     
          that.setData({
            //progress: parseInt(progress),
            progress: progress.toFixed(0),
            minute:minute,
            second:second,
            isplaying: false
          })
        }
      var count =that.data.count  //判断循环模式 ，1 是列表循环 ，2是随机播放，3是单曲循环
      var operation = wx.getStorageSync('operation')
      if ( operation == 'search') {
        count=0;
      }
      wx.setStorageSync('operation', '')
     if (currentPosition == res.duration) {
        if(count==1)
        {
          that.next();
        }else if(count == 2){
          that.random(); 
        }else{
          that.onemusic();
        }
        that.setData({
          isplaying: true,
        })
    }
      }
    })

    
    Countdown(that)
  }, 1000);
};

// ----------------------------------------------------