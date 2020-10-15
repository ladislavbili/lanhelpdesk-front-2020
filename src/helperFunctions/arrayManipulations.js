export const orderArr = (arr, attribute = 'order', order = 1) => arr.sort((a1, a2) => (
  a1[attribute] >= a2[attribute]
  ? 1 * order
  : (-1) * order));

export const sortBy = (array, byAttributes = ['title']) => {
  if (byAttributes === []) {
    return array;
  }
  return array.sort((item1, item2) => {
    const results = byAttributes.map((attribute) => {
      if (item1[attribute] > item2[attribute]) {
        return 1;
      }
      if (item1[attribute] < item2[attribute]) {
        return -1;
      }
      return 0;
    })
    let result = results.find((res) => res !== 0);
    return result || 0;
  });
}

export const arraySelectToString = (arr) => {
  return arr.map(a => " " + a).toString();
}
