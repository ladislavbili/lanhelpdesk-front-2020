import React from 'react';
import classnames from 'classnames';
import Checkbox from 'components/checkbox';
import {
  Label,
  FormGroup,
} from 'reactstrap';
import Select from "react-select";
import {
  selectStyle
} from "configs/components/select";
import {
  objectToAtributeArray
} from 'helperFunctions';

export default function TagACL( props ) {
  const {
    users,
    usersWithRights,
    addUserWithRights,
    removeUserWithRights,
    editUserWithRights,
  } = props;

  const [ chosenUser, setChosenUser ] = React.useState( null );

  return (
    <div>
      <FormGroup>
        <Label>User</Label>
        <div className="row w-30">
          <div className="f-1">
            <Select
              value={chosenUser}
              styles={selectStyle}
              onChange={ (e)=> setChosenUser(e) }
              options={users}
              />
          </div>
          <button
            className="btn m-l-10"
            disabled={ chosenUser === null }
            onClick={() => {
              addUserWithRights();
              setChosenUser(null);
            }}
            >
            Add
          </button>
        </div>
      </FormGroup>

      <table className="table">
        <thead>
          <tr>
            <th> Username </th>
            <th> View </th>
            <th> Edit </th>
            <th> Admin </th>
            <th width="70px"> Action </th>
          </tr>
        </thead>
        <tbody>
          { usersWithRights.map(user => (
            <tr>
              <td> { user.username }</td>
              <td>
                <Checkbox
                  className = "m-l-5 m-r-5"
                  value = { user.rights.view }
                  onChange={(value) =>{
                    editUserWithRights(user.id, "view", value)
                  }}
                  />
              </td>
              <td>
                <Checkbox
                  className = "m-l-5 m-r-5"
                  value = { user.rights.edit }
                  onChange={(value) =>{
                    editUserWithRights(user.id, "edit", value)
                  }}
                  />
              </td>
              <td>
                <Checkbox
                  className = "m-l-5 m-r-5"
                  value = { user.rights.admin }
                  onChange={(value) =>{
                    editUserWithRights(user.id, "admin", value)
                  }}
                  />
              </td>
              <td>
                <button className="btn btn-link waves-effect t-a-c"
                  onClick={()=>{
                    if(window.confirm('Are you sure?')){
                      removeUserWithRights(user.id);
                    }
                  }}>
                  <i className="fa fa-times" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}