import React from 'react';

import {
  FormGroup,
} from 'reactstrap';
import Select from "react-select";
import Checkbox from 'components/checkbox';
import {
  pickSelectStyle
} from "configs/components/select";

export default function ProjectUsers( props ) {
  //data
  const {
    users,
    addRight,
    updateRight,
    deleteRight,
    groups,
    permissions,
    disabled,
    lockedRequester,
    setLockedRequester,
  } = props;

  const [ chosenUser, setChosenUser ] = React.useState( null );
  const [ group, setGroup ] = React.useState( null );
  return (
    <div>
      <Checkbox
        className="m-b-5 m-t-20 p-5 bkg-white"
        labelClassName="text-normal font-normal"
        label="A requester can be only a user with rights to this project."
        centerHor
        disabled={ disabled }
        value={ lockedRequester }
        onChange={() => {
          setLockedRequester( !lockedRequester );
        }}
        />
      {/* USER RIGHTS */}
      <table className="table m-t-10">
        <thead>
          <tr className="font-bold">
            <th width="50%">Helpdesk system user</th>
            <th>Project Group</th>
            <th width="100px"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Select
                value={chosenUser}
                styles={pickSelectStyle()}
                onChange={(e)=> setChosenUser(e)}
                options={users.filter((user)=> !permissions.map((permission)=>permission.user.id).includes(user.id))}
                />
            </td>
            <td>
              <Select
                value={group}
                styles={pickSelectStyle()}
                onChange={(e)=> setGroup(e)}
                options={groups}
                />
            </td>
            <td>
              <button
                className="btn min-width-100"
                disabled={ chosenUser === null || group === null }
                onClick={() => {
                  addRight({ user: chosenUser, group });
                  setChosenUser(null);
                }}
                >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table bkg-white m-t-10">
        <thead>
          <tr>
            <th width="50%">Helpdesk system user</th>
            <th>Project Group</th>
            <th width="50px">Akcie</th>
          </tr>
        </thead>

        <tbody>
          { permissions.sort(( userGroup1, userGroup2 ) => {
            if( userGroup1.group.order === userGroup2.group.order ){
              return (userGroup1.user.email < userGroup2.user.email) ? -1 : 1;
            }
            return (userGroup1.group.order < userGroup2.group.order) ? -1 : 1;
          } )
          .map(permission => (
            <tr key={permission.user.id}>
              <td> {permission.user.email} </td>
              <td>
                <Select
                  value={permission.group}
                  styles={pickSelectStyle()}
                  onChange={(e)=> updateRight({ ...permission, group: e })}
                  options={groups}
                  />
              </td>
              <td>
                <button
                  className="btn-link"
                  disabled={disabled}
                  onClick={()=>{
                    deleteRight(permission)
                  }}
                  >
                  <i className="fa fa-times"  />
                </button>
              </td>
            </tr>
          )) }
        </tbody>
      </table>

      {/* COMPANY RIGHTS */}
      <table className="table m-t-10">
        <thead>
          <tr className="font-bold">
            <th width="50%">Company</th>
            <th>Project Group</th>
            <th width="100px"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Select
                value={chosenUser}
                styles={pickSelectStyle()}
                onChange={(e)=> setChosenUser(e)}
                options={users.filter((user)=> !permissions.map((permission)=>permission.user.id).includes(user.id))}
                />
            </td>
            <td>
              <Select
                value={group}
                styles={pickSelectStyle()}
                onChange={(e)=> setGroup(e)}
                options={groups}
                />
            </td>
            <td>
              <button
                className="btn min-width-100"
                disabled={ chosenUser === null || group === null }
                onClick={() => {
                  addRight({ user: chosenUser, group });
                  setChosenUser(null);
                }}
                >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table bkg-white m-t-10">
        <thead>
          <tr>
            <th width="50%">Company</th>
            <th>Project Group</th>
            <th width="50px">Akcie</th>
          </tr>
        </thead>

        <tbody>
          { [].map( permission => (
            <tr key={permission.user.id}>
              <td> {permission.user.email} </td>
              <td>
                <Select
                  value={permission.group}
                  styles={pickSelectStyle()}
                  onChange={(e)=> updateRight({ ...permission, group: e })}
                  options={groups}
                  />
              </td>
              <td>
                <button
                  className="btn-link"
                  disabled={disabled}
                  onClick={()=>{
                    deleteRight(permission)
                  }}
                  >
                  <i className="fa fa-times"  />
                </button>
              </td>
            </tr>
          )) }
        </tbody>
      </table>

      {/* ROLE RIGHTS */}
      <table className="table m-t-10">
        <thead>
          <tr className="font-bold">
            <th width="50%">Helpdesk role</th>
            <th>Project Group</th>
            <th width="100px"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Select
                value={chosenUser}
                styles={pickSelectStyle()}
                onChange={(e)=> setChosenUser(e)}
                options={users.filter((user)=> !permissions.map((permission)=>permission.user.id).includes(user.id))}
                />
            </td>
            <td>
              <Select
                value={group}
                styles={pickSelectStyle()}
                onChange={(e)=> setGroup(e)}
                options={groups}
                />
            </td>
            <td>
              <button
                className="btn min-width-100"
                disabled={ chosenUser === null || group === null }
                onClick={() => {
                  addRight({ user: chosenUser, group });
                  setChosenUser(null);
                }}
                >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table bkg-white m-t-10">
        <thead>
          <tr>
            <th width="50%">Helpdesk role</th>
            <th>Project Group</th>
            <th width="50px">Akcie</th>
          </tr>
        </thead>

        <tbody>
          { [].map(permission => (
            <tr key={permission.user.id}>
              <td> {permission.user.email} </td>
              <td>
                <Select
                  value={permission.group}
                  styles={pickSelectStyle()}
                  onChange={(e)=> updateRight({ ...permission, group: e })}
                  options={groups}
                  />
              </td>
              <td>
                <button
                  className="btn-link"
                  disabled={disabled}
                  onClick={()=>{
                    deleteRight(permission)
                  }}
                  >
                  <i className="fa fa-times"  />
                </button>
              </td>
            </tr>
          )) }
        </tbody>
      </table>

      <div className="m-t-20 m-b-20">
        Helpdesk users with the administrator role have all project rights.
      </div>
    </div>
  );
}