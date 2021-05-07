import React from 'react';
import Select from 'react-select';
import {
  pickSelectStyle
} from 'configs/components/select';
import {
  toSelItem
} from 'helperFunctions';
import Checkbox from 'components/checkbox';
import booleanSelects from 'configs/constants/boolSelect'
import {
  emptyUserValue,
  emptyCompanyValue,
  emptyStatus
} from 'configs/constants/projects';

export default function ProjectDefaultValues( props ) {
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
  } = props;

  return (
    <div>
      <h3 className="m-t-20"> Default values </h3>
      <table className="table">
        <thead>
          <tr>
            <th ></th>
            <th width="15">Defined</th>
            <th width="15">Fixed</th>
            <th width="15">Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="row">
                <label className="col-3 col-form-label">Status</label>
                <div className="col-9">
                  <Select
                    value={status.value === null ? emptyStatus : toSelItem(status.value) }
                    onChange={(e)=>{
                      if(e.id === null){
                        setStatus({...status, value:null })
                      }else{
                        setStatus({...status, value:e})
                      }
                    }}
                    options={statuses.concat(emptyStatus)}
                    styles={pickSelectStyle( [ 'invisible', 'noArrow', 'colored', ] )}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                disabled={ true }
                value = { true }
                onChange={(e)=>setStatus({...status,def:!status.def})}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { status.fixed }
                onChange={(e)=>setStatus({...status,fixed:!status.fixed, def: !status.fixed ? true : status.def })}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                disabled={ true }
                value = { true }
                onChange={(e)=>setStatus({...status, required:!status.required, def: !status.required ? true : status.def })}
                />
            </td>
          </tr>

          <tr>
            <td>
              <div className="row">
                <label className="col-3 col-form-label">Tags</label>
                <div className="col-9">
                  <Select
                    isMulti
                    value={tag.value}
                    onChange={(e)=>setTag({...tag,value:e})}
                    options={allTags}
                    styles={pickSelectStyle([ 'invisible', 'noArrow', 'colored', ])}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { tag.def }
                onChange={(e)=>setTag({...tag,def:!tag.def})}
                disabled={tag.fixed || tag.required}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { tag.fixed }
                onChange={(e)=>setTag({...tag,fixed:!tag.fixed, def: !tag.fixed ? true : tag.def })}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { tag.required }
                onChange={(e)=>setTag({...tag, required:!tag.required, def: !tag.required ? true : tag.def })}
                />
            </td>
          </tr>

          <tr>
            <td>
              <div className="row">
                <label className="col-3 col-form-label">Assigned</label>
                <div className="col-9">
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
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                disabled={ true }
                value = { true }
                onChange={(e)=>setAssignedTo({...assignedTo,def:!assignedTo.def})}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { assignedTo.fixed }
                onChange={(e)=>setAssignedTo({...assignedTo,fixed:!assignedTo.fixed, def: !assignedTo.fixed ? true : assignedTo.def })}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                disabled={ true }
                value = { true }
                onChange={(e)=>setAssignedTo({...assignedTo, required:!assignedTo.required, def: !assignedTo.required ? true : assignedTo.def })}
                />
            </td>
          </tr>

          <tr>
            <td>
              <div className="row">
                <label className="col-3 col-form-label">Requester</label>
                <div className="col-9">
                  <Select
                    value={requester.value === null ? emptyUserValue : requester.value }
                    onChange={ (e) => {
                      if(e.key === null){
                        setRequester({ ...requester, value:null })
                      }else{
                        setRequester({...requester,value:e})
                      }
                    }}
                    options={users.concat(emptyUserValue)}
                    styles={pickSelectStyle([ 'invisible', ])}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { requester.def }
                onChange={(e)=>setRequester({...requester,def:!requester.def})}
                disabled={requester.fixed || requester.required}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { requester.fixed }
                onChange={(e)=>setRequester({...requester,fixed:!requester.fixed, def: !requester.fixed ? true : requester.def })}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { requester.required }
                onChange={(e)=>setRequester({...requester, required: !requester.required, def: !requester.required ? true : requester.def  })}
                />
            </td>
          </tr>

          <tr>
            <td>
              <div className="row">
                <label className="col-3 col-form-label">Company</label>
                <div className="col-9">
                  <Select
                    value={ company.value === null ? emptyCompanyValue : company.value }
                    onChange={(e)=>{
                      if( e.id === null){
                        setCompany({...company,value:null})
                      }else{
                        setCompany({...company,value:e})
                      }
                    }}
                    options={companies.concat(emptyCompanyValue)}
                    styles={pickSelectStyle([ 'invisible', ])}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                disabled={ true }
                value = { true }
                onChange={(e)=>setCompany({...company,def:!company.def})}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { company.fixed }
                onChange={(e)=>setCompany({...company,fixed:!company.fixed, def: !company.fixed ? true : company.def })}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                disabled={ true }
                value = { true }
                onChange={(e)=>setCompany({...company, required: !company.required, def: !company.required ? true : company.def })}
                />
            </td>
          </tr>

          <tr>
            <td>
              <div className="row">
                <label className="col-3 col-form-label">Task type</label>
                <div className="col-9">
                  <Select
                    value={type.value}
                    onChange={ (e) => {
                        setType({...type,value:e})
                    }}
                    options={taskTypes}
                    styles={pickSelectStyle([ 'invisible', ])}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { type.def }
                onChange={(e)=>setType({...type,def:!type.def})}
                disabled={ type.fixed || type.required }
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { type.fixed }
                onChange={(e)=>setType({...type,fixed:!type.fixed, def: !type.fixed ? true : type.def })}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { type.required }
                onChange={(e)=>setType({...type, required: !type.required, def: !type.required ? true : type.def })}
                />
            </td>
          </tr>

          <tr>
            <td>
              <div className="row">
                <label className="col-3 col-form-label">Pausal</label>
                <div className="col-9">
                  <Select
                    value={pausal.value}
                    onChange={(e)=>setPausal({...pausal,value:e})}
                    options={booleanSelects}
                    styles={pickSelectStyle([ 'invisible', ])}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                disabled={ true }
                value = { true }
                onChange={(e)=>setPausal({...pausal,def:!pausal.def})}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { pausal.fixed }
                onChange={(e)=>setPausal({...pausal,fixed:!pausal.fixed, def: !pausal.fixed ? true : pausal.def })}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                disabled={ true }
                value = { true }
                onChange={(e)=>setPausal({...pausal, required:!pausal.required, def: !pausal.required ? true : pausal.def })}
                />
            </td>
          </tr>

          <tr>
            <td>
              <div className="row">
                <label className="col-3 col-form-label">Mimo pracovných hodín</label>
                <div className="col-9">
                  <Select
                    value={overtime.value}
                    onChange={(e)=>setOvertime({...overtime,value:e})}
                    options={booleanSelects}
                    styles={pickSelectStyle([ 'invisible', ])}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                disabled={ true }
                value = { true }
                onChange={(e)=>setOvertime({...overtime,def:!overtime.def})}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { overtime.fixed }
                onChange={(e)=>setOvertime({...overtime,fixed:!overtime.fixed, def: !overtime.fixed ? true : overtime.def })}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                disabled={ true }
                value = { true }
                onChange={(e)=>setOvertime({...overtime, required:!overtime.required, def: !overtime.required ? true : overtime.def })}
                />
            </td>
          </tr>

        </tbody>
      </table>
      {
        (
          (company.value===null && company.fixed) ||
          (status.value===null && status.fixed) ||
          (assignedTo.value && assignedTo.value.length===0 && assignedTo.fixed)
        ) &&
        <div className="red" style={{color:'red'}}>
          Status, assigned to and company can't be empty if they are fixed!
        </div>
      }
    </div>
  );
}