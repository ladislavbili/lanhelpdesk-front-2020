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
import Empty from 'components/Empty';
import WorksTable from './worksTable';
import Materials from './materialsTable';

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

let fakeID = -1;

export default function TaskEditTablesLoader( props ) {
  const {
    edit,
    task,
    invoiced,
    fromInvoice,
    autoApproved,
    userRights,
    currentUser,
    assignedTo,
    company,
    updateCasheStorage,
    renderCompanyPausalInfo,
    works,
    setWorks,
    taskTypes,
    taskType,
    trips,
    setTrips,
    tripTypes,
    setMaterials,
    materials,
  } = props;
  const setChanged = props.setChanged ? props.setChanged : () => {};
  const setSaving = props.setSaving ? props.setSaving : () => {};

  const [ addSubtask ] = useMutation( ADD_SUBTASK );
  const [ updateSubtask ] = useMutation( UPDATE_SUBTASK );
  const [ deleteSubtask ] = useMutation( DELETE_SUBTASK );
  const [ addWorkTrip ] = useMutation( ADD_WORKTRIP );
  const [ updateWorkTrip ] = useMutation( UPDATE_WORKTRIP );
  const [ deleteWorkTrip ] = useMutation( DELETE_WORKTRIP );
  const [ addTaskMaterial ] = useMutation( ADD_MATERIAL );
  const [ updateTaskMaterial ] = useMutation( UPDATE_MATERIAL );
  const [ deleteTaskMaterial ] = useMutation( DELETE_MATERIAL );

  const addWork = ( work ) => {
    if ( edit ) {
      setSaving( true );

      addSubtask( {
          variables: {
            title: work.title,
            order: work.order,
            done: work.done,
            approved: work.approved,
            discount: work.discount,
            quantity: work.quantity,
            //type: work.type.id,
            task,
            assignedTo: work.assignedTo.id,
            scheduled: work.scheduled,
            fromInvoice,
          }
        } )
        .then( ( response ) => {
          updateCasheStorage( response.data.addSubtask, 'subtasks', 'ADD' );
          setSaving( false );
        } )
        .catch( ( err ) => {
          addLocalError( err );
          setSaving( false );
        } );
    } else {
      work.id = fakeID--;
      setWorks( [ ...works, work ] )
    }
  }

  const updateWork = ( work ) => {
    if ( edit ) {
      setSaving( true );

      updateSubtask( {
          variables: {
            id: work.id,
            title: work.title,
            order: work.order,
            done: work.done,
            approved: work.approved,
            discount: work.discount,
            quantity: work.quantity,
            //type: work.type.id,
            assignedTo: work.assignedTo.id,
            scheduled: work.scheduled,
            fromInvoice,
          }
        } )
        .then( ( response ) => {
          updateCasheStorage( response.data.updateSubtask, 'subtasks', 'UPDATE' );
          setSaving( false );
        } )
        .catch( ( err ) => {
          addLocalError( err );
          setSaving( false );
        } );
    } else {
      setWorks( updateArrayItem( works, work ) );
    }
  }

  const deleteWork = ( id ) => {
    if ( edit ) {
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
    } else {
      setWorks( works.filter( ( work ) => work.id !== id ) );
    }
  }

  const addTrip = ( trip ) => {
    if ( edit ) {
      setSaving( true );

      addWorkTrip( {
          variables: {
            order: trip.order,
            done: trip.done,
            approved: trip.approved,
            discount: parseFloat( trip.discount ),
            quantity: parseFloat( trip.quantity ),
            type: trip.type.id,
            task,
            assignedTo: trip.assignedTo.id,
            scheduled: trip.scheduled,
            fromInvoice,
          }
        } )
        .then( ( response ) => {
          updateCasheStorage( response.data.addWorkTrip, 'workTrips', 'ADD' );
          setSaving( false );
        } )
        .catch( ( err ) => {
          addLocalError( err );
          setSaving( false );
        } );
    } else {
      trip.id = fakeID--;
      setTrips( [ ...trips, trip ] )
    }
  }

  const updateTrip = ( item ) => {
    if ( edit ) {
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
          setSaving( false );
        } )
        .catch( ( err ) => {
          addLocalError( err );
          setSaving( false );
        } );
    } else {
      setTrips( updateArrayItem( trips, item ) );
    }
  }

  const deleteTrip = ( id ) => {
    if ( edit ) {
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
    } else {
      setTrips( trips.filter( ( trip ) => trip.id !== id ) );
    }
  }

  const addMaterial = ( item ) => {
    if ( edit ) {
      setSaving( true );
      addTaskMaterial( {
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
          setSaving( false );
        } )
        .catch( ( err ) => {
          addLocalError( err );
          setSaving( false );
        } );

    } else {
      item.id = fakeID--;
      setMaterials( [ ...materials, item ] )
    }
  }

  const updateMaterial = ( item ) => {
    if ( edit ) {
      setSaving( true );

      updateTaskMaterial( {
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
          setSaving( false );
        } )
        .catch( ( err ) => {
          addLocalError( err );
          setSaving( false );
        } );
    } else {
      setMaterials( updateArrayItem( materials, item ) );
    }
  }

  const deleteMaterial = ( id ) => {
    if ( edit ) {
      deleteTaskMaterial( {
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
    } else {
      setMaterials( materials.filter( ( material ) => material.id !== id ) );
    }
  }


  return (
    <Empty>
      {
        (
          userRights.rights.taskWorksRead ||
          userRights.rights.taskWorksAdvancedRead
        ) &&
        (
          edit ||
          userRights.rights.taskWorksWrite ||
          userRights.rights.taskWorksAdvancedWrite
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
          autoApproved={autoApproved}
          canAddSubtasksAndTrips={assignedTo.length > 0}
          canEditInvoiced={false}
          taskAssigned={assignedTo.filter((user) => user.id !== null )}

          taskTypes={taskTypes}
          defaultType={taskType}
          subtasks={ works }
          addSubtask={(newSubtask, price) => {
            addWork(newSubtask);
            setChanged();
          }}
          updateSubtask={(id,newData)=>{
            let originalWork = works.find((item)=>item.id === id);
            originalWork = {
              ...originalWork,
              scheduled: originalWork.scheduled ?
              {
                from: originalWork.scheduled.from,
                to: originalWork.scheduled.to,
              } :
              null
            }
            updateWork({...originalWork,...newData});
            setChanged();
          }}
          updateSubtasks={(multipleSubtasks)=>{
            multipleSubtasks.forEach(({id, newData})=>{
              let originalWork = works.find((item)=>item.id === id);
              originalWork = {
                ...originalWork,
                scheduled: originalWork.scheduled ?
                {
                  from: originalWork.scheduled.from,
                  to: originalWork.scheduled.to,
                } :
                null
              }
              updateWork({...originalWork,...newData});
              setChanged();
            });
          }}
          removeSubtask={(id)=>{
            deleteWork(id);
            setChanged();
          }}

          workTrips={ trips }
          tripTypes={tripTypes}
          addTrip={(newTrip, price)=>{
            addTrip(newTrip);
            setChanged();
          }}
          updateTrip={(id,newData)=>{
            let originalTrip = trips.find((item)=>item.id===id);
            originalTrip = {
              ...originalTrip,
              scheduled: originalTrip.scheduled ?
              {
                from: originalTrip.scheduled.from,
                to: originalTrip.scheduled.to,
              } :
              null
            }
            updateTrip({...originalTrip,...newData});
            setChanged();
          }}
          updateTrips={(multipleTrips)=>{
            multipleTrips.forEach(({id, newData})=>{
              let originalTrip = trips.find((item)=>item.id===id);
              originalTrip = {
                ...originalTrip,
                scheduled: originalTrip.scheduled ?
                {
                  from: originalTrip.scheduled.from,
                  to: originalTrip.scheduled.to,
                } :
                null
              }
              updateTrip({...originalTrip,...newData});
              setChanged();
            });
          }}
          removeTrip={(id)=>{
            deleteTrip(id);
            setChanged();
          }}
          />
      }

      { userRights.rights.taskPausalInfo && renderCompanyPausalInfo && renderCompanyPausalInfo()}

      { userRights.rights.taskMaterialsRead && ( edit || userRights.rights.taskMaterialsWrite ) &&
        <Materials
          invoiced={invoiced}
          showColumns={ [ 'done', 'title', 'quantity', 'price', 'total', 'approved', 'actions' ] }
          showTotals={true}
          autoApproved={autoApproved}
          userRights={userRights}
          currentUser={currentUser}
          company={company}
          materials={ materials }
          addMaterial={(newMaterial)=>{
            addMaterial(newMaterial);
          }}
          updateMaterial={(id,newData)=>{
            updateMaterial({...materials.find((material)=>material.id===id),...newData});
          }}
          updateMaterials={(multipleMaterials)=>{
            multipleMaterials.forEach(({id, newData})=>{
              updateMaterial({...materials.find((material)=>material.id===id),...newData});
            });
          }}
          removeMaterial={(id)=>{
            deleteMaterial(id);
          }}
          />
      }
    </Empty>
  );
}