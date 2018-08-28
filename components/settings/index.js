/**
 * 设置模块
**/

import util from '../../utils/util.js';
import apis from '../../utils/apis.js';
import { startDate } from '../../utils/const.js';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js';

Component({
  // 组件的对外属性
  properties: {
    hasSetted: Boolean,  // 是否设置过   点击提交按钮和跳过都为true   作用是判断展示my_info   还是setting  /storage
    durationRange: Array,
    intervalRange: Array,
    whoseSetting: String,   // 是“我自己”或者“别人”的设置
    whoseHasSetted: String,  // hasSetted字段是“我自己”或者“别人”
  },
  // 组件的内部数据
  data: {
    genderRange: ['女', '男'],
    genderIndex: null,
    sexChoose: true,   // 男 false 女 true
    // durationRange: util.getNumberArr(1, 14),   // 持续时间
    durationIndex: null,
    // intervalRange: util.getNumberArr(19, 100),    // 间隔时间
    intervalIndex: null,
    recentDate: '',
    startDate: startDate,
    endDate: util.getCurrentDay(),
    hasFinishedSubmit: false,  // 是否点过提交按钮  作用是设置提交按钮颜色
  },
  // 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
  async ready() {
    await this.initApp();
  },

  // 组件的方法
  methods: {
    initApp: async function() {
      const { whoseSetting } = this.data;
        let settingInfo = {};
        try {
          settingInfo = await apis.getSettingInfo(whoseSetting);
        } catch(e) {
          console.log('getSettingInfo', e)
        }
        this.setData({
          genderIndex: settingInfo.genderIndex || null,
          durationIndex: settingInfo.durationIndex || null,
          intervalIndex: settingInfo.intervalIndex || null,
          recentDate: settingInfo.recentDate || '',
        });
        this.hasFinished();
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
      const {
        hasFinishedSubmit,
        genderIndex,
        durationIndex,
        intervalIndex,
        recentDate,
        whoseSetting,
        whoseHasSetted,
      }  = this.data;
      if(hasFinishedSubmit) {
        try {
          await apis.submitSettingInfo(whoseSetting, {
            genderIndex,
            durationIndex,
            intervalIndex,
            recentDate
          });
          await apis.submitSettingStatus(whoseHasSetted, true);
        } catch(e) {
          console.log('bindSubmitTap storage', e)
        }
        this.setData({
          hasSetted: true,
        });
        this.triggerEvent('changesetted', { hasSetted: true });
      } else {
        wx.showToast({
          title: '信息要填完整才能计算准确哦',
          icon: 'none',
          duration: 2000,
        })
      }
    },
    bindSkipTap: async function(e) {
      this.setData({
        hasSetted: true,
      })
      try {
        await apis.submitSettingStatus(this.data.whoseHasSetted, true);
      } catch(e) {
        console.log('submitSettingStatus storage', e);
      }
      this.setData({
        hasSetted: true,
      });
      this.triggerEvent('changesetted', { hasSetted: true });
    },
    hasFinished: function() {
      const {
        genderIndex,
        durationIndex,
        intervalIndex,
        recentDate
      } = this.data;
      if(genderIndex == "1") {
        this.setData({
          hasFinishedSubmit: true
        })
      } else if(genderIndex && durationIndex && intervalIndex && recentDate) {
        this.setData({
          hasFinishedSubmit: true
        })
      } else {
        this.setData({
          hasFinishedSubmit: false
        })
      }
    },
  },
})
