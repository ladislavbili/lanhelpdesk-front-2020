import React, { Component } from 'react';
import { connect } from "react-redux";
import {storageHelpStatusesStart, storageHelpTagsStart, storageUsersStart, storageHelpTaskTypesStart, storageCompaniesStart} from '../../../redux/actions';
import { Button, FormGroup, Label,Input, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';
import {toSelArr, sameStringForms, testing} from '../../../helperFunctions';
import {rebase} from '../../../index';
import Permissions from "./permissions";
import ProjectDefaultValues from './defaultValues';
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
			permissions:[],
			lockedRequester: true,

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
		if(props.usersLoaded && !this.props.usersLoaded){
			this.setState({permissions:this.state.permissions.length===0?[{user:toSelArr(props.users,'email').find((user)=>user.id===this.props.currentUser.id),read:true,write:true,delete:true,internal:true, isAdmin:true}]:this.state.permissions});
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
		this.setState({users:toSelArr(this.props.users,'email'),permissions:this.state.permissions.length===0?[{user:toSelArr(this.props.users,'email').find((user)=>user.id===this.props.currentUser.id),read:true,write:true,delete:true,internal:true, isAdmin:true}]:this.state.permissions});

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
		let canReadUserIDs = this.state.permissions.map((permission)=>permission.user.id);
		let canBeAssigned = this.state.users.filter((user)=>canReadUserIDs.includes(user.id))

    return (
      <div>
          <Modal isOpen={this.state.opened}  >
            <ModalHeader>Add project</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="name">Project name</Label>
                <Input type="text" name="name" id="name" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>

              <FormGroup>
    						<Label htmlFor="description">Popis</Label>
    						<Input type="textarea" className="form-control" id="description" placeholder="Zadajte text" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})}/>
    					</FormGroup>
							<Permissions
								addUser={(user)=>{
									this.setState({
										permissions:[...this.state.permissions,{user,read:true,write:false,delete:false,internal:false,isAdmin:false}]
									})
								}}
								givePermission={(user,permission)=>{
									let permissions=[...this.state.permissions];
									let index = permissions.findIndex((permission)=>permission.user.id===user.id);
									let item = permissions[index];
									item.read=permission.read;
									item.write=permission.write;
									item.delete=permission.delete;
									item.internal=permission.internal;
									item.isAdmin=permission.isAdmin;
									if(!item.read){
										permissions.splice(index,1);
										this.setState({permissions,assignedTo:{...this.state.assignedTo,value:this.state.assignedTo.value.filter((user)=>user.id!==item.user.id)}});
									}else{
										this.setState({permissions});
									}
								}}
								permissions={this.state.permissions}
								userID={this.props.currentUser.id}
								isAdmin={this.props.currentUser.userData.role.value===3||testing}
								lockedRequester={this.state.lockedRequester}
								lockRequester={() => this.setState({lockedRequester: !this.state.lockedRequester})}
								/>

								<ProjectDefaultValues
									updateState={(newState)=>this.setState(newState)}
									state={this.state}
									canBeAssigned={canBeAssigned}
									/>

            </ModalBody>

            <ModalFooter>
              <Button className="btn-link mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>

              <Button className="btn"
                disabled={this.state.saving||this.state.title===""||(this.state.company.value===null&&this.state.company.fixed)||(this.state.status.value===null&&this.state.status.fixed)||(this.state.assignedTo.value.length===0 && this.state.assignedTo.fixed)||(this.state.type.value===null&&this.state.type.fixed)}
                onClick={()=>{
                  this.setState({saving:true});
                  let body = {
                    title: this.state.title,
                    description: this.state.description,
										permissions:this.state.permissions.map((permission)=>{
											return {
												...permission,
												user:permission.user.id,
											}
										}),
										lockedRequester: this.state.lockedRequester,
                    def:{
                      status:this.state.status.value?{...this.state.status,value:this.state.status.value.id}:{def:false,fixed:false, value: null, show:true},
                      tags:this.state.tags.value?{...this.state.tags,value:this.state.tags.value.map(item=>item.id)}:{def:false,fixed:false, value: [], show:true},
                      assignedTo:this.state.assignedTo.value?{...this.state.assignedTo,value:this.state.assignedTo.value.map(item=>item.id)}:{def:false,fixed:false, value: [], show:true},
                      type:this.state.type.value?{...this.state.type,value:this.state.type.value.id}:{def:false,fixed:false, value: null, show:true},
                      requester:this.state.requester.value?{...this.state.requester,value:this.state.requester.value.id}:{def:false,fixed:false, value: null, show:true},
                      company:this.state.company.value?{...this.state.company,value:this.state.company.value.id}:{def:false,fixed:false, value: null, show:true},
											pausal:this.state.pausal.value?{...this.state.pausal,value:this.state.pausal.value.value}:{def:false,fixed:false, value: false, show:true},
											overtime:this.state.overtime.value?{...this.state.overtime,value:this.state.overtime.value.value}:{def:false,fixed:false, value: false, show:true},
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

const mapStateToProps = ({ storageHelpStatuses, storageHelpTags, storageUsers, storageHelpTaskTypes, storageCompanies, userReducer }) => {
	const { statusesActive, statuses } = storageHelpStatuses;
	const { tagsActive, tags } = storageHelpTags;
	const { usersActive, users } = storageUsers;
	const { taskTypesActive, taskTypes } = storageHelpTaskTypes;
	const { companiesActive, companies } = storageCompanies;
	return { currentUser:userReducer,
		statusesActive, statuses,
		tagsActive, tags,
		usersActive, users,
		taskTypesActive, taskTypes,
		companiesActive, companies };
};

export default connect(mapStateToProps, { storageHelpStatusesStart, storageHelpTagsStart, storageUsersStart, storageHelpTaskTypesStart, storageCompaniesStart })(ProjectAdd);
