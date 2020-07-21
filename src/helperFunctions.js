import React from 'react';
import moment from 'moment';

export const testing = false;

export const toSelArr = (arr,index = 'title')=> arr.map((item)=>{return {...item,value:item.id,label:item[index]}})

export const isEmail = (email) => (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)

export const snapshotToArray = (snapshot) => {
  if(snapshot.empty){
    return [];
  }
  return snapshot.docs.map((item)=>{
    return {id:item.id,...item.data()};
  })
}

export const toMomentInput = (unix) => ( unix !== null && unix !== undefined ) ? moment(unix) : null;

export const fromMomentToUnix = (moment) => moment !== null ? moment.unix()*1000 : null;

export const timestampToString = (timestamp) => {
  return moment.unix(timestamp/1000).format('HH:mm DD.MM.YYYY');
}

export const timestampToDate = (timestamp) => {
  let date = (new Date(timestamp));
  return date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
}

export const timestampToHoursAndMinutes = (timestamp) => {
  let date = (new Date(timestamp));
  return date.getHours()+":"+(date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
}

export const toFloat = (number) => parseFloat(parseFloat(number).toFixed(2))

export const hightlightText = (message,text, color)=>{
  let index = message.toLowerCase().indexOf(text.toLowerCase());
  if (index===-1){
    return (<span>{message}</span>);
  }
  return (<span>{message.substring(0,index)}<span style={{color}}>{message.substring(index,index+text.length)}</span>{message.substring(index+text.length,message.length)}</span>);
}


export const calculateTextAreaHeight = (e) => {
  //  const firstHeight = 29;
  //  const expansionHeight = 21;
  //  return firstHeight + Math.floor(Math.abs((e.target.scrollHeight-firstHeight))/expansionHeight)*expansionHeight;
  return e.target.scrollHeight;
}

export const getAttributeDefaultValue = (item) => {
  switch (item.type.id) {
    case 'input':
      return '';
    case 'textarea':
      return '';
    case 'select':
      return item.options.length>0?item.options[0]:null;
    default:
      return '';
  }
}

export const htmlFixNewLines = (text) => {
  return text.replace(/(?:\r\n|\r|\n)/g,'<br>');
}

export const getItemDisplayValue= (item,value) => {
  if(!item[value.value] && (value.type === 'important' || value.type === 'checkbox')){
    return '';
  }
  if(!item[value.value]){
    return 'Neexistuje';
  }
  if(value.type==='object'){
    if (value.value === "status"){
      return <span className="label label-info" style={{backgroundColor: item[value.value] ? item[value.value].color : "white"}}>{item[value.value] ? item[value.value].title : "No status"}</span>
    }
    return item[value.value].title;
  }else if(value.type==='text'){
    return item[value.value];
  }else if(value.type==='custom'){
    return value.func(item);
  }else if(value.type==='url'){
    return <a onClick={(e)=>e.stopPropagation()} href={item[value.value]} target="_blank" without rel="noopener noreferrer">{item[value.value]?item[value.value]:''}</a>;
  }else if(value.type==='int'){
    return parseInt(item[value.value]);
  }else if(value.type==='list'){
    return value.func(item[value.value]);
  }else if(value.type==='date'){
    return timestampToString(item[value.value]);
  }else if(value.type==='user'){
    return item[value.value].name+' '+item[value.value].surname;
  }else	if(value.type === "important"){
    return <i className="far fa-star" style={{color: '#ffc107' }} />;
  }else	if(value.type === "checkbox"){
    return <i className="far fa-star" style={{color: '#ffc107' }} />;
  }
  else{
    return 'Error'
  }
}

export const arraySelectToString = (arr) => {
  return arr.map(a => " " + a).toString();
}

export const toMillisec = (number, time) => {
  switch (time) {
    case 'seconds':
      return number*1000;
    case 'minutes':
      return number*60*1000;
    case 'hours':
      return number*60*60*1000;
    case 'days':
      return number*24*60*60*1000;
    default:
      return number;
  }
}

export const fromMillisec = (number, time) => {
  switch (time) {
    case 'seconds':
      return +(number/1000).toFixed(2);
    case 'minutes':
      return +(number/60/1000).toFixed(2);
    case 'hours':
      return +(number/60/60/1000).toFixed(2);
    case 'days':
      return +(number/24/60/60/1000).toFixed(2);
    default:
      return number;
  }
}

export const toCentralTime = (time) => {
  let date = new Date(time);
  let userTimezoneOffset = date.getTimezoneOffset() * 60*1000;
  return (new Date(date.getTime() + userTimezoneOffset)).getTime();
}

export const fromCentralTime = (time)=>{
  let date = new Date(time);
  let userTimezoneOffset = date.getTimezoneOffset() * 60*1000;
  return (new Date(date.getTime() - userTimezoneOffset)).getTime();
}

export const sameStringForms = (item1,item2)=>{
  return JSON.stringify(item1)===JSON.stringify(item2)
}

export const timestampToInput = (timestamp)=>{
  return timestamp!==null && timestamp!=='' && timestamp!==undefined ?new Date(timestamp).toISOString().replace('Z',''):''
}

export const inputToTimestamp = (input)=>{
  return isNaN(new Date(input).getTime())|| input === '' ? '' : (new Date(input).getTime())
}

export const changeCKEData = (input)=>{
  return input.replace(/<p>/g, "<p style='margin-bottom: 0px; padding-bottom: 0px;'>");
}

export const applyTaskFilter = ( task, filter, user, projectID, milestoneID ) => {
  let currentPermissions = null;
  if(task.project && task.project.permissions){
    currentPermissions = task.project.permissions.find((permission)=>permission.user === user.id);
  }
  return filterOneOf( task, filter, user ) &&
  ( user.statuses.length === 0 || ( task.status && user.statuses.includes( task.status.id ) ) ) &&
  ( filter.workType === null || ( task.type === filter.workType ) ) &&
  filterDateSatisfied( task, filter, 'statusDate' ) &&
  filterDateSatisfied( task, filter, 'closeDate' ) &&
  filterDateSatisfied( task, filter, 'pendingDate' ) &&
  filterDateSatisfied( task, filter, 'deadline' ) &&
  ( projectID === null || ( task.project && task.project.id === projectID ) ) &&
  ( user.userData.role.value === 3 || ( currentPermissions && currentPermissions.read ) ) &&
  ( milestoneID===null || ( task.milestone && task.milestone === milestoneID ) )
}

export const filterDateSatisfied = ( task, filter, type ) => {
  let fromTime = filter[`${type}From`];
  let fromNow = filter[`${type}FromNow`] || false;
  let toTime = filter[`${type}To`];
  let toNow = filter[`${type}ToNow`] || false;
  if( fromNow ){
    fromTime = moment().unix()*1000;
  }
  if( toNow ){
    toTime = moment().unix()*1000;
  }
  return (
    fromTime === null || ( task[type] !== null && task[type] >= fromTime )
  ) && (
    toTime === null || ( task[type] !== null && task[type] <= toTime )
  )
}

export const filterOneOf = ( task, filter, user ) => {
  const requesterSatisfied = (
    filter.requester === null ||
    ( task.requester && task.requester.id === filter.requester ) ||
    ( task.requester && filter.requester==='cur' && task.requester.id === user.id)
  )
  const assignedSatisfied = (
    filter.assigned === null ||
    ( task.assignedTo && task.assignedTo.map( (item) => item.id ).includes( filter.assigned ) ) ||
    ( task.assignedTo && filter.assigned === 'cur' && task.assignedTo.map( (item) => item.id ).includes(user.id) )
  )

  const companySatisfied = (
    filter.company === null ||
    ( task.company && task.company.id === filter.company ) ||
    ( task.company && filter.company==='cur' && task.company.id === user.userData.company )
  )

  const oneOf = [];
  const all = [];
  if(filter.oneOf.includes('requester')){
    oneOf.push(requesterSatisfied)
  }else{
    all.push(requesterSatisfied)
  }

  if(filter.oneOf.includes('assigned')){
    oneOf.push(assignedSatisfied)
  }else{
    all.push(assignedSatisfied)
  }

  if(filter.oneOf.includes('company')){
    oneOf.push(companySatisfied)
  }else{
    all.push(companySatisfied)
  }
  return all.every( (bool) => bool ) && ( oneOf.length === 0 || oneOf.some( (bool) => bool ) )
}

export const filterProjectsByPermissions = ( projects, currentUser ) => {
  return toSelArr(projects).filter((project)=>{
    if(currentUser.userData && currentUser.userData.role.value===3){
      return true;
    }
    if( project.permissions === undefined ) return false;
    let permission = project.permissions.find((permission)=>permission.user===currentUser.id);
    return permission && permission.read;
  })
}

export const filterIncludesText = ( source, text ) => {
  return source.toLowerCase().includes( text.toLowerCase() )
}
