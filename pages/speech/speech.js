//detail.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    standard:[{
      sTitle: "一、演讲内容（35分）",
      sItem: [
        { sText: "1、原创、观点正确，见解独到；", sScore: "15分", sIndex: "0" },
        { sText: "2、半原创、思路清晰，材料真实，反映客观事实；", sScore: "10分", sIndex: "0" },
        { sText: "3、讲稿结构严谨，构思巧妙；", sScore: "5分", sIndex: "0" },
        { sText: "4、文字简练流畅；", sScore: "5分", sIndex: "0"},
      ]}, {
      sTitle: "二、语言表达（35分）",
      sItem: [
        { sText: "1、脱稿演讲，语言规范，吐字清晰，声音洪亮；", sScore: "10分", sIndex: "0" },
        { sText: "2、带稿演讲，表述流畅，准确自然；", sScore: "10分", sIndex: "0" },
        { sText: "3、普通话标准，语言技巧处理得当，语速恰当，语气、语调、节奏张弛符合感情的起伏变化，能熟练表达演讲的内容；", sScore: "15分", sIndex: "0" }
      ]}, {
      sTitle: "三、形象气质（15分）",
      sItem: [
        { sText: "1、精神饱满，能较好的运用手势、表情表达对演讲稿的理解；", sScore: "8分", sIndex: "0" },
        { sText: "2、着正装，自信大方；", sScore: "7分", sIndex: "0" }
      ]}, {
      sTitle: "四、台风效果（10分）",
      sItem: [
        { sText: "1、具有较强的感染力和吸引力，营造良好的演讲效果，并将时间控制的适当的范围内；", sScore: "10分", sIndex: "0" }
      ]}, {
      sTitle: "五、综合印象（5分）",
      sItem: [
        { sText: "1、端庄大方，举止得体，有风度，富有艺术感染力；", sScore: "5分", sIndex: "0" }
      ]}
    ],
    userInfo: {},
    detailSpeech: {},
    detailScores: [],
    id: "",
    order: "",
    scores: 100,
    isSubmit: false,
    isHidden: false
  },
  // 初次加载
  onLoad: function (query) {
    this.setData({
      id: query.id,
      order: query.order,
      userInfo: app.globalData.userInfo,
      shareTitle: '邀请你参与晨会分享评分',
      detailSpeech: (wx.getStorageSync('votes') || [])[query.order],
      detailScores: this.setDetailScores()
    })
  },
  // 设置分数
  setDetailScores: function(){
    const tempArr = this.data.standard.map( (item)=>{
      return item.sItem.map( (it)=>{
        return parseInt(it.sScore)
      } )
    } )
    const toRange = tempArr.map( (item)=>{
      return item.map( (it)=>{
        const toArr = []
        for(let i=it;0<=i;i--){
          toArr.push(i)
        }
        return toArr
      } )
    } )
    return toRange
  },
  // 绑定选择框
  bindPickerChange: function (e) {
    const originStand = this.data.standard
    const eIndex = e.target.dataset.index
    const eInd = e.target.dataset.ind
    const eValue = e.detail.value
    
    originStand[eIndex].sItem[eInd].sIndex = eValue

    const allScore = this.data.detailScores.reduce((total,item,index)=>{
      return total + item.reduce((temp,it,ind)=>{
        return temp + it[originStand[index].sItem[ind].sIndex]
      },0)
    },0)

    this.setData({
      standard: originStand,
      scores: allScore
    })
  },
  // 转发
  onShareAppMessage: function (res) {
    const path = `${util.getCurrentUrl()}?id=${this.data.id}&order=${this.data.order}`
    return {
      title: app.globalData.userInfo.nickName + this.data.shareTitle,
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
  // 提交
  formSubmit: function (e) {
    wx.showLoading({
      title: '提交中',
      mask: 'true'
    })

    // 更新数据
    const detail = this.data.detailSpeech
    const voteScore = this.data.scores
    const temp = { "voteName": app.globalData.userInfo.nickName, "voteScore": voteScore }
    detail.options.push(temp)

    this.countScore(detail)

    const originVote = wx.getStorageSync('votes')
    originVote[this.data.order] = detail

    setTimeout(()=>{
      wx.hideLoading()
      // 将页面滚回顶部
      wx.pageScrollTo({
        scrollTop: 0
      })
      this.setData({
        isHidden: true,
        isSubmit: true,
        detailSpeech: detail
      })
      wx.setStorageSync('votes', originVote)
    },1500)
  },
  // 计算分数
  countScore: function (detail) {
    const rankScore = detail.options.map((item) => { return Number(item.voteScore) })

    const maxScore = Math.max.apply(null, rankScore)

    const minScore = Math.min.apply(null, rankScore)

    const allScore = rankScore.reduce((total, item) => {
      return total + item
    }, 0)

    let averScore = ""
    if (rankScore.length === 2) {
      averScore = (allScore / rankScore.length).toFixed(2)
    } else {
      averScore = ((allScore - maxScore - minScore) / (rankScore.length - 2)).toFixed(2)
    }
    
    detail.score = averScore

    console.log("评分列表", rankScore)
    console.log("最高分：", maxScore)
    console.log("最低分：", minScore)
    console.log("总评分：", allScore)
    console.log("平均分：", averScore)
  }
})
