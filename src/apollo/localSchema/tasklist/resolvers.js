import {
  tasksSortVar,
  ganttSortVar,
  localSearchVar,
  globalSearchVar,
  localStringFilterVar,
  globalStringFilterVar,
  filterOpenVar,
} from './variables';

export const localTaskSearch = () => {
  return localSearchVar();
}

export const globalTaskSearch = () => {
  return globalSearchVar();
}

export const localTaskStringFilter = () => {
  return localStringFilterVar();
}

export const globalTaskStringFilter = () => {
  return globalStringFilterVar();
}

export const filterOpen = () => {
  return filterOpenVar();
}