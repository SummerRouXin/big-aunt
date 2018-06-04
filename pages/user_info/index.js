var util = require('../../utils/util.js');    //TODO:
const app = getApp()

Page({
  data: {
    genderRange: ['女', '男'],
    genderIndex: 0,
    durationRange: util.getNumberArr(1, 14),
    durationIndex: 4,
    intervalRange: util.getNumberArr(15, 100),
    intervalIndex: 15,
    recentDate: util.getCurrentDay(),
    startDate: util.getYearFirstDay(),
  },
  bindPickerGenderChange: function(e) {   //TODO: this
    console.log('picker gender ', e.detail.value)
    this.setData({
      genderIndex: e.detail.value
    })
  },
  bindPickerDurationChange: function(e) {
    console.log('picker duration ', e.detail.value)
    this.setData({
      durationIndex: e.detail.value
    })
  },
  bindPickerIntervalChange: function(e) {
    console.log('picker interval ', e.detail.value)
    this.setData({
      intervalIndex: e.detail.value
    })
  },
  bindPickerRecentChange: function(e) {
    console.log('picker recent ', e.detail.value)
    this.setData({
      recentDate: e.detail.value
    })
  },

})
