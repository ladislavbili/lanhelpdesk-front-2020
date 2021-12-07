export const translateSelectItem = ( selectItem, t ) => {
  return {
    ...selectItem,
    label: t( selectItem.label )
  }
}

export const translateAllSelectItems = ( selectItems, t ) => {
  return selectItems.map( ( selectItem ) => ( {
    ...selectItem,
    label: t( selectItem.label )
  } ) )
}