import React from 'react';
import {
  useMutation,
  useApolloClient,
} from "@apollo/client";
import classnames from "classnames";

import SettingsInput from '../components/settingsInput';
import {
  useTranslation
} from "react-i18next";

import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  GET_TRIP_TYPES,
  ADD_TRIP_TYPE,
} from './queries';

export default function TripTypeAdd( props ) {
  const {
    history
  } = props;

  const {
    t
  } = useTranslation();
  const client = useApolloClient();

  const [ addTripType ] = useMutation( ADD_TRIP_TYPE );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ saving, setSaving ] = React.useState( false );

  //functions
  const addTripTypeFunc = () => {
    setSaving( true );
    addTripType( {
        variables: {
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
        }
      } )
      .then( ( response ) => {
        history.push( `/helpdesk/settings/tripTypes/${response.data.addTripType.id}` )
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
  }

  const cannotSave = () => {
    return saving || title.length === 0;
  }

  return (
    <div className="scroll-visible p-20 fit-with-header">
      <h2 className="m-b-20" >
        {`${t('add')} ${t('tripType').toLowerCase()}`}
      </h2>

      <SettingsInput
        required
        label={t('tripTypeTitle')}
        id="title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        />

      <SettingsInput
        label={t('order')}
        placeholder={t('lowerMeansFirst')}
        id="order"
        value={order}
        onChange={(e) => {
          setOrder(e.target.value);
        }}
        />

      <div className="form-buttons-row">
        { cannotSave() &&
          <div className="message error-message ml-auto m-r-14">
            {t('fillAllRequiredInformation')}
          </div>
        }
        <button
          className={classnames(
            "btn",
            {"ml-auto": !cannotSave()}
          )}
          disabled={cannotSave()}
          onClick={addTripTypeFunc}
          >
          { saving ? `${t('adding')}...` : `${t('add')} ${t('tripType').toLowerCase()}` }
        </button>
      </div>
    </div>
  )
}