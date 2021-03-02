import React from 'react';
import {
  Tooltip
} from 'reactstrap';
import {
  timestampToString
} from './moment';

const ImportantIcon = function ImportantIcon( props ) {
  const {
    item
  } = props;
  const [ tooltipOpen, setTooltipOpen ] = React.useState( false );
  return (
    <span>
    <i className="far fa-star" style={{ color: '#ffc107' }} id={`important-${item.id}`} />
      <Tooltip placement="top" target={`important-${item.id}`} isOpen={tooltipOpen} toggle={() => setTooltipOpen(!tooltipOpen) } >
        Task is important!
      </Tooltip>
  </span>
  )
}

const InvoicedIcon = function InvoicedIcon( props ) {
  const {
    item
  } = props;
  const [ tooltipOpen, setTooltipOpen ] = React.useState( false );
  return (
    <span>
      <i className="far fa-file-alt" id={`invoiced-${item.id}`}/>
      <Tooltip placement="top" target={`invoiced-${item.id}`} isOpen={tooltipOpen} toggle={() => setTooltipOpen(!tooltipOpen) } >
        Task is invoiced!
      </Tooltip>
  </span>
  )
}

export const getItemDisplayValue = ( item, value ) => {
  if ( !item[ value.value ] && ( value.type === 'important' || value.type === 'invoiced' || value.type === 'checkbox' ) ) {
    return null;
  }
  if ( !item[ value.value ] && value.type !== 'boolean' ) {
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
  } else if ( value.type === 'boolean' ) {
    return item[ value.value ] ? "Yes" : "No";
  } else if ( value.type === 'list' ) {
    return value.func( item[ value.value ] );
  } else if ( value.type === 'date' ) {
    return timestampToString( item[ value.value ] );
  } else if ( value.type === 'user' ) {
    return item[ value.value ].name + ' ' + item[ value.value ].surname;
  } else if ( value.type === "important" ) {
    return <ImportantIcon item={item} />;
  } else if ( value.type === "invoiced" ) {
    return <InvoicedIcon item={item} />;
  } else if ( value.type === "checkbox" ) {
    return null;
  } else {
    return 'Error'
  }
}