export const itemAttributesFullfillsString = ( item, filter, attributes ) => {
  const stringFilter = filter.toLowerCase();
  return attributes.some( ( attribute ) => item[ attribute ] !== undefined && item[ attribute ] !== null && item[ attribute ].toString().toLowerCase().includes( stringFilter ) );
}