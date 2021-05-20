import React from 'react';
import {
  useMutation,
  useQuery,
  useSubscription
} from "@apollo/client";
import {
  ListGroupItem,
  Label
} from 'reactstrap';
import Select from 'react-select';
import classnames from 'classnames';
import Loading from 'components/loading';
import {
  pickSelectStyle
} from 'configs/components/select';
import ErrorDetails from './errorDetails';

import {
  timestampToString
} from 'helperFunctions';

import {
  GET_ERROR_MESSAGES,
  SET_ERROR_MESSAGE_READ,
  SET_ALL_ERROR_MESSAGES_READ,
  DELETE_ALL_ERROR_MESSAGES,
  DELETE_SELECTED_ERROR_MESSAGES,
  ERROR_MESSAGES_SUBSCRIPTION,
} from './queries';

const noTypeFilter = {
  value: null,
  label: 'All types'
};
const readTypeFilter = {
  value: 'read',
  label: 'Read'
};
const unreadTypeFilter = {
  value: 'unread',
  label: 'Unread'
};

export default function ErrorList( props ) {
  const {
    history,
    match,
  } = props;

  const {
    data: errorMessagesData,
    loading: errorMessagesLoading,
    refetch: errorMessagesRefetch,
  } = useQuery( GET_ERROR_MESSAGES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( ERROR_MESSAGES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      errorMessagesRefetch();
    }
  } );

  const [ setErrorMessageRead ] = useMutation( SET_ERROR_MESSAGE_READ );
  const [ setAllErrorMessagesRead ] = useMutation( SET_ALL_ERROR_MESSAGES_READ );
  const [ deleteAllErrorMessages ] = useMutation( DELETE_ALL_ERROR_MESSAGES );
  const [ deleteSelectedErrorMessages ] = useMutation( DELETE_SELECTED_ERROR_MESSAGES );


  const [ searchFilter, setSearchFilter ] = React.useState( '' );
  const [ selectedErrorID, setSelectedErrorID ] = React.useState( null );
  const [ type, setType ] = React.useState( noTypeFilter );

  const setErrorMessageReadFunc = ( error ) => {
    setSelectedErrorID( error.id );

    if ( !error.read ) {
      setErrorMessageRead( {
          variables: {
            id: error.id,
            read: true,
          }
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
  }

  const markAllAsRead = () => {
    if ( window.confirm( 'Ste si istý že chcete všetky správy označiť ako prečítané?' ) ) {
      setSelectedErrorID( null );
      setAllErrorMessagesRead( {
          variables: {
            read: true,
          }
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
  }

  const deleteAll = () => {
    if ( window.confirm( 'Ste si istý že chcete všetky správy vymazať?' ) ) {
      setSelectedErrorID( null );
      deleteAllErrorMessages()
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
  }

  const deleteRead = () => {
    if ( window.confirm( 'Ste si istý že chcete všetky prečítané správy vymazať?' ) ) {
      setSelectedErrorID( null );
      const readErrorMessages = errorMessages.filter( errorMessage => errorMessage.read )
        .map( errorMessage => errorMessage.id );
      deleteSelectedErrorMessages( {
          variables: {
            ids: readErrorMessages,
          }
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
  }

  if ( errorMessagesLoading ) {
    return <Loading />
  }

  const errorMessages = errorMessagesData ? errorMessagesData.errorMessages : [];

  const filterErrors = () => {
    let search = searchFilter.toLowerCase();
    return errorMessages.filter( ( errorMessage ) => (
        (
          type.value === null ||
          ( errorMessage.type === type.value ) ||
          ( type.value === 'read' && errorMessage.read ) ||
          ( type.value === 'unread' && !errorMessage.read )
        ) && (
          ( timestampToString( errorMessage.createdAt )
            .includes( search ) ) ||
          ( errorMessage.errorMessage && errorMessage.errorMessage.toLowerCase()
            .includes( search ) ) ||
          ( errorMessage.source && errorMessage.source.toLowerCase()
            .includes( search ) ) ||
          ( errorMessage.sourceID && errorMessage.sourceID.toString()
            .toLowerCase()
            .includes( search ) ) ||
          ( errorMessage.type && errorMessage.type.toLowerCase()
            .includes( search ) )
        )
      ) )
      .sort( ( errorMessage1, errorMessage2 ) => errorMessage1.createdAt > errorMessage2.createdAt ? -1 : 1 )
  }

  const getTypes = () => {
    let typeFilter = [ noTypeFilter, readTypeFilter, unreadTypeFilter ];
    errorMessages.forEach( ( errorMessage ) => {
      if ( !typeFilter.some( ( type ) => type.value === errorMessage.type ) ) {
        typeFilter.push( {
          value: errorMessage.type,
          label: errorMessage.type
        } )
      }
    } );
    return typeFilter;
  }

  const errors = filterErrors();

  return (
    <div className="lanwiki-content row">
      <div className="col-lg-4">

        <div className="scroll-visible fit-with-header lanwiki-list">

          <h1>Error messages</h1>

          <div className="row">
            <div className="search-row" style={{width: "60%"}}>
              <div className="search">
                <input
                  type="text"
                  className="form-control search-text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter( e.target.value )}
                  placeholder="Search"
                  />
                <button className="search-btn" type="button">
                  <i className="fa fa-search" />
                </button>
              </div>
            </div>
            <span className="center-hor ml-auto" style={{width: "30%", backgroundColor: "white"}}>
              <Select
                value={type}
                onChange={(type) => setType( type ) }
                options={getTypes()}
                styles={pickSelectStyle([ 'invisible', ])}
                />
            </span>
          </div>

          <div>
            <button
              type="button"
              className="btn-link btn-distance"
              onClick={markAllAsRead}
              disabled={errors.every((error)=>error.read)}>
              Označit všetky ako prečítané
            </button>
            <button
              type="button"
              className="btn-link btn-distance"
              onClick={deleteAll}
              disabled={errors.length === 0}>
              Vymazať všetky
            </button>
            <button
              type="button"
              className="btn-link"
              onClick={deleteRead}
              disabled={errors.filter((error)=>error.read).length === 0}>
              Vymazať prečítané
            </button>
          </div>
          <div>
            { errors.map((error) =>
              <li
                key={error.id}
                className={classnames({ 'notification-read': error.read,
                  'notification-not-read': !error.read,
                  'sidebar-item-active': selectedErrorID === error.id },
                  "clickable")}
                  onClick={() => setErrorMessageReadFunc(error)}
                  >
                  <div className={(selectedErrorID === error.id ? "text-highlight":"")}>
                    <i className={classnames({ 'far fa-envelope-open': error.read, 'fas fa-envelope': !error.read })} />
                    {error.source}
                    <div className="row">
                      <div>
                        {error.user ? error.user.email : "no user"}
                      </div>
                      <div className="ml-auto">
                        {timestampToString(parseInt(error.createdAt))}
                      </div>
                    </div>
                    <div style={{overflowX:'hidden'}}>{error.errorMessage.substring(0, 150)}...</div>
                  </div>
                </li>
              )
            }
            { errorMessages.length === 0 &&
              <ListGroupItem>There are no errors!</ListGroupItem>
            }
          </div>

        </div>
      </div>
      <div className="col-lg-8">
        { selectedErrorID !== null &&
          <ErrorDetails errorMessage={ errorMessages.find((errorMessage) => errorMessage.id === selectedErrorID )} history={history} />
        }
        { selectedErrorID === null &&
          <div className="fit-with-header" style={{backgroundColor: "white"}}></div>
        }
      </div>
    </div>
  );
}