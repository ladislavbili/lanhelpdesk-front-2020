import React from 'react';
import {
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import classnames from 'classnames';

import {
  useQuery,
} from "@apollo/client";

import Loading from 'components/loading';
import Empty from 'components/Empty';
import ItemRender from '../components/columnItemRender';

import {
  GET_TASKS,
} from '../../queries';

export default function DnDInvoicedColumn( props ) {
  const {
    status,
    taskVariables,
    history,
    limit,
    localFilter,
    localProject,
    localMilestone,
    currentUser,
    globalStringFilter,
    forcedRefetch,
  } = props;

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
      statuses: [ status.id ],
    },
    notifyOnNetworkStatusChange: true,
  } );

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

  const tasks = tasksLoading ? [] : tasksData.tasks.tasks;
  const count = tasksLoading ? 0 : tasksData.tasks.count;

  return (
    <Card className="dnd-column" key={status.id}>
      <CardHeader className="dnd-header">{status.title}</CardHeader>
      <CardBody className="dnd-body">
        { tasksLoading &&
          <Loading />
        }
        { !tasksLoading &&
          <Empty>
            { tasks.map( (task) =>
              <ul
                className={classnames("taskCol" ,"clickable", "list-unstyled", "dnd-item")}
                style={{borderLeft: "3px solid " + status.color}}
                onClick={(e)=>{
                  history.push(link+'/'+task.id);
                }}
                key={task.id}
                >
                <ItemRender task={task} />
              </ul>
            ) }
            { tasks.length === 0 &&
              <div className="center-ver" style={{textAlign:'center'}}>
                Neboli nájdené žiadne výsledky pre tento filter
              </div>
            }
          </Empty>
        }
      </CardBody>
    </Card>
  );
}