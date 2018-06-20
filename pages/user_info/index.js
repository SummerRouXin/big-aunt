import util from '../../utils/util.js';
import apis from '../../utils/apis.js';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js';
const app = getApp()

Page({
  data: {
    genderRange: ['女', '男'],
    genderIndex: null,
    sexChoose: true,   //男 false 女 true
    durationRange: util.getNumberArr(1, 14),
    durationIndex: null,
    intervalRange: util.getNumberArr(15, 100),
    intervalIndex: null,
    recentDate: '',
    // recentDate: util.getCurrentDay(),
    startDate: util.getYearFirstDay(),
    hasFinishedSubmit: false,  //是否点过提交按钮  作用是设置提交按钮颜色
    hasSetted: false,   //是否设置过   点击提交按钮和跳过都为true   作用是判断展示my_info   还是setting  /storage
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {} ,   //用户信息
    settingInfo: {}    //用户的设置信息
  },
  onLoad: async function() {
    this.getUserInfo();
    let settingStatus = false;
    try {
      settingStatus = await apis.getSettingStatus('hasSetted');
    } catch(e) {
      console.log('getSettingStatus', e);
    }
    this.setData({
      hasSetted: settingStatus
    })
    if(!!settingStatus) {   //如果设置过，则展示用户信息
      let settingInfo = {};
      try {
        settingInfo = await apis.getSettingInfo('setting_info');
      } catch(e) {
        console.log('getSettingInfo', e)
      }
      this.setData({
        settingInfo,
      })
    } else {    // 没设置过，则展示设置页面  啥都不用做

    }
  },
  bindPickerGenderChange: function(e) {   //TODO: this
    console.log('picker gender ', e.detail.value)
    this.setData({
      genderIndex: e.detail.value,
      sexChoose: e.detail.value == 0 ? true: false
    })
    this.hasFinished();
  },
  bindPickerDurationChange: function(e) {
    console.log('picker duration ', e.detail.value)
    this.setData({
      durationIndex: e.detail.value
    })
    this.hasFinished();
  },
  bindPickerIntervalChange: function(e) {
    console.log('picker interval ', e.detail.value)
    this.setData({
      intervalIndex: e.detail.value
    })
    this.hasFinished();
  },
  bindPickerRecentChange: function(e) {
    console.log('picker recent ', e.detail.value)
    this.setData({
      recentDate: e.detail.value
    })
    this.hasFinished();
  },
  bindSubmitTap: async function(e) {
    const { genderIndex, durationIndex, intervalIndex, recentDate }  = this.data;
    try {
      await apis.submitSettingInfo('setting_info', {genderIndex, durationIndex, intervalIndex, recentDate})
      await apis.submitSettingStatus('hasSetted', true)
    } catch(e) {
      console.log('bindSubmitTap storage', e)
    }
    this.setData({
      hasSetted: true,
    })
    wx.switchTab({
      url: '../calendar/index'
    })
  },
  bindSkipTap: async function(e) {
    this.setData({
      hasSetted: true,
    })
    try {
      await apis.submitSettingStatus('hasSetted', true)
    } catch(e) {
      console.log('submitSettingStatus storage', e)
    }
    wx.switchTab({
      url: '../calendar/index'
    })
  },
  hasFinished: function() {
    if(this.data.genderIndex == "1") {
      this.setData({
        hasFinishedSubmit: true
      })
    } else if(this.data.genderIndex && this.data.durationIndex && this.data.intervalIndex && this.data.recentDate) {
      this.setData({
        hasFinishedSubmit: true
      })
    } else {
      this.setData({
        hasFinishedSubmit: false
      })
    }
  },
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
  }
})
