var api = require('../../utils/api.js');
var Common = require('../../common')
var app = getApp()
Page({
    data: {
        inputVal: '',
        selectData: ['1', '2', '3', '4', '5', '6'],//下拉列表的数据
        index:0,
        searchStatus:0 //0未在搜索  1搜索结束有结果 2搜索结果无结果 
    },
    
    clearInput() {
        this.setData({
            inputVal: ''
        })
    },
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
      wx.setStorageSync('clickdata', songData)
      wx.switchTab({
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
          var  song =res.data ;
        
         
          
          for (var key in song) {//遍历键值对
              if(key<=10)
              {
                temp.push({
                  id: song[key].music_id,
                  name: song[key].music_name,
                  mp3Url: song[key].play_url,
                  picUrl: song[key].image_url,
                  singer: song[key].artists
                })
              }
              
           
          }
          console.log(temp);
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
            searchStatus : 2
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
})