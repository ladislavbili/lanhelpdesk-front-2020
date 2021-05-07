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
} from 'reactstrap';
import Loading from 'components/loading';
import Checkbox from '../../../components/checkbox';
import {
  toSelArr,
  filterUnique
} from 'helperFunctions';
import Select, {
  Creatable
} from 'react-select';
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
  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading,
    refetch
  } = useQuery( GET_IMAP, {
    variables: {
      id: parseInt( match.params.id )
    },
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
  const [ deleteImap, {
    client
  } ] = useMutation( DELETE_IMAP );
  const allIMAPs = toSelArr( client.readQuery( {
      query: GET_IMAPS
    } )
    .imaps );
  const filteredIMAPs = allIMAPs.filter( IMAP => IMAP.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allIMAPs.length === 0;

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

  // sync
  React.useEffect( () => {
    if ( !loading && !rolesLoading && !companiesLoading && !projectsLoading ) {
      setTitle( data.imap.title );
      setOrder( data.imap.order );
      setDef( data.imap.def );
      setHost( data.imap.host );
      setPort( data.imap.port );
      setUsername( data.imap.username );
      setPassword( data.imap.password );
      setRejectUnauthorized( data.imap.rejectUnauthorized );
      setTls( data.imap.tls );
      setActive( data.imap.active );
      setDestination( data.imap.destination );
      setIgnoredRecievers( data.imap.ignoredRecievers.split( ' ' )
        .map( ( item ) => ( {
          label: item,
          value: item
        } ) ) );
      setPreviousIgnoredRecievers( data.imap.ignoredRecievers.split( ' ' )
        .map( ( item ) => ( {
          label: item,
          value: item
        } ) ) );
      setIgnoredRecieversDestination( data.imap.ignoredRecieversDestination );
      setRole( toSelArr( roleData.roles )
        .find( ( role ) => role.id === data.imap.role.id ) );
      setCompany( toSelArr( companyData.basicCompanies )
        .find( ( company ) => company.id === data.imap.company.id ) );
      setProject( toSelArr( projectData.projects )
        .find( ( project ) => project.id === data.imap.project.id ) );
      setTested( false );
      setDataChanged( false );
    }
  }, [ loading, rolesLoading, companiesLoading, projectsLoading ] );

  React.useEffect( () => {
    refetch( {
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
        console.log( err.message );
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
          console.log( err.message );
          console.log( err );
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

  const dataLoaded = !loading && !rolesLoading && !companiesLoading && !projectsLoading;
  const cannotSave = (
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
    !dataLoaded
  );

  if ( !dataLoaded ) {
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

      <div className="p-t-10 p-l-20 p-r-20 p-b-20 scroll-visible fit-with-header-and-commandbar">
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

        <FormGroup>
          <Label for="name">Title <span className="warning-big">*</span></Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Enter title"
            value={title}
            onChange={ (e) =>{
              setTitle(e.target.value);
              setDataChanged( true );
            } }
            />
        </FormGroup>
        <FormGroup>
          <Label for="name">Host <span className="warning-big">*</span></Label>
          <Input
            type="text"
            name="name"
            id="host"
            placeholder="Enter host"
            value={host}
            onChange={ (e) =>{
              setHost(e.target.value);
              setDataChanged( true );
            } }
            />
        </FormGroup>
        <FormGroup>
          <Label for="name">Port <span className="warning-big">*</span></Label>
          <Input
            type="number"
            name="name"
            id="port"
            placeholder="Enter port"
            value={port}
            onChange={ (e) =>{
              setPort(e.target.value);
              setDataChanged( true );
            } }
            />
        </FormGroup>
        <FormGroup>
          <Label for="name">Username <span className="warning-big">*</span></Label>
          <Input
            type="text"
            name="name"
            id="user"
            placeholder="Enter user"
            value={username}
            onChange={ (e) =>{
              setUsername(e.target.value) ;
              setDataChanged( true );
            }}
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
                <i className={"mt-auto mb-auto "+ (!showPass ?'fa fa-eye':'fa fa-eye-slash')}/>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { tls }
          onChange={ () => {
            setTls(!tls);
            setDataChanged( true );
          } }
          label = "TLS"
          />
        <FormGroup>
          <Label for="destination">Destination <span className="warning-big">*</span></Label>
          <Input
            type="text"
            name="destination"
            id="destination"
            placeholder="Enter destination"
            value={destination}
            onChange={ (e) => {
              setDestination(e.target.value);
              setDataChanged( true );
            } }
            />
        </FormGroup>

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

        <FormGroup>
          <Label for="ignoredDestination">Ignored recievers destination <span className="warning-big">*</span></Label>
          <Input
            type="text"
            name="ignoredDestination"
            id="ignoredDestination"
            placeholder="Enter ignored e-mails destination"
            value={ignoredRecieversDestination}
            onChange={ (e) => {
              setIgnoredRecieversDestination(e.target.value);
              setDataChanged( true );
            } }
            />
        </FormGroup>
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
          <button className="btn-red" disabled={saving || theOnlyOneLeft} onClick={ deleteIMAPFunc }>Delete</button>
          <button className="btn ml-auto btn=distance" disabled={saving || tested} onClick={ startTest }>Test IMAP</button>
          <button className="btn" disabled={cannotSave} onClick={updateIMAPFunc}>{ saving ? 'Saving IMAP...' : 'Save IMAP' }</button>
        </div>
      </div>
    </div>
  );
}