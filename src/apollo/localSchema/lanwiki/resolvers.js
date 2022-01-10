import {
  tagVar,
  folderVar,
  lLocalStringFilterVar,
  lGlobalStringFilterVar,
} from './variables';

export const lSidebarTag = () => {
  return tagVar();
}

export const lSidebarFolder = () => {
  return folderVar();
}

export const lLocalStringFilter = () => {
  return lLocalStringFilterVar();
}

export const lGlobalStringFilter = () => {
  return lGlobalStringFilterVar();
}