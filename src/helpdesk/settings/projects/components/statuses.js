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
import {
  actions
} from 'configs/constants/statuses';
import Select from 'react-select';
import {
  pickSelectStyle
} from "configs/components/select";

const defaultTagColor = '#f759f2';

export default function Statuses( props ) {
  const {
    statuses,
    addStatus,
    deleteStatus,
    updateStatus,
  } = props;

  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ icon, setIcon ] = React.useState( "fa fa-play" );
  const [ action, setAction ] = React.useState( actions[ 0 ] );
  const [ color, setColor ] = React.useState( defaultTagColor );
  const [ editColorID, setEditColorID ] = React.useState( null );

  return (
    <div>
      <h3 className="m-t-20 m-b-20"> Statuses  <span className="warning-big">*</span></h3>
      <table className="table m-t-10 vykazyTable">
        <thead>
          <tr>
            <th> Title </th>
            <th width="100px"> Order </th>
            <th width="150px"> Icon </th>
            <th width="250px"> Reaction </th>
            <th width="150px"> Color </th>
            <th width="50px"> Actions </th>
          </tr>
        </thead>

        <tbody>
          { sortBy(statuses,['order', 'title']).map(status =>
            <tr key={status.id}>
              <td>
                <input
                  className={`form-control ${inputError(status.title, 'text')}`}
                  value={ status.title }
                  onChange={e => updateStatus({ id: status.id, title: e.target.value})}
                  />
              </td>
              <td>
                <input
                  type="number"
                  className={`form-control ${inputError(status.order, 'number')}`}
                  value={ status.order }
                  onChange={e => updateStatus({ id: status.id, order: isNaN(parseInt(e.target.value)) ? e.target.value : parseInt(e.target.value) })}
                  />
              </td>
              <td>
                <input
                  className={`form-control ${inputError(status.order, 'text')}`}
                  value={ status.icon }
                  onChange={e => updateStatus({ id: status.id, icon: e.target.value })}
                  />
              </td>
              <td>
                <Select
                  id="actionIfSelected"
                  name="Action"
                  styles={pickSelectStyle()}
                  options={actions}
                  value={actions.find((action) => action.value === status.action )}
                  onChange={e => updateStatus({ id: status.id, action: e.value }) }
                  />
              </td>
              <td>
                <button
                  id={`add-color-picker-${status.id}`}
                  style={{backgroundColor: status.color }}
                  className={`btn full-width ${inputError(status.color, 'color')}`}
                  onClick={ () => setEditColorID(status.id) }
                  >
                </button>
                <Popover
                  placement="left"
                  target={`add-color-picker-${status.id}`}
                  toggle={() => setEditColorID(null) }
                  isOpen={editColorID !== null && editColorID === status.id }
                  >
                  <PopoverHeader>Change color</PopoverHeader>
                  <PopoverBody>
                    <SketchPicker
                      id="color"
                      color={status.color}
                      onChangeComplete={value => updateStatus({ id: status.id, color: value.hex })}
                      />
                      <div className="p-t-5 row">
                        <button
                          className="btn-link-cancel btn-distance"
                          onClick={() => {
                            setEditColorID(null);
                          }}
                          >
                          Close
                        </button>
                      </div>
                  </PopoverBody>
                </Popover>
              </td>
              <td>
                <button
                  className="btn m-r-5"
                  onClick={() => deleteStatus(status.id) }
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
              <input
                className={`form-control ${inputError(icon, 'text')}`}
                value={ icon }
                onChange={e => setIcon(e.target.value)}
                />
            </td>
            <td>
              <Select
                id="actionIfSelected"
                name="Action"
                styles={pickSelectStyle()}
                options={actions}
                value={action}
                onChange={e => setAction( e ) }
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
                    <div className="p-t-5 row">
                      <button
                        className="btn-link-cancel btn-distance"
                        onClick={() => {
                          setEditColorID(null);
                        }}
                        >
                        Close
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
                  addStatus({
                    title,
                    color,
                    icon,
                    action: action.value,
                    order: parseInt(order)
                  })
                  setEditColorID(null);
                  setTitle("");
                  setOrder(0);
                  setIcon('fa fa-play');
                  setAction(actions[0]);
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