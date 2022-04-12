import {
  companyVar,
  categoryVar,
  cmdbLocalStringFilterVar,
  cmdbGlobalStringFilterVar,
  cmdbManualLocalStringFilterVar,
  cmdbManualGlobalStringFilterVar,
  cmdbPasswordLocalStringFilterVar,
  cmdbPasswordGlobalStringFilterVar,
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

export const cmdbPasswordLocalStringFilter = () => {
  return cmdbPasswordLocalStringFilterVar();
}

export const cmdbPasswordGlobalStringFilter = () => {
  return cmdbPasswordGlobalStringFilterVar();
}