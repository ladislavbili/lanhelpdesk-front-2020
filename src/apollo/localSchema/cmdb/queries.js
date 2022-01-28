import {
  gql
} from "@apollo/client";

export const CMDB_SIDEBAR_COMPANY = gql `
query cmdbSidebarCompany {
  cmdbSidebarCompany @client
}
`;

export const CMDB_SIDEBAR_CATEGORY = gql `
query cmdbSidebarCategory {
  cmdbSidebarCategory @client
}
`;

export const CMDB_LOCAL_STRING_FILTER = gql `
query cmdbLocalStringFilter {
  cmdbLocalStringFilter @client
}
`;

export const CMDB_GLOBAL_STRING_FILTER = gql `
query cmdbGlobalStringFilter {
  cmdbGlobalStringFilter @client
}
`;

export const CMDB_MANUAL_LOCAL_STRING_FILTER = gql `
query cmdbManualLocalStringFilter {
  cmdbManualLocalStringFilter @client
}
`;

export const CMDB_MANUAL_GLOBAL_STRING_FILTER = gql `
query cmdbManualGlobalStringFilter {
  cmdbManualGlobalStringFilter @client
}
`;