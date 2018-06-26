import util from './util.js';

module.exports = {
  getCalendarInitData: (key) => {    //获取日历页面初始信息
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: function(res) {
          resolve(res.data)
        },
        fail: function(e) {
          console.log('getCalendarInitData fail', e)
          resolve([])
        }
      })
    })
  },
  submitSettingInfo: (key, value) => {       //提交setting页面的信息
    wx.setStorage({
      key: key,
      data: util.jsonStringify(value),
      success: () => {
        console.log('submitSettingInfo success')
      },
      fail: (e) => {
        console.log('submitSettingInfo fail', e)
      }
    })
  },
  getSettingInfo: (key) => {    //获取setting信息
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: function(res) {
          resolve(util.jsonParse(res.data))
        },
        fail: function(e) {
          console.log('getSettingInfo fail', e)
          resolve({})
        }
      })
    })
  },
  submitTips: (key, value) => {        //提交备注信息
    wx.setStorage({
      key: key,
      data: util.jsonStringify(value),
      success: () => {
        console.log('submitTips success')
      },
      fail: (e) => {
        console.log('submitTips fail', e)
      }
    })
  },
  sendSwitchStatus: (key, value) => {     //提交开关状态
    wx.setStorage({
      key: key,
      data: value,
      success: () => {
        console.log('sendSwitchStatus success')
      },
      fail: (e) => {
        console.log('sendSwitchStatus fail', e)
      }
    })
  },
  getDayContent: (key) => {      //点击日历上的日期，获取对应日期的状态和内容
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: function(res) {
          resolve(util.jsonParse(res.data))
        },
        fail: function(e) {
          console.log('getDayContent fail', e)
          resolve([])
        }
      })
    })
  },
  submitSettingStatus: (key, value) => {    //提交hasSetted状态信息
    wx.setStorage({
      key: key,
      data: value,
      success: () => {
        console.log('submitSettingStatus success')
      },
      fail: (e) => {
        console.log('submitSettingStatus fail', e)
      }
    })
  },
  getSettingStatus: (key) => {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: function(res) {
          resolve(res.data)
        },
        fail: function(e) {
          console.log('getSettingStatus fail', e)
          resolve(false)
        }
      })
    })
  },

}
