import util from '../../utils/util.js';
import apis from '../../utils/apis.js';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js';
var common  = require('../common_setting/index.js')

Page({
  data: {
    ...common.data,
  },
  onLoad: async function () {
    await common.initApp.call(this)
    this.hasFinished();
  },
  onShow: async function () {
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
})
