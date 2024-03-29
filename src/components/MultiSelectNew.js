import React from 'react';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap';
import Checkbox from './checkbox';
import GeneralPopover from './generalPopover';

export default function MultiSelect( props ) {

  const {
    className,
    menuClassName,
    bodyClassName,
    disabled,
    showFilter,
    direction,
    style,
    menuStyle,
    bodyStyle,
    header,
    target,
    closeMultiSelect,
    open,
    items,
    selected,
    onChange,
    useLegacy,
  } = props;

  const [ filter, setFilter ] = React.useState( "" );
  const [ random ] = React.useState( ( Math.random() * 100000 )
    .toFixed( 0 ) );
  const coloredItems = ( items && items.length !== 0 ) ? items[ 0 ].hasOwnProperty( 'color' ) : false;
  const renderPopover = () => (
    <GeneralPopover
        placement="bottom-start"
        className="overflow-auto max-height-400"
        target={target !== undefined ?  target : `savepoint-${random}`}
        header={`${header ? header : ''}`}
        reset={() => {}}
        submit={closeMultiSelect}
        open={ open }
        close={closeMultiSelect}
        useLegacy={useLegacy}
        >
        <div
          className={`${bodyClassName ? bodyClassName : ''}`}
          style={ bodyStyle ? bodyStyle : {} }
          >
          { showFilter !== false &&
            <input
              className="form-control"
              placeholder="Filter"
              disabled={disabled}
              value={ filter }
              onChange={e => setFilter(e.target.value) }
              />
          }
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
      </div>
    </GeneralPopover>
  );

  if ( target !== undefined ) {
    return renderPopover();
  }
  console.log( 'missing target', header );
  return (
    <div>
      <span id={`savepoint-${random}`}/>
      {renderPopover()}
    </div>
  );
}