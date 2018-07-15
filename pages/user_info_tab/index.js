import util from '../../utils/util.js';
import apis from '../../utils/apis.js';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js';

Page({
  data: {
    ...common.data,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {} ,   //用户信息
    settingInfo: {}    //用户的设置信息
  },
  onLoad: async function() {
    this.getUserInfo();
    await common.initApp.call(this)
    this.hasFinished();
  },
  onShow: async function() {
    this.getUserInfo();
    await common.initApp.call(this)
    this.hasFinished();
  },
  bindPickerGenderChange: common.bindPickerGenderChange,
  bindPickerDurationChange: common.bindPickerDurationChange,
  bindPickerIntervalChange: common.bindPickerIntervalChange,
  bindPickerRecentChange: common.bindPickerRecentChange,
  bindSubmitTap: common.bindSubmitTap,
  bindSkipTap: common.bindSkipTap,
  hasFinished: common.hasFinished,

  getUserInfo: function() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: (res) => {
              console.log('userInfo: ', res.userInfo)
              this.setData({
                userInfo: res.userInfo
              })
            }
          })
        } else {
          console.log('xxxx')
        }
      },
      fail: () => {
        console.log('fail')
      }
    })
  },
  bindGetUserInfo: function(e) {
    this.setData({
      userInfo: e.detail.userInfo || {}
    })
  },
  bindGoToSetting: function(e) {
    this.setData({
      hasSetted: false
    })
  },
  bindMarkAuntMonthly: function(e) {

  },
  bindClearStorage: function(e) {
    wx.clearStorage()
  }
})
