import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Loading from 'components/loading';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";
import { toSelArr } from 'helperFunctions';

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
mutation deleteTaskType($id: Int!, $newId: Int!) {
  deleteTaskType(
    id: $id,
    newId: $newId,
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
  const allTaskTypes = toSelArr(client.readQuery({query: GET_TASK_TYPES}).taskTypes);
  const filteredTaskTypes = allTaskTypes.filter( taskType => taskType.id !== parseInt(match.params.id) );
  const theOnlyOneLeft = allTaskTypes.length === 0;

  //state
  const [ title, setTitle ] = React.useState("");
  const [ order, setOrder ] = React.useState(0);
  const [ saving, setSaving ] = React.useState(false);
  const [ choosingNewTaskType, setChooseingNewTaskType ] = React.useState(false);
  const [ newTaskType, setNewTaskType ] = React.useState(null);

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
    setChooseingNewTaskType(false);

    if(window.confirm("Are you sure?")){
      deleteTaskType({ variables: {
        id: parseInt(match.params.id),
        newId: parseInt(newTaskType.id),
      } }).then( ( response ) => {
        client.writeQuery({ query: GET_TASK_TYPES, data: {taskTypes: filteredTaskTypes} });
        history.goBack();
      }).catch( (err) => {
        console.log(err.message);
        console.log(err);
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
        <Input type="text" name="name" id="name" placeholder="Enter task type name" value={title} onChange={(e)=>setTitle(e.target.value)} />
      </FormGroup>

      <FormGroup>
        <Label for="order">Order</Label>
        <Input type="number" name="order" id="order" placeholder="Lower means first" value={order} onChange={(e)=>setOrder(e.target.value)} />
      </FormGroup>

        <div className="row">
          <Button className="btn" disabled={saving} onClick={updateTaskTypeFunc}>{saving?'Saving task type...':'Save task type'}</Button>
          <Button className="btn-red m-l-5"  disabled={saving || theOnlyOneLeft} onClick={() => setChooseingNewTaskType(true)}>Delete</Button>
        </div>

        <Modal isOpen={choosingNewTaskType}>
          <ModalHeader>
            Please choose a task type to replace this one
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Select
                styles={selectStyle}
                options={filteredTaskTypes}
                value={newTaskType}
                onChange={role => setNewTaskType(role)}
                />
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button className="btn-link mr-auto"onClick={() => setChooseingNewTaskType(false)}>
              Cancel
            </Button>
            <Button className="btn ml-auto" disabled={!newTaskType} onClick={deleteTaskTypeFunc}>
              Complete deletion
            </Button>
          </ModalFooter>
        </Modal>
    </div>
  )
}
