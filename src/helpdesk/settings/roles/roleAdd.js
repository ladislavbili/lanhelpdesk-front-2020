import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import ErrorMessage from 'components/errorMessage';
import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import RightRow from './rightRow';
import {
  getMyData,
} from 'helperFunctions';

import {
  GET_ROLES,
  ADD_ROLE
} from './queries';

export default function RoleAdd( props ) {
  //data
  const {
    history,
    match
  } = props;
  const [ addRole, {
    client
  } ] = useMutation( ADD_ROLE );
  const currentUser = getMyData();
  const currentUserLevel = currentUser ? currentUser.role.level : null;
  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ level, setLevel ] = React.useState( 0 );

  const generalRights = [
    {
      state: React.useState( false ),
      key: 'login',
      label: "Login to system"
    },
    {
      state: React.useState( false ),
      key: 'testSections',
      label: "Test sections - Navody, CMDB, Hesla, Naklady, Projekty, Monitoring"
    },
    {
      state: React.useState( false ),
      key: 'vykazy',
      label: "Výkazy"
    },
    {
      state: React.useState( false ),
      key: 'publicFilters',
      label: "Public Filters"
    },
    {
      state: React.useState( false ),
      key: 'addProjects',
      label: "Add projects"
    },
    {
      state: React.useState( false ),
      key: 'viewErrors',
      label: "View errors"
    }
  ];
  const settings = [
    {
      state: React.useState( false ),
      key: 'users',
      label: "Users"
    },
    {
      state: React.useState( false ),
      key: 'companies',
      label: "Companies"
    },
    {
      state: React.useState( false ),
      key: 'pausals',
      label: "Pausals"
    },
    {
      state: React.useState( false ),
      key: 'projects',
      label: "Projects"
    },
    {
      state: React.useState( false ),
      key: 'statuses',
      label: "Statuses"
    },
    {
      state: React.useState( false ),
      key: 'prices',
      label: "Prices"
    },
    {
      state: React.useState( false ),
      key: 'roles',
      label: "Roles"
    },
    {
      state: React.useState( false ),
      key: 'taskTypes',
      label: "Task types"
    },
    {
      state: React.useState( false ),
      key: 'tripTypes',
      label: "Trip types"
    },
    {
      state: React.useState( false ),
      key: 'imaps',
      label: "IMAPs"
    },
    {
      state: React.useState( false ),
      key: 'smtps',
      label: "SMTPs"
    },
  ];

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
        history.push( '/helpdesk/settings/roles/' + response.data.addRole.id )
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
  }

  const cannotSave = () => {
    return currentUserLevel === null || currentUserLevel >= level || title.length === 0;
  }

  return (
    <div>
      <div className="commandbar a-i-c p-l-20">
        { cannotSave() &&
          <div className="message error-message">
            Fill in all the required information!
          </div>
        }
      </div>


      <div className="p-t-10 p-l-20 p-r-20 p-b-20 scroll-visible fit-with-header-and-commandbar">
        <h2 className="m-b-20" >
          Add role
        </h2>
        <FormGroup>
          <Label for="role">Role <span className="warning-big">*</span></Label>
          <Input name="name" id="name" type="text" placeholder="Enter role name" value={title} onChange={(e) => setTitle(e.target.value)}/>
        </FormGroup>

        <FormGroup>
          <Label for="role">Order</Label>
          <Input name="name" id="name" type="number" placeholder="Enter role name" value={order} onChange={(e) => setOrder(e.target.value)}/>
        </FormGroup>

        <FormGroup>
          <div className="row">
            <Label for="role">Level <span className="warning-big">*</span></Label>
            <ErrorMessage show={ currentUserLevel === null || level <= currentUserLevel } message={`Targets role can't be lower or same as yours(${currentUserLevel})!`} />
          </div>
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

        <div className="form-buttons-row">
          {
            props.close &&
            <button className="btn-link" onClick={() => {
                props.close()
              }}
              >
              Cancel
            </button>
          }

          <button className="btn ml-auto" disabled={cannotSave()} onClick={addRoleFunc}>
            {
              saving
              ? 'Adding...'
              : 'Add role'
            }
          </button>
        </div>
      </div>
    </div>

  );
}