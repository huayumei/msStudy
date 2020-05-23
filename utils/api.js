
// 小程序开发api接口统一配置
const API_BASE_URL = 'https://www.343fblood.cn/ecm'  // 域名
const app = getApp()
const request = (url, method, data) => {
  let _url = API_BASE_URL + url
  return new Promise((resolve, reject) => {
    let token = wx.getStorageSync('token')
    let header = {}
    if(token){
      header = {
        'content-type': 'application/x-www-form-urlencoded',
        'token':token
      }
    }else{
      header = {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: header,
      success(request) {
        if (request.data.code == 400){
          let openId = wx.getStorageSync('openId')
          request('/api/wx/student/auth/bind', 'POST', {
            userName: openId,
            password: openId
          }).then(res => {
            wx.setStorageSync('token', res.response)
            wx.setStorageSync('openId', openId)
          }).catch(res => {

          })
        }
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

module.exports = {
  request,
  // 检查用户是否绑定
  register: data => request('/api/wx/student/user/register', 'POST', data),
  // 用户绑定
  bind: (data) => request('/api/wx/student/auth/bind', 'POST', data),
  // 获取openid
  getOpenId: (data) => request('/api/wx/student/auth/getOpenId', 'POST', data),
  // 用户解绑
  unBind: (data) => request('/api/wx/student/auth/unBind', 'POST', data),
  // 用户答题列表
  pageList: (data) => request('/api/wx/student/exampaper/pageList', 'POST', data),
  //课程详情
  select: (data) => request('/api/wx/student/exampaper/select/'+data.id, 'POST'),
  //提交答案
  answerSubmit: (data) => request('/api/wx/student/exampaper/answer/answerSubmit', 'POST',data),
  //打卡记录列表（答题记录）
  answerPageList: (data) => request('/api/wx/student/exampaper/answer/pageList', 'POST', data),
  //答题详情
  readSelect: (data) => request('/api/wx/student/exampaper/answer/read/' + data.id, 'POST'),
  
}
