import util from '../../utils/util.js';
import apis from '../../utils/apis.js';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js';
var common  = require('../common/index.js')
console.log('----', common)
Page({
  data: common.data,
  onLoad: async function () {
    let settingInfo = {};
    try {
      settingInfo = await apis.getSettingInfo('setting_info');
    } catch(e) {
      console.log('getSettingInfo', e)
    }
    const { genderIndex, durationIndex, intervalIndex, recentDate } = settingInfo || {};

  },
})
