/**
 * 日历模块
**/
import util from '../../utils/util.js';
import apis from '../../utils/apis.js';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js';
import { weekConst, ovulateInterval } from '../../utils/const.js';

Component({
  // 组件的对外属性
  properties: {
    hasSetted: Boolean,
    durationRange: Array,
    intervalRange: Array,
    whoseSetting: String, // 是“我自己”或者“别人”的设置
    hasShowBackBtn: Boolean,
  },
  data: {
    selectMonth: util.getCurrentYearMonth().month, //选中的月份
    selectYear: util.getCurrentYearMonth().year, //选中的年份
    selectDay: null, //选中的天
    hasClick: false,
    hasSwitched: false, //感觉唯一的作用就是写年-月-日这个storage(submitTips)时更方便一些
    tipsContent: null,
    switchedArr: util.newArray(util.getMonthLength()), //记录当前月份打卡情况，因为一进来就要展示，所以需要维护一个数组来记录
    auntArr: util.newArray(util.getMonthLength()), //存储大姨妈日期的数组
    safeArr: util.newArray(util.getMonthLength()), //安全期
    ovulateArr: util.newArray(util.getMonthLength()), //排卵期
    // isBeforeRecentDate: true,    //该月是不是在最近一次月经之前，如果是则排卵期，安全期以及计算的月经期不显示
    firstAuntArr: [], //每个月大姨妈来的第一天保留在数组中，这是为了计算排卵期
    genderIndex: null,
    durationIndex: null,
    intervalIndex: null,
    recentDate: "",
    isCurrentYearMonth: false,   // 判断当前是年月是否与当天的相同，用于标记是否是今天
  },
  async attached() {
    this.getInitData();
    this.calculateValue();
  },
  methods: {
    getInitData: async function() {
      const { whoseSetting } = this.data;
      let settingInfo = {};
      try {
        settingInfo = await apis.getSettingInfo(whoseSetting);
      } catch (e) {
        console.log("getSettingInfo", e);
      }
      this.setData({
        genderIndex: settingInfo.genderIndex || null,
        durationIndex: settingInfo.durationIndex || null,
        intervalIndex: settingInfo.intervalIndex || null,
        recentDate: settingInfo.recentDate || ""
      });
      this.calculateAunt(); // 拿到数据之后再计算大姨妈
    },
    bindMonthTap: async function(e) {
      //点击左右箭头
      const { selectMonth, selectYear, recentDate } = this.data;
      const arrow = e.currentTarget.dataset.arrow;
      if (arrow == "left") {
        //left arrow
        console.log("left: ", selectMonth);
        if (selectMonth == 1) {
          this.setData({
            selectMonth: 12,
            selectYear: selectYear - 1
          });
        } else {
          this.setData({
            selectMonth: selectMonth - 1
          });
        }
      } else if (arrow == "right") {
        //right arrow
        console.log("right: ", selectMonth);
        if (selectMonth == 12) {
          this.setData({
            selectMonth: 1,
            selectYear: selectYear + 1
          });
        } else {
          this.setData({
            selectMonth: selectMonth + 1
          });
        }
      }
      this.calculateValue();
      this.clearArr();
      //比较日期大小 true表示选择的年月在来月经之前    月底
      const newMonth =
          this.data.selectMonth >= 10
            ? this.data.selectMonth
            : "0" + this.data.selectMonth, //notice: 不加0在手机中会报错
        newYear = this.data.selectYear;
      const lastDate = util.getMonthLength(newMonth, newYear);
      const dateResult =
        new Date(`${newYear}-${newMonth}-${lastDate}`) - new Date(recentDate) >=
        0
          ? true
          : false;
      if (dateResult) {
        this.calculateAunt();
      } else {
        //不用计算大姨妈时间
      }
    },
    calculateValue: async function() {
      //专门设置各种变量的函数
      const { selectMonth, selectYear } = this.data;
      const weekArr = weekConst,
        monthLines = util.getMonthLines(selectMonth, selectYear),
        dayArr = util.getCalendarDayArr(selectMonth, selectYear).dayArr,
        grayLastArr = util.getCalendarDayArr(selectMonth, selectYear)
          .grayLastArr,
        grayNextArr = util.getCalendarDayArr(selectMonth, selectYear)
          .grayNextArr;
      try {
        const initData = await apis.getCalendarInitData(
          `${this.data.selectYear}-${this.data.selectMonth}`
        );
        this.setData({
          switchedArr: initData
        });
      } catch (e) {
        console.log("getCalendarInitData: ", e);
      }
      this.setData({
        weekArr,
        monthLines,
        dayArr,
        grayLastArr,
        grayNextArr
      });
    },
    bindDayTap: async function(e) {
      //点击日期
      console.log("bindDayTap: ", e.target.dataset.selectday);
      const eDay =
        e.target.dataset.selectday || e.currentTarget.dataset.selectday;
      const { selectMonth, selectYear, hasSwitched, tipsContent } = this.data;
      const currDay = `${selectYear}-${selectMonth}-${eDay}`;
      const dayContent = await apis.getDayContent(currDay);
      this.setData({
        hasClick: true,
        selectDay: eDay || null,
        hasSwitched: dayContent.hasSwitched || false,
        tipsContent: dayContent.tipsContent || null
      });
    },
    switchChange: async function(e) {
      //点击开关
      console.log("switchChange: ", e.detail.value);
      const selectDay = parseInt(this.data.selectDay),
        { selectMonth, selectYear, switchedArr } = this.data;
      const newArr = switchedArr.slice();
      newArr[selectDay - 1] = e.detail.value; //数组从0开始，日期从1开始，注意-1
      this.setData({
        hasSwitched: e.detail.value,
        switchedArr: newArr
      });

      try {
        const currMonth = `${selectYear}-${selectMonth}`;
        await apis.sendSwitchStatus(currMonth, newArr);
      } catch (e) {
        console.log("sendSwitchStatus storage", e);
      }
    },
    bindTextAreaInput: function(e) {
      //输入文本
      this.setData({
        tipsContent: e.detail.value
      });
    },
    bindTextAreaBlur: async function(e) {
      //输入文本结束
      // console.log('bindTextAreaBlur', e.detail.value)
      const {
        selectDay,
        selectMonth,
        selectYear,
        hasSwitched,
        tipsContent
      } = this.data;
      const currDay = `${selectYear}-${selectMonth}-${selectDay}`;
      try {
        await apis.submitTips(currDay, { hasSwitched, tipsContent });
      } catch (e) {
        console.log("bindTextAreaBlur storage", e);
      }
    },
    calculateAunt: function() {
      this.clearArr();
      const {
        recentDate,
        intervalRange,
        intervalIndex,
        durationRange,
        durationIndex,
        selectMonth,
        selectYear,
        auntArr,
        ovulateArr,
        safeArr
      } = this.data;
      const newSelectMonth =
        parseInt(selectMonth) < 10 ? "0" + selectMonth : selectMonth;
      const monthFirst = util.getMonthFirst(selectMonth, selectYear),
        monthLast = util.getMonthLast(selectMonth, selectYear),
        recentDateNew = new Date(recentDate),
        monthLength = util.getMonthLength(selectMonth, selectYear);
      const tempAuntArr = auntArr.slice(),
        tempOvulateArr = ovulateArr.slice(),
        tempSafeArr = safeArr.slice();
      const intervalLength = intervalRange[intervalIndex];

      console.log("持续时间: ", durationRange[durationIndex]); //5   2018-05-28
      console.log("间隔时间: ", intervalLength);
      console.log("最近一次： ", recentDate);

      //for
      for (let i = 1; i <= monthLength; i++) {
        const day = i < 10 ? "0" + i : i;
        const currentDay = `${selectYear}-${newSelectMonth}-${day}`;
        const twoDayInterval = util.getTwoDayInterval(recentDate, currentDay);

        let result = twoDayInterval % intervalLength;

        if (result >= 0 && result < parseInt(durationRange[durationIndex])) {
          //  标记大姨妈数组
          if (selectMonth == new Date(recentDate).getMonth() + 1) {
            if (
              i - new Date(recentDate).getDate() < 0 &&
              i - new Date(recentDate).getDate() > -intervalLength
            ) {
              tempSafeArr[i - 1] = true;
              this.setData({
                safeArr: tempSafeArr
              });
            } else {
              tempAuntArr[i - 1] = true;
              this.setData({
                auntArr: tempAuntArr
              });
            }
          } else {
            tempAuntArr[i - 1] = true;
            this.setData({
              auntArr: tempAuntArr
            });
          }
        }
        if (result == 0) {
          this.data.firstAuntArr.push(i);
        }
      }
      //for
      this.data.firstAuntArr.forEach(firstAuntItem => {
        for (let i = 1; i <= monthLength; i++) {
          if (((firstAuntItem - i >= 10 && firstAuntItem - i <= 19)
              || (i - firstAuntItem >= intervalLength - 19
                && i - firstAuntItem <= intervalLength - 10
             ))
              && tempSafeArr[i] == false
            ) {
              tempOvulateArr[i - 1] = true;
            } else {
              tempOvulateArr[i - 1] = false;
            }
        }
      });
      this.setData({
        ovulateArr: tempOvulateArr
      });
      for (let j = 0; j < this.data.ovulateArr.length; j++) {
        tempSafeArr[j] = !(this.data.auntArr[j] || this.data.ovulateArr[j]);
      }
      this.setData({
        safeArr: tempSafeArr
      });
    },
    clearArr: function() {
      this.setData({
        auntArr: util.newArray(util.getMonthLength()), //存储大姨妈日期的数组
        safeArr: util.newArray(util.getMonthLength()), //安全期
        ovulateArr: util.newArray(util.getMonthLength()), //排卵期
        firstAuntArr: [],
        hasClick: false
      });
    },
    bindBackTap: function() {
      this.setData({
        hasSetted: false,
      });
      this.triggerEvent('changesetted', { hasSetted: false });
    }
  }
});
