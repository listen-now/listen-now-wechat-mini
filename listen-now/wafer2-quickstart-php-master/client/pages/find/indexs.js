// pages/find/indexs.js
var api = require('../../utils/api.js');
var Common = require('../../common')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hitokotoHitokoto: '永远相信美好的事情即将发生。',
    hitokotoFrom: '凌小汐',
    hitokotoIcon: '/images/icons/hitokoto.png',
    avatarIcon: 'https://listen1.52ledao.com/music/cd.jpg',
    listenNowLogo: '/images/logo.png',
    tabs: ["网易云音乐", "QQ音乐", "虾米音乐"],
    activeIndex: 0,


    inputVal: '',
    index: 0,
    searchStatus: 0 //0未在搜索  1搜索结束有结果 2搜索结果无结果 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: "https://www.zlclclc.cn/Random_song_list",
      method: 'GET',
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log("post成功，获得数据");
        //console.log(res);
        that.setData({
          res: res.data
        })
      //  console.log(that.data.res)
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
  changelist(e) {
    //console.log(e);
    var id = e.currentTarget.dataset.id;

    var that = this;
    wx.request({
      url: "https://www.zlclclc.cn/Random_song_list",
      method: 'GET',
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        //console.log("post成功，获得数据");
        //console.log(res);
        that.setData({
          res: res.data
        })
        console.log(that.data.res)
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getHitohoto()
    this.setHitohoto()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#f24e71',
      animation: {
        duration: 1000,
        timingFunc: 'easeIn'
      }
    })
    // wx.setNavigationBarTitle({
    //   title: '当前页面'
    // })
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
  /**
   * 分栏点击
   */
  intolist(e) {
    console.log(e)
    var that = this
    var listid = e.currentTarget.dataset.listid;
    //console.log(listid);
    wx.navigateTo({
      url: '/pages/recoList/recoList',
    })
    wx.setStorageSync('listid', listid)

  },

  // inputTyping(e) {
  //   this.setData({
  //     inputVal: e.detail.value
  //   })

  // },
  // search1() {
  //   wx.navigateTo({
  //     url: '/pages/search/index?inputVar=' + this.data.inputVal,
  //     success: function (res) { },
  //     fail: function (res) { },
  //     complete: function (res) { },
  //   })
  // },



  inputTyping(e) {
    this.setData({
      inputVal: e.detail.value
    })
    this.search()
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
    // 将当前点击的歌曲保存在缓存中
    wx.removeStorageSync('clickdata')
    wx.removeStorageSync('operation')
    wx.setStorageSync('clickdata', songData)
    wx.setStorageSync('operation', 'search')

    wx.navigateTo({
      url: '../now/index'
    })


  },
  search() {
    let that = this
    if (!that.data) return
    //console.log(that.data)
    this.setData({
      searchStatus: 0,
      inputVal: that.data.inputVal
    });
    console.log(that.data.inputVal)
    wx.showLoading({
      title: '搜索中',
      mask: true
    })
    //查询音乐列表
    wx.request({
      url: 'https://www.zlclclc.cn/search',
      data: {
        title: that.data.inputVal,
        platform: "Neteasymusic",
        page: 1,
      },
      method: 'POST',
      success: res => {
        //console.log(res)
        console.log(res)
      
        wx.hideLoading()//停止加载中提示
        let temp = []
        if (!res.data) {
          that.setData({
            searchStatus: 2
          })
          return;
        }

        var song
        if (res.data.song.list!=undefined)
        {
          song= res.data.song.list;
        }
     



        for (var key in song) {//遍历键值对
          if (key <= 10) {
            temp.push({
              id: song[key].music_id,
              name: song[key].music_name,
              mp3Url: song[key].play_url,
              picUrl: song[key].image_url,
              singer: song[key].artists
            })
          }


        }
        //console.log(temp);
        that.setData({
          searchStatus: 1,
          searchReault: temp
        })
        // res.data.foreach((song, index) => {
        //   temp.push({
        //     id: song.music_id,
        //     name: song.music_name,
        //     mp3Url: song.play_url,
        //     picUrl: song.image_url,
        //     singer: song.artists
        //   })
        //   that.setData({
        //     searchStatus: 1,
        //     searchReault: temp
        //   })
        // })
        // 存入搜索的结果进缓存
        wx.setStorage({
          key: "searchReault",
          data: temp
        })
      },
      fail: err => {
        wx.hideLoading()//停止加载中提示
        that.setData({
          searchStatus: 2
        })
      }
    })
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
  previewImage(e) {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.previewUrl] // 需要预览的图片http链接列表
    });
  },







  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /**
   * 获取hitokoto一句话
   */
  getHitohoto() {
    api.post({
      url: 'song/Hitokoto',
      data: {
      },
      success: res => {
        console.log('获取hitokoto一句话成功')
        wx.setStorage({
          key: 'hitokoto',
          data: res.data.data
        })
      }
    })
  },
  /**
   * 更新hitokoto一句话
   */
  setHitohoto() {
    let that = this
    wx.getStorage({
      key: 'hitokoto',
      success: (res) => {
        let data = res.data
        // console.log(data)
        that.setData({
          hitokotoHitokoto: data.hitokoto,
          hitokotoFrom: data.from
        })
      }
    })
    console.log('更新hitokoto一句话成功')
  }
})