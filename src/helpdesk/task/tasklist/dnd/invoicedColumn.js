import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from 'classnames';
import {
  useTranslation
} from "react-i18next";

import {
  Card,
  CardHeader,
} from 'reactstrap';
import Pagination from './pagination';
import Loading from 'components/loading';
import Empty from 'components/Empty';
import ItemRender from '../components/columnItemRender';
import ModalTaskEdit from 'helpdesk/task/edit/modalEdit';

import {
  GET_TASKS,
  ADD_TASK_SUBSCRIPTION,
} from '../../queries';

export default function DnDInvoicedColumn( props ) {
  const {
    taskVariables,
    history,
    limit,
    link,
    localFilter,
    localProject,
    localMilestone,
    currentUser,
    globalStringFilter,
    forcedRefetch,
  } = props;

  const {
    t
  } = useTranslation();

  const [ page, setPage ] = React.useState( 1 );

  const {
    data: tasksData,
    loading: tasksLoading,
    refetch: tasksRefetch,
  } = useQuery( GET_TASKS, {
    variables: {
      ...taskVariables,
      page,
      limit: limit,
      invoiced: true,
    },
    notifyOnNetworkStatusChange: true,
  } );

  const [ editedTask, setEditedTask ] = React.useState( null );

  //refetch tasks
  React.useEffect( () => {
    tasksRefetch();
    setPage( 1 );
  }, [
    localFilter,
    localProject.id,
    localMilestone.id,
    currentUser,
    globalStringFilter,
    forcedRefetch
  ] );

  React.useEffect( () => {
    tasksRefetch();
  }, [ page ] );

  useSubscription( ADD_TASK_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tasksRefetch();
    }
  } );

  const tasks = tasksLoading ? [] : tasksData.tasks.tasks;
  const count = tasksLoading ? 0 : tasksData.tasks.count;

  if ( tasks.length === 0 && !tasksLoading ) {
    return null;
  }

  return (
    <Card className="dnd-column">
      <CardHeader className="dnd-header">{t('invoicedTasks')}</CardHeader>
      { tasksLoading &&
        <Loading flex />
      }
      { !tasksLoading &&
        <div>
            <div
              className="dnd-body card-body"
              >
              { tasks.map((task, index) => (
                <div
                  key={task.id}
                  >
                  <ul
                    className={classnames("taskCol" ,"clickable", "list-unstyled", "dnd-item", "noselect")}
                    style={{borderLeft: "3px solid " + task.status.color}}
                    onClick={(e)=>{
                      //history.push(link+'/'+task.id);
                      setEditedTask(task);
                    }}
                    key={task.id}
                    >
                    <ItemRender task={task} />
                  </ul>
                </div>
              ))}
            </div>
        </div>
      }
      <Pagination
        page={ page }
        setPage={ setPage }
        limit={ limit }
        count={ count }
        loading={ tasksLoading }
        />
      <ModalTaskEdit opened={editedTask} taskID={ editedTask ? editedTask.id : null } closeModal={ () => setEditedTask(null) } />
    </Card>
  );
}