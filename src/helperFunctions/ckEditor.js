export const changeCKEData = (input) => {
  return input.replace(/<p>/g, "<p style='margin-bottom: 0px; padding-bottom: 0px;'>");
}
