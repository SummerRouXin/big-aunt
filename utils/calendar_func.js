const util = require('./util.js');
const currMonth = util.getCurrentYearMonth().month;
const currYear = util.getCurrentYearMonth().year;

//计算每个月的日历有几行
const getMonthLines = (month = currMonth, year = currYear) => {
  return Math.ceil((util.getMonthFirst(month, year).getDay() + util.getMonthLength(month, year)) / 7);
}

//获取这个月的天数组
const getCalendarDayArr = (month = currMonth, year = currYear) => {
  const firstDay = util.getMonthFirst(month, year).getDay(),
        monthLen = util.getMonthLength(month, year),
        nextMonthLen = getMonthLines(month, year) * 7 - firstDay - monthLen;
  const grayLastArr = [],
        grayNextArr = [],
        dayArr = [];
  for(let i = 1; i <= firstDay; i++) {
    const lastMonthLen = util.getMonthLength(month-1, year);
    grayLastArr.push(lastMonthLen - firstDay + i);
  }
  for(let j = 1; j <= monthLen; j++) {
    dayArr.push(j)
  }
  for(let k = 1; k <= nextMonthLen; k++) {
    grayNextArr.push(k);
  }

  return {
    grayLastArr,
    grayNextArr,
    dayArr
  }
}

module.exports = {
  getMonthLines,
  getCalendarDayArr,
}
