import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient
} from "@apollo/client";
import {
  ListGroupItem,
  Label
} from 'reactstrap';
import Select from 'react-select';
import classnames from 'classnames';
import Loading from 'components/loading';
import {
  invisibleSelectStyleNoArrow
} from 'configs/components/select';
import ErrorInfo from './errorInfo';

import {
  timestampToString
} from 'helperFunctions';

import {
  GET_ERROR_MESSAGES,
  SET_ERROR_MESSAGE_READ,
  SET_ALL_ERROR_MESSAGES_READ,
  DELETE_ALL_ERROR_MESSAGES,
  DELETE_SELECTED_ERROR_MESSAGES,
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
    history
  } = props;

  const {
    data: errorMessagesData,
    loading: errorMessagesLoading,
  } = useQuery( GET_ERROR_MESSAGES );

  const [ setErrorMessageRead ] = useMutation( SET_ERROR_MESSAGE_READ );
  const [ setAllErrorMessagesRead ] = useMutation( SET_ALL_ERROR_MESSAGES_READ );
  const [ deleteAllErrorMessages ] = useMutation( DELETE_ALL_ERROR_MESSAGES );
  const [ deleteSelectedErrorMessages ] = useMutation( DELETE_SELECTED_ERROR_MESSAGES );


  const [ searchFilter, setSearchFilter ] = React.useState( '' );
  const [ selectedErrorID, setSelectedErrorID ] = React.useState( null );
  const [ type, setType ] = React.useState( noTypeFilter );

  const client = useApolloClient();

  const writeDataToCache = ( newData ) => {
    client.writeQuery( {
      query: GET_ERROR_MESSAGES,
      data: {
        errorMessages: newData,
      }
    } );
  }

  const setErrorMessageReadFunc = ( error ) => {
    setSelectedErrorID( error.id );

    if ( !error.read ) {
      setErrorMessageRead( {
          variables: {
            id: error.id,
            read: true,
          }
        } )
        .then( ( response ) => {
          const allErrorMessages = client.readQuery( {
              query: GET_ERROR_MESSAGES
            } )
            .errorMessages;
          const newData = allErrorMessages.map( message => message.id !== error.id ? ( {
            ...message
          } ) : ( {
            ...message,
            read: true
          } ) );
          writeDataToCache( newData );
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
  }

  const markAllAsRead = () => {
    if ( window.confirm( 'Ste si istý že chcete všetky správy označiť ako prečítané?' ) ) {
      setAllErrorMessagesRead( {
          variables: {
            read: true,
          }
        } )
        .then( ( response ) => {
          const allErrorMessages = client.readQuery( {
              query: GET_ERROR_MESSAGES
            } )
            .errorMessages;
          const newData = allErrorMessages.map( message => ( {
            ...message,
            read: true
          } ) );
          writeDataToCache( newData );
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
  }

  const deleteAll = () => {
    if ( window.confirm( 'Ste si istý že chcete všetky správy vymazať?' ) ) {
      deleteAllErrorMessages()
        .then( ( response ) => {
          writeDataToCache( [] );
          setSelectedErrorID( null );
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
  }

  const deleteRead = () => {
    if ( window.confirm( 'Ste si istý že chcete všetky prečítané správy vymazať?' ) ) {
      const readErrorMessages = errorMessages.filter( errorMessage => errorMessage.read )
        .map( errorMessage => errorMessage.id );
      deleteSelectedErrorMessages( {
          variables: {
            ids: readErrorMessages,
          }
        } )
        .then( ( response ) => {
          const allErrorMessages = client.readQuery( {
              query: GET_ERROR_MESSAGES
            } )
            .errorMessages;
          const newData = allErrorMessages.filter( message => !message.read );
          writeDataToCache( newData );
          setSelectedErrorID( null );
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
    <div className="content">
      <div className="row m-0 p-0 taskList-container">
        <div className="col-lg-4">
          <div className="commandbar">
            <div className="search-row">
              <div className="search">
                <button className="search-btn" type="button">
                  <i className="fa fa-search" />
                </button>
                <input
                  type="text"
                  className="form-control search-text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter( e.target.value )}
                  placeholder="Search"
                  />
              </div>
            </div>
            <span className="ml-3 center-hor mr-3" style={{width:175}}>
              <Select
                value={type}
                onChange={(type) => setType( type ) }
                options={getTypes()}
                styles={invisibleSelectStyleNoArrow}
                />
            </span>
          </div>
          <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
            <div className=" p-l-10 p-b-10 row">
              <h2>
                Error messages
              </h2>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-link waves-effect"
                onClick={markAllAsRead}
                disabled={errors.every((error)=>error.read)}>
                Označit všetky ako prečítané
              </button>
              <button
                type="button"
                className="btn btn-link waves-effect"
                onClick={deleteAll}
                disabled={errors.length === 0}>
                Vymazať všetky
              </button>
              <button
                type="button"
                className="btn btn-link waves-effect"
                onClick={deleteRead}
                disabled={errors.filter((error)=>error.read).length === 0}>
                Vymazať prečítané
              </button>
            </div>
            <div>
              <table className="table table-hover">
                <tbody>
                  {
                    errors.map((error) =>
                    <tr
                      key={error.id}
                      className={classnames({ 'notification-read': error.read,
                        'notification-not-read': !error.read,
                        'sidebar-item-active': selectedErrorID === error.id },
                        "clickable")}
                        onClick={() => setErrorMessageReadFunc(error)}
                        >
                        <td className={(selectedErrorID === error.id ? "text-highlight":"")}>
                          <i className={classnames({ 'far fa-envelope-open': error.read, 'fas fa-envelope': !error.read })} />
                          {error.source}
                          <div className="row">
                            <div>
                              {error.user ? error.user.email : "no user"}
                            </div>
                            <div className="ml-auto m-r-55">
                              {timestampToString(parseInt(error.createdAt))}
                            </div>
                          </div>
                          <div style={{overflowX:'hidden'}}>{error.errorMessage.substring(0, 150)}...</div>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
              {
                errorMessages.length === 0 &&
                <ListGroupItem>There are no errors!</ListGroupItem>
              }
            </div>

          </div>
        </div>
        <div className="col-lg-8">
          {
            selectedErrorID !== null &&
            <ErrorInfo errorMessage={ errorMessages.find((errorMessage) => errorMessage.id === selectedErrorID )} history={history} />
          }
          {
            selectedErrorID === null &&
            <div className="commandbar"></div>
          }
        </div>
      </div>
    </div>
  );
}