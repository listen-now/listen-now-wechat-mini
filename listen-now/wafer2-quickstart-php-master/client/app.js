//app.js
App({

  globalData: {
    appid: 'wx45090c5e43a84a30',//appid需自己提供，此处的appid我随机编写
    secret: '00623b89a44e3d0587efcf4d2a854ce3',//secret需自己提供，此处的secret我随机编写

  },
    onLaunch: function () {
  
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    
    getSystemInfo: function (cb) {
        var that = this
        if (that.globalData.systemInfo) {
            typeof cb == "function" && cb(that.globalData.systemInfo)
        } else {
            wx.getSystemInfo({
                success: function (res) {
                    that.globalData.systemInfo = res
                    typeof cb == "function" && cb(that.globalData.systemInfo)
                }
            })
        }
    },
    globalData: {
        userInfo: null,
        systemInfo: null,
        issearchlaying: false 
    },
    pagesData: {},
    pagesNeedUpdate: {},
    stockOutCategories: ["借出", "售出", "领用", "出租", "赠送", "报废","维修"]
})
  /* 
      }*/