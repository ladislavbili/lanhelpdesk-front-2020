import React from 'react';
import Checkbox from 'components/checkbox';

export default function CheckboxList( props ) {
  const {
    items,
    disabled,
    onChange,
    submitItem,
    deleteItem,
    placeholder,
    newPlaceholder,
    label
  } = props;

  const [ addItem, setAddItem ] = React.useState( false );
  const [ title, setTitle ] = React.useState( '' );
  const [ done, setDone ] = React.useState( false );
  return (
    <div className="attachments">
      { items.map((item) =>
        <div className="row" id={item.id}>
          <Checkbox
            className = "m-l-5 m-r-5"
            centerVer
            centerHor
            disabled = {disabled}
            value = { item.done }
            onChange={() => onChange({...item, done: !item.done })}
            />
          <input type="text"
            disabled={disabled}
            value={item.title}
            className="hidden-input flex"
            onChange={(e) => onChange({...item, title: e.target.value })}
            placeholder={placeholder}
            />
            <button
              className="btn btn-link-add waves-effect"
              disabled={disabled}
              onClick={()=>{
                deleteItem(item);
              }}
              >
              <i className="fa fa-times" />
            </button>

        </div>
      ) }
      { addItem &&
        <div className="row" id="add">
          <Checkbox
            className = "m-l-5 m-r-5"
            centerVer
            centerHor
            disabled = {disabled}
            value = { done }
            onChange={() => setDone(!done )}
            />
          <input
            type="text"
            disabled={disabled}
            value={title}
            className="hidden-input flex"
            onChange={(e) => setTitle(e.target.value)}
            placeholder={newPlaceholder}
            />
          <button
            className="btn btn-link-add waves-effect"
            disabled={disabled}
            onClick={()=>{
              submitItem({
                title,
                done
              });
              setAddItem(false);
              setTitle('');
              setDone(false);
            }}
            >
            <i className="fa fa-plus" />
          </button>
          <button
            className="btn btn-link-add waves-effect"
            disabled={disabled}
            onClick={()=>{
              setAddItem(false);
            }}
            >
            <i className="fa fa-times" />
          </button>
        </div>
      }
      { !addItem &&
        <button
          className="btn btn-link-add waves-effect"
          disabled={disabled}
          onClick={()=>{
            setAddItem(true);
          }}
          >
          <i className="fa fa-plus" />
          {` ${label}`}
        </button>
      }
    </div>
  )
}