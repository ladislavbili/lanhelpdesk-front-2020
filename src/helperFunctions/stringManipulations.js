export const randomString = () => Math.random().toString( 36 ).substring( 2, 15 ) + Math.random().toString( 36 ).substring( 2, 15 );

const randomSeparator = () => {
  const index = Math.floor( 5 * Math.random() );
  return [ '!', '@', '$', '%', '#' ][ index ];
}

export const randomPassword = () => {
  let basePass = `${randomString().substring(0, Math.floor(Math.random() * 5 ) + 3)}${randomSeparator()}${randomString().substring(0, Math.floor(Math.random() * 5 ) + 3)}`;
  for ( let i = 0; i < basePass.length - 3; i++ ) {
    const randomChange = Math.floor( basePass.length * Math.random() );
    basePass = `${basePass.substring(0,randomChange)}${( basePass[ randomChange ] ).toUpperCase()}${basePass.substring(randomChange + 1, basePass.length )}`;
  }
  return basePass;
};

export const findAllIndexes = ( string, substring ) => {
  var a = [],
    i = -1;
  while ( ( i = string.indexOf( substring, i + 1 ) ) >= 0 ) a.push( i );
  return a;
}