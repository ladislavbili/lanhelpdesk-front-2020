import React from 'react';
import {
  useQuery
} from "@apollo/client";
import Search from './search';
import Checkbox from 'components/checkbox';
import MultiSelect from 'components/MultiSelectNew';
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
    setVisibility,
    displayValues: allDisplayValues,
    orderByValues,
    link,
    underSearchButtonEvent,
    underSearchButtonLabel
  } = props;

  const {
    data: localProjectData,
    loading: localProjectLoading
  } = useQuery( GET_PROJECT );

  const displayValues = allDisplayValues
    .filter( ( displayValue ) => displayValue.type !== 'checkbox' )
    .map( ( displayValue ) => ( {
      ...displayValue,
      id: displayValue.value
    } ) );

  const [ popoverOpen, setPopoverOpen ] = React.useState( false );
  const toggle = () => setPopoverOpen( !popoverOpen );

  return (
    <div className={classnames("d-flex", "h-60px", "flex-row")}>
      {
        !localProjectLoading &&
        localProjectData.localProject.id &&
        underSearchButtonEvent !== undefined &&
        underSearchButtonEvent !== null &&
        underSearchButtonLabel !== undefined &&
        underSearchButtonLabel !== null &&
        <button className="btn btn-link m-l-20" onClick={underSearchButtonEvent}><i className="fa fa-plus"/> {underSearchButtonLabel}</button>
      }

      <Search {...props}/>
      { !multiselect && statuses && allStatuses.length > 0 &&
        <div className="center-hor flex-row">
          <Checkbox
            className="m-l-5  m-r-10"
            style={{marginTop: 'auto', height: '20px'}}
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
              style={{marginTop: 'auto', height: '20px'}}
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

    <div className="ml-auto p-2 align-self-center">
      <div className="d-flex flex-row">
        <div className={classnames({"m-r-22": (props.link.includes("settings")
          || (props.link.includes("lanwiki") && props.layout === 1)
          || (props.link.includes("passmanager") && props.layout === 1)
          || (props.link.includes("expenditures") && props.layout === 1)
          || (props.link.includes("helpdesk") && !props.link.includes("settings") && props.layout !== 0))},

          {"m-r-5": (props.link.includes("helpdesk") && !props.link.includes("settings") && props.layout === 0)
            || (props.link.includes("passmanager") && props.layout === 0)
            || (props.link.includes("expenditures") && props.layout === 0)
            || (props.link.includes("lanwiki") && props.layout === 0)},

            "d-flex", "flex-row", "align-items-center", "ml-auto")}
            >

              <div className="text-basic m-r-5 m-l-5">
                Sort by
              </div>

              <select
                value={props.orderBy}
                className="invisible-select text-bold text-highlight"
                onChange={(e)=>props.setOrderBy(e.target.value)}>
                { props.orderByValues.map((item,index) =>
                  <option value={item.value} key={index}>{item.label}</option>
                ) }
              </select>

              { !props.ascending &&
                <button type="button" className="btn-link" onClick={()=>props.setAscending(true)}>
                  <i className="fas fa-arrow-up" />
                </button>
              }

              { props.ascending &&
                <button type="button" className="btn-link" onClick={()=>props.setAscending(false)}>
                  <i className="fas fa-arrow-down" />
                </button>
              }

              <div className="row">
                <button className="btn-link" onClick={ toggle } >
                  <i className="fa fa-cog" />
                </button>
                <MultiSelect
                  className="center-hor"
                  menuClassName="m-t-30"
                  bodyClassName="p-l-10 p-r-10 scrollable"
                  bodyStyle={{ maxHeight: 300 }}
                  direction="left"
                  style={{}}
                  header="Select task list columns"
                  closeMultiSelect={toggle}
                  showFilter={false}
                  open={popoverOpen}
                  items={displayValues}
                  selected={displayValues.filter((displayValue) => displayValue.show )}
                  onChange={(_, item, deleted ) => {
                /*    let newVisibility = {};
                    displayValues.forEach((displayValue) => {
                      if(displayValue.id !== item.id){
                        newVisibility[displayValue.visKey ? displayValue.visKey : displayValue.value ] = displayValue.show;
                      }else{
                        newVisibility[displayValue.visKey ? displayValue.visKey : displayValue.value] = !deleted;
                      }
                    })
                    setVisibility(newVisibility);*/
                  }}
                  />
              </div>

            </div>
          </div>
        </div>
    </div>
  );
}