import React from 'react';
import {
  useQuery
} from "@apollo/client";
import {
  gql
} from '@apollo/client';;

import Loading from 'components/loading';
import TaskEdit from './taskEdit';

import {
  toSelArr
} from 'helperFunctions';

import {
  GET_STATUSES
} from 'helpdesk/settings/statuses/querries';

import {
  GET_TAGS
} from 'helpdesk/settings/tags/querries';

import {
  GET_TASK_TYPES
} from 'helpdesk/settings/taskTypes/querries';

import {
  GET_TRIP_TYPES
} from 'helpdesk/settings/tripTypes/querries';

import {
  GET_MY_PROJECTS
} from 'helpdesk/settings/projects/querries';

import {
  GET_BASIC_COMPANIES
} from 'helpdesk/settings/companies/querries';

import {
  GET_BASIC_USERS
} from 'helpdesk/settings/users/querries';

import {
  GET_MY_DATA,
  GET_EMAILS,
  GET_TASK
} from './querries';


export default function TaskEditContainer( props ) {
  //data & queries
  const {
    match
  } = props;
  const id = parseInt( match.params.taskID );

  const {
    data: myData,
    loading: myDataLoading,
  } = useQuery( GET_MY_DATA );
  const {
    data: statusesData,
    loading: statusesLoading,
  } = useQuery( GET_STATUSES );
  const {
    data: basicCompaniesData,
    loading: basicCompaniesLoading,
  } = useQuery( GET_BASIC_COMPANIES );
  const {
    data: basicUsersData,
    loading: basicUsersLoading,
  } = useQuery( GET_BASIC_USERS );
  const {
    data: taskTypesData,
    loading: taskTypesLoading,
  } = useQuery( GET_TASK_TYPES );
  const {
    data: tripTypesData,
    loading: tripTypesLoading,
  } = useQuery( GET_TRIP_TYPES );
  const {
    data: tagsData,
    loading: tagsLoading,
  } = useQuery( GET_TAGS );
  const {
    data: myProjectsData,
    loading: myProjectsLoading,
  } = useQuery( GET_MY_PROJECTS );
  const {
    data: taskData,
    loading: taskLoading,
    refetch: taskRefetch
  } = useQuery( GET_TASK, {
    variables: {
      id
    },
    notifyOnNetworkStatusChange: true,
  } );

  React.useEffect( () => {
    taskRefetch( {
      variables: {
        id
      }
    } );
  }, [ id ] );

  //  const { data: emailsData, loading: emailsLoading } = useQuery(GET_EMAILS, { variables: {task: parseInt(match.params.taskID)}, options: { fetchPolicy: 'network-only' }});


  const dataLoading = (
    myDataLoading ||
    statusesLoading ||
    basicCompaniesLoading ||
    basicUsersLoading ||
    taskTypesLoading ||
    tripTypesLoading ||
    tagsLoading ||
    myProjectsLoading ||
    taskLoading
  )
  if ( dataLoading ) {
    return ( <Loading /> );
  }

  return (
    <TaskEdit
			{...props}
      id={id}
      task={taskData.task}
			currentUser={myData.getMyData}
			accessRights={myData.getMyData.role.accessRights}
			statuses={toSelArr(statusesData.statuses)}
			companies={toSelArr(basicCompaniesData.basicCompanies)}
			users={toSelArr(basicUsersData.basicUsers, 'email')}
			taskTypes={toSelArr(taskTypesData.taskTypes)}
			tripTypes={toSelArr(tripTypesData.tripTypes)}
			allTags={toSelArr(tagsData.tags)}
      projects={toSelArr(myProjectsData.myProjects.map((project) => ({...project, id: project.project.id, title: project.project.title}) ))}
      emails={/*emailsData && emailsData.emails ? emailsData.emails : */[]}
			inModal={false}
			 />
  );

}