// pages/class/detail/detail.js
const api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classDetail: {},//课程详情
    classId:'',//课程id
    userState:false,//
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      classId: options.classId
    })
    this.select()
  },
  select(){
    api.select({ id: this.data.classId }).then(res => {
      if(res.code == 1){
        res.response.courseImage = res.response.courseImage.replace(/\<img/gi, '<img style="width:100%;height:100%" ')
        this.setData({
          classDetail:res.response
        })
      }else{
        wx.showToast({
          title: res.message,
          icon:'none'
        })
      }
    }).catch(res=>{

    })
  },
  payClass(){
    this.setData({
      userState:true
    })
  },
  current(){
    this.setData({
      userState: false
    })
  }
})