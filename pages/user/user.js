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
    let user = wx.getStorageSync('userInfo')
    if (user) {
      this.setData({
        user: user
      })
      this.pageList()
    } else {
      wx.navigateTo({
        url: '../index/index',
      })
    }
  },
  bindClass(){
    this.setData({
      bindState:true
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
  },
  bindInput(e){
    let key = e.currentTarget.dataset.value
    this.setData({
      [key]:e.detail.value
    })
  },
  current(){
    if(!this.data.tel){
      wx.showToast({
        title: '请输入手机号',
        icon:'none'
      })
      return
    }
    if (!this.data.password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }
    this.setData({
      bindState:false
    })
    let data = {
      tel:this.data.tel,
      password:this.data.password
    }
    this.register()
  },
  register(){
    let openId = wx.getStorageSync('openId')
    let data = {
      phone: this.data.user.phone,
      userName: openId,
      password: openId,
      sex: this.data.user.gender,
      imagePath: this.data.user.avatarUrl,
      realName: this.data.user.nickName,
      userLevel: 1,
      wxOpenId: openId
    }
    api.register(data).then(res => {
      if (res.code == 2 || res.code == 1) {
        this.pageList()
      }
    }).catch(res => {

    })
  }
})