// pages/class/class.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArr:[],//课程列表
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    searchPageNum:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.pageList(this.data.searchPageNum)
  },
  pageList(page){
    let th = this
    let data = {
      paperType: 1,
      pageIndex: page,
      pageSize: 10,
      isBuy: 0,     //代表查询课程列表   1代表查询已购买的课程列表
    }
    api.pageList(data).then(res =>{
      if(res.code == 1){
        if (res.response.size != 0){
          let listArr = []
          if (res.response.isFirstPage){
            listArr = res.response.list
          }else{
            listArr = listArr.concat(th.data.listArr, res.response.list)
          }
          listArr.forEach(function(item){
            if (item.courseImage){
              item.courseImage = item.courseImage.replace(/\<img/gi, '<img style="width:100%;height:100%" ')
            }
          })
          th.setData({
            listArr: listArr
          })
        }
        if (!res.response.isLastPage) {
          th.setData({
            searchLoading: true
          })
        } else {
          th.setData({
            searchLoading: false,
            searchLoadingComplete: true,
          })
        }
      }
    }).catch(res => {

    })
  },
  detail(e){
    wx.navigateTo({
      url: 'detail/detail?classId=' + e.currentTarget.dataset.detail.id
    })
  },
  searchScrollLower() {
    let th = this;
    if (th.data.searchLoading && !th.data.searchLoadingComplete) {
      th.setData({
        searchPageNum: th.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
      });
      th.pageList(th.data.searchPageNum);
    }
  }  
})