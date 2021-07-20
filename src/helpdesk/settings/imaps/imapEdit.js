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
} from 'reactstrap';
import SettingsInput from '../components/settingsInput';
import SettingsHiddenInput from '../components/settingsHiddenInput';
import Loading from 'components/loading';
import Checkbox from 'components/checkbox';
import Select, {
  Creatable
} from 'react-select';

import {
  toSelArr,
  filterUnique
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  pickSelectStyle
} from "configs/components/select";

import {
  GET_IMAPS,
  GET_IMAP,
  UPDATE_IMAP,
  DELETE_IMAP,
  TEST_IMAP,
} from './queries';
import {
  GET_ROLES,
} from '../roles/queries';
import {
  GET_BASIC_COMPANIES,
} from '../companies/queries';
import {
  GET_PROJECTS,
} from '../projects/queries';



export default function IMAPEdit( props ) {
  const {
    history,
    match
  } = props;
  const client = useApolloClient();
  const allIMAPs = toSelArr( client.readQuery( {
      query: GET_IMAPS
    } )
    .imaps );
  const filteredIMAPs = allIMAPs.filter( IMAP => IMAP.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allIMAPs.length === 0;

  const {
    data: imapData,
    loading: imapLoading,
    refetch: imapRefetch
  } = useQuery( GET_IMAP, {
    variables: {
      id: parseInt( match.params.id )
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  } );

  const {
    data: roleData,
    loading: rolesLoading
  } = useQuery( GET_ROLES );

  const {
    data: companyData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES );

  const {
    data: projectData,
    loading: projectsLoading
  } = useQuery( GET_PROJECTS );

  const [ testImap ] = useMutation( TEST_IMAP );
  const [ updateImap ] = useMutation( UPDATE_IMAP );
  const [ deleteImap ] = useMutation( DELETE_IMAP );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ def, setDef ] = React.useState( false );
  const [ host, setHost ] = React.useState( "" );
  const [ port, setPort ] = React.useState( 465 );
  const [ username, setUsername ] = React.useState( "" );
  const [ password, setPassword ] = React.useState( "" );
  const [ rejectUnauthorized, setRejectUnauthorized ] = React.useState( false );
  const [ tls, setTls ] = React.useState( true );
  const [ active, setActive ] = React.useState( true );
  const [ destination, setDestination ] = React.useState( '' );
  const [ ignoredRecievers, setIgnoredRecievers ] = React.useState( [] );
  const [ previousIgnoredRecievers, setPreviousIgnoredRecievers ] = React.useState( [] );
  const [ ignoredRecieversDestination, setIgnoredRecieversDestination ] = React.useState( '' );
  const [ role, setRole ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ project, setProject ] = React.useState( null );
  const [ tested, setTested ] = React.useState( false );

  const [ showPass, setShowPass ] = React.useState( false );

  const [ saving, setSaving ] = React.useState( false );
  const [ dataChanged, setDataChanged ] = React.useState( false );

  const dataLoading = imapLoading || rolesLoading || companiesLoading || projectsLoading;

  // sync
  React.useEffect( () => {
    if ( !dataLoading ) {
      setTitle( imapData.imap.title );
      setOrder( imapData.imap.order );
      setDef( imapData.imap.def );
      setHost( imapData.imap.host );
      setPort( imapData.imap.port );
      setUsername( imapData.imap.username );
      setPassword( imapData.imap.password );
      setRejectUnauthorized( imapData.imap.rejectUnauthorized );
      setTls( imapData.imap.tls );
      setActive( imapData.imap.active );
      setDestination( imapData.imap.destination );
      setIgnoredRecievers( imapData.imap.ignoredRecievers.split( ' ' )
        .map( ( item ) => ( {
          label: item,
          value: item
        } ) ) );
      setPreviousIgnoredRecievers( imapData.imap.ignoredRecievers.split( ' ' )
        .map( ( item ) => ( {
          label: item,
          value: item
        } ) ) );
      setIgnoredRecieversDestination( imapData.imap.ignoredRecieversDestination );
      setRole( toSelArr( roleData.roles )
        .find( ( role ) => role.id === imapData.imap.role.id ) );
      setCompany( toSelArr( companyData.basicCompanies )
        .find( ( company ) => company.id === imapData.imap.company.id ) );
      setProject( toSelArr( projectData.projects )
        .find( ( project ) => project.id === imapData.imap.project.id ) );
      setTested( false );
      setDataChanged( false );
    }
  }, [ dataLoading ] );

  React.useEffect( () => {
    imapRefetch( {
      variables: {
        id: parseInt( match.params.id )
      }
    } );
  }, [ match.params.id ] );

  // functions
  const updateIMAPFunc = () => {
    setSaving( true );
    updateImap( {
        variables: {
          id: parseInt( match.params.id ),
          active,
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
          def,
          host,
          port: ( port !== '' ? parseInt( port ) : 0 ),
          username,
          password,
          rejectUnauthorized,
          tls,
          destination,
          ignoredRecievers: ignoredRecievers.map( ( item ) => item.label )
            .join( ' ' ),
          ignoredRecieversDestination,
          projectId: project.id,
          roleId: role.id,
          companyId: company.id,
        }
      } )
      .then( ( response ) => {
        const updatedIMAP = {
          ...response.data.updateImap
        };
        if ( def ) {
          client.writeQuery( {
            query: GET_IMAPS,
            data: {
              imaps: [ ...allIMAPs.map( IMAP => {
                if ( IMAP.id === parseInt( match.params.id ) ) {
                  return ( {
                    ...updatedIMAP,
                    def: true
                  } );
                } else {
                  return ( {
                    ...IMAP,
                    def: false
                  } );
                }
              } ) ]
            }
          } );
        } else {
          client.writeQuery( {
            query: GET_IMAPS,
            data: {
              imaps: [ ...allIMAPs.filter( IMAP => IMAP.id !== parseInt( match.params.id ) ), updatedIMAP ]
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

  const deleteIMAPFunc = () => {
    if ( window.confirm( "Are you sure?" ) ) {
      deleteImap( {
          variables: {
            id: parseInt( match.params.id ),
          }
        } )
        .then( ( response ) => {
          client.writeQuery( {
            query: GET_IMAPS,
            data: {
              imaps: filteredIMAPs
            }
          } );
          history.goBack();
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  };

  const startTest = () => {
    let newImaps = [ ...allIMAPs ];
    let imapIndex = newImaps.findIndex( ( imap ) => imap.id === parseInt( match.params.id ) );
    newImaps[ imapIndex ].currentlyTested = true;
    client.writeQuery( {
      query: GET_IMAPS,
      data: {
        imaps: newImaps
      }
    } );
    setTested( true );
    testImap( {
      variables: {
        id: parseInt( match.params.id )
      }
    } );
  }

  const cannotSave = () => (
    saving ||
    title === '' ||
    host === '' ||
    port === '' ||
    username === '' ||
    role === null ||
    company === null ||
    project === null ||
    ignoredRecieversDestination === "" ||
    destination === "" ||
    dataLoading
  );

  if ( dataLoading ) {
    return <Loading />
  }

  return (
    <div className="scroll-visible p-20 fit-with-header">

      <h2 className="m-b-20" >
        Edit IMAP
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
      <Checkbox
        className = "m-b-5 p-l-0"
        value = { active }
        onChange={ () => {
          setActive(!active);
          setDataChanged( true );
        } }
        label = "Active"
        />

      <SettingsInput
        required
        label="Title"
        id="title"
        value={title}
        onChange={(e)=> {
          setTitle(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsInput
        required
        label="Host"
        id="host"
        value={host}
        onChange={(e)=> {
          setHost(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsInput
        required
        label="Port"
        id="port"
        type="number"
        value={port}
        onChange={(e)=> {
          setPort(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsInput
        required
        label="Username"
        id="username"
        value={username}
        onChange={(e)=> {
          setUsername(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsHiddenInput
        required
        label="Password"
        id="password"
        value={password}
        onChange={(e)=> {
          setPassword(e.target.value);
          setDataChanged( true );
        }}
        />

      <Checkbox
        className = "m-b-5 p-l-0"
        value = { tls }
        onChange={ () => {
          setTls(!tls);
          setDataChanged( true );
        } }
        label = "TLS"
        />

      <SettingsInput
        required
        label="Destination"
        id="destination"
        value={destination}
        onChange={(e)=> {
          setDestination(e.target.value);
          setDataChanged( true );
        }}
        />

      <FormGroup>
        <Label for="ignoredRecievers">Ignored recievers</Label>
        <Creatable
          isMulti
          value={ignoredRecievers}
          onChange={(ignoredRecievers) => {
            setIgnoredRecievers(ignoredRecievers);
            setPreviousIgnoredRecievers(filterUnique([...ignoredRecievers, ...previousIgnoredRecievers]));
            setDataChanged( true );
          }}
          options={previousIgnoredRecievers}
          styles={pickSelectStyle()}
          />
      </FormGroup>

      <SettingsInput
        required
        label="Destination"
        id="ignoredRecieversDestination"
        placeholder="Enter ignored e-mails destination"
        value={ignoredRecieversDestination}
        onChange={(e)=> {
          setIgnoredRecieversDestination(e.target.value);
          setDataChanged( true );
        }}
        />

      <Checkbox
        className = "m-b-5 p-l-0"
        value = { rejectUnauthorized }
        onChange={ () => {
          setRejectUnauthorized(!rejectUnauthorized);
          setDataChanged( true );
        } }
        label = "Reject unauthorized"
        />
      <FormGroup>
        <Label for="role">Users Role <span className="warning-big">*</span></Label>
        <Select
          styles={pickSelectStyle()}
          options={toSelArr(roleData.roles)}
          value={role}
          onChange={role => {
            setRole(role);
            setDataChanged( true );
          }}
          />
      </FormGroup>
      <FormGroup>
        <Label for="project">Users Company <span className="warning-big">*</span></Label>
        <Select
          styles={pickSelectStyle()}
          options={toSelArr(companyData.basicCompanies)}
          value={company}
          onChange={company =>{
            setCompany(company);
            setDataChanged( true );
          }}
          />
      </FormGroup>
      <FormGroup>
        <Label for="project">Tasks Project <span className="warning-big">*</span></Label>
        <Select
          styles={pickSelectStyle()}
          options={toSelArr(projectData.projects)}
          value={project}
          onChange={project => {
            setProject(project);
            setDataChanged( true );
          }}
          />
      </FormGroup>

      <div className="form-buttons-row">
        <button
          className="btn-red"
          disabled={saving || theOnlyOneLeft}
          onClick={ deleteIMAPFunc }
          >
          Delete
        </button>

        <div className="ml-auto message m-r-10">
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

        <button
          className="btn btn-distance"
          disabled={saving || tested}
          onClick={ startTest }
          >
          Test IMAP
        </button>

        <button
          className="btn"
          disabled={cannotSave()}
          onClick={updateIMAPFunc}>
          { saving ? 'Saving IMAP...' : 'Save IMAP' }
        </button>
      </div>
    </div>
  );
}