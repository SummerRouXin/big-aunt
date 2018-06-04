const getNumberArr = (startNum, endNum) => {
  let result = [];
  for(let i = startNum; i <= endNum; i++) {
    result.push(i);
  }
  return result;
}

const getCurrentDay = () => {
  let date = new Date();
  let year = date.getYear()+1900;
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return `${year}-${month}-${day}`;
}

const getYearFirstDay = () => {
  let date = new Date();
  let year = date.getYear()+1900;
  return `${year}-01-01`;
}

module.exports = {
  getNumberArr,
  getCurrentDay,
  getYearFirstDay,
}
