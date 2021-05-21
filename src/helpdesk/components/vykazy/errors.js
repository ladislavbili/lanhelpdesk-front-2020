export const getCreationError = ( newSubtaskType, newSubtaskAssigned, company, userRights ) => {
  //let noType = newSubtaskType.id === null;
  let noType = false;
  let noAssigned = newSubtaskAssigned.length === 0;
  let noCompany = company === null;
  let messages = [];
  if ( noAssigned && userRights.assignedRead ) {
    messages.push( 'assign the task to someone' );
  }
  if ( noType && userRights.typeRead ) {
    messages.push( 'pick task type' );
  }
  if ( noCompany && userRights.companyRead ) {
    messages.push( 'pick company' );
  }

  if ( messages.length === 0 ) {
    return ''
  }
  let errorMessage = 'First ';
  for ( let i = 0; i < messages.length; i++ ) {
    if ( i === messages.length - 1 ) {
      errorMessage += `${messages.length > 1 ? 'and ' : ''} ${messages[i]}!`
    } else {
      errorMessage += `${messages[i]}${messages.length-2 === i ? ' ' : ', '}`
    }
  }
  return errorMessage;
}