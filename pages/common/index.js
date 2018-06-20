import util from '../../utils/util.js';
import apis from '../../utils/apis.js';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js';

const conf = {
  data: {
    genderRange: ['女', '男'],
    genderIndex: null,
    sexChoose: true,   //男 false 女 true
    durationRange: util.getNumberArr(1, 14),
    durationIndex: null,
    intervalRange: util.getNumberArr(15, 100),
    intervalIndex: null,
    recentDate: '',
    startDate: util.getYearFirstDay(),
    hasFinishedSubmit: false,  //是否点过提交按钮  作用是设置提交按钮颜色
    hasSetted: false,   //是否设置过   点击提交按钮和跳过都为true   作用是判断展示my_info   还是setting  /storage
  },
  onLoad: async function() {

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
}


module.exports = conf
