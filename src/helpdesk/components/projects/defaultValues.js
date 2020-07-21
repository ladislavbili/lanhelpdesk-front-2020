import React, { Component } from 'react';
import Select from 'react-select';
import {invisibleSelectStyle} from 'configs/components/select';
import Checkbox from '../../../components/checkbox';
import booleanSelects from 'configs/constants/boolSelect'

export default class ProjectDefaultValues extends Component {

  render(){
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
                      value={this.props.state.status.value}
                      onChange={(status)=>this.props.updateState({status:{...this.props.state.status,value:status}})}
                      options={this.props.state.statuses}
                      styles={invisibleSelectStyle}
                      />
                  </div>
                </div>
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.status.def }
                  onChange={(e)=>this.props.updateState({status:{...this.props.state.status,def:!this.props.state.status.def}})}
                  disabled={this.props.state.status.fixed || !this.props.state.status.show}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.status.fixed }
                  onChange={(e)=>this.props.updateState({status:{...this.props.state.status,fixed:!this.props.state.status.fixed, def: !this.props.state.status.fixed ? true : this.props.state.status.def }})}
                  disabled={!this.props.state.status.show}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.status.show }
                  onChange={(e)=>this.props.updateState({status:{...this.props.state.status, show:!this.props.state.status.show, def: true, fixed: true }})}
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
                      value={this.props.state.tags.value}
                      onChange={(tags)=>this.props.updateState({tags:{...this.props.state.tags,value:tags}})}
                      options={this.props.state.allTags}
                      styles={invisibleSelectStyle}
                      />
                  </div>
                </div>
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.tags.def }
                  onChange={(e)=>this.props.updateState({tags:{...this.props.state.tags,def:!this.props.state.tags.def}})}
                  disabled={this.props.state.tags.fixed}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.tags.fixed }
                  onChange={(e)=>this.props.updateState({tags:{...this.props.state.tags,fixed:!this.props.state.tags.fixed, def: !this.props.state.tags.fixed ? true : this.props.state.tags.def }})}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.tags.show }
                  onChange={(e)=>this.props.updateState({tags:{...this.props.state.tags, show:!this.props.state.tags.show }})}
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
                      value={this.props.state.assignedTo.value}
                      onChange={(assignedTo)=>this.props.updateState({assignedTo:{...this.props.state.assignedTo,value:assignedTo}})}
                      options={this.props.canBeAssigned}
                      styles={invisibleSelectStyle}
                      />
                  </div>
                </div>
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.assignedTo.def }
                  onChange={(e)=>this.props.updateState({assignedTo:{...this.props.state.assignedTo,def:!this.props.state.assignedTo.def}})}
                  disabled={this.props.state.assignedTo.fixed || !this.props.state.assignedTo.show}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.assignedTo.fixed }
                  onChange={(e)=>this.props.updateState({assignedTo:{...this.props.state.assignedTo,fixed:!this.props.state.assignedTo.fixed, def: !this.props.state.assignedTo.fixed ? true : this.props.state.assignedTo.def }})}
                  disabled={!this.props.state.assignedTo.show}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.assignedTo.show }
                  onChange={(e)=>this.props.updateState({assignedTo:{...this.props.state.assignedTo, show:!this.props.state.assignedTo.show, def:true, fixed:true }})}
                  />
              </td>
            </tr>

            <tr>
              <td>
                <div className="row">
                  <label className="col-3 col-form-label">Type</label>
                  <div className="col-9">
                    <Select
                      value={this.props.state.type.value}
                      onChange={(type)=>this.props.updateState({type:{...this.props.state.type,value:type}})}
                      options={this.props.state.types}
                      styles={invisibleSelectStyle}
                      />
                  </div>
                </div>
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.type.def }
                  onChange={(e)=>this.props.updateState({type:{...this.props.state.type,def:!this.props.state.type.def}})}
                  disabled={this.props.state.type.fixed || !this.props.state.type.show }
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.type.fixed }
                  onChange={(e)=>this.props.updateState({type:{...this.props.state.type,fixed:!this.props.state.type.fixed, def: !this.props.state.type.fixed ? true : this.props.state.type.def }})}
                  disabled={ !this.props.state.type.show }
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.type.show }
                  onChange={(e)=>this.props.updateState({type:{...this.props.state.type, show:!this.props.state.type.show, def:true, fixed:true }})}
                  />
              </td>
            </tr>

            <tr>
              <td>
                <div className="row">
                  <label className="col-3 col-form-label">Requester</label>
                  <div className="col-9">
                    <Select
                      value={this.props.state.requester.value}
                      onChange={(requester)=>this.props.updateState({requester:{...this.props.state.requester,value:requester}})}
                      options={this.props.state.users}
                      styles={invisibleSelectStyle}
                      />
                  </div>
                </div>
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.requester.def }
                  onChange={(e)=>this.props.updateState({requester:{...this.props.state.requester,def:!this.props.state.requester.def}})}
                  disabled={this.props.state.requester.fixed}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.requester.fixed }
                  onChange={(e)=>this.props.updateState({requester:{...this.props.state.requester,fixed:!this.props.state.requester.fixed, def: !this.props.state.requester.fixed ? true : this.props.state.requester.def }})}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.requester.show }
                  onChange={(e)=>this.props.updateState({requester:{...this.props.state.requester, show:!this.props.state.requester.show }})}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <div className="row">
                  <label className="col-3 col-form-label">Company</label>
                  <div className="col-9">
                    <Select
                      value={this.props.state.company.value}
                      onChange={(company)=>this.props.updateState({company:{...this.props.state.company,value:company}})}
                      options={this.props.state.companies}
                      styles={invisibleSelectStyle}
                      />
                  </div>
                </div>
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.company.def }
                  onChange={(e)=>this.props.updateState({company:{...this.props.state.company,def:!this.props.state.company.def}})}
                  disabled={this.props.state.company.fixed || !this.props.state.company.show }
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.company.fixed }
                  onChange={(e)=>this.props.updateState({company:{...this.props.state.company,fixed:!this.props.state.company.fixed, def: !this.props.state.company.fixed ? true : this.props.state.company.def }})}
                  disabled={ !this.props.state.company.show }
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.company.show }
                  onChange={(e)=>this.props.updateState({company:{...this.props.state.company, show:!this.props.state.company.show, def:true, fixed:true }})}
                  />
              </td>
            </tr>

            <tr>
              <td>
                <div className="row">
                  <label className="col-3 col-form-label">Pausal</label>
                  <div className="col-9">
                    <Select
                      value={this.props.state.pausal.value}
                      onChange={(pausal)=>this.props.updateState({pausal:{...this.props.state.pausal,value:pausal}})}
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
                  value = { this.props.state.pausal.def }
                  onChange={(e)=>this.props.updateState({pausal:{...this.props.state.pausal,def:!this.props.state.pausal.def}})}
                  disabled={this.props.state.pausal.fixed || !this.props.state.pausal.show}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.pausal.fixed }
                  onChange={(e)=>this.props.updateState({pausal:{...this.props.state.pausal,fixed:!this.props.state.pausal.fixed, def: !this.props.state.pausal.fixed ? true : this.props.state.pausal.def }})}
                  disabled={!this.props.state.pausal.show}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.pausal.show }
                  onChange={(e)=>this.props.updateState({pausal:{...this.props.state.pausal, show:!this.props.state.pausal.show, def:true, fixed:true }})}
                  />
              </td>
            </tr>

            <tr>
              <td>
                <div className="row">
                  <label className="col-3 col-form-label">Mimo pracovných hodín</label>
                  <div className="col-9">
                    <Select
                      value={this.props.state.overtime.value}
                      onChange={(overtime)=>this.props.updateState({overtime:{...this.props.state.overtime,value:overtime}})}
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
                  value = { this.props.state.overtime.def }
                  onChange={(e)=>this.props.updateState({overtime:{...this.props.state.overtime,def:!this.props.state.overtime.def}})}
                  disabled={this.props.state.overtime.fixed || !this.props.state.overtime.show}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.overtime.fixed }
                  onChange={(e)=>this.props.updateState({overtime:{...this.props.state.overtime,fixed:!this.props.state.overtime.fixed, def: !this.props.state.overtime.fixed ? true : this.props.state.overtime.def }})}
                  disabled={!this.props.state.overtime.show}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value = { this.props.state.overtime.show }
                  onChange={(e)=>this.props.updateState({overtime:{...this.props.state.overtime, show:!this.props.state.overtime.show, def:true, fixed:true }})}
                  />
              </td>
            </tr>
          </tbody>
        </table>
        {
          (
            (this.props.state.company.value===null && this.props.state.company.fixed) ||
            (this.props.state.status.value===null && this.props.state.status.fixed) ||
            (this.props.state.assignedTo.value.length===0 && this.props.state.assignedTo.fixed) ||
            (this.props.state.type.value===null && this.props.state.type.fixed)
          ) &&
          <div className="red" style={{color:'red'}}>
            Status, assigned to, task type and company can't be empty if they are fixed!
          </div>
        }
      </div>
    )
  }
}
