export const getMonthFirstDay = function(date) {
  if (!date) {
    return;
  }
  let temp = new Date(date);
  temp.setDate(1);
  return temp;
};

export const isSameDay = function(startTime, endTime) {
  const startTimeMs = new Date(startTime).setHours(0, 0, 0, 0);
  const endTimeMs = new Date(endTime).setHours(0, 0, 0, 0);
  return startTimeMs === endTimeMs ? true : false;
};

export const checkData = function(value, formatStr) {
  const reg = `^(?:(?!0000)[0-9]{4}${formatStr}(?:(?:0[1-9]|1[0-2])${formatStr}(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])${formatStr}(?:29|30)|(?:0[13578]|1[02])-31)|          (?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$`;
  var regExp = new RegExp(reg);
  if (!regExp.test(value)) {
    return false;
  } else {
    return true;
  }
};
