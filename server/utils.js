const convertMonth = num => {
  const months = [
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'
  ];

  return months[num];
}

const convertDay = num => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return days[num];
}

const formatTime = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours %= 12;
  hours = hours || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutes}${ampm}`;
};

const parseEventsData = events => {
  const today = new Date();
  const todayStr = `${convertMonth(today.getMonth())}${today.getDate()}`;

  return events.map(event => {
    const { colorId, summary, start, end, id } = event;
    const startDate = new Date(start.dateTime || start.date);
    const endDate = new Date(end.dateTime || end.date);
    let startTime = formatTime(startDate);
    let endTime = formatTime(endDate);
    const allDay = startTime === endTime;
    const month = convertMonth(startDate.getMonth());
    const day = convertDay(startDate.getDay());
    const date = startDate.getDate();
    let isToday = '';
    if (todayStr === `${month}${date}`) isToday = 'today';

    if (startTime.includes('am') && endTime.includes('am')) startTime = startTime.replace('am', '');
    if (startTime.includes('pm') && endTime.includes('pm')) startTime = startTime.replace('pm', '');

    return { id, colorId, summary, startTime, endTime, month, day, date, isToday, allDay };
  });
}

module.exports = {
  convertDay,
  convertMonth,
  formatTime,
  parseEventsData
}