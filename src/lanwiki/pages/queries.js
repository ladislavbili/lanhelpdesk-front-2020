import {
  gql
} from '@apollo/client';

export const GET_PAGES = gql `
query lanwikiPages(
  $folderId: Int
  $tagId: Int
  $limit: Int
  $page: Int
  $stringFilter: LanwikiPageStringFilterInput
){
  lanwikiPages (
    folderId: $folderId
    tagId: $tagId
    limit: $limit
    page: $page
    stringFilter: $stringFilter
  ){
    count
    pages{
      id
      title
      tags{
        id
        title
        color
      }
      folder{
        id
        title
      }
      myRights{
        active
        read
        write
        manage
      }
    }
  }
}
`;

export const GET_PAGE = gql `
query lanwikiPage(
  $id: Int!
){
  lanwikiPage(
    id: $id
  ){
    id
    title
    body
    tags{
      id
      title
      color
    }
    folder{
      id
      title
    }
    myRights{
      active
      read
      write
      manage
    }
  }
}
`;

export const ADD_PAGE = gql `
mutation addLanwikiPage(
  $title: String!
  $body: String!
  $folderId: Int!
  $tags: [Int]!
) {
  addLanwikiPage(
    title: $title
    body: $body
    folderId: $folderId
    tags: $tags
  ){
    id
  }
}
`;

export const UPDATE_PAGE = gql `
mutation updateLanwikiPage(
  $id: Int!
  $title: String!
  $body: String!
  $folderId: Int
  $tags: [Int]
) {
  updateLanwikiPage(
    id: $id
    title: $title
    body: $body
    folderId: $folderId
    tags: $tags
  ){
    id
  }
}
`;

export const DELETE_PAGE = gql `
mutation deleteLanwikiPage(
  $id: Int!
) {
  deleteLanwikiPage(
    id: $id
  ){
    id
  }
}
`;