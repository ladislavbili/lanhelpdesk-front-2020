import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from "react-redux";
import {invisibleSelectStyle} from 'configs/components/select';
import {storageHelpStatusesStart, storageHelpTagsStart, storageUsersStart, storageHelpTaskTypesStart, storageCompaniesStart} from '../../../redux/actions';
import { Button, FormGroup, Label,Input, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';
import {toSelArr, sameStringForms} from '../../../helperFunctions';
import {rebase} from '../../../index';
import { noDef } from 'configs/constants/projects';

class ProjectAdd extends Component{
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
      opened: true
    }
  }

	componentWillReceiveProps(props){
		if(!sameStringForms(props.statuses,this.props.statuses)){
			this.setState({statuses:toSelArr(props.statuses)})
		}
		if(!sameStringForms(props.tags,this.props.tags)){
			this.setState({tags:toSelArr(props.tags)})
		}
		if(!sameStringForms(props.users,this.props.users)){
			this.setState({users:toSelArr(props.users,'email')})
		}
		if(!sameStringForms(props.taskTypes,this.props.taskTypes)){
			this.setState({taskTypes:toSelArr(props.taskTypes)})
		}
		if(!sameStringForms(props.companies,this.props.companies)){
			this.setState({companies:toSelArr(props.companies)})
		}
	}

	componentWillMount(){
		if(!this.props.statusesActive){
			this.props.storageHelpStatusesStart();
		}
		this.setState({statuses:toSelArr(this.props.statuses)});

		if(!this.props.tagsActive){
			this.props.storageHelpTagsStart();
		}
		this.setState({allTags:toSelArr(this.props.tags)});

		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		this.setState({users:toSelArr(this.props.users,'email')});

		if(!this.props.taskTypesActive){
			this.props.storageHelpTaskTypesStart();
		}
		this.setState({types:toSelArr(this.props.taskTypes)});

		if(!this.props.companiesActive){
			this.props.storageCompaniesStart();
		}
		this.setState({companies:toSelArr(this.props.companies)});
	}

  toggle(){
    if(!this.state.opened){
			this.setState({
				title:'',
	      description:'',
				...noDef,
			})
    }
		this.props.close();
    this.setState({opened:!this.state.opened});
  }
  render(){
    return (
      <div>
          <Modal isOpen={this.state.opened}>
            <ModalHeader>  Add project </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="name">Project name</Label>
                <Input type="text" name="name" id="name" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>

              <FormGroup>
    						<Label htmlFor="description">Popis</Label>
    						<Input type="textarea" className="form-control" id="description" placeholder="Zadajte text" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})}/>
    					</FormGroup>

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
              <Button className="btn mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>

              <Button className="btn"
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
                  rebase.addToCollection('/help-projects', body)
                  .then(()=>{
										this.setState({
                    saving:false,
                    title: '',
                    description: '',
                    ...noDef
	                  });
										this.props.close();
									});
                }}>
                {this.state.saving?'Adding...':'Add project'}
              </Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}

const mapStateToProps = ({ storageHelpStatuses, storageHelpTags, storageUsers, storageHelpTaskTypes, storageCompanies }) => {
	const { statusesActive, statuses } = storageHelpStatuses;
	const { tagsActive, tags } = storageHelpTags;
	const { usersActive, users } = storageUsers;
	const { taskTypesActive, taskTypes } = storageHelpTaskTypes;
	const { companiesActive, companies } = storageCompanies;
	return { statusesActive, statuses,
		tagsActive, tags,
		usersActive, users,
		taskTypesActive, taskTypes,
		companiesActive, companies };
};

export default connect(mapStateToProps, { storageHelpStatusesStart, storageHelpTagsStart, storageUsersStart, storageHelpTaskTypesStart, storageCompaniesStart })(ProjectAdd);
