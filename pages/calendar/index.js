import util from '../../utils/util.js';
import apis from '../../utils/apis.js';
import calendar_func from '../../utils/calendar_func.js';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js';
const weekConst = require('../../utils/const.js').weekConst;

Page({
  data: {
    selectMonth: util.getCurrentYearMonth().month, //选中的月份
    selectYear: util.getCurrentYearMonth().year,   //选中的年份
    selectDay: null,    //选中的天
    hasClick: false,
    hasSwitched: false,   //感觉唯一的作用就是写年-月-日这个storage(submitTips)时更方便一些
    tipsContent: null,
    switchedArr: new Array(util.getMonthLength()),     //记录当前月份打卡情况，因为一进来就要展示，所以需要维护一个数组来记录
  },
  onLoad: async function() {
    this.calculateValue();
  },
  bindMonthTap: async function(e) {    //点击左右箭头
    const { selectMonth, selectYear } = this.data,
          arrow = e.currentTarget.dataset.arrow;
    if(arrow == 'left') {   //left arrow
      console.log('left: ', selectMonth)
      if(selectMonth == 1) {
        this.setData({
          selectMonth: 12,
          selectYear: selectYear - 1
        })
      } else {
        this.setData({
          selectMonth: selectMonth - 1
        })
      }
    } else if(arrow == 'right') {   //right arrow
      console.log('right: ', selectMonth)
      if(selectMonth == 12) {
        this.setData({
          selectMonth: 1,
          selectYear: selectYear + 1
        })
      } else {
        this.setData({
          selectMonth: selectMonth + 1
        })
      }
    }
    this.calculateValue();
  },
  calculateValue: async function() {  //专门设置各种变量的函数
    const { selectMonth, selectYear, switchedArr } = this.data;
    const weekArr = weekConst,
          monthLines = calendar_func.getMonthLines(selectMonth, selectYear),
          dayArr = calendar_func.getCalendarDayArr(selectMonth, selectYear).dayArr,
          grayLastArr = calendar_func.getCalendarDayArr(selectMonth, selectYear).grayLastArr,
          grayNextArr = calendar_func.getCalendarDayArr(selectMonth, selectYear).grayNextArr;
    try {
      const initData = await apis.getCalendarInitData(`${this.data.selectYear}-${this.data.selectMonth}`)
      this.setData({
        switchedArr: initData
      })
    } catch(e) {
      console.log('getCalendarInitData: ', e)
    }
    this.setData({
      weekArr,
      monthLines,
      dayArr,
      grayLastArr,
      grayNextArr,
    })
  },
  bindDayTap: async function(e) {     //点击日期
    console.log('bindDayTap: ', e.target.dataset.content)
    const eDay = e.target.dataset.content;
    const { selectMonth, selectYear, hasSwitched, tipsContent } = this.data;
    const currDay = `${selectYear}-${selectMonth}-${eDay}`
    const dayContent = await apis.getDayContent(currDay);
    this.setData({
      hasClick: true,
      selectDay: e.target.dataset.content || null,
      hasSwitched: dayContent.hasSwitched || false,
      tipsContent: dayContent.tipsContent || null,
    })
  },
  switchChange: async function(e) {    //点击开关
    console.log('switchChange: ', e.detail.value)
    const selectDay = parseInt(this.data.selectDay),
          { selectMonth, selectYear, switchedArr } = this.data;
    // const newArr = new Array(util.getMonthLength(selectMonth, selectYear));
    const newArr = switchedArr.slice();
    newArr[selectDay - 1] = true;    //数组从0开始，日期从1开始，注意-1
    this.setData({
      hasSwitched: e.detail.value,
      switchedArr: newArr
    })
    // console.log('newArr: ', newArr)
    // console.log('switchedArr: ', this.data.switchedArr)

    try {
      const currMonth = `${selectYear}-${selectMonth}`
      await apis.sendSwitchStatus(currMonth, newArr)
    } catch(e) {
      console.log('sendSwitchStatus storage', e)
    }
  },
  bindTextAreaInput: function(e) {     //输入文本
    this.setData({
      tipsContent: e.detail.value
    })
  },
  bindTextAreaBlur: async function(e) {    //输入文本结束
    // console.log('bindTextAreaBlur', e.detail.value)
    const { selectDay, selectMonth, selectYear, hasSwitched, tipsContent } = this.data;
    const currDay = `${selectYear}-${selectMonth}-${selectDay}`
    try {
      await apis.submitTips(currDay , {hasSwitched, tipsContent})
    } catch(e) {
      console.log('bindTextAreaBlur storage', e)
    }
  }
})
// BB: async function() {
//   await new Promise((resolve) => {
//       setTimeout(resolve, 500)
//       console.log(2)
//     })
//   console.log(1)
// },
