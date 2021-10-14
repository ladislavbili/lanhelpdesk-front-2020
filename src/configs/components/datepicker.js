export default function config( time ) {
  return {
    locale: "sk",
    showTimeSelect: time,
    todayButton: "Today",
    timeIntervals: 15,
    dateFormat: `${time ? ' HH:mm' : ''} dd.MM.yyyy`,
  }
}