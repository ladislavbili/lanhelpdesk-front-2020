export const isEmail = ( email ) => ( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ).test( email )

export const sameStringForms = ( item1, item2 ) => {
  return JSON.stringify( item1 ) === JSON.stringify( item2 )
}

export const textIncluded = ( source, text ) => {
  return source.toLowerCase().includes( text.toLowerCase() )
}