import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from 'classnames';

import {
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import {
  Droppable,
  Draggable
} from 'react-beautiful-dnd';
import Pagination from './pagination';
import Loading from 'components/loading';
import Empty from 'components/Empty';
import ItemRender from '../components/columnItemRender';
import ModalTaskEdit from 'helpdesk/task/edit/modalEdit';

import {
  GET_TASKS,
  ADD_TASK_SUBSCRIPTION,
} from '../../queries';

export default function DnDStatusColumn( props ) {
  const {
    status,
    taskVariables,
    history,
    change,
    limit,
    disabled,
    link,
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

  React.useEffect( () => {
    if ( change !== null && ( change.originalStatus.id === status.id || change.newStatus.id === status.id ) ) {
      tasksRefetch();
    }
  }, [ change ] );

  useSubscription( ADD_TASK_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tasksRefetch();
    }
  } );

  const tasks = tasksLoading ? [] : tasksData.tasks.tasks;
  const count = tasksLoading ? 0 : tasksData.tasks.count;

  return (
    <Card className="dnd-column" key={status.id}>
      <CardHeader className="dnd-header">{status.title}</CardHeader>
      { tasksLoading &&
        <Loading flex />
      }
      { !tasksLoading &&
        <Droppable droppableId={status.id.toString()}>
          { (provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className="dnd-body card-body"
              style={{
                background: snapshot.isDraggingOver ? 'lightblue' : 'inherit',
              }}
              >
              <Empty>
                { !disabled && tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    extraData={'aaaa'}
                    index={index}
                    >
                    { (provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        >
                        <ul
                          className={classnames("taskCol" ,"clickable", "list-unstyled", "dnd-item", "noselect")}
                          style={{borderLeft: "3px solid " + status.color}}
                          onClick={(e)=>{
                            //history.push(link+'/'+task.id);
                            setEditedTask(task);
                          }}
                          key={task.id}
                          >
                          <ItemRender task={task} />
                        </ul>
                      </div>
                    ) }
                  </Draggable>
                ))}
                { disabled && tasks.map((task, index) => (
                  <div
                    key={task.id}
                    >
                    <ul
                      className={classnames("taskCol" ,"clickable", "list-unstyled", "dnd-item", "noselect")}
                      style={{borderLeft: "3px solid " + status.color}}
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

              </Empty>

              { tasks.length === 0 &&
                <div className="center-ver" style={{textAlign:'center'}}>
                  Neboli nájdené žiadne výsledky pre tento filter
                </div>
              }
              {provided.placeholder}
            </div>
          ) }
        </Droppable>
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