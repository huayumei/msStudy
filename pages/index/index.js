// pages/index/index.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    phoneState:false,//
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token')
    if(token){
      wx.switchTab({
        url: '../class/class',
      })
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
    this.setData({
      userInfo: e.detail.userInfo,
      phoneState:true,
    })
  },
  getPhoneNumber(e){
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)
    let userInfo = this.data.userInfo
    userInfo.phone = '18702198126'
    this.login()
  },
  login(){
    wx.login({
      success: res => {
        api.getOpenId({ code: res.code }).then(res => {
          if (res.code == 1) {
            let openId = res.response
            let data = {
              phone: this.data.userInfo.phone,
              userName: openId,
              password: openId,
              sex: this.data.userInfo.gender,
              imagePath: this.data.userInfo.avatarUrl,
              realName: this.data.userInfo.nickName,
              userLevel: 1,
              wxOpenId: openId
            }
            api.register(data).then(res => {
              if (res.code == 2 || res.code == 1) {
                api.bind({
                  userName: openId,
                  password: openId
                }
                ).then(res => {
                  wx.setStorageSync('token', res.response)
                  wx.setStorageSync('openId', openId)
                  th.setData({
                    phoneState:false
                  })
                  wx.switchTab({
                    url: '../class/class',
                  })
                }).catch(res => {

                })
              }
            }).catch(res => {

            })
          }
        }).catch(res => {

        })
      }
    })
  }
})