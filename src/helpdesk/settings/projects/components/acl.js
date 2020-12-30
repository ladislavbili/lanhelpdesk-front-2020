import React from 'react';
import {

} from 'reactstrap';
import Checkbox from 'components/checkbox';

export const projectACLS = [
  {
    id: 'viewProjectDescription',
    title: 'View project description',
    dependancy: null,
  },
  {
    id: 'editProjectDescription',
    title: 'Edit description',
    dependancy: 'viewDescription',
  },
  {
    id: 'viewProject',
    title: 'View project',
    dependancy: null,
  },
  {
    id: 'editProject',
    title: 'Edit project',
    dependancy: 'viewProject',
  },
  {
    id: 'viewTaskDescription',
    title: 'View task description',
    dependancy: null,
  },
  {
    id: 'editTaskDescription',
    title: 'Edit task description',
    dependancy: 'viewTaskDescription',
  },
  {
    id: 'internal',
    title: 'Internal comments',
    dependancy: 'viewComments',
  },
  {
    id: 'emails',
    title: 'Send emails from comments',
    dependancy: 'viewComments',
  },
  {
    id: 'viewComments',
    title: 'View comments',
    dependancy: null,
  },
  {
    id: 'addComments',
    title: 'Add comments',
    dependancy: 'viewComments',
  },
];

export const projectDoubleACLS = [
  {
    id: 'vykaz',
    title: 'Vykaz',
  },
  {
    id: 'status',
    title: 'Status',
  },
  {
    id: 'tags',
    title: 'Tags',
  },
  {
    id: 'assigned',
    title: 'Assigned to',
  },
  {
    id: 'requester',
    title: 'Requester',
  },
  {
    id: 'company',
    title: 'Company',
  },
  {
    id: 'pausal',
    title: 'Pausal',
  },
];

export default function ProjectACL( props ) {
  const {
    groups,
    updateGroupRight
  } = props;

  return (
    <div>
      <table className="table vykazyTable">
        <thead>
          <tr>
            <th> ACL </th>
            {
              groups.map((group) => (
                <th width="150px" key={group.id} className="bolder">{group.title}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Action</td>
            {
              groups.map((group) => (
                <td>
                  <button
                    className="btn waves-effect m-r-5"
                    onClick={() => {} }
                    >
                    EDIT
                  </button>
                  <button
                    className="btn waves-effect m-r-5"
                    onClick={() => {} }
                    >
                    DELETE
                  </button>
                </td>
              ))
            }
          </tr>
          <tr>
            <td>Group Order</td>
            {
              groups.map((group) => (
                <td>
                  {group.order}
                </td>
              ))
            }
          </tr>

          {
            projectACLS.map((projectACL) => (
              <tr key={projectACL.id}>
                <td>{ projectACL.title }</td>
                {
                  groups.map( (group) => (
                    <td key={group.id}>
                      <Checkbox
                        className = "m-l-5 m-r-5"
                        centerHor
                        value = { group.rights[projectACL.id] }
                        onChange={() =>{
                          let newVal = !group.rights[projectACL.id];
                          if( projectACL.dependancy !== null && newVal){
                            updateGroupRight(group.id, projectACL.dependancy, newVal )
                          }
                          updateGroupRight(group.id, projectACL.id, newVal )
                        }}
                        />
                    </td>
                  ) )
                }
              </tr>
            ))
          }
          {
            projectDoubleACLS.map((projectACL) => (
              <tr key={projectACL.id}>
                <td>{ projectACL.title }</td>
                {
                  groups.map( (group) => (
                    <td key={group.id}>
                        <span className='center-hor row' style={{width: 'fit-content'}}>
                      <Checkbox
                        className = "m-l-5 m-r-5"
                        value = { group.rights[projectACL.id].read }
                        onChange={() =>{
                          let newVal = !group.rights[projectACL.id].read;
                          updateGroupRight(group.id, projectACL.id, { read: newVal, write: group.rights[projectACL.id].write } )
                        }}
                        />
                      /
                      <Checkbox
                        className = "m-l-5 m-r-5"
                        value = { group.rights[projectACL.id].write }
                        onChange={() =>{
                          let newVal = !group.rights[projectACL.id].write;
                          if( newVal ){
                            updateGroupRight(group.id, projectACL.id, { read: true, write: true } )
                          }
                          updateGroupRight(group.id, projectACL.id, { read: group.rights[projectACL.id].read, write: newVal } )
                        }}
                        />
                    </span>
                    </td>
                  ) )
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}