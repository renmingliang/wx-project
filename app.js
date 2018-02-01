//app.js
App({
  /**
   * 生命周期函数--监听小程序初始化
   */
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        const code = res.code
        // console.log(`https://api.weixin.qq.com/sns/jscode2session?appid=wx12a772f3b246db33&secret=7c7b596eccc5f5fa0b35bae10a09b3fe&js_code=${code}&grant_type=authorization_code`)
        // {"session_key":"4C\/RAL0gnMxtyfGzRzuySQ==","expires_in":7200,"openid":"oorPq0LtvmxG3-4L0foOPvldJ7Hw"}
        // console.log('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx12a772f3b246db33&secret=7c7b596eccc5f5fa0b35bae10a09b3fe')
        // {"access_token":"5_U7O4w6J17_AJdbd3cS-evBzywBTfjcx1NDT1fDv6-1Bw8K5uOp1U-mO23auf2XqE8ty1bDeys05k9B6GmPcxVNGCrLGqmSa-ZA4xqsRuxHKen-6gx2bGki_w_CIK49Z8dwjPfMIGkiEhgx04UBIhAIAPWD", "expires_in":7200 }
        // console.log('https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=5_U7O4w6J17_AJdbd3cS-evBzywBTfjcx1NDT1fDv6-1Bw8K5uOp1U-mO23auf2XqE8ty1bDeys05k9B6GmPcxVNGCrLGqmSa-ZA4xqsRuxHKen-6gx2bGki_w_CIK49Z8dwjPfMIGkiEhgx04UBIhAIAPWD')
        // 需要post数据
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function (options) {
    // Do something when show.
    // wx.showModal({
    //   title: '提示',
    //   content: `${options.scene}`,
    //   showCancel: false
    // })
  },
  onHide: function () {
    // Do something when hide.
    // 退出到后台时清除启动日志
    wx.removeStorage("logs")
  },
  onError: function (msg) {
    console.log(msg)
  },
  /**
   * 全局定义数据
   */
  globalData: {
    id: 0,
    userInfo: null,
    column: [
      { "type": 0, "name": "投票", "title": "发起投票" }, 
      { "type": 1, "name": "活动", "title": "发布活动" },
      { "type": 2, "name": "评分", "title": "晨会评分" }
    ]
  }
})