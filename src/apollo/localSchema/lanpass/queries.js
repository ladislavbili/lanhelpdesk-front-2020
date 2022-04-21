import {
  gql
} from "@apollo/client";

export const P_SIDEBAR_FOLDER = gql `
query pSidebarFolder {
  pSidebarFolder @client
}
`;

export const P_LOCAL_STRING_FILTER = gql `
query pLocalStringFilter {
  pLocalStringFilter @client
}
`;

export const P_GLOBAL_STRING_FILTER = gql `
query pGlobalStringFilter {
  pGlobalStringFilter @client
}
`;
