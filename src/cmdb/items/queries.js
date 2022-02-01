import {
  gql
} from '@apollo/client';

export const GET_ITEMS = gql `
query cmdbItems (
  $companyId: Int
  $categoryId: Int
  $limit: Int
  $page: Int
  $stringFilter: CMDBItemStringFilterInput
  $sort: EnumCMDBItemSort!
){
  cmdbItems (
    companyId: $companyId
    categoryId: $categoryId
    limit: $limit
    page: $page
    stringFilter: $stringFilter
    sort: $sort
  ){
    count
    items{
      id
      title
      active
      location
      installDate
      expireDate
      createdAt
      createdBy{
        id
        fullName
      }
      updatedAt
      updatedBy{
        id
        fullName
      }
      company{
        id
        title
      }
      category{
        id
        title
      }
      addresses{
        id
        ip
      }
    }
  }
}
`;

export const GET_ITEM = gql `
query cmdbItem(
  $id: Int!
){
  cmdbItem(
    id: $id
  ){
    id
    title
    active
    location
    installDate
    expireDate
    hardware
    serialNumber
    description
    backup
    monitoring
    createdAt
    createdBy{
      id
      fullName
    }
    updatedAt
    updatedBy{
      id
      fullName
    }
    company{
      id
      title
    }
    category{
      id
      title
    }
    descriptionImages{
      id
      filename
      path
      mimetype
      encoding
      size
    }
    backupImages{
      id
      filename
      path
      mimetype
      encoding
      size
    }
    monitoringImages{
      id
      filename
      path
      mimetype
      encoding
      size
    }
    addresses{
      id
      nic
      ip
      mask
      gateway
      dns
      vlan
      note
    }
  }
}
`;

export const ADD_ITEM = gql `
mutation addCmdbItem(
  $companyId: Int!
  $categoryId: Int!
  $title: String!
  $active: Boolean!
  $location: String!
  $installDate: String
  $expireDate: String
  $hardware: String!
  $serialNumber: String!
  $description: String!
  $backup: String!
  $monitoring: String!
  $addresses: [CMDBAddressInput]!
) {
  addCmdbItem(
    companyId: $companyId
    categoryId: $categoryId
    title: $title
    active: $active
    location: $location
    installDate: $installDate
    expireDate: $expireDate
    hardware: $hardware
    serialNumber: $serialNumber
    description: $description
    backup: $backup
    monitoring: $monitoring
    addresses: $addresses
  ){
    id
  }
}
`;

export const UPDATE_ITEM = gql `
mutation updateCmdbItem(
  $id: Int!
  $companyId: Int
  $categoryId: Int
  $title: String!
  $active: Boolean!
  $location: String!
  $installDate: String
  $expireDate: String
  $hardware: String!
  $serialNumber: String!
  $description: String!
  $backup: String!
  $monitoring: String!
  $deletedImages: [Int]
) {
  updateCmdbItem(
    id: $id
    companyId: $companyId
    categoryId: $categoryId
    title: $title
    active: $active
    location: $location
    installDate: $installDate
    expireDate: $expireDate
    hardware: $hardware
    serialNumber: $serialNumber
    description: $description
    backup: $backup
    monitoring: $monitoring
    deletedImages: $deletedImages
  ){
    id
  }
}
`;

export const DELETE_ITEM = gql `
mutation deleteCmdbItem(
  $id: Int!
) {
  deleteCmdbItem(
    id: $id
  ){
    id
  }
}
`;

export const ADD_ADDRESS = gql `
mutation addCmdbAddress(
  $itemId: Int!
  $nic: String!
  $ip: String!
  $mask: String!
  $gateway: String!
  $dns: String!
  $vlan: String!
  $note: String!
) {
  addCmdbAddress(
    itemId: $itemId
    nic: $nic
    ip: $ip
    mask: $mask
    gateway: $gateway
    dns: $dns
    vlan: $vlan
    note: $note
  ){
    id
    nic
    ip
    mask
    gateway
    dns
    vlan
    note
  }
}
`;

export const UPDATE_ADDRESS = gql `
mutation updateCmdbAddress(
  $id: Int!
  $nic: String!
  $ip: String!
  $mask: String!
  $gateway: String!
  $dns: String!
  $vlan: String!
  $note: String!
) {
  updateCmdbAddress(
    id: $id
    nic: $nic
    ip: $ip
    mask: $mask
    gateway: $gateway
    dns: $dns
    vlan: $vlan
    note: $note
  ){
    id
  }
}
`;

export const DELETE_ADDRESS = gql `
mutation deleteCmdbAddress(
  $id: Int!
) {
  deleteCmdbAddress(
    id: $id
  ){
    id
  }
}
`;