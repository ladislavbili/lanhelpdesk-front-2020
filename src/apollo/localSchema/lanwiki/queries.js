import {
  gql
} from "@apollo/client";

export const L_SIDEBAR_TAG = gql `
query lSidebarTag {
  lSidebarTag @client
}
`;

export const L_SIDEBAR_FOLDER = gql `
query lSidebarFolder {
  lSidebarFolder @client
}
`;

export const L_LOCAL_STRING_FILTER = gql `
query lLocalStringFilter {
  lLocalStringFilter @client
}
`;

export const L_GLOBAL_STRING_FILTER = gql `
query lGlobalStringFilter {
  lGlobalStringFilter @client
}
`;