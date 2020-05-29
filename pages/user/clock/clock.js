// pages/user/clock/clock.js
const api = require('../../../utils/api.js')
const util = require('../../../utils/util.js')
const conf = {
  data: {
    calendarConfig: {
      // 配置内置主题
      theme: 'elegant',
      takeoverTap: true,
      multi: true, // 是否开启多选,
    },
    classDetail: {},//课程详情
    classArr: [],//打卡数据
    clockToDay: true,//是否显示今天打卡
    clockArrOn: [],//已打卡数组
    clockArrOver: [],//已补卡数组
    clockArr: [],//打卡数据
    toSetOn:[],//正常打卡日历
    toSetOver: [],//补卡日历
    toSetNo: [],//待补卡日历
    clockTotal:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onTapDay(e) {
    let y = '0'+e.detail.month
    let d = '0' + e.detail.day
    let currentTime = e.detail.year + '-' + y.slice(y.length - 2, y.length) + '-' + d.slice(d.length - 2, d.length)
    let day = util.dataNum(this.data.classDetail.createTime, currentTime)
    if (day >= this.data.classArr.length || day<0) {
      wx.showToast({
        title: '所选日期没有课程',
        icon:'none'
      })
      return
    }
    let day1 = util.dataNum(this.data.classDetail.nowTime, currentTime)
    if (day1 > 0) {
      return
    }
    let status = 0
    let currentDay = ''
    console.log(currentTime)
    console.log(this.data.clockArrOn)
    console.log(this.data.clockArrOver)
    if (this.data.clockArrOn.indexOf(currentTime) != -1 || this.data.clockArrOver.indexOf(currentTime) != -1){
      this.data.clockArr.forEach(function(item,key){
        if(item.createTime.split(' ')[0] == currentTime){
          currentDay = key
        }
      })
      wx.navigateTo({
        url: '../../detail/detailEnd/detailEnd?answerId=' + this.data.clockArr[currentDay].id + '&doTime=' + day,
      })
    }else{
      if(this.data.clockArrNo.indexOf(currentTime)){
        status = 1
      }
      wx.navigateTo({
        url: '../../detail/detail?classId=' + this.data.classDetail.id + '&doTime=' + day + '&status=' + status + '&currentTime=' + currentTime,
      })
    }
  },
  clockStart(){
    let status = 0
    let currentTime = this.data.classDetail.nowTime
    // if (this.data.clockArrNo.indexOf(currentTime.split(' ')[0])) {
    //   status = 1
    // }
    let day = util.dataNum(this.data.classDetail.createTime, this.data.classDetail.nowTime)
    wx.navigateTo({
      url: '../../detail/detail?classId=' + this.data.classDetail.id + '&doTime=' + day + '&status=' + status + '&currentTime=' + currentTime.split(' ')[0],
    })
  },
  afterCalendarRender(e) {
    this.select()
    this.answerPageList()
  },
  onLoad(options){
    let detail = options.detail
    this.setData({
      classDetail: JSON.parse(detail)
    })
  },
  answerPageList(){
    let th = this
    let data = {
      courseId: this.data.classDetail.id,
      pageIndex: 1,
      pageSize: 100000,
    }
    api.answerPageList(data).then(res => {
      this.setData({
        clockArr:res.response.list,
        clockTotal: res.response.total
      })
      let nowTime = this.data.classDetail.nowTime.split(' ')[0]
      let cArr = this.data.clockArr
      let cArrOn = this.data.clockArrOn
      let cArrOver  = this.data.clockArrOver
      let cArrNo = this.data.clockArrNo
      cArr.forEach(function(item){
        if(item.status == 0){
          cArrOn.push(item.createTime.split(' ')[0])
          th.delitem(cArrNo, item.createTime.split(' ')[0])
        }else if(item.status == 1){
          cArrOver.push(item.createTime.split(' ')[0])
          th.delitem(cArrNo, item.createTime.split(' ')[0])
        }
      })
      if (this.data.clockArrOn.indexOf(nowTime) != -1 || this.data.clockArrOver.indexOf(nowTime) != -1) {
        this.setData({
          clockToDay: false
        })
      }
      this.clockSet(this.data.toSetOn, cArrOn,'success_calendar')
      this.clockSet(this.data.toSetNo, cArrNo,'success_calendar1')
      this.clockSet(this.data.toSetOver, cArrOver,'error_calendar')
      this.calendar.setDateStyle(this.data.toSetNo);
      this.calendar.setDateStyle(this.data.toSetOn);
      this.calendar.setDateStyle(this.data.toSetOver);
    }).catch(res =>{

    })
  },
  clockSet(newArr,oldArr,clsa){
    oldArr.forEach(function(item){
      newArr.push({
        'year': item.split('-')[0],
        'month': item.split('-')[1].replace(/\b(0+)/gi,""),
        'day': item.split('-')[2].replace(/\b(0+)/gi, ""),
        'class':clsa
      })
    })
  },
  delitem(arr,text){
    for(let i = 0; i < arr.length; i++) {
      if (text == arr[i]) {
        arr.splice(i, 1);
        return false;
      }
    }
  },
  select() {
    api.select({id: this.data.classDetail.id}).then(res => {
      if(res.code == 1){
        this.setData({
          classArr:res.response.titleItems
        })
        let day = util.dataNum(this.data.classDetail.createTime, this.data.classDetail.nowTime)
        if(day > this.data.classArr.length){
          this.setData({
            clockToDay:false
          })
        }
        this.data.clockArrNo = util.getTimes(this.data.classDetail.createTime, this.data.classDetail.nowTime, this.data.classArr.length)
      }else{
        wx.showToast({
          title: res.message,
        })
      }
    }).catch(res => {

    })
  }
}
Page(conf);