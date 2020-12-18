import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import {
  toSelArr
} from 'helperFunctions';
import {
  Modal,
  ModalBody,
  Button
} from 'reactstrap';
import RowTaskAdd from './rowTaskAdd';

import {
  noMilestone
} from 'configs/constants/sidebar';

import {
  GET_TASK_TYPES
} from 'helpdesk/settings/taskTypes/querries';
import {
  GET_TRIP_TYPES
} from 'helpdesk/settings/tripTypes/querries';

import {
  GET_BASIC_USERS
} from 'helpdesk/settings/users/querries';

import {
  GET_BASIC_COMPANIES
} from 'helpdesk/settings/companies/querries';

import {
  GET_MY_PROJECTS
} from 'helpdesk/settings/projects/querries';

import {
  GET_STATUSES
} from 'helpdesk/settings/statuses/querries';

import {
  GET_MY_DATA
} from '../../querries';

import {
  GET_PROJECT,
} from 'apollo/localSchema/querries';

export default function RowTaskAddContainer( props ) {
  //data & queries
  const {
    data: statusesData,
    loading: statusesLoading
  } = useQuery( GET_STATUSES, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );
  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );
  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_BASIC_USERS, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );
  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );
  const {
    data: tripTypesData,
    loading: tripTypesLoading
  } = useQuery( GET_TRIP_TYPES, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );

  const {
    data: projectsData,
    loading: projectsLoading
  } = useQuery( GET_MY_PROJECTS, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );
  const {
    data: currentUserData,
    loading: currentUserLoading
  } = useQuery( GET_MY_DATA, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );

  const {
    data: localProjectData,
    loading: localProjectLoading
  } = useQuery( GET_PROJECT );

  //state

  const loading = (
    statusesLoading ||
    companiesLoading ||
    usersLoading ||
    taskTypesLoading ||
    tripTypesLoading ||
    projectsLoading ||
    localProjectLoading ||
    currentUserLoading
  );
  if ( !localProjectData.localProject.id || loading ) {
    return null;
  }

  return (
    <RowTaskAdd
      {...props}
      loading={loading}
      statuses={ toSelArr(statusesData.statuses.filter((status) => !status.action.toLowerCase().includes('invoiced') )) }
      projects={
        toSelArr(projectsData.myProjects.map((myProject) => ({
          ...myProject.project,
          right: myProject.right,
          users: myProject.usersWithRights.map((user) => user.id)
        }) ))
      }
      project={localProjectData.localProject}
      projectID={localProjectData.localProject.id}
      users={ usersData ? toSelArr(usersData.basicUsers, 'email') : [] }
      companies={ toSelArr(companiesData.basicCompanies) }
      taskTypes={ toSelArr(taskTypesData.taskTypes) }
      allTags={ [] }
      tripTypes={ toSelArr(tripTypesData.tripTypes) }
      currentUser={ currentUserData.getMyData }
      milestones={[noMilestone]}
      defaultUnit={null}
      closeModal={ () => setOpenAddTaskModal(false)}
      />
  );
}