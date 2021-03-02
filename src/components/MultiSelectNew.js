import React from 'react';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap';
import Checkbox from './checkbox';

export default function MultiSelect( props ) {

  const {
    className,
    disabled,
    direction,
    style,
    header,
    closeMultiSelect,
    open,
    items,
    selected,
    onChange,
  } = props;

  const [ filter, setFilter ] = React.useState( "" );

  const coloredItems = ( items && items.length !== 0 ) ? items[ 0 ].hasOwnProperty( 'color' ) : false;

  return (
    <ButtonDropdown
      className={ className }
      direction={ direction ? direction : "left" }
      style={ style ? style : {} }
      isOpen={ open && !disabled }
      toggle={ closeMultiSelect }
      >
      <DropdownToggle className="bkg-white p-0 m-0" style={{ width: 0 }}>
      </DropdownToggle>
      <DropdownMenu style={{width:'max-content'}} className="p-0">
        <div className="dynamic-commandbar multiselect-header">
          {header}
        </div>
        <input
          className="form-control"
          placeholder="Filter"
          disabled={disabled}
          value={ filter }
          onChange={e => setFilter(e.target.value) }
          />
        { !items &&
          <span className="message error-message">{ ` Provided items are of value ${items}` }</span>
        }
        { items && items.filter((item) => item.label.toLowerCase().includes(filter.toLowerCase()) ).map((item) => (
          <div
            key={item.id}
            className="multiselect-item"
            onClick={() => {
              if(disabled){
                return;
              }
              const removed = selected.some((selected) => selected.id === item.id );
              const newItems = ( removed
                ?
                selected.filter((selected) => selected.id !== item.id )
                :
                [ ...selected, item ]
              )
              onChange( newItems, item, removed )
            }}
            >
            { selected.some((selected) => selected.id === item.id )
              ?
              <i className="far fa-check-circle" style={{ color: 'green' }} />
              :
              <i className="fa fa-times" style={{ color: 'red', width: 18, paddingLeft: 1 }} />
            }
            <span className="m-r-5 p-l-5 p-r-5" style={ coloredItems ? { backgroundColor: item.color, color: 'white', borderRadius: 3, fontWeight: 'normal' } : {} }>
              {item.label}
            </span>
          </div>
        ))
      }
    </DropdownMenu>
  </ButtonDropdown>
  );
}