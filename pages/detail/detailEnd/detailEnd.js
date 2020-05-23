// pages/detail/detailEnd/detailEnd.js
const api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu:[],//题目
    answer:[],//用户答案
    answerStateArr:[],//答案对错数组
    answerSuccess:0,//答对数量
    answerId:'',//答题记录id
    doTime:'',//第几天答题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      answerId: JSON.parse(options.answerId),
      doTime: JSON.parse(options.doTime)
    })
    this.readSelect()
  },
  goIndex(){
    wx.switchTab({
      url: '../../class/class',
    })
  },
  readSelect(){
    let th = this
    api.readSelect({ id: this.data.answerId}).then(res=>{
      if(res.code == 1){
        this.setData({
          answer: res.response.answer.answerItems,
          menu: res.response.paper.titleItems[this.data.doTime].questionItems,
        })
        console.log(this.data.answer)
        console.log(this.data.menu)
        let answerS = 0
        let answerSArr = []
        let answerArr = this.data.answer
        answerArr.forEach(function (item, index) {
          console.log(item.content+',,'+th.data.menu[index].correct)
          if (item.content == th.data.menu[index].correct) {
            answerS++
            answerSArr.push('true')
          } else {
            answerSArr.push('false')
          }
        })
        console.log(answerS)
        console.log(answerSArr)
        this.setData({
          answerSuccess: answerS,
          answerStateArr: answerSArr,
        })
      }
    }).catch(res=>{

    })
  }
})