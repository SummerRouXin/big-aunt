import util from '../../utils/util.js';
import apis from '../../utils/apis.js';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js';

Page({
  data: {
    hasSetted: false,
    durationRange: util.getNumberArr(1, 14), // 持续时间
    intervalRange: util.getNumberArr(19, 100), // 间隔时间
    whoseSetting: "my_setting_info", // 是“我自己”或者“别人”的设置
    whoseHasSetted: "my_has_setted", // hasSetted字段是“我自己”或者“别人”
  },
  onLoad: async function () {
    let settingStatus = false;
    try {
      settingStatus = await apis.getSettingStatus(this.data.whoseHasSetted);
    } catch (e) {
      console.log("getSettingStatus", e);
    }
    this.setData({
      hasSetted: settingStatus
    });
  },
  onShow: async function () {
    const component = this.selectComponent("#calendar");
    component && component.getinitApp();
  },
  changeSetted: function (e) {
    const { hasSetted } = e.detail;
    this.setData({
      hasSetted,
    });
  },
  onShareAppMessage: function () {
    return {
      title: '',
      path: '',
    };
  }
});
