// pages/user/user.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArr: [],
    user:{},//用户信息
    userState:true,
    bindState:false,//绑定课程
    tel:'',
    password:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow(){
    let th = this
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res.data)
        if (res.data) {
          th.setData({
            user: res.data
          })
          th.pageList()
          console.log(11)
        } else {
          wx.navigateTo({
            url: '../index/index',
          })
        }
      },
    })
  },
  pageList() {
    let data = {
      paperType: 1,
      pageIndex: 1,
      pageSize: 10,
      isBuy: 1,     //代表查询课程列表   1代表查询已购买的课程列表
    }
    api.pageList(data).then(res => {
      let listArr = res.response.list
      listArr.forEach(function (item) {
        item.courseImage = item.courseImage.replace(/\<img/gi, '<img style="width:100%;height:100%" ')
      })
      this.setData({
        listArr: listArr
      })
    }).catch(res => {

    })
  },
  detail(e){
    let data = {
      id: e.currentTarget.dataset.detail.id,
      createTime: e.currentTarget.dataset.detail.createTime,
      nowTime: e.currentTarget.dataset.detail.nowTime,
    }
    wx.navigateTo({
      url: 'clock/clock?detail=' + JSON.stringify(data)
    })
  }
})