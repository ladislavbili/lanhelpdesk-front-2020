import React from 'react';
import {
  timestampToString
} from './moment';

export const getItemDisplayValue = ( item, value ) => {
  if ( !item[ value.value ] && ( value.type === 'important' || value.type === 'invoiced' || value.type === 'checkbox' ) ) {
    return null;
  }
  if ( !item[ value.value ] ) {
    return 'Neexistuje';
  }
  if ( value.type === 'object' ) {
    if ( value.value === "status" ) {
      return <span className="label label-info" style={{
          backgroundColor: item[value.value]
            ? item[value.value].color
            : "white"
        }}>{
          item[value.value]
            ? item[value.value].title
            : "No status"
        }</span>
    }
    return item[ value.value ].title;
  } else if ( value.type === 'text' ) {
    return item[ value.value ];
  } else if ( value.type === 'custom' ) {
    return value.func( item );
  } else if ( value.type === 'url' ) {
    return <a onClick={(e) => e.stopPropagation()} href={item[value.value]} target="_blank" without="without" rel="noopener noreferrer">{
        item[value.value]
          ? item[value.value]
          : ''
      }</a>;
  } else if ( value.type === 'int' ) {
    return parseInt( item[ value.value ] );
  } else if ( value.type === 'list' ) {
    return value.func( item[ value.value ] );
  } else if ( value.type === 'date' ) {
    return timestampToString( item[ value.value ] );
  } else if ( value.type === 'user' ) {
    return item[ value.value ].name + ' ' + item[ value.value ].surname;
  } else if ( value.type === "important" ) {
    return <i className="far fa-star" style={{
        color: '#ffc107'
      }}/>;
  } else if ( value.type === "invoiced" ) {
    return <i className="far fa-file-alt"/>;
  } else if ( value.type === "checkbox" ) {
    return <i className="far fa-star" style={{
        color: '#ffc107'
      }}/>;
  } else {
    return 'Error'
  }
}