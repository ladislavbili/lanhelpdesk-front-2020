import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';
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

  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ color, setColor ] = React.useState( defaultTagColor );
  const [ editColorID, setEditColorID ] = React.useState( null );

  return (
    <div>
      <h3 className="m-t-20 m-b-20"> Tags  <span className="warning-big">*</span></h3>
      <table className="table m-t-10 vykazyTable">
        <thead>
          <tr>
            <th> Title </th>
            <th width="100px"> Order </th>
            <th width="150px"> Color </th>
            <th width="50px"> Actions </th>
          </tr>
        </thead>

        <tbody>
          { sortBy(tags,['order', 'title']).map(tag =>
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
                  <PopoverHeader>Change color</PopoverHeader>
                  <PopoverBody>
                    <SketchPicker
                      id="color"
                      color={tag.color}
                      onChangeComplete={value => updateTag({ id: tag.id, color: value.hex })}
                      />
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
                <PopoverHeader>Change color</PopoverHeader>
                <PopoverBody>
                  <SketchPicker
                    id="color"
                    color={color}
                    onChangeComplete={value => setColor( value.hex )}
                    />
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