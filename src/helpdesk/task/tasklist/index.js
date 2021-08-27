import React from 'react';
import {
  useQuery,
  useMutation,
} from "@apollo/client";

import {
  localFilterToValues,
  deleteAttributes,
  getMyData,
} from 'helperFunctions';

import {
  unimplementedAttributes,
  defaultSorts,
} from 'configs/constants/tasks';

import Loading from 'components/loading';
import TasklistSwitch from './layoutSwitch';

import {
  SET_TASKLIST_LAYOUT,
} from 'helpdesk/settings/users/queries';
import {
  GET_MY_PROJECTS,
} from 'helpdesk/settings/projects/queries';

import {
  setFilter,
  setProject,
  setMilestone,
  addLocalError,
  setLocalTaskSearch,
  setGlobalTaskSearch,
} from 'apollo/localSchema/actions';

import {
  GET_FILTER,
  GET_PROJECT,
  GET_MILESTONE,
  GET_LOCAL_TASK_SEARCH,
  GET_GLOBAL_TASK_SEARCH,
} from 'apollo/localSchema/queries';

import {
  SET_TASKLIST_SORT,
} from '../queries';

export default function TasksLoader( props ) {
  const {
    history,
    match,
  } = props;
  const page = match.params.page ? parseInt( match.params.page ) : 1;
  const limit = 30;

  //local
  const {
    data: filterData,
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
  } = useQuery( GET_PROJECT );

  const {
    data: milestoneData,
  } = useQuery( GET_MILESTONE );

  const {
    data: localSearchData,
  } = useQuery( GET_LOCAL_TASK_SEARCH );

  const {
    data: globalSearchData,
  } = useQuery( GET_GLOBAL_TASK_SEARCH );

  const currentUser = getMyData();

  const getSort = () => {
    let realLayout = currentUser ? currentUser.tasklistLayout : 0;
    if ( ( [ 2, 4 ].includes( realLayout ) && localProject.id === null ) || ( realLayout === 3 && !( localProject.id === null || localProject.right.assignedRead ) ) ) {
      realLayout = 0;
    }
    let sort = defaultSorts[ 0 ];
    if ( currentUser && currentUser.tasklistSorts.some( ( sort ) => sort.layout === realLayout ) ) {
      sort = currentUser.tasklistSorts.find( ( sort ) => sort.layout === realLayout );
    } else if ( currentUser && defaultSorts.some( ( sort ) => sort.layout === realLayout ) ) {
      sort = defaultSorts.find( ( sort ) => sort.layout === realLayout );
    }
    return sort;
  }

  const localFilter = filterData.localFilter;
  const localProject = projectData.localProject;
  const localMilestone = milestoneData.localMilestone;
  const sort = getSort();


  const filterVariables = deleteAttributes(
    localFilterToValues( localFilter ),
    unimplementedAttributes
  );

  const {
    data: myProjectsData,
    loading: myProjectsLoading,
    refetch: refetchMyProjects,
  } = useQuery( GET_MY_PROJECTS );

  const [ setTasklistSort ] = useMutation( SET_TASKLIST_SORT );
  const [ setTasklistLayout ] = useMutation( SET_TASKLIST_LAYOUT );

  //state
  const setTasklistLayoutFunc = ( value ) => {
    setTasklistLayout( {
        variables: {
          tasklistLayout: value,
        }
      } )
      .catch( ( err ) => addLocalError( err ) );
  }

  const setTasklistSortFunc = ( asc, sort ) => {
    setTasklistSort( {
        variables: {
          asc,
          sort,
          layout: currentUser.tasklistLayout
        }
      } )
      .catch( ( err ) => addLocalError( err ) );
  }

  const processTasks = ( tasks ) => {
    return tasks.map( ( task ) => {
      let usersWithRights = []
      if ( !myProjectsLoading ) {
        let myProject = myProjectsData.myProjects.find( ( myProject ) => myProject.project.id === task.project.id );
        if ( myProject ) {
          usersWithRights = myProject.usersWithRights;
        }
      }
      return {
        ...task,
        usersWithRights,
      }
    } )
  }


  if ( !currentUser ) {
    return (
      <Loading />
    )
  }

  const canViewCalendar = localProject.id === null || localProject.right.assignedRead || !currentUser.role.accessRights.tasklistCalendar;

  return (
    <TasklistSwitch
      history={history}
      match={match}
      currentUser={currentUser}
      localFilter = {localFilter}
      setLocalFilter={setFilter}
      filterVariables={filterVariables}
      localProject = {localProject}
      setLocalProject={setProject}
      localMilestone = {localMilestone}
      setLocalMilestone={setMilestone}
      canViewCalendar={canViewCalendar}
      processTasks={processTasks}
      page={page}
      limit={limit}
      orderBy={ sort.sort }
      setOrderBy={(key) => {
        let ascending = sort.asc;
        if(['important','updatedAt'].includes(key)){
          ascending = false;
        }
        setTasklistSortFunc( ascending, key );
      }}
      ascending={ sort.asc }
      setAscending={(ascending) => {
        setTasklistSortFunc( ascending, sort.sort )
      }}
      tasklistLayout={currentUser.tasklistLayout}
      setTasklistLayout={setTasklistLayoutFunc}

      taskSearch={localSearchData.localTaskSearch}
      globalTaskSearch={globalSearchData.globalTaskSearch}
      setLocalTaskSearch={setLocalTaskSearch}
      setGlobalTaskSearch={setGlobalTaskSearch}
      />
  );
}