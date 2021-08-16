import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import {
  toSelArr,
  getMyData,
} from 'helperFunctions';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import RowTaskAdd from './rowTaskAdd';

import {
  noMilestone
} from 'configs/constants/sidebar';

import {
  GET_TASK_TYPES
} from 'helpdesk/settings/taskTypes/queries';
import {
  GET_TRIP_TYPES
} from 'helpdesk/settings/tripTypes/queries';

import {
  GET_BASIC_USERS
} from 'helpdesk/settings/users/queries';

import {
  GET_BASIC_COMPANIES
} from 'helpdesk/settings/companies/queries';

import {
  GET_MY_PROJECTS
} from 'helpdesk/settings/projects/queries';

import {
  GET_PROJECT,
} from 'apollo/localSchema/queries';

export default function RowTaskAddContainer( props ) {
  //data & queries
  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_BASIC_USERS, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: tripTypesData,
    loading: tripTypesLoading
  } = useQuery( GET_TRIP_TYPES, {
    fetchPolicy: 'network-only'
  } );

  const {
    data: projectsData,
    loading: projectsLoading
  } = useQuery( GET_MY_PROJECTS, {
    fetchPolicy: 'network-only'
  } );

  const {
    data: localProjectData,
    loading: localProjectLoading
  } = useQuery( GET_PROJECT );

  const currentUser = getMyData();

  //state
  const loading = (
    companiesLoading ||
    usersLoading ||
    taskTypesLoading ||
    tripTypesLoading ||
    projectsLoading ||
    localProjectLoading ||
    !currentUser
  );
  if ( !localProjectData.localProject.id || loading ) {
    return null;
  }

  return (
    <RowTaskAdd
      {...props}
      loading={loading}
      projects={
        toSelArr(projectsData.myProjects.map((myProject) => ({
          ...myProject.project,
          right: myProject.right,
          users: myProject.userWithRights.map((user) => userWithRights.user.id)
        }) ))
      }
      project={localProjectData.localProject}
      projectID={localProjectData.localProject.id}
      users={ usersData ? toSelArr(usersData.basicUsers, 'email') : [] }
      companies={ toSelArr(companiesData.basicCompanies) }
      taskTypes={ toSelArr(taskTypesData.taskTypes) }
      tripTypes={ toSelArr(tripTypesData.tripTypes) }
      currentUser={ currentUser }
      milestones={[noMilestone]}
      defaultUnit={null}
      closeModal={ () => setOpenAddTaskModal(false)}
      />
  );
}