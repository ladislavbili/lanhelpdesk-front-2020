import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import ErrorMessage from 'components/errorMessage';
import {
  Button,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import RightRow from './rightRow';
import {
  generalRightsTemplate,
  settingsTemplate
} from 'configs/constants/roles';

import {
  GET_ROLES,
  ADD_ROLE,
  GET_MY_DATA
} from './querries';

export default function RoleAdd( props ) {
  //data
  const {
    history,
    match
  } = props;
  const [ addRole, {
    client
  } ] = useMutation( ADD_ROLE );
  const userDataQuery = useQuery( GET_MY_DATA );
  const currentUserLevel = ( userDataQuery.loading ? null : userDataQuery.data.getMyData.role.level );
  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ level, setLevel ] = React.useState( 0 );

  const generalRights = generalRightsTemplate.map( ( template ) => ( {
    ...template,
    state: React.useState( false ),
  } ) );
  const settings = settingsTemplate.map( ( template ) => ( {
    ...template,
    state: React.useState( false ),
  } ) );

  const [ saving, setSaving ] = React.useState( false );

  //functions
  const addRoleFunc = () => {
    setSaving( true );
    let accessRights = {};
    [ ...generalRights, ...settings ].forEach( ( right ) => accessRights[ right.key ] = right.state[ 0 ] );
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
      <Label for="role" className="row">
        Level
        <ErrorMessage show={ currentUserLevel === null || level <= currentUserLevel } message={`Targets role can't be lower or same as yours(${currentUserLevel})!`} />
      </Label>
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
          { generalRights.map( (right) =>
            <RightRow
              key={[right.key,right.state[0]].toString()}
              onChange={right.state[1]}
              label={right.label}
              disabled={false}
              value={right.state[0]}
              />
          )}
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
          { settings.map( (right) =>
            <RightRow
              key={[right.key,right.state[0]].toString()}
              onChange={right.state[1]}
              label={right.label}
              disabled={false}
              value={right.state[0]}
              />
          )}
        </tbody>
      </table>
    </div>

    <div className="row">
      {
        props.close &&
        <Button className="btn-link" onClick={() => {
            props.close()
          }}
          >
          Cancel
        </Button>
      }

      <Button className="btn ml-auto" disabled={currentUserLevel === null || currentUserLevel >= level || true} onClick={addRoleFunc}>
        {
          saving
          ? 'Adding...'
          : 'Add role'
        }
      </Button>
    </div>
  </div> );
}