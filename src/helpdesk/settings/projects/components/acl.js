import React from 'react';
import {

} from 'reactstrap';
import classnames from 'classnames';
import {
  useTranslation
} from "react-i18next";
import Checkbox from 'components/checkbox';
import {
  allACLs
} from 'configs/constants/projects';
import GroupEdit from './group/groupEdit';

export default function ProjectACL( props ) {
  const {
    groups,
    updateGroupRight,
  } = props;

  const {
    t
  } = useTranslation();

  const sortedGroups = groups.sort( ( group1, group2 ) => {
    if ( group1.order === group2.order ) {
      return ( group1.title < group2.title ) ? -1 : 1;
    }
    return ( parseInt( group1.order ) < parseInt( group2.order ) ) ? -1 : 1;
  } );

  const resolveDependancy = ( acl, group, newVal ) => {
    if ( acl.dependancy && newVal ) {
      acl.dependancy.forEach( ( dependancy ) => {
        if ( allACLs.find( ( acl ) => acl.id === dependancy.key )
          .both ) {
          switch ( dependancy.affect ) {
            case 'read': {
              updateGroupRight(
                group.id,
                dependancy.key, {
                  read: true,
                  write: group.rights[ dependancy.key ].write
                }
              )
              break;
            }
            default: {
              updateGroupRight(
                group.id,
                dependancy.key, {
                  read: true,
                  write: true
                }
              )
              break;
            }
          }
        } else {
          updateGroupRight( group.id, dependancy.key, newVal )
        }
      } )
    }
  }

  const rightDisabled = ( acl, rights, write = false ) => {
    if ( !write && acl.both && rights[ acl.id ].write ) {
      return true;
    }
    if ( !acl.disabled ) {
      return false;
    }
    return acl.disabled.some( ( disabledInfo ) => {
      if ( write && disabledInfo.values === 'read' ) {
        return false;
      }
      const targetACL = allACLs.find( ( acl ) => acl.id === disabledInfo.key );
      if ( targetACL.both ) {
        switch ( disabledInfo.affectedBy ) {
          case 'read': {
            return rights[ targetACL.id ].read;
            break;
          }
          default: {
            return rights[ targetACL.id ].read || rights[ targetACL.id ].write;
            break;
          }
        }
      } else {
        return rights[ targetACL.id ];
      }
    } )
  }

  return (
    <div>
      <table className="table bkg-white">
        <tbody>
          { allACLs.map((acl) => (
            <tr key={acl.id} className={classnames( { 'bkg-content h-30': acl.separator, 'font-bold': acl.header })}>
              <td colSpan={acl.separator ? sortedGroups.length + 1 : '1' } >{ acl.separator ? '' : t(acl.title) }</td>
              { sortedGroups.map( (group) => {
                if(acl.separator){
                  return null;
                }
                if(acl.header){
                  return (
                  <td key={group.id}>
                    {t(group.title)}
                  </td>
                  )
                }
                return (
                  <td key={group.id}>
                    <span className='center-hor row' style={{width: 'fit-content'}}>
                      <Checkbox
                        className = "m-l-5 m-r-5"
                        blocked = { acl.fake || (group.admin && ['projectRead', 'projectWrite'].includes(acl.id)) }
                        disabled = { acl.fake || rightDisabled(acl, group.rights) || (group.admin && ['projectRead', 'projectWrite'].includes(acl.id)) }
                        value = { acl.fake ? acl.value : (acl.both ? group.rights[acl.id].read : group.rights[acl.id]) }
                        onChange={() => {
                          if(acl.fake){
                            return;
                          }
                          let newVal = !( acl.both ? group.rights[acl.id].read : group.rights[acl.id] );
                          if( acl.both ){
                            updateGroupRight(group.id, acl.id, { read: newVal, write: group.rights[acl.id].write } )
                          }else{
                            updateGroupRight(group.id, acl.id, newVal )
                          }
                          resolveDependancy( acl, group, newVal );
                        }}
                        />
                      { acl.both && '/' }
                      { acl.both &&
                        <Checkbox
                          className = "m-l-5 m-r-5"
                          disabled = { rightDisabled(acl, group.rights, true) }
                          value = { group.rights[acl.id].write }
                          onChange={() =>{
                            let newVal = !group.rights[acl.id].write;
                            if( newVal ){
                              updateGroupRight(group.id, acl.id, { read: true, write: true } )
                            }
                            updateGroupRight(group.id, acl.id, { read: group.rights[acl.id].read, write: newVal } )
                            resolveDependancy( acl, group, newVal );
                          }}
                          />
                      }
                    </span>
                  </td>
                );
              } )}
            </tr>
          )) }
        </tbody>
      </table>
    </div>
  );
}