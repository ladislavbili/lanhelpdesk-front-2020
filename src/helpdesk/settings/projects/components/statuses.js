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
  inputError,
  translateAllSelectItems,
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";
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

  const {
    t
  } = useTranslation();

  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ icon, setIcon ] = React.useState( "fa fa-play" );
  const [ action, setAction ] = React.useState( translateAllSelectItems( actions, t )[ 0 ] );
  const [ color, setColor ] = React.useState( defaultTagColor );
  const [ editColorID, setEditColorID ] = React.useState( null );

  const firstNewStatus = statuses.find( ( status ) => status.action === 'IsNew' );
  const firstNewStatusId = firstNewStatus ? firstNewStatus.id : null;
  return (
    <div>
      <table className="table m-t-10 vykazyTable">
        <thead>
          <tr>
            <th>{t('title')}</th>
            <th width="100px">{t('order')}</th>
            <th width="150px">{t('icon')}</th>
            <th width="250px">{t('reaction')}</th>
            <th width="150px">{t('color')}</th>
            <th width="50px">{t('actions')}</th>
          </tr>
        </thead>

        <tbody>
          { sortBy(statuses,[{key: 'order', asc: true }, {key: 'title', asc: true }]).map(status =>
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
                  options={translateAllSelectItems(actions,t)}
                  value={translateAllSelectItems(actions,t ).find((action) => action.value === status.action )}
                  isDisabled={status.id === firstNewStatusId}
                  onChange={e => updateStatus({ id: status.id, action: e.value }) }
                  />
              </td>
              <td>
                <button
                  id={`add-color-picker-${status.id}`}
                  style={{backgroundColor: status.color }}
                  className={`btn full-width ${inputError(status.color, 'color')}`}
                  onClick={ () => setEditColorID(status.id) }
                  />
                <Popover
                  placement="left"
                  target={`add-color-picker-${status.id}`}
                  toggle={() => setEditColorID(null) }
                  isOpen={editColorID !== null && editColorID === status.id }
                  >
                  <PopoverHeader>{t('changeColor')}</PopoverHeader>
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
                        {t('close')}
                      </button>
                    </div>
                  </PopoverBody>
                </Popover>
              </td>
              <td>
                { status.id !== firstNewStatusId &&
                  <button
                    className="btn m-r-5"
                    onClick={() => deleteStatus(status.id) }
                    >
                    <i className="fa fa-times" />
                  </button>
                }
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
                options={translateAllSelectItems(actions,t )}
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
                  setAction(translateAllSelectItems(actions, t)[0]);
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