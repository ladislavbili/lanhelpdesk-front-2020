import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/react-hooks";
import gql from "graphql-tag";

import {
  Button,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import Checkbox from '../../../components/checkbox';
import {
  toSelArr
} from 'helperFunctions';
import Select from 'react-select';
import {
  selectStyle
} from "configs/components/select";
import Loading from 'components/loading';

import {
  GET_ROLES
} from './index';

const GET_ROLE = gql `
query role($id: Int!) {
  role (
    id: $id
  ) {
    id
    title
    order
    level
    accessRights {
      login
      testSections
      mailViaComment
      vykazy
      publicFilters
      addProjects
      viewVykaz
      viewRozpocet
      viewErrors
      viewInternal
      users
      companies
      pausals
      projects
      statuses
      units
      prices
      suppliers
      tags
      invoices
      roles
      taskTypes
      tripTypes
      imaps
      smtps
    }
  }
}
`;

const UPDATE_ROLE = gql `
mutation updateRole($id: Int!, $title: String, $order: Int, $level: Int, $accessRights: AccessRightsUpdateInput) {
  updateRole(
    id: $id,
    title: $title,
    order: $order,
    level: $level,
    accessRights: $accessRights,
  ){
    id
    title
    order
    level
  }
}
`;

export const DELETE_ROLE = gql `
mutation deleteRole($id: Int!, $newId: Int!) {
  deleteRole(
    id: $id,
    newId: $newId,
  ){
    id
  }
}
`;

export default function RoleEdit( props ) {
  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading,
    refetch
  } = useQuery( GET_ROLE, {
    variables: {
      id: parseInt( props.match.params.id )
    }
  } );
  const [ updateRole ] = useMutation( UPDATE_ROLE );
  const [ deleteRole, {
    client
  } ] = useMutation( DELETE_ROLE );
  const allRoles = toSelArr( client.readQuery( {
      query: GET_ROLES
    } )
    .roles );
  const filteredRoles = allRoles.filter( role => role.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allRoles.length === 0;

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ level, setLevel ] = React.useState( 0 );

  const login = [ ...React.useState( false ), "Login to system" ];
  const testSections = [ ...React.useState( false ), "Test sections - Navoody, CMDB, Hesla, Naklady, Projekty, Monitoring" ];
  const mailViaComment = [ ...React.useState( false ), "Send mail via comments" ];
  const vykazy = [ ...React.useState( false ), "Výkazy" ];
  const publicFilters = [ ...React.useState( false ), "Public Filters" ];
  const addProjects = [ ...React.useState( false ), "Add projects" ];
  const viewVykaz = [ ...React.useState( false ), "View vykaz" ];
  const viewRozpocet = [ ...React.useState( false ), "View rozpocet" ];
  const viewErrors = [ ...React.useState( false ), "View errors" ];
  const viewInternal = [ ...React.useState( false ), "Internal messages" ];

  const generalRights = [ login, testSections, mailViaComment, vykazy, publicFilters, addProjects, viewVykaz, viewRozpocet, viewErrors, viewInternal ];

  const users = [ ...React.useState( false ), "Users" ];
  const companies = [ ...React.useState( false ), "Companies" ];
  const pausals = [ ...React.useState( false ), "Pausals" ];
  const projects = [ ...React.useState( false ), "Projects" ];
  const statuses = [ ...React.useState( false ), "Statuses" ];
  const units = [ ...React.useState( false ), "Units" ];
  const prices = [ ...React.useState( false ), "Prices" ];
  const suppliers = [ ...React.useState( false ), "Suppliers" ];
  const tags = [ ...React.useState( false ), "Tags" ];
  const invoices = [ ...React.useState( false ), "Invoices" ];
  const roles = [ ...React.useState( false ), "Roles" ];
  const taskTypes = [ ...React.useState( false ), "Task types" ];
  const tripTypes = [ ...React.useState( false ), "Trip types" ];
  const imaps = [ ...React.useState( false ), "IMAPs" ];
  const smtps = [ ...React.useState( false ), "SMTPs" ];

  const settings = [ users, companies, pausals, projects, statuses, units, prices, suppliers, tags, invoices, roles, taskTypes, tripTypes, imaps, smtps ];

  const [ newRole, setNewRole ] = React.useState( null );
  const [ choosingNewRole, setChooseingNewRole ] = React.useState( false );

  const [ saving, setSaving ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !loading ) {
      setTitle( data.role.title );
      setOrder( data.role.order );
      setLevel( data.role.level );

      login[ 1 ]( data.role.accessRights.login );
      testSections[ 1 ]( data.role.accessRights.testSections );
      mailViaComment[ 1 ]( data.role.accessRights.mailViaComment );
      vykazy[ 1 ]( data.role.accessRights.vykazy );
      publicFilters[ 1 ]( data.role.accessRights.publicFilters );
      addProjects[ 1 ]( data.role.accessRights.addProjects );
      viewVykaz[ 1 ]( data.role.accessRights.viewVykaz );
      viewRozpocet[ 1 ]( data.role.accessRights.viewRozpocet );
      viewErrors[ 1 ]( data.role.accessRights.viewErrors );
      viewInternal[ 1 ]( data.role.accessRights.viewInternal );
      users[ 1 ]( data.role.accessRights.users );
      companies[ 1 ]( data.role.accessRights.companies );
      pausals[ 1 ]( data.role.accessRights.pausals );
      projects[ 1 ]( data.role.accessRights.projects );
      statuses[ 1 ]( data.role.accessRights.statuses );
      units[ 1 ]( data.role.accessRights.units );
      prices[ 1 ]( data.role.accessRights.prices );
      suppliers[ 1 ]( data.role.accessRights.suppliers );
      tags[ 1 ]( data.role.accessRights.tags );
      invoices[ 1 ]( data.role.accessRights.invoices );
      roles[ 1 ]( data.role.accessRights.roles );
      taskTypes[ 1 ]( data.role.accessRights.taskTypes );
      tripTypes[ 1 ]( data.role.accessRights.tripTypes );
      imaps[ 1 ]( data.role.accessRights.imaps );
      smtps[ 1 ]( data.role.accessRights.smtps );
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
  const updateRoleFunc = () => {
    setSaving( true );
    let accessRights = {
      login: login[ 0 ],
      testSections: testSections[ 0 ],
      mailViaComment: mailViaComment[ 0 ],
      vykazy: vykazy[ 0 ],
      publicFilters: publicFilters[ 0 ],
      addProjects: addProjects[ 0 ],
      viewVykaz: viewVykaz[ 0 ],
      viewRozpocet: viewRozpocet[ 0 ],
      viewErrors: viewErrors[ 0 ],
      viewInternal: viewInternal[ 0 ],
      users: users[ 0 ],
      companies: companies[ 0 ],
      pausals: pausals[ 0 ],
      projects: projects[ 0 ],
      statuses: statuses[ 0 ],
      units: units[ 0 ],
      prices: prices[ 0 ],
      suppliers: suppliers[ 0 ],
      tags: tags[ 0 ],
      invoices: invoices[ 0 ],
      roles: roles[ 0 ],
      taskTypes: taskTypes[ 0 ],
      tripTypes: tripTypes[ 0 ],
      imaps: imaps[ 0 ],
      smtps: smtps[ 0 ],
    }
    updateRole( {
        variables: {
          id: parseInt( match.params.id ),
          title,
          level: ( level !== '' ? parseInt( level ) : 0 ),
          order: ( order !== '' ? parseInt( order ) : 0 ),
          accessRights
        }
      } )
      .then( ( response ) => {
        let updatedRole = {
          ...response.data.updateRole,
          __typename: "Role"
        };
        client.writeQuery( {
          query: GET_ROLES,
          data: {
            roles: [ ...allRoles.filter( role => role.id !== parseInt( match.params.id ) ), updatedRole ]
          }
        } );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  };

  const deleteRoleFunc = () => {
    setChooseingNewRole( false );

    if ( window.confirm( "Are you sure?" ) ) {
      deleteRole( {
          variables: {
            id: parseInt( match.params.id ),
            newId: parseInt( newRole.id ),
          }
        } )
        .then( ( response ) => {
          client.writeQuery( {
            query: GET_ROLES,
            data: {
              roles: filteredRoles
            }
          } );
          history.push( '/helpdesk/settings/roles/add' );
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
    }
  };

  if ( loading ) {
    return <Loading />
  }

  const disabled = false;

  return (
    <div className="p-20 scroll-visible fit-with-header-and-commandbar">
      <FormGroup>
        <Label for="role">Role</Label>
          <Input name="name" id="name" type="text" placeholder="Enter role name" disabled={disabled} value={title} onChange={ (e) => setTitle(e.target.value) }
            />
      </FormGroup>

      <FormGroup>
        <Label for="role">Order</Label>
          <Input name="name" id="name" type="number" placeholder="Enter role name" disabled={disabled} value={order} onChange={ (e) => setOrder(e.target.value) }
            />
      </FormGroup>

      <FormGroup>
        <Label for="role">Level</Label>
          <Input name="name" id="name" type="number" placeholder="Enter role name" disabled={disabled} value={level} onChange={ (e) => setLevel(e.target.value) }
            />
      </FormGroup>

        <div className="">
          <h2>General rights</h2>
          <table className="table">
            <thead>
              <tr>
                  <th  width={"90%"} key={1}>
                    Name
                  </th>
                  <th className="t-a-c" key={2}>
                    Granted
                  </th>
              </tr>
            </thead>
            <tbody>
              { generalRights.map( (right) =>
                <tr
                  onClick={() => {
                    if(disabled) return;
                    right[1](!right[0]);
                    }}
                  >
                  <td>{right[2]}</td>
                  <td>
                    <Checkbox
                      className = "m-b-5 p-l-0"
                      centerVer
                      centerHor
                      disabled={disabled}
                      value = { right[0] }
                      label = ""
                      onChange={()=>{}}
                      highlighted={true}
                      />
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>

      <div className="">
        <h2>Specific rules</h2>
        <table className="table">
          <thead>
            <tr>
              <th width={"90%"} key={1}>
                Access
              </th>
              <th className="t-a-c" key={2}>
                View & Edit
              </th>
            </tr>
          </thead>
          <tbody>
            { settings.map( (right) =>
              <tr
                onClick={() => {
                  if(disabled) return;
                  right[1](!right[0]);
                  }}
                >
                <td>{right[2]}</td>
                <td>
                  <Checkbox
                    className = "m-b-5 p-l-0"
                    centerVer
                    centerHor
                    disabled={disabled}
                    value = { right[0] }
                    label = ""
                    onChange={()=>{}}
                    highlighted={true}
                    />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={choosingNewRole}>
        <ModalHeader>
          Please choose a role to replace this one
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Select
              styles={selectStyle}
              options={filteredRoles}
              value={newRole}
              onChange={s => setNewRole(s)}
              />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button className="btn-link mr-auto"onClick={() => setChooseingNewRole(false)}>
            Cancel
          </Button>
          <Button className="btn ml-auto" disabled={!newRole} onClick={deleteRoleFunc}>
            Complete deletion
          </Button>
        </ModalFooter>
      </Modal>

      <div className="row">
        <Button className="btn" onClick={updateRoleFunc}>{saving?'Savinging...':'Save'}</Button>
        <Button className="btn-red m-l-5" disabled={saving || theOnlyOneLeft} onClick={ () => setChooseingNewRole(true) }>Delete</Button>
        {props.close &&
        <Button className="btn-link"
          onClick={()=>{props.close()}}>Cancel</Button>
        }
      </div>
    </div>
  );
}