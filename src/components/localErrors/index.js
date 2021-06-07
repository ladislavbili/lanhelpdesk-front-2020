import React from 'react';
import {
  useQuery,
} from "@apollo/client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import classnames from 'classnames';
import {
  GET_LOCAL_ERRORS,
} from 'apollo/localSchema/queries';
import {
  clearLocalErrors,
} from 'apollo/localSchema/actions';
import Empty from '../Empty';

export default function LocalErrors( props ) {

  const {
    history,
    location
  } = props;

  const {
    data: localErrorsData,
  } = useQuery( GET_LOCAL_ERRORS );
  const [ open, setOpen ] = React.useState( false );
  const count = localErrorsData.localErrors.length;
  if ( count === 0 ) {
    return null;
  }
  return (
    <Empty>
      <Dropdown className="center-hor" isOpen={open} toggle={() => setOpen(!open)}>
        <DropdownToggle className="header-dropdown header-with-text">
          <i className="header-icon-with-text fa fa fa-exclamation-circle"/>
          <span className="m-l-2 header-icon-text clickable">{count > 99 ? '99+' : count }</span>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header={true}>Local Errors</DropdownItem>
          { localErrorsData.localErrors.slice(0,10).map( (localError) =>
            <DropdownItem
              key={localError.id}
              onClick={ () => {
              }}
              className='notification-read-small'
              >
              <div>
                {localError.message}
              </div>
            </DropdownItem>
          )}
          <DropdownItem divider={true}/>
          <DropdownItem onClick={() => {
              if(window.confirm('Are you sure?')){
                clearLocalErrors()
              }
            }}>
            <span style={{ color: 'red' }}>Clear local errors</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Empty>
  )
}