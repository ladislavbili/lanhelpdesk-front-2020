import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";

import {
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import Loading from 'components/loading';
import ErrorMessage from 'components/errorMessage';
import Checkbox from 'components/checkbox';
import {
  toSelArr
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import Select from 'react-select';
import {
  pickSelectStyle
} from "configs/components/select";

import wellKnownOptions from 'configs/constants/wellKnown';

import {
  GET_SMTPS,
  GET_SMTP,
  UPDATE_SMTP,
  DELETE_SMTP,
  TEST_SMTP
} from './queries';



export default function SMTPEdit( props ) {
  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading,
    refetch
  } = useQuery( GET_SMTP, {
    variables: {
      id: parseInt( props.match.params.id )
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  } );
  const [ updateSmtp ] = useMutation( UPDATE_SMTP );
  const [ testSmtp ] = useMutation( TEST_SMTP );
  const [ deleteSmtp, {
    client
  } ] = useMutation( DELETE_SMTP );
  const allSMTPs = toSelArr( client.readQuery( {
      query: GET_SMTPS
    } )
    .smtps );
  const filteredSMTPs = allSMTPs.filter( SMTP => SMTP.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allSMTPs.length === 1;

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

  const [ showPass, setShowPass ] = React.useState( false );

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
    if ( !loading ) {
      setTitle( data.smtp.title );
      setOrder( data.smtp.order );
      setDef( data.smtp.def );
      setHost( data.smtp.host );
      setPort( data.smtp.port );
      setUsername( data.smtp.username );
      setPassword( data.smtp.password );
      setRejectUnauthorized( data.smtp.rejectUnauthorized );
      setSecure( data.smtp.secure );
      setWellKnown( wellKnownOptions.find( ( option ) => option.id === data.smtp.wellKnown ) );
      setTested( false );
      setDataChanged( false );
    }
  }, [ loading ] );

  React.useEffect( () => {
    refetch( {
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

    if ( window.confirm( "Are you sure?" ) ) {
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
          history.push( '/helpdesk/settings/smtps/add' );
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  };


  const cannotSave = (
    ( wellKnownBlock && ( saving || password === '' || username === '' ) ) ||
    ( !wellKnownBlock && ( saving || title === '' || host === '' || port === '' || password === '' || username === '' ) )
  )


  if ( loading ) {
    return <Loading />
  }

  return (
    <div>
      <div className="commandbar a-i-c p-l-20">
        { dataChanged &&
          <div className="message error-message">
            Save changes before leaving!
          </div>
        }
        { !dataChanged &&
          <div className="message success-message">
            Saved
          </div>
        }
      </div>

      <div className="p-l-20 p-r-20 p-t-10 p-b-20 scroll-visible fit-with-header-and-commandbar">

      <h2 className="m-b-20" >
        Edit SMTP
      </h2>

      <Checkbox
        className = "m-b-5 p-l-0"
        value = { def }
        onChange={ () => {
          setDef(!def);
          setDataChanged( true );
        } }
        label = "Default"
        />

      <FormGroup>
        <Label for="name">Title { !wellKnownBlock && <span className="warning-big">*</span>}</Label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Enter title"
          value={title}
          onChange={ (e) => {
            setTitle(e.target.value);
            setDataChanged( true );
          } }
          />
      </FormGroup>

      <FormGroup>
        <Label>Well known providers - requires only user and password</Label>
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

      <FormGroup>
        <Label for="name">Host { !wellKnownBlock && <span className="warning-big">*</span>}</Label>
        <Input
          type="text"
          name="name"
          id="host"
          placeholder="Enter host"
          value={host}
          onChange={ (e) => {
            setHost(e.target.value);
            setDataChanged( true );
          } }
          />
      </FormGroup>

      <FormGroup>
        <Label for="name">Port { !wellKnownBlock && <span className="warning-big">*</span>}</Label>
        <Input
          type="number"
          name="name"
          id="port"
          placeholder="Enter port"
          value={port}
          onChange={ (e) => {
            setPort(e.target.value);
            setDataChanged( true );
          } }
          />
      </FormGroup>

      <Checkbox
        className = "m-b-5 p-l-0"
        value = { secure }
        onChange={ () => {
          setSecure(!secure);
          setDataChanged( true );
        } }
        label = "Secure"
        />

      <FormGroup>
        <Label for="name">Username <span className="warning-big">*</span></Label>
        <Input
          type="text"
          name="name"
          id="user"
          placeholder="Enter user"
          value={username}
          onChange={ (e) => {
            setUsername(e.target.value);
            setDataChanged( true );
          }  }
          />
      </FormGroup>

      <FormGroup>
        <Label>Password <span className="warning-big">*</span></Label>
        <InputGroup>
          <Input
            type={showPass?'text':"password"}
            className="from-control"
            placeholder="Enter password"
            value={password}
            onChange={ (e) => {
              setPassword(e.target.value);
              setDataChanged( true );
            } }
            />
          <InputGroupAddon addonType="append" className="clickable" onClick={ () => setShowPass(!showPass) }>
            <InputGroupText>
              <i className={"mt-auto mb-auto "+ ( !showPass ?' fa fa-eye':'fa fa-eye-slash') }/>
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>

      <Checkbox
        className = "m-b-5 p-l-0"
        value = { rejectUnauthorized }
        onChange={ () => {
          setRejectUnauthorized(!rejectUnauthorized);
          setDataChanged( true );
        }}
        label = "Reject unauthorized"
        />

      <Modal isOpen={choosingNewSMTP}>
        <ModalHeader>
          Please choose an SMTP to replace this one
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            { def && <Label>A replacement SMTP</Label> }
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
              <Label>New default SMTP</Label>
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
            Cancel
          </button>
          <button className="btn ml-auto" disabled={!newSMTP || (def ? !newDefSMTP : false)} onClick={deleteSMTPFunc}>
            Complete deletion
          </button>
        </ModalFooter>
      </Modal>

      <div className="form-buttons-row">
        <button className="btn-red mr-auto" disabled={saving || theOnlyOneLeft} onClick={ () => setChoosingNewSMTP(true) }>Delete</button>
        <ErrorMessage show={ !loading && !data.smtp.currentlyTested && !data.smtp.working  } message={data.smtp.errorMessage} />
        <button className="btn btn-distance" disabled={saving || tested} onClick={ startTest }>Test SMTP</button>
        <button className="btn" disabled={cannotSave} onClick={updateSMTPFunc}>{ saving ? 'Saving SMTP...' : 'Save SMTP' }</button>
      </div>
    </div>
  </div>
  );
}