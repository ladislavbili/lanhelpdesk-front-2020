import React, { Component } from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import TaskTypeAdd from './taskTypeAdd';

const ADD_TASK_TYPE = gql`
mutation addTaskType($title: String!, $order: Int) {
  addTaskType(
    title: $title,
    order: $order,
  ){
    id
    title
    order
  }
}
`;


export default function TaskTypeAddContainer(props){
  const [addTaskType, {client}] = useMutation(ADD_TASK_TYPE);
  return (
    <TaskTypeAdd addTaskType={addTaskType} client={client} {...props}/>
  )
}
