import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';

import {
  useTranslation
} from "react-i18next";
import {
  SketchPicker
} from "react-color";
import {
  sortBy,
  inputError
} from 'helperFunctions';

const defaultTagColor = '#f759f2';

export default function Tags( props ) {
  const {
    tags,
    addTag,
    deleteTag,
    updateTag,
  } = props;

  const {
    t
  } = useTranslation();

  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ color, setColor ] = React.useState( defaultTagColor );
  const [ editColorID, setEditColorID ] = React.useState( null );

  return (
    <div>
      <table className="table m-t-10 vykazyTable">
        <thead>
          <tr>
            <th>{t('title')}</th>
            <th width="100px">{t('order')}</th>
            <th width="150px">{t('color')}</th>
            <th width="50px">{t('actions')}</th>
          </tr>
        </thead>

        <tbody>
          { sortBy(tags,[{key: 'order', asc: true }, {key: 'title', asc: true }]).map(tag =>
            <tr key={tag.id}>
              <td>
                <input
                  className={`form-control ${inputError(tag.title, 'text')}`}
                  value={ tag.title }
                  onChange={e => updateTag({ id: tag.id, title: e.target.value})}
                  />
              </td>
              <td>
                <input
                  type="number"
                  className={`form-control ${inputError(tag.order, 'number')}`}
                  value={ tag.order }
                  onChange={e => updateTag({ id: tag.id, order: isNaN(parseInt(e.target.value)) ? e.target.value : parseInt(e.target.value) })}
                  />
              </td>
              <td>
                <button
                  id={`add-color-picker-${tag.id}`}
                  style={{backgroundColor: tag.color }}
                  className={`btn full-width ${inputError(tag.color, 'color')}`}
                  onClick={ () => setEditColorID(tag.id) }
                  >
                </button>
                <Popover
                  placement="left"
                  target={`add-color-picker-${tag.id}`}
                  toggle={() => setEditColorID(null) }
                  isOpen={editColorID !== null && editColorID === tag.id }
                  >
                  <PopoverHeader>{t('changeColor')}</PopoverHeader>
                  <PopoverBody>
                    <SketchPicker
                      id="color"
                      color={tag.color}
                      onChangeComplete={value => updateTag({ id: tag.id, color: value.hex })}
                      />
                    <div className="p-t-5 row">
                      <button
                        className="btn-link-cancel btn-distance"
                        onClick={() => {
                          setEditColorID(null);
                        }}
                        >
                        {t('close')}
                      </button>
                    </div>
                  </PopoverBody>
                </Popover>
              </td>
              <td>
                <button
                  className="btn m-r-5"
                  onClick={() => deleteTag(tag.id) }
                  >
                  <i className="fa fa-times" />
                </button>
              </td>
            </tr>
          ) }
          <tr key='add'>
            <td>
              <input
                className={`form-control`}
                value={ title }
                onChange={e => setTitle(e.target.value)}
                />
            </td>
            <td>
              <input
                type="number"
                className={`form-control ${inputError(order, 'number')}`}
                value={ order }
                onChange={e => setOrder(e.target.value)}
                />
            </td>
            <td>
              <button
                id="add-color-picker"
                style={{backgroundColor: color }}
                className={`btn full-width ${inputError(color, 'color')}`}
                onClick={ () => setEditColorID('add') }
                >
              </button>
              <Popover
                placement="left"
                isOpen={editColorID !== null && editColorID === 'add' }
                target="add-color-picker"
                toggle={() => setEditColorID(null) }
                >
                <PopoverHeader>{t('changeColor')}</PopoverHeader>
                <PopoverBody>
                  <SketchPicker
                    id="color"
                    color={color}
                    onChangeComplete={value => setColor( value.hex )}
                    />
                    <div className="p-t-5 row">
                      <button
                        className="btn-link-cancel btn-distance"
                        onClick={() => {
                          setEditColorID(null);
                        }}
                        >
                        {t('close')}
                      </button>
                    </div>
                </PopoverBody>
              </Popover>
            </td>
            <td>
              <button
                className="btn m-r-5"
                disabled={title.length === 0 || !color.includes('#') || isNaN(parseInt(order)) }
                onClick={() => {
                  addTag({
                    title,
                    color,
                    order: parseInt(order)
                  })
                  setEditColorID(null);
                  setTitle("");
                  setOrder(0);
                  setColor(defaultTagColor);
                }}
                >
                <i className="fa fa-plus" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}