import util from '../../utils/util.js';
import apis from '../../utils/apis.js';
import calendar_func from '../../utils/calendar_func.js';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js';
var common  = require('../common_setting/index.js')
import { weekConst, ovulateInterval } from '../../utils/const.js';

Page({
  data: {
    ...common.data,
    selectMonth: util.getCurrentYearMonth().month, //选中的月份
    selectYear: util.getCurrentYearMonth().year,   //选中的年份
    selectDay: null,    //选中的天
    hasClick: false,
    hasSwitched: false,   //感觉唯一的作用就是写年-月-日这个storage(submitTips)时更方便一些
    tipsContent: null,
    switchedArr: util.newArray(util.getMonthLength()),     //记录当前月份打卡情况，因为一进来就要展示，所以需要维护一个数组来记录
    auntArr: util.newArray(util.getMonthLength()),       //存储大姨妈日期的数组
    safeArr: util.newArray(util.getMonthLength()),       //安全期
    ovulateArr: util.newArray(util.getMonthLength()),    //排卵期
    // isBeforeRecentDate: true,    //该月是不是在最近一次月经之前，如果是则排卵期，安全期以及计算的月经期不显示
    firstAuntArr: [],     //每个月大姨妈来的第一天保留在数组中，这是为了计算排卵期
  },
  bindPickerGenderChange: common.bindPickerGenderChange,
  bindPickerDurationChange: common.bindPickerDurationChange,
  bindPickerIntervalChange: common.bindPickerIntervalChange,
  bindPickerRecentChange: common.bindPickerRecentChange,
  bindSubmitTap: common.bindSubmitTap,
  bindSkipTap: common.bindSkipTap,
  hasFinished: common.hasFinished,
  onLoad: async function() {
    this.calculateValue();
    await common.initApp.call(this);
    this.calculateAunt();
  },
  onShow: async function() {
    this.calculateValue();
    await common.initApp.call(this);
    this.calculateAunt();
  },
  bindMonthTap: async function(e) {    //点击左右箭头
    const { selectMonth, selectYear, recentDate } = this.data,
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
    await common.initApp.call(this);
    this.clearArr();
    //比较日期大小 true表示选择的年月在来月经之前    月底
    const newMonth = this.data.selectMonth >= 10 ? this.data.selectMonth : "0"+this.data.selectMonth, //notice: 不加0在手机中会报错
          newYear = this.data.selectYear;
    const lastDate = util.getMonthLength(newMonth, newYear);
    const dateResult = (new Date(`${newYear}-${newMonth}-${lastDate}`) - new Date(recentDate)) >= 0 ? true : false;
    if(dateResult) {
      this.calculateAunt();
    } else {
      //不用计算月经时间
    }
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
    const newArr = switchedArr.slice();
    newArr[selectDay - 1] = e.detail.value;    //数组从0开始，日期从1开始，注意-1
    this.setData({
      hasSwitched: e.detail.value,
      switchedArr: newArr
    })

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
  },


  calculateAunt: function() {
    const { recentDate, intervalRange, intervalIndex, durationRange, durationIndex,
      selectMonth, selectYear, auntArr, ovulateArr, safeArr } = this.data;
    const newSelectMonth = parseInt(selectMonth) < 10 ? '0'+selectMonth : selectMonth;
    const monthFirst = util.getMonthFirst(selectMonth, selectYear),
          monthLast = util.getMonthLast(selectMonth, selectYear),
          recentDateNew = new Date(recentDate),
          monthLength = util.getMonthLength(selectMonth, selectYear);
    const tempAuntArr = auntArr.slice(),
          tempOvulateArr = ovulateArr.slice(),
          tempSafeArr = safeArr.slice();
    console.log('持续时间: ', durationRange[durationIndex] )  //5   2018-05-28
    console.log('间隔时间: ', intervalRange[intervalIndex])
    console.log('最近一次： ', recentDate)
    const intervalLength = intervalRange[intervalIndex];
    //for
    for(let i = 1; i <= monthLength; i++ ){
      const day = i < 10 ? '0'+i : i;
      const currentDay = `${selectYear}-${newSelectMonth}-${day}`;
      const twoDayInterval = util.getTwoDayInterval(recentDate, currentDay);

      let result = twoDayInterval % intervalLength;

      if(result >= 0 && result < parseInt(durationRange[durationIndex])){   //  标记大姨妈数组
        if(selectMonth == new Date(recentDate).getMonth() + 1) {
          if(i - new Date(recentDate).getDate() < 0 && i - new Date(recentDate).getDate() > -intervalLength) {
            tempSafeArr[i-1] = true;
            this.setData({
              safeArr: tempSafeArr
            })
          } else {
            tempAuntArr[i-1] = true;
            this.setData({
              auntArr: tempAuntArr
            })
          }
        } else {
          tempAuntArr[i-1] = true;
          this.setData({
            auntArr: tempAuntArr
          })
        }
      }
      if(result == 0) {
        this.data.firstAuntArr.push(i)
      }
    }
    //for
    this.data.firstAuntArr.forEach((firstAuntItem) => {
      for(let i = 1; i <= monthLength; i++) {
        if(firstAuntItem - i >= 10 || i - firstAuntItem >= intervalLength - 19) {
          tempOvulateArr[i-1] = true;
        }
      }
    })
    this.setData({
      ovulateArr: tempOvulateArr
    })
    for(let j = 0; j < this.data.ovulateArr.length; j++) {
      tempSafeArr[j] = !(this.data.auntArr[j] || this.data.ovulateArr[j])
    }
    this.setData({
      safeArr: tempSafeArr
    })
  },

  // calculateAunt: function() {
  //   const { recentDate, intervalRange, intervalIndex, durationRange, durationIndex,
  //     selectMonth, selectYear, auntArr, ovulateArr, safeArr } = this.data;
  //   const newSelectMonth = parseInt(selectMonth) < 10 ? '0'+selectMonth : selectMonth;
  //   const monthFirst = util.getMonthFirst(selectMonth, selectYear),
  //         monthLast = util.getMonthLast(selectMonth, selectYear),
  //         recentDateNew = new Date(recentDate),
  //         monthLength = util.getMonthLength(selectMonth, selectYear);
  //   const tempAuntArr = auntArr.slice(),
  //         tempOvulateArr = ovulateArr.slice(),
  //         tempSafeArr = safeArr.slice();
  //   console.log('持续时间: ', durationRange[durationIndex] )  //5   2018-05-28
  //   console.log('间隔时间: ', intervalRange[intervalIndex])
  //   console.log('最近一次： ', recentDate)
  //   console.log('monthLength:' ,monthLength)
  //
  //   let i = 1;
  //   let auntStartDayArr = [];
  //   while(i <= monthLength) {
  //     const day = i < 10 ? '0'+i : i;
  //     const currentDay = `${selectYear}-${newSelectMonth}-${day}`;
  //     const twoDayInterval = util.getTwoDayInterval(recentDate, currentDay);
  //     const intervalLength = intervalRange[intervalIndex];
  //     const result = twoDayInterval % intervalLength;
  //     if(result == 0) {
  //       auntStartDayArr.push(i);
  //       for(let j = i;j < i + durationRange[durationIndex] && j <= monthLength ; j++) {
  //         tempAuntArr[j-1] = true;
  //       }
  //       i = i + durationRange[durationIndex];
  //       this.setData({
  //         auntArr: tempAuntArr
  //       })
  //     } else {
  //       i++;
  //     }
  //   }
  //   console.log('auntStartDayArr: ', auntStartDayArr)
  //   auntStartDayArr = auntStartDayArr.filter(item => item - 10 >= 0)
  //   console.log('auntStartDayArr: ', auntStartDayArr)
  //   auntStartDayArr.forEach((item) => {
  //     let k = 0;
  //     for(let j = item - 10, k = 0; j >= 0, k < 10; j--, k++) {
  //       console.log('ovalate: ', j)
  //       tempOvulateArr[j-1] = true;
  //       this.setData({
  //         ovulateArr: tempOvulateArr
  //       })
  //     }
  //   })
  // },

  clearArr: function() {
    this.setData({
      auntArr: util.newArray(util.getMonthLength()),       //存储大姨妈日期的数组
      safeArr: util.newArray(util.getMonthLength()),       //安全期
      ovulateArr: util.newArray(util.getMonthLength()),    //排卵期
      firstAuntArr: []
    })
  }
})
