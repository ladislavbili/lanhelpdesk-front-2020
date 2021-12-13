export const translateSelectItem = ( selectItem, t ) => {
  return {
    ...selectItem,
    label: selectItem.labelId ? t( selectItem.labelId ) : t( selectItem.label )
  }
}

export const translateAllSelectItems = ( selectItems, t ) => {
  return selectItems.map( ( selectItem ) => ( {
    ...selectItem,
    label: selectItem.labelId ? t( selectItem.labelId ) : t( selectItem.label )
  } ) )
}