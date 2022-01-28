import {
  gql
} from '@apollo/client';

export const GET_SCHEME = gql `
query cmdbScheme(
  $companyId: Int!
){
  cmdbScheme (
    companyId: $companyId
  ){
    description
    file {
      id
      filename
      path
      mimetype
      encoding
      size
    }
  }
}
`;

export const ADD_OR_UPDATE_CMDB_SCHEME = gql `
mutation addOrUpdateCmdbScheme(
  $companyId: Int!
  $description: String!
) {
  addOrUpdateCmdbScheme(
    companyId: $companyId
    description: $description
  ){
    id
  }
}
`;