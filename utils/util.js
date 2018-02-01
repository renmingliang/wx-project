// 获取2017-12-16 17：33：21
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 获取日期，默认 T+1 ;参数options: { limit: 限定天 }
const pickerDate = options => {
  var date = new Date()
  options = options || {}
  options.limit = options.limit || 0
  date.setDate(date.getDate() + options.limit)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

// 获取时间(不含秒) 17：33
const pickerTime = () => {
  const date = new Date()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}

// 获取当前页面路径
const getCurrentUrl = () => {
  const pages = getCurrentPages()   //获取当前页面的对象
  const currentPage = pages[pages.length - 1]    //获取当前页面的对象
  const url = currentPage.route    //当前页面url
  return "/"+url
}

// 转化个位数字 => 十位数字，前置补0
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  getCurrentUrl: getCurrentUrl,
  formatTime: formatTime,
  pickerDate: pickerDate,
  pickerTime: pickerTime
}
