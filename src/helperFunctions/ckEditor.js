import {
  base64ToImg,
} from './imageManipulations';
import {
  REST_URL,
} from 'configs/restAPI';

export const changeCKEData = ( input ) => {
  return input.replace( /<p>/g, "<p style='margin-bottom: 0px; padding-bottom: 0px;'>" );
}

export const extractImages = ( value ) => {
  let newValue = value;
  let allImages = [];
  let imageIndex = 0;
  while ( imageIndex !== null ) {
    imageIndex = newValue.indexOf( 'src="data:' );
    if ( imageIndex > -1 ) {
      imageIndex += 5;
      const dataIndex = newValue.substring( imageIndex, newValue.length )
        .indexOf( '"' );
      const elementEndIndex = newValue.substring( imageIndex, newValue.length )
        .indexOf( '>' );
      const imageData = newValue.substring( imageIndex, imageIndex + dataIndex );
      const imageId = allImages.length;
      const imageFile = base64ToImg( imageData, `text-image-${imageId}` );
      allImages.push( imageFile );
      newValue = `
      ${newValue.substring(0,imageIndex)}${imageFile.name}" alt="temp-picture"${newValue.substring( imageIndex + elementEndIndex, newValue.length )
      }`;
    } else {
      imageIndex = null;
    }
  }
  return {
    value: newValue,
    files: allImages,
  }

}

export const replacePlaceholdersWithLinks = ( value, linkData, restAction ) => {
  console.log( linkData );
  let newValue = value;
  linkData.forEach( ( imageFile ) => {
    const match = `src="${imageFile.filename}" alt="temp-picture">`;
    const srcIndex = newValue.indexOf( match );
    newValue = `${newValue.substring(0, srcIndex )}src="${REST_URL}/${restAction}?path=${imageFile.path}" alt="saved-picture">${newValue.substring(srcIndex + match.length , newValue.length )}`
  } )
  return newValue;
}

export const getDeletedImages = ( value, allImages, restAction ) => {
  return allImages.filter( ( image ) => !value.includes( `/${restAction}?path=${image.path}" alt="saved-picture">` ) ).map( ( image ) => image.id );
};