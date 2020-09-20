import React from 'react';
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label,Input } from 'reactstrap';

import {  GET_TASK_TYPES } from './index';

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

export default function TaskTypeAdd(props){
  //data & queries
  const { history } = props;
  const [ addTaskType, {client} ] = useMutation(ADD_TASK_TYPE);

  //state
  const [ title, setTitle ] = React.useState("");
  const [ order, setOrder ] = React.useState(0);
  const [ saving, setSaving ] = React.useState(false);

  //functions
  const addTaskTypeFunc = () => {
    setSaving( true );
    addTaskType({ variables: {
      title: title,
      order: (order !== '' ? parseInt(order) : 0),
    } }).then( ( response ) => {
      const allTaskTypes = client.readQuery({query: GET_TASK_TYPES}).taskTypes;
      const newTaskType = {...response.data.addTaskType, __typename: "TaskType"};
      client.writeQuery({ query: GET_TASK_TYPES, data: {taskTypes: [...allTaskTypes, newTaskType ] } });
      history.push('/helpdesk/settings/taskTypes/' + newTaskType.id)
    }).catch( (err) => {
      console.log(err.message);
    });
    setSaving( false );
  }

  return (
    <div className="p-20 scroll-visible fit-with-header-and-commandbar">

      <FormGroup>
        <Label for="name">Task type name</Label>
        <Input type="text" name="name" id="name" placeholder="Enter task type name" value={title} onChange={(e)=>setTitle(e.target.value)} />
      </FormGroup>

      <FormGroup>
        <Label for="order">Order</Label>
        <Input type="number" name="order" id="order" placeholder="Lower means first" value={order} onChange={(e)=>setOrder(e.target.value)} />
      </FormGroup>

      <Button className="btn" disabled={saving} onClick={addTaskTypeFunc}>{saving?'Adding...':'Add task type'}</Button>
  </div>
  )
}
