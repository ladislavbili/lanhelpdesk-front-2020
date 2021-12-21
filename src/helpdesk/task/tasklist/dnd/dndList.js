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
import CommandBar from '../components/commandBar';
import ItemRender from '../components/columnItemRender';
import Search from '../components/search';
import ActiveSearch from '../components/activeSearch';
import InvoicedColumn from './invoicedColumn';
import StatusColumn from './statusColumn';
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
const limit = 20;

export default function TaskListDnD( props ) {
  const {
    history,
    link,
    localProject,
    localFilter,
    globalStringFilter,
    globalTaskSearch,
    taskVariables,
  } = props;

  const client = useApolloClient();

  let statuses = localProject.project.statuses;

  const filterStatuses = localFilter.filter.statuses;
  if ( filterStatuses.length > 0 ) {
    statuses = statuses.filter( ( status ) => filterStatuses.some( ( status2 ) => status.id === status2.id ) )
  }

  const activeSearchHidden = (
    globalStringFilter === null ||
    Object.keys( globalStringFilter )
    .filter( ( filterKey ) => (
      ![ 'createdAt', 'startsAt', 'deadline' ].includes( filterKey ) &&
      globalStringFilter[ filterKey ] !== null &&
      globalStringFilter[ filterKey ].length !== 0
    ) )
    .length === 0
  ) && globalTaskSearch.length === 0;

  const [ updateTask ] = useMutation( UPDATE_TASK );
  const [ changedTask, setChangedTask ] = React.useState( null );
  const [ fakeChanges, setFakeChanges ] = React.useState( [] );
  const [ tasks, setTasks ] = React.useState( [] );

  //create fake tasks, mark taskId and status of fake task

  const onDragEnd = ( props ) => {
    const {
      source,
      destination,
      draggableId,
    } = props;

    if (
      source !== null &&
      destination !== null &&
      parseInt( source.droppableId ) === parseInt( destination.droppableId )
    ) {
      return;
    }

    const originalStatus = statuses.find( ( status ) => status.id === parseInt( source.droppableId ) );
    const targetStatus = statuses.find( ( status ) => status.id === parseInt( destination.droppableId ) );
    const task = tasks.find( ( task ) => task.id === parseInt( draggableId ) );
    setFakeChanges( [
      ...fakeChanges.filter( ( fakeChange ) => fakeChange.task.id !== task.id ),
      {
        task,
        originalStatus: parseInt( source.droppableId ),
        targetStatus: parseInt( destination.droppableId ),
        targetUpdate: false,
        originUpdate: false,
    }
  ] );
    let updateData = {
      id: task.id,
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
    updateTaskFunc( originalStatus, targetStatus, updateData );
  }

  const updateTaskFunc = ( originalStatus, newStatus, updateData ) => {
    updateTask( {
        variables: updateData
      } )
      .then( ( response ) => {
        setChangedTask( {
          originalStatus,
          newStatus,
          id: updateData.id,
        } );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
  }

  return (
    <div className="relative">
      <CommandBar
        {...props}
        showSort
        />
      <div className="scroll-visible overflow-x fit-with-header-and-commandbar task-container">
        <Search {...props} />
        <ActiveSearch {...props} includeGlobalSearch />
        <div className="flex-row m-l-30" >
          <DragDropContext onDragEnd={onDragEnd}>
            { statuses
              .filter( (status) => status.action !== 'Invoiced' )
              .map( (status) =>
              <StatusColumn
                {...props}
                disabled={!localProject.attributeRights.status.edit}
                addStatusTasks={ (newTasks) => setTasks([
                  ...tasks.filter((task) => newTasks.every((task2) => task.id !== task2.id ) ),
                  ...newTasks,
                ]) }
                change={changedTask}
                fakeChanges={fakeChanges}
                setFakeChanges={setFakeChanges}
                status={status}
                key={status.id}
                limit={1}
                />
            ) }
          </DragDropContext>
          <InvoicedColumn {...props} limit={limit} />
        </div>
      </div>
    </div>
  );
}