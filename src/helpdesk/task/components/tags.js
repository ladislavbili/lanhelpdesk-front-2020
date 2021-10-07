import React from 'react';
import GeneralPopover from 'components/generalPopover';
import classnames from 'classnames';

export default function TagsPickerPopover( props ) {
  const {
    taskID,
    items,
    menuClassName,
    menuStyle,
    bodyClassName,
    bodyStyle,
    showFilter,
    onChange,
    disabled,
    selected,
  } = props;
  const coloredItems = ( items && items.length !== 0 ) ? items[ 0 ].hasOwnProperty( 'color' ) : false;

  const [ tagsOpen, setTagsOpen ] = React.useState( false );
  const [ filter, setFilter ] = React.useState( "" );

  return (
    <div className="row mb-auto">
      <button className="btn-link m-b-10 h-20-f btn-distance" id={`edit-tags-${taskID}`} onClick={ () => setTagsOpen(true) } >
        <i className="fa fa-plus" />
        Tags
      </button>
      <GeneralPopover
        placement="bottom-start"
        className="overflow-auto max-height-400"
        target={`edit-tags-${taskID}`}
        header="Select tags"
        reset={() => {}}
        submit={() => {}}
        open={ tagsOpen }
        close={() => setTagsOpen(false)}
        >
        <div
          className={`${menuClassName ? menuClassName : ''} p-0`}
          style={ menuStyle ? { width:'max-content', ...menuStyle} : { width:'max-content' } }
          >
          <div
            className={`${bodyClassName ? bodyClassName : ''}`}
            style={ bodyStyle ? bodyStyle : {} }
            >
            { showFilter !== false &&
              <input
                className="form-control m-b-15"
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
      </div>
      </GeneralPopover>
    </div>
  );
}