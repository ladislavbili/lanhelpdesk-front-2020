import React from 'react';
import Select from 'react-select';
import {
  pickSelectStyle
} from 'configs/components/select';
import {
  toSelItem
} from 'helperFunctions';
import Checkbox from 'components/checkbox';
import Switch from "components/switch";
import booleanSelects from 'configs/constants/boolSelect'
import {
  emptyUserValue,
  emptyCompanyValue,
  emptyStatus
} from 'configs/constants/projects';

export const noSelect = {
  label: 'None',
  title: 'None',
  value: null,
  id: null
}

export default function ProjectAttributes( props ) {
  //data
  const {
    assignedTo,
    setAssignedTo,
    company,
    setCompany,
    status,
    setStatus,
    requester,
    setRequester,
    type,
    setType,
    tag,
    setTag,
    pausal,
    setPausal,
    overtime,
    setOvertime,
    statuses,
    users,
    assignableUsers,
    allTags,
    companies,
    taskTypes,
    autoApproved,
    setAutoApproved,
  } = props;

  return (
    <div>
      <table className="table bkg-white m-t-5 m-b-30">
        <thead>
          <tr>
            <th width="300">Task attributes</th>
            <th>Default value</th>
            <th width="100" className="text-center">Fixed</th>
            <th width="100" className="text-center">Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <label className="col-form-label">Status</label>
            </td>
            <td>
              <Select
                value={status.value === null ? emptyStatus : toSelItem(status.value) }
                onChange={(e) => {
                  if(e.id === null){
                    setStatus({...status, value:null })
                  }else{
                    setStatus({...status, value:e })
                  }
                }}
                options={statuses.concat(emptyStatus)}
                styles={pickSelectStyle( [ 'invisible', 'noArrow', 'colored', ] )}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                value = { status.fixed }
                onChange={(e)=>setStatus({...status,fixed:!status.fixed, def: !status.fixed ? true : status.def })}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                blocked
                />
            </td>
          </tr>
          <tr>
            <td>
              <label className="col-form-label">Tags</label>
            </td>
            <td>
              <Select
                isMulti
                value={tag.value}
                onChange={(e) => {
                  if(e.length === 0 && !(tag.fixed || tag.required) ){
                    setTag({...tag,value: [], def: false })
                  }else{
                    setTag({...tag,value: e, def: true })
                  }
                }}
                options={allTags}
                styles={pickSelectStyle([ 'invisible', 'noArrow', 'colored', ])}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                value = { tag.fixed }
                onChange={(e)=>setTag({...tag,fixed:!tag.fixed, def: !tag.fixed ? true : tag.def })}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                value = { tag.required }
                onChange={(e)=>setTag({...tag, required:!tag.required, def: !tag.required ? true : tag.def })}
                />
            </td>
          </tr>
          <tr>
            <td>
              <label className="col-form-label">Assigned</label>
            </td>
            <td>
              <Select
                isMulti
                value={ assignedTo.value.length !== 0 ? assignedTo.value : [ { label: 'Nepriradený/Zadávateľ má assigned edit právo', value: null } ] }
                onChange={(value) =>{
                  if(value.some((user) => user.value === 'clear' )){
                    setAssignedTo({...assignedTo, value: [] })
                  }else{
                    setAssignedTo({...assignedTo, value: value.filter((user) => user.value !== null ) })
                  }
                }}
                options={[...(assignedTo.value.length > 0 ? [{ label: 'Nepriradený/Zadávateľ má assigned edit právo', value: 'clear' }]: []), ...assignableUsers ]}
                styles={pickSelectStyle([ 'invisible', ])}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                value = { assignedTo.fixed }
                onChange={(e)=>setAssignedTo({...assignedTo,fixed:!assignedTo.fixed, def: !assignedTo.fixed ? true : assignedTo.def })}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                blocked
                />
            </td>
          </tr>
          <tr>
            <td>
              <label className="col-form-label">Requester</label>
            </td>
            <td>
              <Select
                value={requester.value === null ? emptyUserValue : requester.value }
                onChange={ (e) => {
                  if(e.key === null && !( requester.fixed || requester.required )){
                    setRequester({ ...requester, value: null, def: false })
                  }else{
                    setRequester({...requester,value:e, def: true })
                  }
                }}
                options={users.concat(emptyUserValue)}
                styles={pickSelectStyle([ 'invisible', ])}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                value = { requester.fixed }
                onChange={(e)=>setRequester({...requester,fixed:!requester.fixed, def: !requester.fixed ? true : requester.def })}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                value = { requester.required }
                onChange={(e)=>setRequester({...requester, required: !requester.required, def: !requester.required ? true : requester.def  })}
                />
            </td>
          </tr>
          <tr>
            <td>
              <label className="col-form-label">Company</label>
            </td>
            <td>

              <Select
                value={ company.value === null ? emptyCompanyValue : company.value }
                onChange={(e)=>{
                  if( e.id === null){
                    setCompany({...company,value:null, def: false })
                  }else{
                    setCompany({...company,value:e})
                  }
                }}
                options={companies.concat(emptyCompanyValue)}
                styles={pickSelectStyle([ 'invisible', ])}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                value = { company.fixed }
                onChange={(e)=>setCompany({...company,fixed:!company.fixed, def: !company.fixed ? true : company.def })}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                blocked
                />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="table bkg-white m-t-5 m-b-15">
        <thead>
          <tr>
            <th width="300">Pausal attributes</th>
            <th>Default value</th>
            <th width="100" className="text-center">Fixed</th>
            <th width="100" className="text-center">Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <label className="col-form-label">Task type</label>
            </td>
            <td>
              <Select
                value={type.value}
                onChange={ (e) => {
                  if(e.value === null ){
                    setType({ ...type, value:e, def: false })
                  } else {
                    setType({ ...type, value:e, def: true })
                  }
                }}
                options={ type.fixed || type.required ? taskTypes : [noSelect, ...taskTypes] }
                styles={pickSelectStyle([ 'invisible', ])}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                value = { type.fixed }
                onChange={(e)=>setType({...type,fixed:!type.fixed, def: !type.fixed ? true : type.def })}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                value = { type.required }
                onChange={(e)=>setType({...type, required: !type.required, def: !type.required ? true : type.def })}
                />
            </td>
          </tr>
          <tr>
            <td>
              <label className="col-form-label">Pausal</label>
            </td>
            <td>
              <Select
                value={pausal.value}
                onChange={(e)=>setPausal({...pausal,value:e})}
                options={booleanSelects}
                styles={pickSelectStyle([ 'invisible', ])}
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                className="m-t-5"
                value = { pausal.fixed }
                onChange={(e)=>setPausal({...pausal,fixed:!pausal.fixed, def: !pausal.fixed ? true : pausal.def })}
                />
            </td>
            <td>
              <Checkbox
                centerVer
                blocked
                className="m-t-5"
                />
            </td>
          </tr>
          <tr>
            <td>
              <label className="col-form-label">Mimo pracovných hodín</label>
            </td>
            <td>
              <Select
                value={overtime.value}
                onChange={(e)=>setOvertime({...overtime,value:e})}
                options={booleanSelects}
                styles={pickSelectStyle([ 'invisible', ])}
                />
            </td>
            <td>
              <Checkbox
                centerVer
                className="m-t-5"
                value = { overtime.fixed }
                onChange={(e)=>setOvertime({...overtime,fixed:!overtime.fixed, def: !overtime.fixed ? true : overtime.def })}
                />
            </td>
            <td>
              <Checkbox
                centerVer
                blocked
                className="m-t-5"
                />
            </td>
          </tr>
          <tr>
            <td>
              <label className="col-form-label">Faktúrovať</label>
            </td>
            <td colSpan="3">
              <Switch
                value={autoApproved}
                onChange={() => setAutoApproved(!autoApproved) }
                className="m-t-4"
                labelClassName="text-normal font-normal"
                simpleSwitch
                />
            </td>
          </tr>
        </tbody>
      </table>

      {
        (
          (company.value === null && company.fixed) ||
          (status.value === null && status.fixed) ||
          (assignedTo.value && assignedTo.value.length===0 && assignedTo.fixed)
        ) &&
        <div className="red" style={{color:'red'}}>
          Status, assigned to and company can't be empty if they are fixed!
        </div>
      }
    </div>
  );
}