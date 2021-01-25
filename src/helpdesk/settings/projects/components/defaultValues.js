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
    pausal,
    setPausal,
    overtime,
    setOvertime,
    canBeAssigned,
    statuses,
    users,
    allTags,
    companies,
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
                disabled={status.fixed}
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
                onChange={(e)=>setStatus({...status, required:!status.required })}
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
                value = { tag.required }
                onChange={(e)=>setTag({...tag, required:!tag.required })}
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
                disabled={assignedTo.fixed }
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
                onChange={(e)=>setAssignedTo({...assignedTo, required:!assignedTo.required })}
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
                value = { requester.required }
                onChange={(e)=>setRequester({...requester, required: !requester.required })}
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
                disabled={company.fixed }
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
                onChange={(e)=>setCompany({...company, required: !company.required })}
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
                disabled={pausal.fixed }
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
                onChange={(e)=>setPausal({...pausal, required:!pausal.required })}
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
                disabled={overtime.fixed }
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
                onChange={(e)=>setOvertime({...overtime, required:!overtime.required })}
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