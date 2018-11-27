const getCurrentYearMonth = () => {    //获取当前年份
  const date = new Date();
  const year = date.getYear()+1900;
  const month = date.getMonth() + 1
  return {
    year,
    month
  };
}

const currMonth = getCurrentYearMonth().month;
const currYear = getCurrentYearMonth().year;

const getNumberArr = (startNum, endNum) => {   //返回一个开始数字和结束数字组成的数组，用于选择周期时间范围
  const result = [];
  for(let i = startNum; i <= endNum; i++) {
    result.push(i);
  }
  return result;
}

const getCurrentDay = () => {    //获取今天的年月日
  const date = new Date();
  const year = date.getYear()+1900,
        month = date.getMonth() + 1,
        day = date.getDate();
  const showMonth = month >= 10 ? month : '0' + month,
        showDay = day >= 10 ? day : '0' + day;
  return `${year}-${showMonth}-${showDay}`;
}

const getYearFirstDay = () => {     //获取当年的第一天，用于初始化
  const date = new Date();
  const year = date.getYear()+1900;
  return `${year}-01-01`;
}

const getMonthLength = (month = currMonth, year = currYear) => {    //获取某个月的天数
  return new Date(year, month, 0).getDate()   //month都不用－1
}

const getMonthFirst = (month = currMonth, year = currYear) => {    //month字段取值为1～12
  const date = new Date(year, month-1, '01');
  if(month && month >= 1 && month <= 12) {     //如果month字段存在则获取指定月份的第一天
    date.setMonth(month - 1,1);
  } else {       //如果month字段不存在则取当月的第一天
    date.setDate(1);
  }
  return date;
}

const getMonthLast = (month = currMonth, year = currYear) => {    //month字段取值为1～12
  const date = new Date(year, month-1, '01');
  if(month && month >= 1 && month <= 12) {     //如果month字段存在则获取指定月份的第一天
    date.setMonth(month,0);
  } else {       //如果month字段不存在则取当月的第一天
    date.setDate(1);
  }
  return date;
}

const jsonStringify = (inputObj) => {
  if(typeof inputObj === 'object') {
    let inputStringify = JSON.stringify(inputObj);
    return inputStringify;
  }
  return inputObj;
}

const jsonParse = (value) => {
  let outputObj = {};
  try {
    outputObj = JSON.parse(value);
  } catch(e) {
    outputObj = {};
  }
  return outputObj;
}

const getTwoDayInterval = (dayBefore, dayAfter) => {   //  TODO:  两天之间的间隔要不要+1
  let dayBeforeDate = new Date(dayBefore),
      dayAfterDate = new Date(dayAfter);
  const result = Math.ceil(Math.abs(parseInt(dayAfterDate - dayBeforeDate) / 1000 / 60 / 60 / 24)) ;   //直接相减得到的是毫秒数
  return result;
}

const newArray = (length) => {
  const arr = new Array();
  for(let i = 0; i < length; i++) {
    arr.push(false);
  }
  return arr;
}

//计算每个月的日历有几行
const getMonthLines = (month = currMonth, year = currYear) => {
  return Math.ceil((getMonthFirst(month, year).getDay() + getMonthLength(month, year)) / 7);
}

//获取这个月的天数组
const getCalendarDayArr = (month = currMonth, year = currYear) => {
  const firstDay = getMonthFirst(month, year).getDay(),
        monthLen = getMonthLength(month, year),
        nextMonthLen = getMonthLines(month, year) * 7 - firstDay - monthLen;
  const grayLastArr = [],
        grayNextArr = [],
        dayArr = [];
  for(let i = 1; i <= firstDay; i++) {
    const lastMonthLen = getMonthLength(month-1, year);
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

const isToday = (str) => {
  var d = new Date(str.replace(/-/g, "/"));
  var todaysDate = new Date();
  if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  getCurrentYearMonth,
  getNumberArr,
  getCurrentDay,
  getYearFirstDay,
  getMonthLength,
  getMonthFirst,
  getMonthLast,
  jsonStringify,
  jsonParse,
  getTwoDayInterval,
  newArray,
  getMonthLines,
  getCalendarDayArr,
  isToday,
}
