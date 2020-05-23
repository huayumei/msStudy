const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime1 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const dataNum = (start,end) =>{
  let startTime = new Date(start.split(' ')[0].replace(/-/g, "/")), endTime = new Date(end.split(' ')[0].replace(/-/g, "/"));
  let day = parseInt((endTime.getTime()-startTime.getTime())/(1000*60*60*24))
  return day
}

const getTimes = (time, day) => {
  let timeArr = []
  for (var i = 0; i < day;i++){
    let startTime = new Date(time.split(' ')[0].replace(/-/g, "/"))
    let day = startTime.getTime() + i * (1000 * 60 * 60 * 24)
    timeArr.push(formatTime1(new Date(day)))
  }
  return timeArr
}

module.exports = {
  formatTime: formatTime,
  dataNum:dataNum,
  getTimes: getTimes,
}
