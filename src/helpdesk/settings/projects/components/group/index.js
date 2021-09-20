import React from 'react';
import Empty from 'components/Empty';
import GroupAdd from './groupAdd';
import GroupEdit from './groupEdit';
import {
  defaultGroups,
  createCleanRights
} from 'configs/constants/projects';

let fakeID = -( defaultGroups.length + 1 );

export default function ProjectGroups( props ) {
  const {
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
  } = props;

  const [ editedGroup, setEditedGroup ] = React.useState( null );

  return (
    <Empty>
      <table className="table bkg-white">
        <thead>
          <tr>
            <th>
              Group name
            </th>
            <th>
              Description
            </th>
            <th width="50">
              Order
            </th>
            <th width="100">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          { groups.map( (group) => (
            <tr key={group.id}>
              <td>
                {group.title}
              </td>
              <td>
                {group.description.length > 0 ? group.description : 'No description' }
              </td>
              <td className="p-l-17">
                {group.order}
              </td>
              { !group.def &&
                <td>
                  <button
                    className="btn btn-link"
                    onClick={() => setEditedGroup(group)}
                    >
                    EDIT
                  </button>
                  <button
                    className="btn btn-link-red"
                    onClick={() => deleteGroup(group.id)}
                    >
                    <i className="fa fa-times" />
                  </button>
                </td>
              }
              { group.def &&
                <td>
                  DEFAULT
                </td>
              }
            </tr>
          ))}
        </tbody>
      </table>
        <GroupAdd
        submit={addGroup}
        getFakeId={ () => fakeID-- }
        reccomendedOrder={ groups.length - 1 }
        />
      <GroupEdit
        open={ editedGroup !== null }
        closeModal={ () => setEditedGroup(null) }
        group={ editedGroup }
        updateGroup={updateGroup}
        />
    </Empty>
  )
}