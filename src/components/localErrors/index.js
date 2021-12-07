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
import ModalError from './modalError';
import classnames from 'classnames';
import {
  GET_LOCAL_ERRORS,
} from 'apollo/localSchema/queries';
import {
  clearLocalErrors,
} from 'apollo/localSchema/actions';
import {
  useTranslation
} from "react-i18next";
import Empty from '../Empty';

export default function LocalErrors( props ) {

  const {
    history,
    location
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: localErrorsData,
  } = useQuery( GET_LOCAL_ERRORS );
  const [ open, setOpen ] = React.useState( false );
  const [ openedError, setOpenedError ] = React.useState( null );
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
          <DropdownItem header={true}>{t('localErrors')}</DropdownItem>
          { localErrorsData.localErrors.slice(0,10).map( (localError, index) => {
            if(localError.apollo){
              const errors = localError.errors;
              return (
                <DropdownItem
                  key={index}
                  onClick={ () => setOpenedError( localError ) }
                  className='notification-read-small'
                  >
                  <div>
                    {errors.map((error, index) => (
                      <div key={index}>
                        {error.message}
                      </div>
                    ) )}
                  </div>
                </DropdownItem>
              )
            }
            const error = localError.error;
            return (
              <DropdownItem
                key={index}
                onClick={ () => setOpenedError( localError ) }
                className='notification-read-small'
                >
                <div>
                  {error.message}
                </div>
              </DropdownItem>
            )
          } )}
          <DropdownItem divider={true}/>
          <DropdownItem onClick={() => {
              if(window.confirm(t('generalConfirmation'))){
                clearLocalErrors()
              }
            }}>
            <span style={{ color: 'red' }}>{t('clearLocalErrors')}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ModalError opened={openedError !== null} close={() => setOpenedError(null)} localError={openedError} />
    </Empty>
  )
}