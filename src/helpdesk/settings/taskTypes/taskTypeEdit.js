import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label,Input } from 'reactstrap';
import Loading from 'components/loading';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import {  GET_TASK_TYPES } from './index';

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

export default function TaskTypeEdit(props){
  //data
  const { history, match } = props;
  const { data, loading, refetch } = useQuery(GET_TASK_TYPE, { variables: {id: parseInt(props.match.params.id)} });
  const [updateTaskType, {updateData}] = useMutation(UPDATE_TASK_TYPE);
  const [deleteTaskType, {deleteData, client}] = useMutation(DELETE_TASK_TYPE);

  //state
  const [ title, setTitle ] = React.useState("");
  const [ order, setOrder ] = React.useState(0);
  const [ saving, setSaving ] = React.useState(false);

  // sync
  React.useEffect( () => {
      if (!loading){
        setTitle(data.taskType.title);
        setOrder(data.taskType.order);
      }
  }, [loading]);

  React.useEffect( () => {
      refetch({ variables: {id: parseInt(match.params.id)} });
  }, [match.params.id]);

  // functions
  const updateTaskTypeFunc = () => {
    setSaving( true );

    updateTaskType({ variables: {
      id: parseInt(match.params.id),
      title,
      order: (order !== '' ? parseInt(order) : 0),
    } }).then( ( response ) => {
    }).catch( (err) => {
      console.log(err.message);
    });

     setSaving( false );
  };

  const deleteTaskTypeFunc = () => {
    if(window.confirm("Are you sure?")){
      deleteTaskType({ variables: {
        id: parseInt(match.params.id),
      } }).then( ( response ) => {
        const allTaskTypes = client.readQuery({query: GET_TASK_TYPES}).taskTypes;
        client.writeQuery({ query: GET_TASK_TYPES, data: {taskTypes: allTaskTypes.filter( taskType => taskType.id !== match.params.id,)} });
        history.goBack();
      }).catch( (err) => {
        console.log(err.message);
      });
    }
  };

  return (
    <div className="p-20 scroll-visible fit-with-header-and-commandbar">
      {
        loading &&
        <Loading />
      }
      <FormGroup>
        <Label for="name">Task type name</Label>
        <Input type="text" name="name" id="name" placeholder="Enter task type name" value={title} onChange={(e)=>setTitle(title)} />
      </FormGroup>

      <FormGroup>
        <Label for="order">Order</Label>
        <Input type="number" name="order" id="order" placeholder="Lower means first" value={order} onChange={(e)=>setOrder(order)} />
      </FormGroup>

        <div className="row">
          <Button className="btn" disabled={saving} onClick={updateTaskType}>{saving?'Saving task type...':'Save task type'}</Button>
          <Button className="btn-red m-l-5"  disabled={saving} onClick={deleteTaskType}>Delete</Button>
        </div>
    </div>
  )
}
