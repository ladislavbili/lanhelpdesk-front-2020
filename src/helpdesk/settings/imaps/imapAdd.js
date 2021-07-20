import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";
import classnames from "classnames";

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
  pickSelectStyle
} from "configs/components/select";
import {
  addLocalError,
} from 'apollo/localSchema/actions';

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
  const {
    match,
    history
  } = props;
  const client = useApolloClient();

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

  const [ addImap ] = useMutation( ADD_IMAP );

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

  const [ saving, setSaving ] = React.useState( false );

  const dataLoading = rolesLoading || companiesLoading || projectsLoading;

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
        history.push( `/helpdesk/settings/imaps/${newIMAP.id}` )
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
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

      <h2 className="m-b-20">
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

      <SettingsInput
        required
        label="Title"
        id="title"
        value={title}
        onChange={(e)=> {
          setTitle(e.target.value);
        }}
        />

      <SettingsInput
        required
        label="Host"
        id="host"
        value={host}
        onChange={(e)=> {
          setHost(e.target.value);
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
        }}
        />

      <SettingsInput
        required
        label="Username"
        id="username"
        value={username}
        onChange={(e)=> {
          setUsername(e.target.value);
        }}
        />

      <SettingsHiddenInput
        required
        label="Password"
        id="password"
        value={password}
        onChange={(e)=> {
          setPassword(e.target.value);
        }}
        />

      <Checkbox
        className = "m-b-5 p-l-0"
        value = { tls }
        onChange={ () => setTls(!tls) }
        label = "TLS"
        />

      <SettingsInput
        required
        label="Destination"
        id="destination"
        value={destination}
        onChange={(e)=> {
          setDestination(e.target.value);
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
        }}
        />

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
        { cannotSave() &&
          <div className="message error-message ml-auto m-r-14">
            Fill in all the required information!
          </div>
        }
        <button
          className={classnames(
            "btn",
            {"ml-auto": !cannotSave()}
          )}
          disabled={cannotSave()}
          onClick={addIMAPFunc}>
          { saving ? 'Adding...' : 'Add Imap' }
        </button>
      </div>
    </div>
  );
}