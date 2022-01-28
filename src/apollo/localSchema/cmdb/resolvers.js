import {
  companyVar,
  categoryVar,
  cmdbLocalStringFilterVar,
  cmdbGlobalStringFilterVar,
  cmdbManualLocalStringFilterVar,
  cmdbManualGlobalStringFilterVar,
} from './variables';

export const cmdbSidebarCompany = () => {
  return companyVar();
}

export const cmdbSidebarCategory = () => {
  return categoryVar();
}

export const cmdbLocalStringFilter = () => {
  return cmdbLocalStringFilterVar();
}

export const cmdbGlobalStringFilter = () => {
  return cmdbGlobalStringFilterVar();
}
export const cmdbManualLocalStringFilter = () => {
  return cmdbManualLocalStringFilterVar();
}

export const cmdbManualGlobalStringFilter = () => {
  return cmdbManualGlobalStringFilterVar();
}