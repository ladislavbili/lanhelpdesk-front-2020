import {
  tasksSortVar,
  ganttSortVar,
  localSearchVar,
  globalSearchVar,
  localStringFilterVar,
  globalStringFilterVar,
} from './variables';

export const tasksSort = () => {
  return tasksSortVar();
}

export const ganttSort = () => {
  return ganttSortVar();
}

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