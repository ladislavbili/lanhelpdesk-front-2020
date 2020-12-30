import React from 'react';
import Select from 'react-select';
import {
  invisibleSelectStyle,
  invisibleSelectStyleNoArrowColored
} from 'configs/components/select';
import Checkbox from 'components/checkbox';
import booleanSelects from 'configs/constants/boolSelect'

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
    tag,
    setTag,
    taskType,
    setTaskType,
    pausal,
    setPausal,
    overtime,
    setOvertime,
    canBeAssigned,
    statuses,
    users,
    allTags,
    companies,
    taskTypes
  } = props;

  return (
    <div>
      <h3 className="m-t-20"> Default values </h3>
      <table className="table">
        <thead>
          <tr>
            <th ></th>
            <th width="10">Def.</th>
            <th width="10">Fixed</th>
            <th width="10">Show</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="row">
                <label className="col-3 col-form-label">Status</label>
                <div className="col-9">
                  <Select
                    value={status.value}
                    onChange={(e)=>setStatus({...status, value:e})}
                    options={statuses}
                    styles={invisibleSelectStyleNoArrowColored}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { status.def }
                onChange={(e)=>setStatus({...status,def:!status.def})}
                disabled={status.fixed || !status.show}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { status.fixed }
                onChange={(e)=>setStatus({...status,fixed:!status.fixed, def: !status.fixed ? true : status.def })}
                disabled={!status.show}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { status.show }
                onChange={(e)=>setStatus({...status, show:!status.show, def: true, fixed: true })}
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
                    styles={invisibleSelectStyleNoArrowColored}
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
                disabled={tag.fixed}
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
                value = { tag.show }
                onChange={(e)=>setTag({...tag, show:!tag.show })}
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
                    value={assignedTo.value}
                    onChange={(e)=>setAssignedTo({...assignedTo,value:e})}
                    options={canBeAssigned}
                    styles={invisibleSelectStyle}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { assignedTo.def }
                onChange={(e)=>setAssignedTo({...assignedTo,def:!assignedTo.def})}
                disabled={assignedTo.fixed || !assignedTo.show}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { assignedTo.fixed }
                onChange={(e)=>setAssignedTo({...assignedTo,fixed:!assignedTo.fixed, def: !assignedTo.fixed ? true : assignedTo.def })}
                disabled={!assignedTo.show}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { assignedTo.show }
                onChange={(e)=>setAssignedTo({...assignedTo, show:!assignedTo.show, def:true, fixed:true })}
                />
            </td>
          </tr>

          <tr>
            <td>
              <div className="row">
                <label className="col-3 col-form-label">Task type</label>
                <div className="col-9">
                  <Select
                    value={taskType.value}
                    onChange={(e)=>setTaskType({...taskType,value:e})}
                    options={taskTypes}
                    styles={invisibleSelectStyle}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { taskType.def }
                onChange={(e)=>setTaskType({...taskType,def:!taskType.def})}
                disabled={taskType.fixed || !taskType.show }
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { taskType.fixed }
                onChange={(e)=>setTaskType({...taskType,fixed:!taskType.fixed, def: !taskType.fixed ? true : taskType.def })}
                disabled={ !taskType.show }
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { taskType.show }
                onChange={(e)=>setTaskType({...taskType, show:!taskType.show, def:true, fixed:true })}
                />
            </td>
          </tr>

          <tr>
            <td>
              <div className="row">
                <label className="col-3 col-form-label">Requester</label>
                <div className="col-9">
                  <Select
                    value={requester.value}
                    onChange={(e)=>setRequester({...requester,value:e})}
                    options={users}
                    styles={invisibleSelectStyle}
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
                disabled={requester.fixed}
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
                value = { requester.show }
                onChange={(e)=>setRequester({...requester, show:!requester.show })}
                />
            </td>
          </tr>

          <tr>
            <td>
              <div className="row">
                <label className="col-3 col-form-label">Company</label>
                <div className="col-9">
                  <Select
                    value={company.value}
                    onChange={(e)=>setCompany({...company,value:e})}
                    options={companies}
                    styles={invisibleSelectStyle}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { company.def }
                onChange={(e)=>setCompany({...company,def:!company.def})}
                disabled={company.fixed || !company.show }
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { company.fixed }
                onChange={(e)=>setCompany({...company,fixed:!company.fixed, def: !company.fixed ? true : company.def })}
                disabled={ !company.show }
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { company.show }
                onChange={(e)=>setCompany({...company, show:!company.show, def:true, fixed:true })}
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
                    styles={invisibleSelectStyle}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { pausal.def }
                onChange={(e)=>setPausal({...pausal,def:!pausal.def})}
                disabled={pausal.fixed || !pausal.show}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { pausal.fixed }
                onChange={(e)=>setPausal({...pausal,fixed:!pausal.fixed, def: !pausal.fixed ? true : pausal.def })}
                disabled={!pausal.show}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { pausal.show }
                onChange={(e)=>setPausal({...pausal, show:!pausal.show, def:true, fixed:true })}
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
                    styles={invisibleSelectStyle}
                    />
                </div>
              </div>
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { overtime.def }
                onChange={(e)=>setOvertime({...overtime,def:!overtime.def})}
                disabled={overtime.fixed || !overtime.show}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { overtime.fixed }
                onChange={(e)=>setOvertime({...overtime,fixed:!overtime.fixed, def: !overtime.fixed ? true : overtime.def })}
                disabled={!overtime.show}
                />
            </td>
            <td>
              <Checkbox
                centerHor
                centerVer
                value = { overtime.show }
                onChange={(e)=>setOvertime({...overtime, show:!overtime.show, def:true, fixed:true })}
                />
            </td>
          </tr>

        </tbody>
      </table>
      {
        (
          (company.value===null && company.fixed) ||
          (status.value===null && status.fixed) ||
          (assignedTo.value && assignedTo.value.length===0 && assignedTo.fixed) ||
          (taskType.value===null && taskType.fixed)
        ) &&
        <div className="red" style={{color:'red'}}>
          Status, assigned to, task taskType and company can't be empty if they are fixed!
        </div>
      }
    </div>
  );
}