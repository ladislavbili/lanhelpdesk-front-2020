import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";
import classnames from 'classnames';
import {
  useTranslation
} from "react-i18next";

import Loading from 'components/loading';
import DeleteReplacement from 'components/deleteReplacement';
import SettingsInput from '../components/settingsInput';

import {
  toSelArr
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  GET_TRIP_TYPES,
  GET_TRIP_TYPE,
  UPDATE_TRIP_TYPE,
  DELETE_TRIP_TYPE,
} from './queries';

export default function TripTypeEdit( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();
  const client = useApolloClient();
  const allTripTypes = toSelArr( client.readQuery( {
      query: GET_TRIP_TYPES
    } )
    .tripTypes );
  const filteredTripTypes = allTripTypes.filter( tripType => tripType.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allTripTypes.length < 2;

  const {
    data: tripTypeData,
    loading: tripTypeLoading,
    refetch: tripTypeRefetch
  } = useQuery( GET_TRIP_TYPE, {
    variables: {
      id: parseInt( match.params.id )
    },
    fetchPolicy: 'network-only',
  } );

  const [ updateTripType ] = useMutation( UPDATE_TRIP_TYPE );
  const [ deleteTripType ] = useMutation( DELETE_TRIP_TYPE );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ saving, setSaving ] = React.useState( false );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );
  const [ dataChanged, setDataChanged ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !tripTypeLoading ) {
      setData();
    }
  }, [ tripTypeLoading ] );

  React.useEffect( () => {
    tripTypeRefetch( {
        variables: {
          id: parseInt( match.params.id )
        }
      } )
      .then( setData );
  }, [ match.params.id ] );

  // functions
  const setData = () => {
    if ( tripTypeLoading ) {
      return;
    }
    setTitle( tripTypeData.tripType.title );
    setOrder( tripTypeData.tripType.order );
    setDataChanged( false );
  }

  const updateTripTypeFunc = () => {
    setSaving( true );

    updateTripType( {
        variables: {
          id: parseInt( match.params.id ),
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
    setDataChanged( false );
  };

  const deleteTripTypeFunc = ( replacement ) => {
    if ( window.confirm( t( 'generalConfirmation' ) ) ) {
      deleteTripType( {
          variables: {
            id: parseInt( match.params.id ),
            newId: parseInt( replacement.id ),
          }
        } )
        .then( ( response ) => {
          history.push( '/helpdesk/settings/tripTypes' );
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  };

  if ( tripTypeLoading ) {
    return <Loading />
  }

  return (
    <div className="scroll-visible p-20 fit-with-header">

      <h2 className="m-b-20" >
        {`${t('edit')} ${t('tripType').toLowerCase()}`}
      </h2>

      <div className="p-20 scroll-visible fit-with-header-and-commandbar">

        <SettingsInput
          required
          label={t('tripTypeTitle')}
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setDataChanged( true );
          }}
          />

        <SettingsInput
          label={t('order')}
          placeholder={t('lowerMeansFirst')}
          id="order"
          value={order}
          onChange={(e) => {
            setOrder(e.target.value);
            setDataChanged( true );
          }}
          />

        <div className="form-buttons-row">
          <button
            className="btn-red"
            disabled={saving || theOnlyOneLeft}
            onClick={() => setDeleteOpen(true)}
            >
            {t('delete')}
          </button>

          <div className="ml-auto message m-r-10">
            { dataChanged &&
              <div className="message error-message">
                {t('saveBeforeLeaving')}
              </div>
            }
            { !dataChanged &&
              <div className="message success-message">
                {t('saved')}
              </div>
            }
          </div>

          <button
            className="btn m-t-5"
            disabled={saving}
            onClick={updateTripTypeFunc}>
            { saving ? `${t('saving')}...` : `${t('save')} ${t('tripType').toLowerCase()}` }
          </button>
        </div>
        <DeleteReplacement
          isOpen={deleteOpen}
          label={t('tripType')}
          options={filteredTripTypes}
          close={()=>setDeleteOpen(false)}
          finishDelete={deleteTripTypeFunc}
          />
      </div>
    </div>
  )
}