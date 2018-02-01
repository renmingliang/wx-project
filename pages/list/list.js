//list.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    vote: [],
    hasMore: true,
    isChange: true,
    userInfo: {}
  },
  // 监听页面加载
  onLoad: function () {
    this.setData({
      vote: this.setRank(),
      userInfo: app.globalData.userInfo
    })
  },
  // 监听页面显示，比较前后数据是否一致
  onShow: function () {
    const lastList = this.data.vote.length
    const newList = wx.getStorageSync('votes').length
    if(lastList != newList){
      wx.showLoading({
        title: 'Loading',
        mask: true
      })
      this.loadMore()
    }
  },
  // 开启下拉刷新,需要在app.json中开启
  onPullDownRefresh: function(){
    this.setData({
      hasMore: true
    })
    this.loadMore()
  },
  // 加载更多
  loadMore: function(){
    if (!this.data.hasMore) return
    // 开启导航条加载动画
    wx.showNavigationBarLoading()
    setTimeout(()=>{
      // 如果页面显示
      if (this.data.isChange) {
        wx.hideLoading()
      }
      this.setData({
        vote: this.setRank(),
        userInfo: app.globalData.userInfo
      })
      // 关闭导航条加载动画
      wx.hideNavigationBarLoading()
      // 停止当前页面下拉刷新
      wx.stopPullDownRefresh()
    },1500)
  },
  // 长按删除
  deleteVote: function(e){
    const order = e.target.dataset.order
    wx.showActionSheet({
      itemList: ["删除"],
      success: (res)=> {
        // 更新数据
        const originVote = wx.getStorageSync('votes')
        originVote.splice(order, 1)
        this.setData({
          vote: originVote
        })
        wx.setStorageSync('votes', originVote)
      }
    })
  },
  // 排名
  setRank: function () {
    let index = 0
    const data = wx.getStorageSync('votes') || []
    const rank = data.sort(
      (a, b) => { return b.score - a.score }
    )

    rank.map((item)=>{
      if(item.score){
        index++
        return item.rank = index
      }
    })
    wx.setStorageSync('votes', rank)
    return rank
  }
})
