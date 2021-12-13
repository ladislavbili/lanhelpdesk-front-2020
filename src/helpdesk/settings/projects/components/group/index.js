import React from 'react';
import Empty from 'components/Empty';
import GroupAdd from './groupAdd';
import GroupEdit from './groupEdit';
import {
  defaultGroups,
  createCleanRights
} from 'configs/constants/projects';
import {
  useTranslation
} from "react-i18next";

let fakeID = -( defaultGroups.length + 1 );

export default function ProjectGroups( props ) {
  const {
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
  } = props;

  const {
    t
  } = useTranslation();

  const [ editedGroup, setEditedGroup ] = React.useState( null );

  return (
    <Empty>
      <table className="table bkg-white">
        <thead>
          <tr>
            <th>
              {t('groupTitle')}
            </th>
            <th>
              {t('description')}
            </th>
            <th width="50">
              {t('order')}
            </th>
            <th width="100">
              {t('actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          { groups.map( (group) => (
            <tr key={group.id}>
              <td>
                {t(group.title)}
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
                    {t('edit')}
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
                  {t('default')}
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