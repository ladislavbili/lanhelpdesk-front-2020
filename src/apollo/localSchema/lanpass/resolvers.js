import {
  folderVar,
  pLocalStringFilterVar,
  pGlobalStringFilterVar,
} from './variables';

export const pSidebarFolder = () => {
  return folderVar();
}

export const pLocalStringFilter = () => {
  return pLocalStringFilterVar();
}

export const pGlobalStringFilter = () => {
  return pGlobalStringFilterVar();
}
