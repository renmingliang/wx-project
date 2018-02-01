//获取应用实例
const app = getApp()
//post.js
const util = require('../../utils/util.js')

Page({
  data: {
    type: "",
    name: "",
    descCount: "0/100",
    userInfo: {},
    isDisabled: true,
    isShow: false,
    barTitle: "",
    voteTitle: "标题",
    options: [{ "holder": "选项" }, { "holder": "选项"}],
    date: util.pickerDate(),
    limitDate: util.pickerDate({"limit": 1}),
    limitTime: util.pickerTime()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    if (query.type ){
      this.setData({
        type: query.type,
        name: app.globalData.column[query.type].name,
        userInfo: app.globalData.userInfo,
        barTitle: app.globalData.column[query.type].title,
        voteTitle: app.globalData.column[query.type].name+"标题"
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.setNavigationBarTitle({ title: this.data.barTitle })
  },
  // 向后插入数据
  addOption(e) {
    this.setData({
      options: this.data.options.concat([{ "holder":"选项"}])
    })
  },
  // 删除数据
  delOption(e) {
    // 至少保留两项数据
    if (this.data.options.length <= 2) { return false }
    const dataSet = e.target.dataset
    const Index = dataSet.index
    this.data.options.splice(Index,1)
    this.setData({
      options: this.data.options
    })
  },
  moreOption: function(e){
    this.setData({
      isShow: !this.data.isShow
    })
  },
  // 选择日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 选择截止日期
  bindLimitDateChange: function (e) {
    this.setData({
      limitDate: e.detail.value
    })
  },
  // 选择截止时间
  bindLimitTimeChange: function (e) {
    this.setData({
      limitTime: e.detail.value
    })
  },
  // 是否输入标题
  bindVoteTitle: function (e) {
    this.setData({
      isDisabled: !e.detail.cursor
    })
  },
  // 限定输入字数
  bindDescInput: function(e){
    if (e.detail.cursor > 100) {
      this.setData({
        descCount: "100/100"
      })
      return e.detail.value.substr(0, 100)
    }else{
      this.setData({
        descCount: e.detail.cursor + "/100"
      })
    }
  },
  // 提交
  formSubmit: function(e) {
    this.checkInput(e.detail.value)
  },
  // 重置
  formReset: function() {
    console.log('form发生了reset事件')
    this.setData({
      isDisabled: true
    })
  },
  checkInput: function(value){
    let nextUrl = "detail/detail"
    if(this.data.type != 2){
      value.options = this.data.options.map(
        (item, index) => { return { "value": value[`option-${index}`], "count": 0, "checked": false } }
      )
    }else{
      value.options = []
      nextUrl = "speech/speech"
    }

    // 展示本地存储能力
    const vote = wx.getStorageSync('votes') || []
    value.nextUrl = nextUrl
    value.id = vote[0] ? (vote[0].id + 1) : 0
    vote.unshift(value)
    wx.setStorageSync('votes', vote)
    console.log(vote)

    wx.showLoading({
      title: 'Loading',
      mask: 'true'
    })

    setTimeout(()=>{
      wx.hideLoading()
      // 此路由跳转不会入栈浏览history
      wx.redirectTo ({
        url: `/pages/${value.nextUrl}?id=${value.id}&order=0`,
      })
    },2000)
  }
})
