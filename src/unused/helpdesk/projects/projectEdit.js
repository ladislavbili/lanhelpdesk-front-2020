import React, { Component } from 'react';
import Select from 'react-select';
import { Modal, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase, database} from '../../index';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import {invisibleSelectStyle} from 'configs/components/select';
import Permits from "../../components/permissions";
import { noDef } from 'configs/constants/projects';

export default class ProjectEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title: '',
      description: '',
      statuses:[],
      allTags:[],
      users:[],
      types:[],
      companies:[],

      ...noDef,
      saving: false,
      opened: false
    }
    this.fetchData.bind(this);
    this.fetchData(this.props.item.id);
  }

  componentWillReceiveProps(props){
    if (this.props.item.id !== props.item.id){
      this.fetchData(props.item.id);
    }
  }

  fetchData(id){
    Promise.all(
      [
        database.collection('help-projects').doc(id).get(),
        database.collection('help-statuses').get(),
        database.collection('help-tags').get(),
        database.collection('users').get(),
        database.collection('help-task_types').get(),
        database.collection('companies').get(),
      ]).then(([project,statuses,tags,users,types,companies])=>this.setData(
        {id:project.id,...project.data()},
				toSelArr(snapshotToArray(statuses)),
				toSelArr(snapshotToArray(tags)),
				toSelArr(snapshotToArray(users),'email'),
				toSelArr(snapshotToArray(types)),
      	toSelArr(snapshotToArray(companies))
      ));
  }

  setData(project,statuses,allTags,users,types,companies){
    let status = statuses.find(item=> project.def && item.id===project.def.status.value);
    let tags = allTags.filter(item=> project.def && project.def.tags.value.includes(item.id));
    let assignedTo = users.filter(item=> project.def && project.def.assignedTo.value.includes(item.id));
    let type = types.find(item=> project.def && item.id===project.def.type.value);
    let requester = users.find(item=> project.def && item.id===project.def.requester.value);
    let company = companies.find(item=> project.def && item.id===project.def.company.value);
    this.setState({
      title:project.title,
      description:project.description?project.description:'',
      statuses,
      allTags,
      users,
      types,
      companies,

      status:status?{value:status,def:project.def.status.def,fixed:project.def.status.fixed}:{def:false,fixed:false, value: null},
      tags:project.def?{value:tags,def:project.def.tags.def,fixed:project.def.tags.fixed}:{def:false,fixed:false, value: []},
      assignedTo:project.def?{value:assignedTo,def:project.def.assignedTo.def,fixed:project.def.assignedTo.fixed}:{def:false,fixed:false, value: []},
      type:type?{value:type,def:project.def.type.def,fixed:project.def.type.fixed}:{def:false,fixed:false, value: null},
      requester:requester?{value:requester,def:project.def.requester.def,fixed:project.def.requester.fixed}:{def:false,fixed:false, value: null},
      company:company?{value:company,def:project.def.company.def,fixed:project.def.company.fixed}:{def:false,fixed:false, value: null},
    });
  }

  toggle(){
    if(!this.state.opened){
      this.fetchData(this.props.item.id);
    }
    this.setState({opened: !this.state.opened})
  }

  render(){
    return (
      <div className='sidebar-menu-item'>
        <Button
          className='btn-link sidebar-menu-item t-a-l'
          onClick={this.toggle.bind(this)}
          >
          <i className="fa fa-cog m-r-5 m-l-5 "/> Project settings
        </Button>

        <Modal isOpen={this.state.opened} toggle={this.toggle.bind(this)} >
            <ModalBody>
              <FormGroup>
                <Label>Filter name</Label>
                <Input type="text" className="from-control" placeholder="Enter filter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="body">Popis</Label>
                <Input type="textarea" className="form-control" id="body" placeholder="Zadajte text" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})}/>
              </FormGroup>

              {false &&   <Permits id={this.props.item.id} view={this.props.item.view} edit={this.props.item.edit} permissions={this.props.item.permissions} db="help-projects" />}

              <h3 className="m-t-20"> DEMO - Default values </h3>

                <table className="table">
                  <thead>
                    <tr>
                      <th ></th>
                      <th width="10">Def.</th>
                      <th width="10">Fixed</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="row">
                          <label className="col-3 col-form-label">Status</label>
                          <div className="col-9">
                            <Select
                              value={this.state.status.value}
                              onChange={(status)=>this.setState({status:{...this.state.status,value:status}})}
                              options={this.state.statuses}
                              styles={invisibleSelectStyle}
                              />
                          </div>
                        </div>
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.status.def} onChange={(e)=>this.setState({status:{...this.state.status,def:!this.state.status.def}})} disabled={this.state.status.fixed} />
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.status.fixed} onChange={(e)=>this.setState({status:{...this.state.status,fixed:!this.state.status.fixed, def: !this.state.status.fixed ? true : this.state.status.def }})} />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="row">
                          <label className="col-3 col-form-label">Tags</label>
                          <div className="col-9">
                            <Select
                              isMulti
                              value={this.state.tags.value}
                              onChange={(tags)=>this.setState({tags:{...this.state.tags,value:tags}})}
                              options={this.state.allTags}
                              styles={invisibleSelectStyle}
                              />
                          </div>
                        </div>
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.tags.def} onChange={(e)=>this.setState({tags:{...this.state.tags,def:!this.state.tags.def}})} disabled={this.state.tags.fixed} />
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.tags.fixed} onChange={(e)=>this.setState({tags:{...this.state.tags,fixed:!this.state.tags.fixed, def: !this.state.tags.fixed ? true : this.state.tags.def }})} />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="row">
                          <label className="col-3 col-form-label">Assigned</label>
                          <div className="col-9">
                            <Select
                              isMulti
                              value={this.state.assignedTo.value}
                              onChange={(assignedTo)=>this.setState({assignedTo:{...this.state.assignedTo,value:assignedTo}})}
                              options={this.state.users}
                              styles={invisibleSelectStyle}
                              />
                          </div>
                        </div>
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.assignedTo.def} onChange={(e)=>this.setState({assignedTo:{...this.state.assignedTo,def:!this.state.assignedTo.def}})} disabled={this.state.assignedTo.fixed} />
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.assignedTo.fixed} onChange={(e)=>this.setState({assignedTo:{...this.state.assignedTo,fixed:!this.state.assignedTo.fixed, def: !this.state.assignedTo.fixed ? true : this.state.assignedTo.def }})} />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="row">
                          <label className="col-3 col-form-label">Type</label>
                          <div className="col-9">
                            <Select
                              value={this.state.type.value}
                              onChange={(type)=>this.setState({type:{...this.state.type,value:type}})}
                              options={this.state.types}
                              styles={invisibleSelectStyle}
                              />
                          </div>
                        </div>
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.type.def} onChange={(e)=>this.setState({type:{...this.state.type,def:!this.state.type.def}})} disabled={this.state.type.fixed} />
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.type.fixed} onChange={(e)=>this.setState({type:{...this.state.type,fixed:!this.state.type.fixed, def: !this.state.type.fixed ? true : this.state.type.def }})} />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="row">
                          <label className="col-3 col-form-label">Requester</label>
                          <div className="col-9">
                            <Select
                              value={this.state.requester.value}
                              onChange={(requester)=>this.setState({requester:{...this.state.requester,value:requester}})}
                              options={this.state.users}
                              styles={invisibleSelectStyle}
                              />
                          </div>
                        </div>
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.requester.def} onChange={(e)=>this.setState({requester:{...this.state.requester,def:!this.state.requester.def}})} disabled={this.state.requester.fixed} />
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.requester.fixed} onChange={(e)=>this.setState({requester:{...this.state.requester,fixed:!this.state.requester.fixed, def: !this.state.requester.fixed ? true : this.state.requester.def }})} />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="row">
                          <label className="col-3 col-form-label">Company</label>
                          <div className="col-9">
                            <Select
                              value={this.state.company.value}
                              onChange={(company)=>this.setState({company:{...this.state.company,value:company}})}
                              options={this.state.companies}
                              styles={invisibleSelectStyle}
                              />
                          </div>
                        </div>
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.company.def} onChange={(e)=>this.setState({company:{...this.state.company,def:!this.state.company.def}})} disabled={this.state.company.fixed} />
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.company.fixed} onChange={(e)=>this.setState({company:{...this.state.company,fixed:!this.state.company.fixed, def: !this.state.company.fixed ? true : this.state.company.def }})} />
                      </td>
                    </tr>

                  </tbody>
                </table>

                {((this.state.company.value===null&&this.state.company.fixed)||(this.state.status.value===null&&this.state.status.fixed)) && <div className="red" style={{color:'red'}}>
                  Status and company can't be empty if they are fixed!
                </div>}
              </ModalBody>
              <ModalFooter>
              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>
              <Button
                className="btn"
                disabled={this.state.saving||this.state.title===""||(this.state.company.value===null&&this.state.company.fixed)||(this.state.status.value===null&&this.state.status.fixed)}
                onClick={()=>{
                  this.setState({saving:true});
                  let body = {
                    title: this.state.title,
                    description: this.state.description,
                    def:{
                      status:this.state.status.value?{...this.state.status,value:this.state.status.value.id}:{def:false,fixed:false, value: null},
                      tags:this.state.tags.value?{...this.state.tags,value:this.state.tags.value.map(item=>item.id)}:{def:false,fixed:false, value: []},
                      assignedTo:this.state.assignedTo.value?{...this.state.assignedTo,value:this.state.assignedTo.value.map(item=>item.id)}:{def:false,fixed:false, value: []},
                      type:this.state.type.value?{...this.state.type,value:this.state.type.value.id}:{def:false,fixed:false, value: null},
                      requester:this.state.requester.value?{...this.state.requester,value:this.state.requester.value.id}:{def:false,fixed:false, value: null},
                      company:this.state.company.value?{...this.state.company,value:this.state.company.value.id}:{def:false,fixed:false, value: null}
                    }
                  };
                  rebase.updateDoc(`/help-projects/${this.props.item.id}`, body)
                        .then(()=>{this.setState({saving:false, opened: false})});
                        this.props.triggerChange();
              }}>
                {(this.state.saving?'Saving...':'Save project')}
              </Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}
