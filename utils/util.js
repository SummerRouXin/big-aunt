const getCurrentYearMonth = () => {    //获取当前年份
  const date = new Date();
  const year = date.getYear()+1900;
  const month = date.getMonth() + 1
  return {
    year,
    month
  };
}

const getNumberArr = (startNum, endNum) => {   //返回一个开始数字和结束数字组成的数组，用于选择周期时间范围
  const result = [];
  for(let i = startNum; i <= endNum; i++) {
    result.push(i);
  }
  return result;
}

const getCurrentDay = () => {    //获取今天的年月日
  const date = new Date();
  const year = date.getYear()+1900;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

const getYearFirstDay = () => {     //获取当年的第一天，用于初始化
  const date = new Date();
  const year = date.getYear()+1900;
  return `${year}-01-01`;
}

const getMonthLength = (month = getCurrentYearMonth().month, year = getCurrentYearMonth().year) => {    //获取某个月的天数
  return new Date(year, month, 0).getDate()   //month都不用－1
}

const getMonthFirst = (month = getCurrentYearMonth().month, year = getCurrentYearMonth().year) => {    //month字段取值为1～12
  const date = new Date(year, month-1, '01');
  if(month && month >= 1 && month <= 12) {     //如果month字段存在则获取指定月份的第一天
    date.setMonth(month - 1,1);
  } else {       //如果month字段不存在则取当月的第一天
    date.setDate(1);
  }
  return date;
}

const getMonthLast = (month = getCurrentYearMonth().month, year = getCurrentYearMonth().year) => {    //month字段取值为1～12
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
}
