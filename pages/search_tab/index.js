import util from '../../utils/util.js';

Page({
  data: {
    hasSetted: false,
    durationRange: util.getNumberArr(1, 14), // 持续时间
    intervalRange: util.getNumberArr(19, 100), // 间隔时间
    whoseSetting: "others_setting_info", // 是“我自己”或者“别人”的设置
    whoseHasSetted: "others_has_setted", // hasSetted字段是“我自己”或者“别人”
    hasShowBackBtn: true,  // 是否展示返回按钮
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
