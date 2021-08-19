import React from 'react';
import GroupEdit from './groupEdit';
import {
  defaultGroups,
  createCleanRights
} from 'configs/constants/projects';

let fakeID = -( defaultGroups.length + 1 );

export default function ProjectGroups( props ) {
  const {
    groups,
    disabled,
    addGroup,
    updateGroup,
    deleteGroup,
  } = props;

  const [ title, setTitle ] = React.useState( "" );
  const [ description, setDescription ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( groups.length );

  React.useEffect( () => {
    setOrder( groups.length );
  }, [ groups.length ] );

  return (
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
            <td>
              <GroupEdit
                updateGroup={updateGroup}
                disabled={disabled}
                group={group}
                />
              <button
                className="btn btn-link-red"
                disabled={disabled}
                onClick={() => deleteGroup(group.id)}
                >
                <i className="fa fa-times" />
              </button>
            </td>
          </tr>
        ))}
        { !disabled &&
          <tr>
          <td>
            <input
              className="form-control hidden-input"
              placeholder="Enter group name"
              value={title}
              onChange={e => setTitle(e.target.value)}
              />
          </td>
          <td>
            <input
              className="form-control hidden-input"
              placeholder="Enter group description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              />
          </td>
          <td>
            <input
              className="form-control hidden-input"
              placeholder="Enter order"
              value={order}
              onChange={e => setOrder(e.target.value)}
              />
          </td>
          <td>
            <button
              className="btn btn-link"
              disabled={ title.length === 0 || isNaN(parseInt(order)) }
              onClick={() => {
                addGroup({ title, description, id: fakeID--, order, rights: createCleanRights() });
                setTitle('');
                setDescription('');
              }}
              >
              <i className="fa fa-plus" />
            </button>
          </td>
        </tr>
      }
      </tbody>
    </table>
  )
}