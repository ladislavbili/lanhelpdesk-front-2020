import React from 'react';
import {
  useQuery
} from "@apollo/client";
import Search from './search';
import Checkbox from 'components/checkbox';
import Multiselect from 'components/multiselect';
import classnames from "classnames";

import {
  GET_PROJECT,
} from 'apollo/localSchema/queries';

export default function ListHeader( props ) {
  const {
    greyBackground,
    multiselect,
    statuses,
    allStatuses,
    setStatuses,
    currentUser,
    underSearchButtonEvent,
    underSearchButtonLabel
  } = props;

  const {
    data: localProjectData,
    loading: localProjectLoading
  } = useQuery( GET_PROJECT );

  return (
    <div className={classnames("d-flex", "p-b-10", "flex-row", "m-t-20")}>
      {
        !localProjectLoading &&
        localProjectData.localProject.id &&
        underSearchButtonEvent !== undefined &&
        underSearchButtonLabel !== undefined &&
        <button className="btn btn-link m-l-20" onClick={underSearchButtonEvent}><i className="fa fa-plus"/> {underSearchButtonLabel}</button>
      }

      <Search {...props}/>
      { !multiselect && statuses && allStatuses.length > 0 &&
        <div className="center-hor flex-row">
          <Checkbox
            className="m-l-5  m-r-10"
            label= "All"
            value={ statuses.length===0 || allStatuses.every((status)=>statuses.includes(status.id)) }
            onChange={()=>{
              if(statuses.length===0){
                let newStatuses = allStatuses.map((status) => status.id );
                setStatuses( newStatuses );
              }else{
                setStatuses( [] );
              }
            }}
            />
          { allStatuses.map((status)=>
            <Checkbox
              key={status.id}
              className="m-l-5 m-r-10"
              label={ status.title }
              value={ statuses.includes(status.id) }
              onChange={()=>{
                if(statuses.includes(status.id)) {
                  let newStatuses = statuses.filter( (id) => !(status.id === id) );
                  setStatuses( newStatuses );
                }else{
                  let newStatuses = [...statuses, status.id];
                  setStatuses(newStatuses);
                }
              }}
              />
          )}
        </div>
      }
      { multiselect && statuses &&
        <Multiselect
          className="ml-auto m-r-10"
          options={ [{ id:'All', label: 'All' }, ...allStatuses.map((status)=>({...status,label:status.title}))] }
          value={
            [{ id:'All', label: 'All' }, ...allStatuses.map((status)=>({...status,label:status.title}))]
            .filter((status)=> statuses.includes(status.id))
            .concat(allStatuses.every((status)=>statuses.includes(status.id))?[{ id:'All', label: 'All' }]:[])
          }
          label={ "Status filter" }
          onChange={ (status) => {
            if(status.id === 'All'){
              if(statuses.length===0){
                let newStatuses = allStatuses.map((status) => status.id );
                setStatuses( newStatuses );
              }else{
                setStatuses( [] );
              }
            }else{
              if(statuses.includes(status.id)) {
                let newStatuses = statuses.filter( (id) => !(status.id === id) );
                setStatuses( newStatuses );
              }else{
                let newStatuses = [...statuses, status.id];
                setStatuses(newStatuses);
              }
            }
          } }
          />
      }
    </div>
  );
}