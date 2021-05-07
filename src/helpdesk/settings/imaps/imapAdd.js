import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import Loading from 'components/loading';

import {
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import {
  toSelArr,
  filterUnique
} from 'helperFunctions';
import Checkbox from 'components/checkbox';
import Select, {
  Creatable
} from 'react-select';
import {
  pickSelectStyle
} from "configs/components/select";

import {
  GET_IMAPS,
  ADD_IMAP,
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



export default function IMAPAdd( props ) {
  //data
  const {
    match,
    history
  } = props;
  const [ addImap, {
    client
  } ] = useMutation( ADD_IMAP );
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

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order ] = React.useState( 0 );
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

  const [ showPass, setShowPass ] = React.useState( false );

  const [ saving, setSaving ] = React.useState( false );

  //functions
  const addIMAPFunc = () => {
    setSaving( true );
    addImap( {
        variables: {
          active,
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
          def,
          host,
          port: ( port !== '' ? parseInt( port ) : 465 ),
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
        const allIMAPs = client.readQuery( {
            query: GET_IMAPS
          } )
          .imaps;
        const newIMAP = {
          ...response.data.addImap,
          __typename: "Imap"
        };
        client.writeQuery( {
          query: GET_IMAPS,
          data: {
            imaps: [ ...allIMAPs.filter( IMAP => IMAP.id !== parseInt( match.params.id ) ), newIMAP ]
          }
        } );
        history.push( '/helpdesk/settings/imaps/' + newIMAP.id )
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
    setSaving( false );
  }

  const dataLoaded = !rolesLoading && !companiesLoading && !projectsLoading;

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
        { cannotSave &&
          <div className="message error-message">
            Fill in all the required information!
          </div>
        }
      </div>
      <div className="p-t-10 p-l-20 p-r-20 p-b-20 scroll-visible fit-with-header-and-commandbar">
        <h2 className="m-b-20" >
          Add IMAP
        </h2>
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
          <Label for="name">Title <span className="warning-big">*</span></Label>
          <Input type="text" name="name" id="name" placeholder="Enter title" value={title} onChange={ (e) => setTitle(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="name">Host <span className="warning-big">*</span></Label>
          <Input type="text" name="name" id="host" placeholder="Enter host" value={host} onChange={ (e) => setHost(e.target.value) }/>
        </FormGroup>
        <FormGroup>
          <Label for="name">Port <span className="warning-big">*</span></Label>
          <Input type="number" name="name" id="port" placeholder="Enter port"  value={port} onChange={ (e) => setPort(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="name">Username <span className="warning-big">*</span></Label>
          <Input type="text" name="name" id="user" placeholder="Enter user" value={username} onChange={ (e) => setUsername(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label>Password <span className="warning-big">*</span></Label>
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
          <Label for="destination">Destination <span className="warning-big">*</span></Label>
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
            styles={pickSelectStyle()}
            />
        </FormGroup>

        <FormGroup>
          <Label for="ignoredDestination">Ignored recievers destination <span className="warning-big">*</span></Label>
          <Input type="text" name="ignoredDestination" id="ignoredDestination" placeholder="Enter ignored e-mails destination" value={ignoredRecieversDestination} onChange={ (e) => setIgnoredRecieversDestination(e.target.value) } />
        </FormGroup>


        <Checkbox
          className = "m-b-5 p-l-0"
          value = { rejectUnauthorized }
          onChange={ () => setRejectUnauthorized(!rejectUnauthorized) }
          label = "Reject unauthorized"
          />

        <FormGroup>
          <Label for="role">Users Role <span className="warning-big">*</span></Label>
          <Select
            styles={pickSelectStyle()}
            options={toSelArr(roleData.roles)}
            value={role}
            onChange={role => setRole(role)}
            />
        </FormGroup>
        <FormGroup>
          <Label for="project">Users Company <span className="warning-big">*</span></Label>
          <Select
            styles={pickSelectStyle()}
            options={toSelArr(companyData.basicCompanies)}
            value={company}
            onChange={company => setCompany(company)}
            />
        </FormGroup>
        <FormGroup>
          <Label for="project">Tasks Project <span className="warning-big">*</span></Label>
          <Select
            styles={pickSelectStyle()}
            options={toSelArr(projectData.projects)}
            value={project}
            onChange={project => setProject(project)}
            />
        </FormGroup>

        <div className="form-buttons-row">
          <button className="btn ml-auto" disabled={cannotSave} onClick={addIMAPFunc}>{saving?'Adding...':'Add Imap'}</button>
        </div>
      </div>
    </div>
  );
}