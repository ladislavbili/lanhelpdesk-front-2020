import React from 'react';
import Checkbox from 'components/checkbox';
import {
  Label
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";

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

  const {
    t
  } = useTranslation();

  const [ addItem, setAddItem ] = React.useState( false );
  const [ title, setTitle ] = React.useState( '' );
  const [ done, setDone ] = React.useState( false );
  const [ editedItem, setEditedItem ] = React.useState( null );
  return (
    <div className="form-section">
          <Label>{t('shortSubtasks')}</Label>
          <div></div>
          <div className="form-section-rest">
      { items.map((item) =>
        <div className="row" key={item.id}>
          <Checkbox
            className = "m-r-5"
            centerVer
            centerHor
            disabled = {disabled}
            value = { item.done }
            onChange={() => onChange({...item, done: !item.done })}
            />
          <input type="text"
            disabled={disabled}
            value={ ( editedItem && editedItem.id === item.id) ? editedItem.title : item.title }
            className="form-control hidden-input flex"
            onFocus={ () => setEditedItem(item) }
            onBlur={() => onChange(editedItem)}
            onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value }) }
            placeholder={placeholder}
            />
            <button
              className="btn-link"
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
            className = "m-r-5"
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
            className="form-control hidden-input flex"
            onChange={(e) => setTitle(e.target.value)}
            placeholder={newPlaceholder}
            />
          <button
            className="btn-link btn-distance"
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
            className="btn-link"
            disabled={disabled}
            onClick={()=>{
              setAddItem(false);
            }}
            >
            <i className="fa fa-times" />
          </button>
        </div>
      }
      { !addItem && !disabled &&
        <button
          className="btn-link"
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
  </div>
  )
}