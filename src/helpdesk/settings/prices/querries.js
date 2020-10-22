import gql from "graphql-tag";

export const GET_PRICELISTS = gql `
query {
  pricelists {
    title
    id
    order
    def
  }
}
`;

export const ADD_PRICELIST = gql `
mutation addPricelist($title: String!, $order: Int!, $afterHours: Int!, $def: Boolean!, $materialMargin: Int!, $materialMarginExtra: Int!, $prices: [CreatePriceInput]! ) {
  addPricelist(
    title: $title,
    order: $order,
    afterHours: $afterHours,
    def: $def,
    materialMargin: $materialMargin,
    materialMarginExtra: $materialMarginExtra,
    prices: $prices,
  ){
    id
    title
    order
    def
  }
}
`;

export const GET_PRICELIST = gql `
query pricelist($id: Int!) {
  pricelist (
    id: $id
  ) {
    id
    title
    order
    afterHours
    def
    materialMargin
    materialMarginExtra
    prices {
      id
      type
      price
      taskType {
        id
        title
      }
      tripType {
        id
        title
      }
    }
  }
}
`;

export const UPDATE_PRICELIST = gql `
mutation updatePricelist($id: Int!, $title: String!, $order: Int!, $afterHours: Int!, $def: Boolean!, $materialMargin: Int!, $materialMarginExtra: Int!, $prices: [UpdatePriceInput]! ) {
  updatePricelist(
    id: $id,
    title: $title,
    order: $order,
    afterHours: $afterHours,
    def: $def,
    materialMargin: $materialMargin,
    materialMarginExtra: $materialMarginExtra,
    prices: $prices,
  ){
    id
    title
    order
    def
  }
}
`;

export const DELETE_PRICELIST = gql `
mutation deletePricelist($id: Int!, $newDefId: Int, $newId: Int) {
  deletePricelist(
    id: $id,
    newDefId: $newDefId,
    newId: $newId,
  ){
    id
  }
}
`;