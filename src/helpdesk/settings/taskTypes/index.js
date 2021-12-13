import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from 'classnames';

import Empty from 'components/Empty';
import SettingLoading from '../components/settingLoading';
import SettingListContainer from '../components/settingListContainer';
import TaskTypeAdd from './taskTypeAdd';
import TaskTypeEdit from './taskTypeEdit';

import {
  orderArr
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";
import {
  itemAttributesFullfillsString
} from '../components/helpers';

import {
  GET_TASK_TYPES,
  TASK_TYPES_SUBSCRIPTION,
} from './queries';


export default function TaskTypeList( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: taskTypesData,
    loading: taskTypesLoading,
    refetch: taskTypesRefetch,
  } = useQuery( GET_TASK_TYPES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( TASK_TYPES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      taskTypesRefetch();
    }
  } );

  // state
  const [ taskTypeFilter, setTaskTypeFilter ] = React.useState( "" );

  if ( taskTypesLoading ) {
    return ( <SettingLoading match={match} /> );
  }

  const taskTypes = orderArr( taskTypesData.taskTypes );

  const RightSideComponent = (
    <Empty>
      { match.params.id && match.params.id==='add' &&
        <TaskTypeAdd {...props}  />
      }
      { match.params.id && match.params.id!=='add' && taskTypes.some((item) => item.id.toString() === match.params.id) &&
        <TaskTypeEdit {...{history, match}} />
      }
    </Empty>
  );

  return (
    <SettingListContainer
      header={t('taskTypes')}
      filter={taskTypeFilter}
      setFilter={setTaskTypeFilter}
      history={history}
      addURL="/helpdesk/settings/taskTypes/add"
      addLabel={t('taskType')}
      RightSideComponent={RightSideComponent}
      >
      <table className="table table-hover">
        <thead>
          <tr>
            <th>{t('title')}</th>
            <th>{t('order')}</th>
          </tr>
        </thead>
        <tbody>
          { taskTypes.filter( (item) => itemAttributesFullfillsString(item, taskTypeFilter, ['title']) )
            .map((taskType) => (
              <tr key={taskType.id}
                className={classnames (
                  "clickable",
                  {
                    "active": parseInt(match.params.id) === taskType.id
                  }
                )}
                onClick={()=>history.push(`/helpdesk/settings/taskTypes/${taskType.id}`)}>
                <td>
                  {taskType.title}
                </td>
                <td>
                  {taskType.order}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </SettingListContainer>
  )
}