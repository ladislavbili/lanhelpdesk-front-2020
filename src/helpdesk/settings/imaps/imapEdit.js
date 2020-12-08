import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";

import {
  Button,
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
  selectStyle
} from "configs/components/select";

import {
  GET_IMAPS,
  GET_IMAP,
  UPDATE_IMAP,
  DELETE_IMAP,
  TEST_IMAP,
} from './querries';
import {
  GET_ROLES,
} from '../roles/querries';
import {
  GET_BASIC_COMPANIES,
} from '../companies/querries';
import {
  GET_PROJECTS,
} from '../projects/querries';



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
    <div className="p-20 scroll-visible fit-with-header-and-commandbar">

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { def }
          onChange={ () => setDef(!def) }
          label = "Default"
          />
        <Checkbox
          className = "m-b-5 p-l-0"
          value = { active }
          onChange={ () => setActive(!active) }
          label = "Active"
          />

        <FormGroup>
          <Label for="name">Title</Label>
          <Input type="text" name="name" id="name" placeholder="Enter title" value={title} onChange={ (e) => setTitle(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="name">Host</Label>
          <Input type="text" name="name" id="host" placeholder="Enter host" value={host} onChange={ (e) => setHost(e.target.value) }/>
        </FormGroup>
        <FormGroup>
          <Label for="name">Port</Label>
          <Input type="number" name="name" id="port" placeholder="Enter port"  value={port} onChange={ (e) => setPort(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="name">Username</Label>
          <Input type="text" name="name" id="user" placeholder="Enter user" value={username} onChange={ (e) => setUsername(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <InputGroup>
            <Input type={showPass?'text':"password"} className="from-control" placeholder="Enter password" value={password} onChange={ (e) => setPassword(e.target.value) } />
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
          onChange={ () => setTls(!tls) }
          label = "TLS"
          />
          <FormGroup>
            <Label for="destination">Destination</Label>
            <Input type="text" name="destination" id="destination" placeholder="Enter destination" value={destination} onChange={ (e) => setDestination(e.target.value) } />
          </FormGroup>

          <FormGroup>
            <Label for="ignoredRecievers">Ignored recievers</Label>
            <Creatable
              isMulti
              value={ignoredRecievers}
              onChange={(ignoredRecievers) => {
                setIgnoredRecievers(ignoredRecievers);
                setPreviousIgnoredRecievers(filterUnique([...ignoredRecievers, ...previousIgnoredRecievers]));
              }}
              options={previousIgnoredRecievers}
              styles={selectStyle}
              />
          </FormGroup>

          <FormGroup>
            <Label for="ignoredDestination">Ignored recievers destination</Label>
            <Input type="text" name="ignoredDestination" id="ignoredDestination" placeholder="Enter ignored e-mails destination" value={ignoredRecieversDestination} onChange={ (e) => setIgnoredRecieversDestination(e.target.value) } />
          </FormGroup>
        <Checkbox
          className = "m-b-5 p-l-0"
          value = { rejectUnauthorized }
          onChange={ () => setRejectUnauthorized(!rejectUnauthorized) }
          label = "Reject unauthorized"
          />
          <FormGroup>
            <Label for="role">Users Role</Label>
            <Select
              styles={selectStyle}
              options={toSelArr(roleData.roles)}
              value={role}
              onChange={role => setRole(role)}
              />
          </FormGroup>
          <FormGroup>
            <Label for="project">Users Company</Label>
            <Select
              styles={selectStyle}
              options={toSelArr(companyData.basicCompanies)}
              value={company}
              onChange={company => setCompany(company)}
              />
          </FormGroup>
          <FormGroup>
            <Label for="project">Tasks Project</Label>
            <Select
              styles={selectStyle}
              options={toSelArr(projectData.projects)}
              value={project}
              onChange={project => setProject(project)}
              />
          </FormGroup>

        <div className="row">
          <Button className="btn-red" disabled={saving || theOnlyOneLeft} onClick={ deleteIMAPFunc }>Delete</Button>
          <Button className="btn ml-auto" disabled={saving || tested} onClick={ startTest }>Test IMAP</Button>
            <Button className="btn m-l-5" disabled={cannotSave} onClick={updateIMAPFunc}>{ saving ? 'Saving IMAP...' : 'Save IMAP' }</Button>
        </div>
      </div>
  );
}