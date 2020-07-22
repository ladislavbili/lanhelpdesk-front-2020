import React, { Component } from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import TaskTypeList from './taskTypeList';

export const GET_TASK_TYPES = gql`
query {
  taskTypes {
    title
    id
    order
  }
}
`;

export default function TaskTypeListContainer(props){
  const taskTypesData = useQuery(GET_TASK_TYPES);
  return (
    <TaskTypeList taskTypesData={taskTypesData} {...props}/>
  )
}
