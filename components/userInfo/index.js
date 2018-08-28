/**
 * 个人信息模块
**/

import util from '../../utils/util.js';
import apis from '../../utils/apis.js';
import { startDate } from '../../utils/const.js';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js';

Component({
  // 组件的对外属性
  properties: {
    hasSetted: Boolean, // 是否设置过   点击提交按钮和跳过都为true   作用是判断展示my_info   还是setting  /storage
    durationRange: Array,
    intervalRange: Array,
    whoseSetting: String, // 是“我自己”或者“别人”的设置
    whoseHasSetted: String // hasSetted字段是“我自己”或者“别人”
  },
  // 组件的内部数据
  data: {
    // canIUse: wx.canIUse("button.open-type.getUserInfo"),
    // userInfo: {}, //用户信息
    settingInfo: {}, //用户的设置信息
    durationIndex: null,
    intervalIndex: null
  },
  // 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
  async ready() {
    await this.getinitApp();
  },

  // 组件的方法
  methods: {
    getinitApp: async function() {
      const { whoseSetting } = this.data;
      let settingInfo = {};
      try {
        settingInfo = await apis.getSettingInfo(whoseSetting);
      } catch (e) {
        console.log("getSettingInfo", e);
      }
      this.setData({
        durationIndex: settingInfo.durationIndex || null,
        intervalIndex: settingInfo.intervalIndex || null
      });
      // this.getUserInfo();
    },
    // getUserInfo: function() {
    //   wx.getSetting({
    //     success: res => {
    //       if (res.authSetting["scope.userInfo"]) {
    //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //         wx.getUserInfo({
    //           success: res => {
    //             console.log("userInfo: ", res.userInfo);
    //             this.setData({
    //               userInfo: res.userInfo
    //             });
    //           }
    //         });
    //       } else {
    //         console.log("xxxx");
    //       }
    //     },
    //     fail: () => {
    //       console.log("fail");
    //     }
    //   });
    // },
    // bindGetUserInfo: function(e) {
    //   this.setData({
    //     userInfo: e.detail.userInfo || {}
    //   });
    // },
    bindGoToSetting: function() {
      this.setData({
        hasSetted: false
      });
      this.triggerEvent("changesetted", { hasSetted: false });
    }
  }
});
