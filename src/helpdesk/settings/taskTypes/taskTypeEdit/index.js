import React, { Component } from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import TaskTypeEdit from './taskTypeEdit';

const GET_TASK_TYPE = gql`
query taskType($id: Int!) {
  taskType (
    id: $id
  ) {
    id
    title
    order
  }
}
`;

const UPDATE_TASK_TYPE = gql`
mutation updateTaskType($id: Int!, $title: String, $order: Int) {
  updateTaskType(
    id: $id,
    title: $title,
    order: $order,
  ){
    id
    title
    order
  }
}
`;

export const DELETE_TASK_TYPE = gql`
mutation deleteTaskType($id: Int!) {
  deleteTaskType(
    id: $id,
  ){
    id
  }
}
`;

export default function TaskTypeEditContainer(props){
  const taskTypeData = useQuery(GET_TASK_TYPE, { variables: {id: parseInt(props.match.params.id)} });
  const [updateTaskType, {updateData}] = useMutation(UPDATE_TASK_TYPE);
  const [deleteTaskType, {deleteData, client}] = useMutation(DELETE_TASK_TYPE);
  return (
    <TaskTypeEdit taskTypeData={taskTypeData} updateTaskType={updateTaskType} deleteTaskType={deleteTaskType} client={client} history={props.history} match={props.match} />
  )
}
