// pages/index/index.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    phoneState:false,//
    openId:'',
    sessionK:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token')
    let phone = wx.getStorageSync('phone')
    if(token){
      wx.switchTab({
        url: '../class/class',
      })
      return
    }
    let userInfo = wx.getStorageSync('userInfo')
    let openId = wx.getStorageSync('openId')
    this.setData({
      userInfo: userInfo,
      openId: openId
    })
    if(phone){
      this.register(phone)
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                userInfo: res.userInfo,
                phoneState: true,
              })
              wx.setStorageSync('userInfo', res.userInfo)
            }
          })
        } else {

        }
      }
    })
  },
  getuserinfo(e){
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.setData({
        userInfo: e.detail.userInfo,
        phoneState: true,
      })
    } else {
      //用户按了拒绝按钮
    }
    
  },
  getPhoneNumber(e){
    let th = this
    if (e.detail.errMsg == 'getPhoneNumber:fail') {
      th.showToast_fail('未获取到手机号码');
      return false;
    } else if (e.detail.iv == undefined || !e.detail.iv) {
      th.showToast_fail('授权失败');
      return false;
    } else {
      th.login(e.detail.iv, e.detail.encryptedData)
    }
  },
  login(iv,eData){
    let th = this
    let userInfo = this.data.userInfo
    wx.login({
      success: res => {
        api.getOpenId({ code: res.code }).then(res => {
          if (res.code == 1) {
            this.setData({
              sessionK: res.response.session_key,
              openId: res.response.openId,
            })
            api.deciphering({
              encryptedData: eData,
              iv: iv,
              session_key: th.data.sessionK,
              pageIndex: 0,
              pageSize: 10,
            }).then(res => {
              if (res.code = 1) {
                wx.setStorageSync('phone', res.response)
                this.register(res.response)
              }
            }).catch(res => {

            })
          }
        }).catch(res => {

        })
      }
    })
  },
  register(phone){
    let th = this
    let data = {
      phone: phone,
      userName: this.data.openId,
      password: this.data.openId,
      sex: this.data.userInfo.gender,
      imagePath: this.data.userInfo.avatarUrl,
      realName: this.data.userInfo.nickName,
      userLevel: 1,
      wxOpenId: this.data.openId
    }
    api.register(data).then(res => {
      if (res.code == 2 || res.code == 1) {
        api.bind({
          userName: this.data.openId,
          password: this.data.openId
        }
        ).then(res => {
          if(res.code == 1){
            wx.setStorageSync('token', res.response)
            wx.setStorageSync('openId', th.data.openId)
            th.setData({
              phoneState: false
            })
            wx.switchTab({
              url: '../class/class',
            })
          }
        }).catch(res => {

        })
      }
    }).catch(res => {

    })
  }
})