import React from 'react';
import {

} from 'reactstrap';
import Checkbox from 'components/checkbox';
import {
  allACLs
} from './aclData';

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
            allACLs.map((acl) => (
              <tr key={acl.id}>
                <td colSpan={acl.separator ? groups.length + 1 : '1' } >{ acl.title }</td>
                { groups.map( (group) => {
                  if(acl.separator){
                    return null;
                  }
                    return (
                      <td key={group.id}>
                        <span className='center-hor row' style={{width: 'fit-content'}}>
                          <Checkbox
                            className = "m-l-5 m-r-5"
                            value = { acl.both ? group.rights[acl.id].read : group.rights[acl.id] }
                            onChange={() =>{
                              let newVal = !( acl.both ? group.rights[acl.id].read : group.rights[acl.id] );
                              if( acl.both ){
                                updateGroupRight(group.id, acl.id, { read: newVal, write: group.rights[acl.id].write } )
                              }else{
                                if( acl.dependancy !== null && newVal){
                                  updateGroupRight(group.id, acl.dependancy, newVal )
                                }
                                updateGroupRight(group.id, acl.id, newVal )
                              }
                            }}
                            />
                          { acl.both && '/' }
                          { acl.both && <Checkbox
                            className = "m-l-5 m-r-5"
                            value = { group.rights[acl.id].write }
                            onChange={() =>{
                              let newVal = !group.rights[acl.id].write;
                              if( newVal ){
                                updateGroupRight(group.id, acl.id, { read: true, write: true } )
                              }
                              updateGroupRight(group.id, acl.id, { read: group.rights[acl.id].read, write: newVal } )
                            }}
                            />
                        }
                      </span>
                    </td>
                  )
                }
              )}
          </tr>
        ))
      }
    </tbody>
  </table>
</div>
  );
}