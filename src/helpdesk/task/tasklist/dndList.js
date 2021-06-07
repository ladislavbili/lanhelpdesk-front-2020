import React from 'react';
import {
  useMutation,
  useApolloClient
}
from "@apollo/client";
import {
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import CommandBar from './components/commandBar';
import ListHeader from './components/listHeader';
import ItemRender from './components/columnItemRender';
import classnames from 'classnames';
import {
  unimplementedAttributes,
} from 'configs/constants/tasks';
import {
  localFilterToValues,
  deleteAttributes,
  updateArrayItem,
  filterUnique,
} from 'helperFunctions';
import moment from 'moment';
import {
  DragDropContext,
  Droppable,
  Draggable
} from 'react-beautiful-dnd';
import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  UPDATE_TASK,
  GET_TASK,
  GET_TASKS,
} from 'helpdesk/task/queries';

export default function TaskListDnD( props ) {
  const {
    history,
    link,
    localProject,
    localFilter,
    tasks,
  } = props;

  const statuses = (
    localProject.project.statuses ?
    localProject.project.statuses :
    filterUnique( tasks.map( ( task ) => task.status ), 'id' )
  )
  const [ updateTask ] = useMutation( UPDATE_TASK );

  const client = useApolloClient();

  const groupDataFunc = () => {
    let grouped = [];
    statuses.forEach( ( status ) => grouped.push( {
      status: {
        ...status,
        title: status.title ? status.title : 'Undefined title',
        color: status.color ? status.color : '#b8d9db'
      },
      tasks: tasks.filter( ( task ) => task.status !== undefined && task.status.id === status.id )
    } ) );
    return grouped;
  }

  const groupRest = () => {
    const ids = statuses.map( ( story ) => story.id );
    return tasks.filter( ( task ) => task.status === undefined || !ids.includes( task.status.id ) );
  }

  const updateTaskFunc = ( id, status, updateData ) => {
    updateTask( {
        variables: updateData
      } )
      .then( ( response ) => {
        let updatedTask = response.data.updateTask;
        delete updateTask.__typename;
        try {
          const originalTask = client.readQuery( {
              query: GET_TASK,
              variables: {
                id
              },
            } )
            .task;

          const newTask = {
            ...originalTask,
            ...updatedTask
          };

          client.writeQuery( {
            query: GET_TASK,
            variables: {
              id
            },
            data: {
              task: newTask
            }
          } );
        } catch ( err ) {
          addLocalError( err );
        }

        try {
          let execTasks = client.readQuery( {
              query: GET_TASKS,
              variables: {
                filterId: localFilter.id,
                filter: deleteAttributes(
                  localFilterToValues( localFilter ),
                  unimplementedAttributes
                ),
                projectId: localProject.id,
                sort: null
              }
            } )
            .tasks;

          const newTask = {
            ...execTasks.tasks.find( task => task.id === id ),
            ...updateData
          };

          client.writeQuery( {
            query: GET_TASKS,
            variables: {
              filterId: localFilter.id,
              filter: deleteAttributes(
                localFilterToValues( localFilter ),
                unimplementedAttributes
              ),
              projectId: localProject.id,
              sort: null
            },
            data: {
              tasks: {
                ...execTasks,
                tasks: updateArrayItem( execTasks.tasks, newTask )
              }
            }
          } );
        } catch ( err ) {
          addLocalError( err );
        } finally {

        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
  }

  const onDragEnd = ( {
    source,
    destination
  } ) => {
    if (
      source !== null &&
      destination !== null &&
      parseInt( source.droppableId ) === parseInt( destination.droppableId )
    ) {
      return;
    }
    const groups = groupDataFunc()

    const targetStatus = statuses.find( ( status ) => status.id === parseInt( destination.droppableId ) );
    const item = groups.find( ( group ) => group.status.id === parseInt( source.droppableId ) )
      .tasks[ source.index ];
    let updateData = {
      id: item.id,
      status: targetStatus.id,
    };
    if ( targetStatus.action === 'PendingDate' ) {
      updateData.pendingDate = moment()
        .add( 1, 'days' )
        .valueOf()
        .toString();
      updateData.pendingChangable = true;
    } else if ( targetStatus.action === 'CloseDate' || targetStatus.action === 'CloseInvalid' ) {
      updateData.important = false;
    }
    updateTaskFunc( item.id, targetStatus, updateData );
  }

  const taskGroups = groupDataFunc();

  return (
    <div>
        <CommandBar
          {...props}
          />
        <div className="scroll-visible overflow-x fit-with-header-and-commandbar task-container">
          <ListHeader
            {...props}
            />
          <div className="flex-row m-l-30" >
            <DragDropContext onDragEnd={onDragEnd}>
              {
                taskGroups
                .filter( (group) => group.status.action !== 'Invoiced' )
                .map(
                  (group) =>
                  <Card className="dnd-column" key={group.status.id}>
                    <CardHeader className="dnd-header">{group.status.title}</CardHeader>
                    <Droppable droppableId={group.status.id.toString()}>
                      {
                        (provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            className="dnd-body card-body"
                            style={{
                              background: snapshot.isDraggingOver ? 'lightblue' : 'inherit',
                            }}
                            >
                            {
                              group.tasks.map((item, index) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id.toString()}
                                  index={index}
                                  >
                                  {
                                    (provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        >
                                        <ul
                                          className={classnames("taskCol" ,"clickable", "list-unstyled", "dnd-item")}
                                          style={{borderLeft: "3px solid " + group.status.color}}
                                          onClick={(e)=>{
                                            history.push(link+'/'+item.id);
                                          }}
                                          key={item.id}
                                          >
                                          <ItemRender task={item} />
                                        </ul>
                                      </div>
                                    )
                                  }
                                </Draggable>
                              ))
                            }
                            {provided.placeholder}
                          </div>
                        )
                      }
                    </Droppable>
                  </Card>
                )
              }
            </DragDropContext>
            {
              taskGroups
              .filter( (group) => group.status.action === 'Invoiced' )
              .map(
                (group) =>
                <Card className="dnd-column" key={group.status.id}>
                  <CardHeader className="dnd-header">{group.status.title}</CardHeader>
                  <CardBody className="dnd-body">
                    {
                      group.tasks.map(
                        (item)=>
                        <ul
                          className={classnames("taskCol" ,"clickable", "list-unstyled", "dnd-item")}
                          style={{borderLeft: "3px solid " + group.status.color}}
                          onClick={(e)=>{
                            history.push(link+'/'+item.id);
                          }}
                          key={item.id}
                          >
                          <ItemRender task={item} />
                        </ul>
                      )
                    }
                    {
                      group.tasks.length===0 &&
                      <div className="center-ver" style={{textAlign:'center'}}>
                        Neboli nájdené žiadne výsledky pre tento filter
                      </div>
                    }
                  </CardBody>
                </Card>
              )
            }
            {
              groupRest().length>0 &&
              <Card className="dnd-column" key="Undefined group">
                <CardHeader>Undefined group</CardHeader>
                <CardBody>
                  {
                    groupRest().map(
                      (item)=>
                      <ul
                        className={classnames("dnd-item", "clickable", "list-unstyled")}
                        style={{borderLeft: `4px solid ${item.status.color}`}}
                        onClick={(e)=>{
                          history.push(link+'/'+item.id);
                        }}
                        key={item.id}
                        >
                        <ItemRender task={item} />
                      </ul>
                    )
                  }
                </CardBody>
              </Card>
            }
          </div>
        </div>
      </div>
  );
}