import React from 'react';
import {
  useMutation
} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
  Button,
  FormGroup,
  Label,
  Input
} from 'reactstrap';

import Checkbox from '../../../components/checkbox';

import {
  GET_ROLES
} from './index';

const ADD_ROLE = gql `
mutation addRole($title: String!, $order: Int, $level: Int!, $accessRights: AccessRightsCreateInput!) {
  addRole(
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

export default function RoleAdd( props ) {
  //data
  const {
    history,
    match
  } = props;
  const [ addRole, {
    client
  } ] = useMutation( ADD_ROLE );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ level, setLevel ] = React.useState( 0 );

  const login = [
    ...React.useState( false ),
    "Login to system"
  ];
  const testSections = [
    ...React.useState( false ),
    "Test sections - Navoody, CMDB, Hesla, Naklady, Projekty, Monitoring"
  ];
  const mailViaComment = [
    ...React.useState( false ),
    "Send mail via comments"
  ];
  const vykazy = [
    ...React.useState( false ),
    "Výkazy"
  ];
  const publicFilters = [
    ...React.useState( false ),
    "Public Filters"
  ];
  const addProjects = [
    ...React.useState( false ),
    "Add projects"
  ];
  const viewVykaz = [
    ...React.useState( false ),
    "View vykaz"
  ];
  const viewRozpocet = [
    ...React.useState( false ),
    "View rozpocet"
  ];
  const viewErrors = [
    ...React.useState( false ),
    "View errors"
  ];
  const viewInternal = [
    ...React.useState( false ),
    "Internal messages"
  ];

  const generalRights = [
    login,
    testSections,
    mailViaComment,
    vykazy,
    publicFilters,
    addProjects,
    viewVykaz,
    viewRozpocet,
    viewErrors,
    viewInternal
  ];

  const users = [
    ...React.useState( false ),
    "Users"
  ];
  const companies = [
    ...React.useState( false ),
    "Companies"
  ];
  const pausals = [
    ...React.useState( false ),
    "Pausals"
  ];
  const projects = [
    ...React.useState( false ),
    "Projects"
  ];
  const statuses = [
    ...React.useState( false ),
    "Statuses"
  ];
  const units = [
    ...React.useState( false ),
    "Units"
  ];
  const prices = [
    ...React.useState( false ),
    "Prices"
  ];
  const suppliers = [
    ...React.useState( false ),
    "Suppliers"
  ];
  const tags = [
    ...React.useState( false ),
    "Tags"
  ];
  const invoices = [
    ...React.useState( false ),
    "Invoices"
  ];
  const roles = [
    ...React.useState( false ),
    "Roles"
  ];
  const taskTypes = [
    ...React.useState( false ),
    "Task types"
  ];
  const tripTypes = [
    ...React.useState( false ),
    "Trip types"
  ];
  const imaps = [
    ...React.useState( false ),
    "IMAPs"
  ];
  const smtps = [
    ...React.useState( false ),
    "SMTPs"
  ];

  const settings = [
    users,
    companies,
    pausals,
    projects,
    statuses,
    units,
    prices,
    suppliers,
    tags,
    invoices,
    roles,
    taskTypes,
    tripTypes,
    imaps,
    smtps
  ];

  const [ saving, setSaving ] = React.useState( false );

  //functions
  const addRoleFunc = () => {
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
      smtps: smtps[ 0 ]
    }
    addRole( {
        variables: {
          title,
          level: (
            level !== '' ?
            parseInt( level ) :
            0 ),
          order: (
            order !== '' ?
            parseInt( order ) :
            0 ),
          accessRights
        }
      } )
      .then( ( response ) => {
        const allRoles = client.readQuery( {
            query: GET_ROLES
          } )
          .roles;
        const newRole = {
          ...response.data.addRole,
          __typename: "Role"
        };
        client.writeQuery( {
          query: GET_ROLES,
          data: {
            roles: [
              ...allRoles.filter( role => role.id !== parseInt( match.params.id ) ),
              newRole
            ]
          }
        } );
        history.push( '/helpdesk/settings/roles/' + newRole.id )
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
    setSaving( false );
  }

  return ( <div className="p-20 scroll-visible fit-with-header-and-commandbar">
    <FormGroup>
      <Label for="role">Role</Label>
      <Input name="name" id="name" type="text" placeholder="Enter role name" value={title} onChange={(e) => setTitle(e.target.value)}/>
    </FormGroup>

    <FormGroup>
      <Label for="role">Order</Label>
      <Input name="name" id="name" type="number" placeholder="Enter role name" value={order} onChange={(e) => setOrder(e.target.value)}/>
    </FormGroup>

    <FormGroup>
      <Label for="role">Level</Label>
      <Input name="name" id="name" type="number" placeholder="Enter role name" value={level} onChange={(e) => setLevel(e.target.value)}/>
    </FormGroup>

    <div className="">
      <h2>General rights</h2>
      <table className="table">
        <thead>
          <tr>
            <th width={"90%"} key={1}>
              Name
            </th>
            <th className="t-a-c" key={2}>
              Granted
            </th>
          </tr>
        </thead>
        <tbody>
          {
            generalRights.map(right => <tr key={right} onClick={() => {
                console.log('bb');
                right[1](!right[0])
              }}>
              <td>{right[2]}</td>
              <td>
                <Checkbox className="m-b-5 p-l-0" centerVer="centerVer" centerHor="centerHor" value={right[0]} label="" onChange={() => {
                    console.log('aa');
                  }} highlighted={true}/>
              </td>
            </tr>)
          }
        </tbody>
      </table>
    </div>

    <div className="">
      <h2>Settings</h2>
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
          {
            settings.map(right => <tr key={right} onClick={() => right[1](!right[0])}>
              <td>{right[2]}</td>
              <td>
                <Checkbox className="m-b-5 p-l-0" centerVer="centerVer" centerHor="centerHor" value={right[0]} label="" onChange={() => {}} highlighted={true}/>
              </td>
            </tr>)
          }
        </tbody>
      </table>
    </div>

    <Button className="btn" onClick={addRoleFunc}>{
        saving
          ? 'Adding...'
          : 'Add role'
      }</Button>

    {
      props.close && <Button className="btn-link" onClick={() => {
            props.close()
          }}>Cancel</Button>
    }
  </div> );
}