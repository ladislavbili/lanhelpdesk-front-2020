export const deleteAttributes = ( object, attList ) => {
  let newObject = {
    ...object
  };
  attList.forEach( ( att ) => delete newObject[ att ] );
  return newObject;
}

export const objectToAtributeArray = ( object, attribute ) => {
  return object.map( attr => attr[ attribute ] );
}