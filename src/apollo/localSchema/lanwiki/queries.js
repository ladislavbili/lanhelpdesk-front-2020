import {
  gql
} from "@apollo/client";

export const L_SIDEBAR_TAG_ID = gql `
query lSidebarTagId {
  lSidebarTagId @client
}
`;

export const L_SIDEBAR_FOLDER_ID = gql `
query lSidebarFolderId {
  lSidebarFolderId @client
}
`;