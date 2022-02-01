import React from 'react';
import {
  updateArrayItem,
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  useMutation,
} from "@apollo/client";

import {
  ADD_SUBTASK,
  UPDATE_SUBTASK,
  DELETE_SUBTASK,
  ADD_WORKTRIP,
  UPDATE_WORKTRIP,
  DELETE_WORKTRIP,
  ADD_MATERIAL,
  UPDATE_MATERIAL,
  DELETE_MATERIAL,
} from './queries';

export default function TaskEditTablesLoader( props ) {
  const {
    task,
    userRights,
    invoiced,
    currentUser,
    company,
    autoApproved,
    assignedTo,
    taskTypes,
    taskType,
    subtasks,
    edit,
    updateCasheStorage,
    setSaving,
    fromInvoice,
  } = props;

  const [ addSubtask ] = useMutation( ADD_SUBTASK );
  const [ updateSubtask ] = useMutation( UPDATE_SUBTASK );
  const [ deleteSubtask ] = useMutation( DELETE_SUBTASK );
  const [ addWorkTrip ] = useMutation( ADD_WORKTRIP );
  const [ updateWorkTrip ] = useMutation( UPDATE_WORKTRIP );
  const [ deleteWorkTrip ] = useMutation( DELETE_WORKTRIP );
  const [ addMaterial ] = useMutation( ADD_MATERIAL );
  const [ updateMaterial ] = useMutation( UPDATE_MATERIAL );
  const [ deleteMaterial ] = useMutation( DELETE_MATERIAL );

  const addSubtaskFunc = ( sub ) => {
    setSaving( true );

    addSubtask( {
        variables: {
          title: sub.title,
          order: sub.order,
          done: sub.done,
          approved: sub.approved,
          discount: sub.discount,
          quantity: sub.quantity,
          //type: sub.type.id,
          task,
          assignedTo: sub.assignedTo.id,
          scheduled: sub.scheduled,
          fromInvoice,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.addSubtask, 'subtasks', 'ADD' );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
  }

  const updateSubtaskFunc = ( sub ) => {
    setSaving( true );

    updateSubtask( {
        variables: {
          id: sub.id,
          title: sub.title,
          order: sub.order,
          done: sub.done,
          approved: sub.approved,
          discount: sub.discount,
          quantity: sub.quantity,
          //type: sub.type.id,
          assignedTo: sub.assignedTo.id,
          scheduled: sub.scheduled,
          fromInvoice,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateSubtask, 'subtasks', 'UPDATE' );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
  }

  const deleteSubtaskFunc = ( id ) => {
    deleteSubtask( {
        variables: {
          id,
          fromInvoice,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( {
          id
        }, 'subtasks', 'DELETE' );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
  }

  const addWorkTripFunc = ( wt ) => {
    setSaving( true );

    addWorkTrip( {
        variables: {
          order: wt.order,
          done: wt.done,
          approved: wt.approved,
          discount: parseFloat( wt.discount ),
          quantity: parseFloat( wt.quantity ),
          type: wt.type.id,
          task,
          assignedTo: wt.assignedTo.id,
          scheduled: wt.scheduled,
          fromInvoice,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.addWorkTrip, 'workTrips', 'ADD' );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
  }

  const updateWorkTripFunc = ( item ) => {
    setSaving( true );

    updateWorkTrip( {
        variables: {
          id: item.id,
          order: item.order,
          done: item.done,
          approved: item.approved,
          discount: item.discount,
          quantity: item.quantity,
          type: item.type.id,
          assignedTo: item.assignedTo.id,
          scheduled: item.scheduled,
          fromInvoice,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateWorkTrip, 'workTrips', 'UPDATE' );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
  }

  const deleteWorkTripFunc = ( id ) => {
    deleteWorkTrip( {
        variables: {
          id,
          fromInvoice,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( {
          id
        }, 'workTrips', 'DELETE' );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
  }

  const addMaterialFunc = ( item ) => {
    setSaving( true );
    addMaterial( {
        variables: {
          title: item.title,
          order: item.order,
          done: item.done,
          approved: item.approved,
          quantity: parseFloat( item.quantity ),
          margin: parseFloat( item.margin ),
          price: parseFloat( item.price ),
          task,
          fromInvoice,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.addMaterial, 'materials', 'ADD' );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
  }

  const updateMaterialFunc = ( item ) => {
    setSaving( true );

    updateMaterial( {
        variables: {
          id: item.id,
          title: item.title,
          order: item.order,
          done: item.done,
          approved: item.approved,
          quantity: parseFloat( item.quantity ),
          margin: parseFloat( item.margin ),
          price: parseFloat( item.price ),
          fromInvoice,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateMaterial, 'materials', 'UPDATE' );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
  }

  const deleteMaterialFunc = ( id ) => {
    deleteMaterial( {
        variables: {
          id,
          fromInvoice,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( {
          id
        }, 'materials', 'DELETE' );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
  }


  return (
    <Empty>
      { (
        userRights.rights.taskWorksRead ||
        userRights.rights.taskWorksAdvancedRead
      ) &&
      <WorksTable
        invoiced={invoiced}
        userID={currentUser.id}
        userRights={userRights}
        currentUser={currentUser}
        company={company}
        showTotals={true}
        showColumns={ [ 'done', 'title', 'quantity', 'assigned', 'approved', 'actions' ] }
        showAdvancedColumns={ [ 'done', 'title', 'quantity', 'price', 'discount', 'priceAfterDiscount' , 'actions' ] }
        autoApproved={project ? project.project.autoApproved : false}
        canAddSubtasksAndTrips={assignedTo.length > 0}
        canEditInvoiced={false}
        taskAssigned={assignedTo.filter((user) => user.id !== null )}

        taskTypes={taskTypes}
        defaultType={taskType}
        subtasks={ subtasks }
        addSubtask={(newSubtask, price) => {
          addSubtaskFunc(newSubtask);
          setVykazyChanged(true);
        }}
        updateSubtask={(id,newData)=>{
          let originalSubtask = subtasks.find((item)=>item.id===id);
          originalSubtask = {
            ...originalSubtask,
            scheduled: originalSubtask.scheduled ?
            {
              from: originalSubtask.scheduled.from,
              to: originalSubtask.scheduled.to,
            } :
            null
          }
          updateSubtaskFunc({...originalSubtask,...newData});
          setVykazyChanged(true);
        }}
        updateSubtasks={(multipleSubtasks)=>{
          multipleSubtasks.forEach(({id, newData})=>{
            let originalSubtask = subtasks.find((item)=>item.id===id);
            originalSubtask = {
              ...originalSubtask,
              scheduled: originalSubtask.scheduled ?
              {
                from: originalSubtask.scheduled.from,
                to: originalSubtask.scheduled.to,
              } :
              null
            }
            updateSubtaskFunc({...originalSubtask,...newData});
            setVykazyChanged(true);
          });
        }}
        removeSubtask={(id)=>{
          deleteSubtaskFunc(id);
          setVykazyChanged(true);
        }}

        workTrips={ workTrips }
        tripTypes={tripTypes}
        addTrip={(newTrip, price)=>{
          addWorkTripFunc(newTrip);
          setVykazyChanged(true);
        }}
        updateTrip={(id,newData)=>{
          let originalTrip = workTrips.find((item)=>item.id===id);
          originalTrip = {
            ...originalTrip,
            scheduled: originalTrip.scheduled ?
            {
              from: originalTrip.scheduled.from,
              to: originalTrip.scheduled.to,
            } :
            null
          }
          updateWorkTripFunc({...originalTrip,...newData});
          setVykazyChanged(true);
        }}
        updateTrips={(multipleTrips)=>{
          multipleTrips.forEach(({id, newData})=>{
            let originalTrip = workTrips.find((item)=>item.id===id);
            originalTrip = {
              ...originalTrip,
              scheduled: originalTrip.scheduled ?
              {
                from: originalTrip.scheduled.from,
                to: originalTrip.scheduled.to,
              } :
              null
            }
            updateWorkTripFunc({...originalTrip,...newData});
            setVykazyChanged(true);
          });
        }}
        removeTrip={(id)=>{
          deleteWorkTripFunc(id);
          setVykazyChanged(true);
        }}
        />
    }

    { userRights.rights.taskPausalInfo && renderCompanyPausalInfo()}

    { userRights.rights.taskMaterialsRead &&
      <Materials
        invoiced={invoiced}
        showColumns={ [ 'done', 'title', 'quantity', 'price', 'total', 'approved', 'actions' ] }
        showTotals={true}
        autoApproved={project ? project.project.autoApproved : false}
        userRights={userRights}
        currentUser={currentUser}
        company={company}
        materials={ materials }
        addMaterial={(newMaterial)=>{
          addMaterialFunc(newMaterial);
        }}
        updateMaterial={(id,newData)=>{
          updateMaterialFunc({...materials.find((material)=>material.id===id),...newData});
        }}
        updateMaterials={(multipleMaterials)=>{
          multipleMaterials.forEach(({id, newData})=>{
            updateMaterialFunc({...materials.find((material)=>material.id===id),...newData});
          });
        }}
        removeMaterial={(id)=>{
          deleteMaterialFunc(id);
        }}
        />
    }
  </Empty>
  );
}