import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";
import classnames from 'classnames';

import {
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import Select from 'react-select';
import SettingsInput from '../components/settingsInput';
import SettingsHiddenInput from '../components/settingsHiddenInput';
import Loading from 'components/loading';
import ErrorMessage from 'components/errorMessage';
import Checkbox from 'components/checkbox';

import wellKnownOptions from 'configs/constants/wellKnown';
import {
  toSelArr
} from 'helperFunctions';
import {
  pickSelectStyle
} from "configs/components/select";
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  useTranslation
} from "react-i18next";

import {
  GET_SMTPS,
  GET_SMTP,
  UPDATE_SMTP,
  DELETE_SMTP,
  TEST_SMTP
} from './queries';

export default function SMTPEdit( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();
  const client = useApolloClient();
  const allSMTPs = toSelArr( client.readQuery( {
      query: GET_SMTPS
    } )
    .smtps );
  const filteredSMTPs = allSMTPs.filter( SMTP => SMTP.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allSMTPs.length === 1;

  const {
    data: smtpData,
    loading: smtpLoading,
    refetch: smtpRefetch
  } = useQuery( GET_SMTP, {
    variables: {
      id: parseInt( props.match.params.id )
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  } );

  const [ updateSmtp ] = useMutation( UPDATE_SMTP );
  const [ testSmtp ] = useMutation( TEST_SMTP );
  const [ deleteSmtp ] = useMutation( DELETE_SMTP );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ def, setDef ] = React.useState( false );
  const [ host, setHost ] = React.useState( "" );
  const [ port, setPort ] = React.useState( 465 );
  const [ username, setUsername ] = React.useState( "" );
  const [ password, setPassword ] = React.useState( "" );
  const [ rejectUnauthorized, setRejectUnauthorized ] = React.useState( false );
  const [ secure, setSecure ] = React.useState( true );

  const [ saving, setSaving ] = React.useState( false );
  const [ dataChanged, setDataChanged ] = React.useState( false );

  const [ tested, setTested ] = React.useState( false );
  const [ newSMTP, setNewSMTP ] = React.useState( null );
  const [ choosingNewSMTP, setChoosingNewSMTP ] = React.useState( false );
  const [ newDefSMTP, setNewDefSMTP ] = React.useState( null );
  const [ wellKnown, setWellKnown ] = React.useState( wellKnownOptions[ 0 ] );

  const wellKnownBlock = wellKnown.id !== null;

  // sync
  React.useEffect( () => {
    if ( !smtpLoading ) {
      const smtp = smtpData.smtp;
      setTitle( smtp.title );
      setOrder( smtp.order );
      setDef( smtp.def );
      setHost( smtp.host );
      setPort( smtp.port );
      setUsername( smtp.username );
      setPassword( smtp.password );
      setRejectUnauthorized( smtp.rejectUnauthorized );
      setSecure( smtp.secure );
      setWellKnown( wellKnownOptions.find( ( option ) => option.id === smtp.wellKnown ) );
      setTested( false );
      setDataChanged( false );
    }
  }, [ smtpLoading ] );

  React.useEffect( () => {
    smtpRefetch( {
      variables: {
        id: parseInt( match.params.id )
      }
    } );
  }, [ match.params.id ] );

  // functions
  const updateSMTPFunc = () => {
    setSaving( true );
    updateSmtp( {
        variables: {
          id: parseInt( match.params.id ),
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
          def,
          host,
          port: ( port !== '' ? parseInt( port ) : 0 ),
          username,
          password,
          rejectUnauthorized,
          secure,
          wellKnown: wellKnown.value
        }
      } )
      .then( ( response ) => {
        const updatedSMTP = {
          ...response.data.updateSmtp
        };
        if ( def ) {
          client.writeQuery( {
            query: GET_SMTPS,
            data: {
              smtps: [ ...allSMTPs.map( SMTP => {
                if ( SMTP.id === parseInt( match.params.id ) ) {
                  return ( {
                    ...updatedSMTP,
                    def: true
                  } );
                } else {
                  return ( {
                    ...SMTP,
                    def: false
                  } );
                }
              } ) ]
            }
          } );
        } else {
          client.writeQuery( {
            query: GET_SMTPS,
            data: {
              smtps: [ ...allSMTPs.filter( SMTP => SMTP.id !== parseInt( match.params.id ) ), updatedSMTP ]
            }
          } );
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
    setDataChanged( false );
  };

  const startTest = () => {
    let newSmtps = [ ...allSMTPs ];
    let smtpIndex = newSmtps.findIndex( ( smtp ) => smtp.id === parseInt( match.params.id ) );
    newSmtps[ smtpIndex ].currentlyTested = true;
    client.writeQuery( {
      query: GET_SMTPS,
      data: {
        smtps: newSmtps
      }
    } );
    setTested( true );
    testSmtp( {
      variables: {
        id: parseInt( match.params.id )
      }
    } );
  }

  const deleteSMTPFunc = () => {
    setChoosingNewSMTP( false );

    if ( window.confirm( t( 'generalConfirmation' ) ) ) {
      deleteSmtp( {
          variables: {
            id: parseInt( match.params.id ),
            newDefId: ( newDefSMTP ? parseInt( newDefSMTP.id ) : null ),
            newId: ( newSMTP ? parseInt( newSMTP.id ) : null ),
          }
        } )
        .then( ( response ) => {
          if ( def ) {
            client.writeQuery( {
              query: GET_SMTPS,
              data: {
                smtps: filteredSMTPs.map( smtp => {
                  return {
                    ...smtp,
                    def: ( smtp.id === parseInt( newDefSMTP.id ) )
                  }
                } )
              }
            } );
          } else {
            client.writeQuery( {
              query: GET_SMTPS,
              data: {
                smtps: filteredSMTPs
              }
            } );
          }
          history.push( '/helpdesk/settings/smtps' );
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  };

  const cannotSave = () => (
    (
      wellKnownBlock &&
      ( saving || password === '' || username === '' )
    ) ||
    (
      !wellKnownBlock &&
      ( saving || title === '' || host === '' || port === '' || password === '' || username === '' )
    )
  );

  if ( smtpLoading ) {
    return <Loading />
  }

  return (
    <div className="scroll-visible p-20 fit-with-header">

      <h2 className="m-b-20" >
        {`${t('edit')} ${t('smtp')}`}
      </h2>

      <Checkbox
        className = "m-b-5 p-l-0"
        value = { def }
        onChange={ () => {
          setDef(!def);
          setDataChanged( true );
        } }
        label={t('default')}
        />

      <SettingsInput
        required={!wellKnownBlock}
        label={t('active')}
        id="title"
        value={title}
        onChange={(e)=> {
          setTitle(e.target.value);
          setDataChanged( true );
        }}
        />

      <FormGroup>
        <Label>{t('wellKnown')}</Label>
        <Select
          styles={pickSelectStyle()}
          options={wellKnownOptions}
          value={wellKnown}
          onChange={wellKnown => {
            setWellKnown(wellKnown);
            setDataChanged( true );
          }}
          />
      </FormGroup>

      <SettingsInput
        required={!wellKnownBlock}
        label={t('host')}
        id="host"
        value={host}
        onChange={(e)=> {
          setHost(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsInput
        required={!wellKnownBlock}
        label={t('port')}
        id="port"
        value={port}
        onChange={(e)=> {
          setPort(e.target.value);
          setDataChanged( true );
        }}
        />

      <Checkbox
        className="m-b-5 p-l-0"
        label={t('secure')}
        value={ secure }
        onChange={ () => {
          setSecure(!secure);
          setDataChanged( true );
        } }
        />

      <SettingsInput
        required
        label={t('username')}
        id="username"
        value={username}
        onChange={(e)=> {
          setUsername(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsHiddenInput
        required
        label={t('password')}
        id="password"
        value={password}
        onChange={(e)=> {
          setPassword(e.target.value);
          setDataChanged( true );
        }}
        />

      <Checkbox
        className = "m-b-5 p-l-0"
        label={t('rejectUnauthorized')}
        value={ rejectUnauthorized }
        onChange={ () => {
          setRejectUnauthorized(!rejectUnauthorized);
          setDataChanged( true );
        }}
        />

      <Modal isOpen={choosingNewSMTP}>
        <ModalHeader>
          {t('selectReplacementSmtp')}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            { def && <Label>{t('smtpReplacement')}</Label> }
            <Select
              styles={pickSelectStyle()}
              options={filteredSMTPs}
              value={newSMTP}
              onChange={s => {
                setNewSMTP(s);
                setDataChanged( true );
              }}
              />
          </FormGroup>

          {def &&
            <FormGroup>
              <Label>{t('smtpNewDefault')}</Label>
              <Select
                styles={pickSelectStyle()}
                options={filteredSMTPs}
                value={newDefSMTP}
                onChange={s => {
                  setNewDefSMTP(s);
                  setDataChanged( true );
                }}
                />
            </FormGroup>
          }
        </ModalBody>
        <ModalFooter>
          <button className="btn-link mr-auto"onClick={() => setChoosingNewSMTP(false)}>
            {t('cancel')}
          </button>
          <button className="btn ml-auto" disabled={!newSMTP || (def ? !newDefSMTP : false)} onClick={deleteSMTPFunc}>
            {t('completeDeletion')}
          </button>
        </ModalFooter>
      </Modal>

      <div className="form-buttons-row">

        <button className="btn-red" disabled={saving || theOnlyOneLeft} onClick={ () => setChoosingNewSMTP(true) }>{t('delete')}</button>

        <ErrorMessage
          className="ml-auto m-r-10"
          show={ !smtpLoading && !smtpData.smtp.currentlyTested && !smtpData.smtp.working  }
          message={smtpData.smtp.errorMessage}
          />

        <div className="message m-r-10">
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
          className="btn btn-distance"
          disabled={saving || tested}
          onClick={ startTest }
          >
          {t('testSmtp')}
        </button>

        <button
          className="btn"
          disabled={cannotSave()}
          onClick={updateSMTPFunc}
          >
          { saving ? `${t('saving')} ${t('smtp')}...` : `${t('save')} ${t('smtp')}` }
        </button>
      </div>
    </div>
  );
}