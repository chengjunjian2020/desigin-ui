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
