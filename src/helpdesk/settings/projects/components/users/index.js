import React from 'react';

import {
  FormGroup,
} from 'reactstrap';
import UserAdd from './userAdd';
import CompanyAdd from './companyAdd';
import Select from "react-select";
import Checkbox from 'components/checkbox';
import Radio from 'components/radio';
import {
  pickSelectStyle
} from "configs/components/select";

export default function ProjectUsers( props ) {
  //data
  const {
    addUserRight,
    deleteUserRight,
    updateUserRight,
    addCompanyRight,
    deleteCompanyRight,
    updateCompanyRight,
    groups,
    users,
    userGroups,
    companies,
    companyGroups,
    disabled,
    lockedRequester,
    setLockedRequester,
  } = props;

  const [ chosenUser, setChosenUser ] = React.useState( null );
  const [ userGroup, setUserGroup ] = React.useState( null );
  const [ chosenCompany, setChosenCompany ] = React.useState( null );
  const [ companyGroup, setCompanyGroup ] = React.useState( null );
  return (
    <div>
      <Radio
        className="m-t-20"
        options={ [
          {
            key: 'lockedRequesterOff',
            value: !lockedRequester,
            label: 'A requester can be ALL helpdesk users',
          },
          {
            key: 'lockedRequesterOn',
            value: lockedRequester,
            label: 'A requester can be only one of PROJECT users.',
          },
        ] }
        name="lockedRequester"
        disabled={ disabled }
        onChange={ () => {
          setLockedRequester( !lockedRequester );
        } }
        />
      {/* USER RIGHTS */}
      <table className="table bkg-white m-t-20">
        <thead>
          <tr>
            <th width="50%">Helpdesk system user</th>
            <th>Project Group</th>
            <th width="50px">Akcie</th>
          </tr>
        </thead>

        <tbody>
          { userGroups.sort(( userGroup1, userGroup2 ) => {
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
                  onChange={(e)=> updateUserRight({ ...permission, group: e })}
                  options={groups}
                  />
              </td>
              <td>
                <button
                  className="btn-link"
                  disabled={disabled}
                  onClick={()=>{
                    deleteUserRight(permission)
                  }}
                  >
                  <i className="fa fa-times"  />
                </button>
              </td>
            </tr>
          )) }
        </tbody>
      </table>
      <UserAdd submit={addUserRight} users={ users.filter((user) => !userGroups.map((permission) => permission.user.id).includes(user.id)) } groups={groups} />

      {/* COMPANY RIGHTS */}
      <table className="table bkg-white m-t-10">
        <thead>
          <tr>
            <th width="50%">Company</th>
            <th>Project Group</th>
            <th width="50px">Akcie</th>
          </tr>
        </thead>

        <tbody>
          { companyGroups.map( permission => (
            <tr key={permission.company.id}>
              <td> {permission.company.title} </td>
              <td>
                <Select
                  value={permission.group}
                  styles={pickSelectStyle()}
                  onChange={(e)=> updateCompanyRight({ ...permission, group: e })}
                  options={groups}
                  />
              </td>
              <td>
                <button
                  className="btn-link"
                  disabled={disabled}
                  onClick={()=>{
                    deleteCompanyRight(permission)
                  }}
                  >
                  <i className="fa fa-times"  />
                </button>
              </td>
            </tr>
          )) }
        </tbody>
      </table>
      <CompanyAdd submit={addCompanyRight} companies={companies.filter((company) => !companyGroups.map((permission) => permission.company.id).includes(company.id))} groups={groups} />

      <div className="m-t-20 m-b-20">
        Helpdesk users with the administrator role have all project rights.
      </div>
    </div>
  );
}