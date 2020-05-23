// pages/detail/detail.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classDetail:{},//题目
    classNum:0,//第几题
    answerArrT: [],//答案
    videoState:false,//视频是否显示
    classId:'',//课程id
    doTime:'',//第几天
    status:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      classDetail: JSON.parse(options.detail),
      classId: options.classId,
      doTime: options.doTime,
      status:options.status,
      currentTime: options.currentTime,
    })
  },
  radioChange(e){
    let answerArrT = this.data.answerArrT
    answerArrT.push(e.detail.value)
    this.setData({
      answerArrT: answerArrT
    })
  },
  current(){
    let th = this
    this.setData({
      videoState: false
    })
    if (this.data.classNum + 1 == this.data.classDetail.questionItems.length) {
      let data = {
        id: this.data.classId,
        doTime:this.data.doTime,
        status:this.data.status,
        cardTime:this.data.currentTime+' 00:00:00'
      }
      let an = this.data.answerArrT
      an.forEach(function(item,index){
        console.log(th.data.classDetail.questionItems)
        console.log(th.data.classDetail.questionItems[index])
        let key = index+1 + '_' + th.data.classDetail.questionItems[index].id + '_1'
        data[key] = item
      })
      api.answerSubmit(data).then(res =>{
        if(res.code == 1){
          wx.navigateTo({
            url: 'detailEnd/detailEnd?answerId=' + JSON.stringify(res.response) + '&doTime=' + this.data.doTime,
          })
        }else{
          wx.showToast({
            title: '提交失败',
          })
        }
      }).catch(res =>{

      })
     
    } else {
      this.setData({
        classNum: this.data.classNum + 1
      })
    }
  },
  next(){
    if (!this.data.answerArrT[this.data.classNum]){
      wx.showToast({
        title: '请选择答案',
        icon:'none'
      })
      return
    }
    this.setData({
      videoState:true
    })
  }
})