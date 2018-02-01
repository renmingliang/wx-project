//detail.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    id: "",
    order: "",
    select: "",
    isSubmit: false,
    isDisabled: true,
    isHidden: false,
    userInfo: {},
    detailVote: {}
  },
  onLoad: function (query) {
    this.setData({
      id: query.id,
      order: query.order,
      userInfo: app.globalData.userInfo,
      detailVote: (wx.getStorageSync('votes') || [])[query.order],
      shareTitle: '邀请你参与Vote助手'
    })
  },
  // 转发
  onShareAppMessage: function (res) {
    const path = `${util.getCurrentUrl()}?id=${this.data.id}&order=${this.data.order}`
    return {
      title: app.globalData.userInfo.nickName + this.data.shareTitle + this.data.detailVote.name,
      path: path,
      success: function (res) {
        // 转发成功
        console.log(res.errMsg)
        wx.showToast({
          title: "成功",
        })
      }
    }
  },
  // 是否选择
  checkSelect: function (e) {
    const select = e.detail.value
    const detail = this.data.detailVote
    detail.options.map((item, index)=>{
      if (select.indexOf(index + "") != -1) {
        detail.options[index].checked = true;
      } else {
        detail.options[index].checked = false;
      }
    })
    this.setData({
      isDisabled: !e.detail.value.length,
      detailVote: detail
    })
  },
  // 提交
  formSubmit: function (e) {
    wx.showLoading({
      title: '提交中'
    })
    // 提交数据
    const select = e.detail.value.options
    const detail = this.data.detailVote
    detail.options.map((item, index) => {
      item.checked = false
      if (select.indexOf(index + "") != -1) {
        detail.options[index].count += 1;
      }
    })

    // 更新数据
    const originVote = wx.getStorageSync('votes')
    originVote[this.data.order] = detail
    
    setTimeout(()=>{
      wx.hideLoading()
      this.setData({
        isHidden: true,
        isSubmit: true,
        detailVote: detail
      })
      wx.setStorageSync('votes', originVote)
    },1500)
  }
})
