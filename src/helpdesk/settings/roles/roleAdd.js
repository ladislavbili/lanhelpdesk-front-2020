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
  Input
} from 'reactstrap';
import ErrorMessage from 'components/errorMessage';
import SettingsInput from '../components/settingsInput';
import RightRow from './rightRow';

import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  getMyData,
} from 'helperFunctions';

import {
  GET_ROLES,
  ADD_ROLE
} from './queries';

export default function RoleAdd( props ) {
  const {
    history,
    match
  } = props;

  const client = useApolloClient();

  const currentUser = getMyData();

  const [ addRole ] = useMutation( ADD_ROLE );
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
  const helpdesk = [
    {
      state: React.useState( false ),
      key: 'tasklistLayout',
      label: "Set tasklist layout (all tasks)"
    },
    {
      state: React.useState( false ),
      key: 'tasklistCalendar',
      label: "Tasklist calendar (all tasks)"
    },
    {
      state: React.useState( false ),
      key: 'tasklistPreferences',
      label: "Tasklist column preferences"
    },
    {
      state: React.useState( false ),
      key: 'customFilters',
      label: "Create custom filters"
    },
  ];

  const [ saving, setSaving ] = React.useState( false );

  //functions
  const addRoleFunc = () => {
    setSaving( true );
    let accessRights = {};
    [ ...generalRights, ...settings, ...helpdesk ].forEach( ( right ) => accessRights[ right.key ] = right.state[ 0 ] );
    addRole( {
        variables: {
          title,
          level: (
            level !== '' ?
            parseInt( level ) :
            0
          ),
          order: (
            order !== '' ?
            parseInt( order ) :
            0
          ),
          accessRights
        }
      } )
      .then( ( response ) => {
        history.push( `/helpdesk/settings/roles/${response.data.addRole.id}` )
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
  }

  const currentUserLevel = currentUser ? currentUser.role.level : null;

  const cannotSave = () => (
    currentUserLevel === null ||
    currentUserLevel >= level ||
    title.length === 0
  );

  return (
    <div className="scroll-visible p-20 fit-with-header">
      <h2 className="m-b-20" >
        Add role
      </h2>

      <SettingsInput
        required
        id="title"
        label="Role name"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        />

      <SettingsInput
        id="order"
        label="Order"
        value={order}
        onChange={(e) => {
          setOrder(e.target.value);
        }}
        />

      <SettingsInput
        id="level"
        label="Level"
        type="number"
        error={ currentUserLevel === null || level <= currentUserLevel }
        errorMessage={`Targets role can't be lower or same as yours(${currentUserLevel})!`}
        value={level}
        onChange={(e) => {
          setLevel(e.target.value);
        }}
        />

      <div>
        <h2>General rights</h2>
        <table className="table">
          <thead>
            <tr>
              <th width={"90%"} key={1}>
                Name
              </th>
              <th className="text-center" key={2}>
                Granted
              </th>
            </tr>
          </thead>
          <tbody>
            { generalRights.map( (right) => (
              <RightRow
                key={[right.key,right.state[0]].toString()}
                onChange={right.state[1]}
                label={right.label}
                disabled={false}
                value={right.state[0]}
                />
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Settings</h2>
        <table className="table">
          <thead>
            <tr>
              <th width={"90%"} key={1}>
                Access
              </th>
              <th className="text-center" key={2}>
                View & Edit
              </th>
            </tr>
          </thead>
          <tbody>
            { settings.map( (right) => (
              <RightRow
                key={[right.key,right.state[0]].toString()}
                onChange={right.state[1]}
                label={right.label}
                disabled={false}
                value={right.state[0]}
                />
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Helpdesk rights</h2>
        <table className="table">
          <thead>
            <tr>
              <th width={"90%"} key={1}>
                Name
              </th>
              <th className="text-center" key={2}>
                Granted
              </th>
            </tr>
          </thead>
          <tbody>
            { helpdesk.map( (right) => (
              <RightRow
                key={[right.key,right.state[0]].toString()}
                onChange={right.state[1]}
                label={right.label}
                disabled={false}
                value={right.state[0]}
                />
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-buttons-row">
        { props.close &&
          <button className="btn-link" onClick={() => {
              props.close()
            }}
            >
            Cancel
          </button>
        }

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
          onClick={addRoleFunc}
          >
          { saving ? 'Adding...' : 'Add role' }
        </button>
      </div>
    </div>
  );
}