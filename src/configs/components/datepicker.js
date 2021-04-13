export default function config( time ) {
  return {
    locale: "sk",
    showTimeSelect: time,
    todayButton: "Today",
    timeIntervals: 15,
    dateFormat: `dd.MM.yyyy${time ? ' HH:mm' : ''}`,
  }

}