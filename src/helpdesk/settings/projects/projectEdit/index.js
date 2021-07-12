import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import {
  toSelArr,
  getMyData,
} from 'helperFunctions';

import ProjectEdit from "./projectEdit";

import {
  GET_BASIC_COMPANIES,
} from '../../companies/queries';
import {
  GET_BASIC_USERS,
} from '../../users/queries';
import {
  GET_TASK_TYPES,
} from '../../taskTypes/queries';
import {
  GET_PROJECTS,
  GET_MY_PROJECTS,
  GET_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  GET_NUMBER_OF_TASKS,
  DELETE_PROJECT_ATTACHMENT,
} from '../queries';

export default function ProjectEditLoader( props ) {
  //data & queries
  const {
    history,
    match,
    closeModal,
    projectDeleted,
    projectID
  } = props;

  const id = closeModal ? projectID : parseInt( match.params.id );

  const {
    data: projectData,
    loading: projectLoading,
    refetch
  } = useQuery( GET_PROJECT, {
    variables: {
      id
    },
    fetchPolicy: 'network-only',
  } );
  const [ updateProject ] = useMutation( UPDATE_PROJECT );
  const [ deleteProjectAttachment ] = useMutation( DELETE_PROJECT_ATTACHMENT );

  const [ deleteProject, {
    client
  } ] = useMutation( DELETE_PROJECT );

  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES, {
    fetchPolicy: 'network-only',
  } );

  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_BASIC_USERS, {
    fetchPolicy: 'network-only',
  } );

  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES, {
    fetchPolicy: 'network-only',
  } );

  const {
    data: numberOfTasksData,
    loading: numberOfTasksLoading,
    error: numberOfTasksError,
  } = useQuery( GET_NUMBER_OF_TASKS, {
    fetchPolicy: 'network-only',
    variables: {
      projectId: id
    }
  } );

  let allProjects = [];
  if ( closeModal ) {
    allProjects = toSelArr( client.readQuery( {
        query: GET_MY_PROJECTS
      } )
      .myProjects.map( ( projectData ) => projectData.project ) );

  } else {
    allProjects = toSelArr( client.readQuery( {
        query: GET_PROJECTS
      } )
      .projects );
  }
  const filteredProjects = allProjects.filter( project => project.id !== id );
  const theOnlyOneLeft = allProjects.length === 1;
  const currentUser = getMyData();

  const dataLoading = (
    projectLoading ||
    companiesLoading ||
    usersLoading ||
    !currentUser
  )

  const newProps = {
    ...props,
    projectData,
    projectLoading,
    refetch,
    updateProject,
    deleteProjectAttachment,
    deleteProject,
    client,
    companiesData,
    companiesLoading,
    usersData,
    usersLoading,
    taskTypesData,
    taskTypesLoading,
    numberOfTasksData,
    numberOfTasksLoading,
    numberOfTasksError,
    allProjects,
    filteredProjects,
    theOnlyOneLeft,
    currentUser,
    dataLoading,
    id,
  }

  return (
    <ProjectEdit {...newProps} />
  )

}