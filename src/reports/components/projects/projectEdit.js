import React, {
  Component
} from 'react';
import Select from 'react-select';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  connect
} from "react-redux";
import {
  storageHelpStatusesStart,
  storageHelpTagsStart,
  storageUsersStart,
  storageHelpTaskTypesStart,
  storageCompaniesStart,
  storageHelpProjectsStart,
  setProject,
  storageHelpTasksStart
} from '../../../redux/actions';
import {
  rebase,
  database
} from '../../../index';
import firebase from 'firebase';
import {
  toSelArr,
  sameStringForms,
  snapshotToArray
} from '../../../helperFunctions';
import {
  pickSelectStyle
} from 'configs/components/select';
import Permits from "../../../components/permissions";
import {
  noDef
} from 'configs/constants/projects';

class ProjectEdit extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      title: '',
      description: '',
      statuses: [],
      allTags: [],
      users: [],
      types: [],
      companies: [],

      ...noDef,
      saving: false,
      loaded: false,
      opened: false
    }
  }

  storageLoaded( props ) {
    return props.statusesLoaded &&
      props.tagsLoaded &&
      props.usersLoaded &&
      props.taskTypesLoaded &&
      props.companiesLoaded &&
      props.projectsLoaded &&
      props.tasksLoaded
  }

  componentWillReceiveProps( props ) {
    if ( this.props.item.id !== props.item.id || ( this.storageLoaded( props ) && !this.storageLoaded( this.props ) ) ) {
      this.setProjectsData( props );
    }
    if ( !sameStringForms( props.statuses, this.props.statuses ) &&
      !sameStringForms( props.tags, this.props.tags ) &&
      !sameStringForms( props.users, this.props.users ) &&
      !sameStringForms( props.taskTypes, this.props.taskTypes ) &&
      !sameStringForms( props.tasks, this.props.tasks ) &&
      !sameStringForms( props.companies, this.props.companies ) ) {
      this.setData( props );
    }
  }

  componentWillMount() {
    if ( !this.props.statusesActive ) {
      this.props.storageHelpStatusesStart();
    }

    if ( !this.props.tagsActive ) {
      this.props.storageHelpTagsStart();
    }

    if ( !this.props.usersActive ) {
      this.props.storageUsersStart();
    }

    if ( !this.props.taskTypesActive ) {
      this.props.storageHelpTaskTypesStart();
    }

    if ( !this.props.companiesActive ) {
      this.props.storageCompaniesStart();
    }

    if ( !this.props.tasksActive ) {
      this.props.storageHelpTasksStart();
    }

    if ( !this.props.projectsActive ) {
      this.props.storageHelpProjectsStart();
    }
    this.setProjectsData( this.props );
  }

  setProjectsData( props ) {
    if ( !this.storageLoaded( props ) ) {
      return;
    }

    let project = props.projects.find( ( project ) => project.id === props.item.id );
    let statuses = toSelArr( props.statuses );
    let allTags = toSelArr( props.tags );
    let users = toSelArr( props.users, 'email' );
    let types = toSelArr( props.taskTypes );
    let companies = toSelArr( props.companies );

    let status = statuses.find( item => project.def && item.id === project.def.status.value );
    let tags = allTags.filter( item => project.def && project.def.tags.value.includes( item.id ) );
    let assignedTo = users.filter( item => project.def && project.def.assignedTo.value.includes( item.id ) );
    let type = types.find( item => project.def && item.id === project.def.type.value );
    let requester = users.find( item => project.def && item.id === project.def.requester.value );
    let company = companies.find( item => project.def && item.id === project.def.company.value );

    this.setState( {
      title: project.title,
      description: project.description ? project.description : '',

      status: status ? {
        value: status,
        def: project.def.status.def,
        fixed: project.def.status.fixed
      } : {
        def: false,
        fixed: false,
        value: null
      },
      tags: project.def ? {
        value: tags,
        def: project.def.tags.def,
        fixed: project.def.tags.fixed
      } : {
        def: false,
        fixed: false,
        value: []
      },
      assignedTo: project.def ? {
        value: assignedTo,
        def: project.def.assignedTo.def,
        fixed: project.def.assignedTo.fixed
      } : {
        def: false,
        fixed: false,
        value: []
      },
      type: type ? {
        value: type,
        def: project.def.type.def,
        fixed: project.def.type.fixed
      } : {
        def: false,
        fixed: false,
        value: null
      },
      requester: requester ? {
        value: requester,
        def: project.def.requester.def,
        fixed: project.def.requester.fixed
      } : {
        def: false,
        fixed: false,
        value: null
      },
      company: company ? {
        value: company,
        def: project.def.company.def,
        fixed: project.def.company.fixed
      } : {
        def: false,
        fixed: false,
        value: null
      },
    } );

  }

  setData( props ) {
    if ( !this.storageLoaded( props ) ) {
      return;
    }

    this.setState( {
      statuses: toSelArr( props.statuses ),
      allTags: toSelArr( props.tags ),
      users: toSelArr( props.users, 'email' ),
      types: toSelArr( props.taskTypes ),
      companies: toSelArr( props.companies ),
    } );
  }

  toggle() {
    if ( !this.state.opened ) {
      this.setProjectsData( this.props );
    }
    this.setState( {
      opened: !this.state.opened
    } )
  }

  deleteProject() {
    let projectID = this.props.item.id;
    if ( window.confirm( "Are you sure?" ) ) {
      this.props.tasks.filter( ( task ) => task.project === projectID )
        .map( ( task ) => this.deleteTask( task ) );
      rebase.removeDoc( '/help-projects/' + projectID )
        .then( () => {
          this.toggle();
          this.props.setProject( null );
        } );
    }
  }

  deleteTask( task ) {
    let taskID = task.id;
    Promise.all(
			[
				database.collection( 'help-task_materials' )
          .where( "task", "==", taskID )
          .get(),
				database.collection( 'help-task_works' )
          .where( "task", "==", taskID )
          .get(),
				database.collection( 'help-repeats' )
          .doc( taskID )
          .get(),
				database.collection( 'help-comments' )
          .where( "task", "==", taskID )
          .get()
		] )
      .then( ( [ taskMaterials, taskWorks, repeat, comments ] ) => {

        let storageRef = firebase.storage()
          .ref();
        task.attachments.map( ( attachment ) => storageRef.child( attachment.path )
          .delete() );

        rebase.removeDoc( '/help-tasks/' + taskID );
        snapshotToArray( taskMaterials )
          .forEach( ( material ) => rebase.removeDoc( '/help-task_materials/' + material.id ) )
        snapshotToArray( taskWorks )
          .forEach( ( work ) => rebase.removeDoc( '/help-task_works/' + work.id ) )
        if ( repeat.exists ) {
          rebase.removeDoc( '/help-repeats/' + taskID );
        }
        snapshotToArray( comments )
          .forEach( ( item ) => rebase.removeDoc( '/help-comments/' + item.id ) );
      } );
  }

  render() {
    return (
      <div className='sidebar-menu-item'>
        <Button
          className='btn-link sidebar-menu-item text-left'
          onClick={this.toggle.bind(this)}
          >
          <i className="fa fa-cog m-r-5 m-l-5 "/> Project settings
        </Button>

        <Modal isOpen={this.state.opened}>
						<ModalHeader>
							Edit project
						</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Project name</Label>
                <Input type="text" className="from-control" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
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
                              styles={pickSelectStyle([ 'invisible', ])}
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
                              styles={pickSelectStyle([ 'invisible', ])}
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
                              styles={pickSelectStyle([ 'invisible', ])}
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
                              styles={pickSelectStyle([ 'invisible', ])}
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
                              styles={pickSelectStyle([ 'invisible', ])}
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
                              styles={pickSelectStyle([ 'invisible', ])}
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
							<Button className="mr-auto btn-danger" disabled={this.state.saving} onClick={this.deleteProject.bind(this)}>
								Delete
							</Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}

const mapStateToProps = ( {
  storageHelpStatuses,
  storageHelpTags,
  storageUsers,
  storageHelpTaskTypes,
  storageCompanies,
  storageHelpProjects,
  storageHelpTasks
} ) => {
  const {
    statusesActive,
    statuses,
    statusesLoaded
  } = storageHelpStatuses;
  const {
    tagsActive,
    tags,
    tagsLoaded
  } = storageHelpTags;
  const {
    usersActive,
    users,
    usersLoaded
  } = storageUsers;
  const {
    taskTypesActive,
    taskTypes,
    taskTypesLoaded
  } = storageHelpTaskTypes;
  const {
    companiesActive,
    companies,
    companiesLoaded
  } = storageCompanies;
  const {
    projectsActive,
    projects,
    projectsLoaded
  } = storageHelpProjects;
  const {
    tasksActive,
    tasks,
    tasksLoaded
  } = storageHelpTasks;
  return {
    statusesActive,
    statuses,
    statusesLoaded,
    tagsActive,
    tags,
    tagsLoaded,
    usersActive,
    users,
    usersLoaded,
    taskTypesActive,
    taskTypes,
    taskTypesLoaded,
    companiesActive,
    companies,
    companiesLoaded,
    projectsActive,
    projects,
    projectsLoaded,
    tasksActive,
    tasks,
    tasksLoaded
  };
};

export default connect( mapStateToProps, {
  storageHelpStatusesStart,
  storageHelpTagsStart,
  storageUsersStart,
  storageHelpTaskTypesStart,
  storageCompaniesStart,
  storageHelpProjectsStart,
  setProject,
  storageHelpTasksStart
} )( ProjectEdit );