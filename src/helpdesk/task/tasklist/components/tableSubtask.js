import React from 'react';
import {
  useMutation,
  useApolloClient
} from "@apollo/client";

import Checkbox from 'components/checkbox';

import {
  updateArrayItem,
} from 'helperFunctions';

import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  GET_TASKS,
  UPDATE_SUBTASK,
} from '../../queries';

export default function TableSubtaskRender( props ) {
  const {
    task,
    taskVariables,
  } = props;

  const client = useApolloClient();
  const [ updateSubtask ] = useMutation( UPDATE_SUBTASK );

  return (
    <div>
      { task.subtasks.map((subtask) => (
        <div key={subtask.id} className="m-r-5 m-t-5 p-l-5 p-r-5">
          <Checkbox
            className = "p-l-0 min-width-20 m-t-5 m-l-5"
            value = { subtask.done }
            disabled={ !task.rights.vykazWrite }
            onChange={ () => {
              updateSubtask({
                variables: {
                  id: subtask.id,
                  done: !subtask.done
                }
              }).then((resp) => {
                let data = client.readQuery( {
                    query: GET_TASKS,
                    variables: taskVariables,
                  } ).tasks;

                const tasks = data.tasks;
                const originalTask = tasks.find((listTask) => listTask.id === task.id );
                const replacementTask = {
                  ...originalTask,
                  subtasks: updateArrayItem( originalTask.subtasks, { ...originalTask.subtasks.find((listSubtask) => listSubtask.id === subtask.id ), done: !subtask.done } )
                }
                client.writeQuery( {
                  query: GET_TASKS,
                  variables: taskVariables,
                  data: {
                    ...data,
                    tasks: updateArrayItem( tasks, replacementTask )
                  }
                } );
              })
            } }
            label={subtask.title}
            labelClassName="font-normal"
            />
        </div>
      ) ) }
    </div>
  )
}