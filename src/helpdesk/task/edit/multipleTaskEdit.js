import React, {
  Component
} from 'react';
import Select from 'react-select';
import {
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import DatePicker from 'components/DatePicker';
import moment from 'moment';
import lodash from 'lodash';

import Attachments from 'helpdesk/components/attachments';
import Comments from 'helpdesk/components/comments';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import classnames from "classnames";
import {
  toSelArr,
  sameStringForms
} from 'helperFunctions';
import {
  pickSelectStyle
} from 'configs/components/select';
import {
  REST_URL
} from 'configs/restAPI';
import booleanSelects from 'configs/constants/boolSelect'
import {
  noMilestone
} from 'configs/constants/sidebar';
import {
  noDef
} from 'configs/constants/projects';

export default class MultipleTaskEdit extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      layout: "1",

      saving: false,
      loading: true,
      addItemModal: false,
      tasks: props.tasks,

      users: [],
      companies: [],
      statuses: [],
      projects: [],
      milestones: [ noMilestone ],
      tags: [],
      taskTypes: [],

      defaultFields: noDef,
      history: [],

      project: null,
      status: null,
      type: null,
      milestone: noMilestone,
      assignedTo: [],
      requester: null,
      company: null,
      pausal: booleanSelects[ 0 ],
      deadline: null,
      repeat: null,
      overtime: booleanSelects[ 0 ],

      closeDate: null,
      pendingDate: null,
      pendingChangable: false,
      attachments: [],

      /////
      openAddStatusModal: false,
      openAddTaskModal: false,
      isColumn: false,
      search: '',
      openCopyModal: false,

      openUserAdd: false,
      openCompanyAdd: false,
      viewOnly: true,
    };
    this.setData.bind( this );
    this.storageLoaded.bind( this );
    this.renderTitle.bind( this );
    this.renderSelectsLayout1.bind( this );
    this.renderAttachments.bind( this );
    this.getHistoryMessage.bind( this );
    this.getAttributeID.bind( this );
    this.submit.bind( this );
    //    this.fetchData(this.props.match.params.taskID);
  }

  componentWillReceiveProps( props ) {
    if ( this.props.tasks !== props.tasks ) {
      this.setState( {
        tasks: props.tasks,
      } )
    }
    if (
      !sameStringForms( props.companies, this.props.companies ) ||
      !sameStringForms( props.projects, this.props.projects ) ||
      !sameStringForms( props.statuses, this.props.statuses ) ||
      !sameStringForms( props.taskTypes, this.props.taskTypes ) ||
      !sameStringForms( props.users, this.props.users ) ||
      !sameStringForms( props.milestones, this.props.milestones ) ||
      ( !this.storageLoaded( this.props ) && this.storageLoaded( props ) )
    ) {
      this.setData( props );
    }
  }

  componentWillMount() {
    if ( !this.props.companiesActive ) {
      this.props.storageCompaniesStart();
    }
    if ( !this.props.projectsActive ) {
      this.props.storageHelpProjectsStart();
    }
    if ( !this.props.statusesActive ) {
      this.props.storageHelpStatusesStart();
    }
    if ( !this.props.taskTypesActive ) {
      this.props.storageHelpTaskTypesStart();
    }
    if ( !this.props.usersActive ) {
      this.props.storageUsersStart();
    }
    if ( !this.props.milestonesActive ) {
      this.props.storageHelpMilestonesStart();
    }
    this.setData( this.props );
  }

  storageLoaded( props ) {
    return props.companiesLoaded &&
      props.projectsLoaded &&
      props.statusesLoaded &&
      props.taskTypesLoaded &&
      props.usersLoaded &&
      props.milestonesLoaded
  }

  setData( props ) {
    let prices = props.prices;
    let taskTypes = toSelArr( props.taskTypes )
      .map( ( taskType ) => {
        let newTaskType = {
          ...taskType,
          prices: prices.filter( ( price ) => price.type === taskType.id )
        }
        return newTaskType;
      } );
    this.setState( {
      statuses: toSelArr( this.props.statuses ),
      projects: toSelArr( this.props.projects ),
      users: toSelArr( this.props.users, 'email' ),
      companies: toSelArr( this.props.companies ),
      taskTypes,
      milestones: [ noMilestone, ...toSelArr( props.milestones ) ],
    } )
  }

  addToHistory( event ) {
    rebase.addToCollection( 'help-task_history', event )
      .then( ( result ) => {
        this.setState( {
          history: [ {
            ...event,
            id: Math.random()
        }, ...this.state.history ]
        } );
      } );
  }

  addNotification( originalEvent, internal ) {
    let event = {
      ...originalEvent,
      read: false
    }
    let usersToNotify = [ ...this.state.assignedTo.filter( ( user ) => !internal || this.getPermissions( user.id )
      .internal ) ];
    if ( this.state.requester && ( !internal || this.getPermissions( this.state.requester.id )
        .internal ) && !usersToNotify.some( ( user ) => user.id === this.state.requester.id ) ) {
      usersToNotify.push( this.state.requester );
    }
    usersToNotify = usersToNotify.filter( ( user ) => user.id !== this.props.currentUser.id );
    usersToNotify.forEach( ( user ) => {
      rebase.addToCollection( 'user_notifications', {
          ...event,
          user: user.id
        } )
        .then( ( newNotification ) => {
          if ( user.mailNotifications ) {
            firebase.auth()
              .currentUser.getIdToken( /* forceRefresh */ true )
              .then( ( token ) => {
                fetch( `${REST_URL}/send-notification`, {
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify( {
                      message: `<div>
                  <h4>Nové upozornenie</h4>
                  <p>Zmena: ${event.message}</p>
                  <p>V úlohe: ${event.task}: ${this.state.title}</p>
                  <p>Odkaz: https://lanhelpdesk2019.lansystems.sk/helpdesk/notifications/${newNotification.id}/${event.task}</p>
                </div>`,
                      tos: [ user.email ],
                      subject: `Upozornenie na zmenu: ${event.message}`,
                      token,
                    } ),
                  } )
                  .then( ( response ) => response.json()
                    .then( ( response ) => {
                      if ( response.error ) {}
                    } ) )
                  .catch( ( error ) => {
                    addLocalError( error );
                  } );
              } );
            //end of sending mail
          }
        } );
    } )
  }

  getHistoryMessage( type, data ) {
    let user = "Používateľ " + this.props.currentUser.userData.name + ' ' + this.props.currentUser.userData.surname;
    switch ( type ) {
      case 'status': {
        return `${user} zmenil status z ${data.oldStatus?data.oldStatus.title:''} na ${data.newStatus?data.newStatus.title:''}.`;
      }
      case 'comment': {
        return user + ' komentoval úlohu.';
      }
      default: {
        return user + ' spravil nedefinovanú zmenu.';
      }
    }
  }

  setDefaults( projectID ) {
    if ( projectID === null ) {
      this.setState( {
        defaultFields: noDef
      } );
      return;
    }
    let project = this.state.projects.find( ( proj ) => proj.id === projectID );
    let def = project.def;
    if ( !def ) {
      this.setState( {
        defaultFields: noDef
      } );
      return;
    }

    let state = this.state;

    let permissionIDs = state.project && state.project.permissions ? state.project.permissions.map( ( permission ) => permission.user ) : [];
    let assignedTo = state.assignedTo.filter( ( user ) => permissionIDs.includes( user.id ) );

    this.setState( {
      assignedTo: def.assignedTo && ( def.assignedTo.fixed || def.assignedTo.def ) ? state.users.filter( ( item ) => def.assignedTo.value.includes( item.id ) ) : assignedTo,
      company: def.company && ( def.company.fixed || def.company.def ) ? state.companies.find( ( item ) => item.id === def.company.value ) : this.state.company,
      requester: def.requester && ( def.requester.fixed || def.requester.def ) ? state.users.find( ( item ) => item.id === def.requester.value ) : this.state.requester,
      status: def.status && ( def.status.fixed || def.status.def ) ? state.statuses.find( ( item ) => item.id === def.status.value ) : state.statuses[ 0 ],
      type: def.type && ( def.type.fixed || def.type.def ) ? state.taskTypes.find( ( item ) => item.id === def.type.value ) : this.state.type,
      overtime: def.overtime && ( def.overtime.fixed || def.overtime.def ) ? booleanSelects.find( ( item ) => def.overtime.value === item.value ) : this.state.overtime,
      pausal: def.pausal && ( def.pausal.fixed || def.pausal.def ) ? booleanSelects.find( ( item ) => def.pausal.value === item.value ) : this.state.pausal,
      project,
      defaultFields: def
    } );
  }

  getAttributeID( name, task ) {
    let value = null;
    if ( this.state[ name ] ) {
      value = this.state[ name ].id;
    } else if ( task[ name ] ) {
      value = task[ name ].id;
    }
    return value;
  }

  submit() {
    const failedTasks = this.state.tasks.filter( ( task ) => task.viewOnly );
    const editedTasks = this.state.tasks.filter( ( task ) => !task.viewOnly );
    let allEdits = [];
    editedTasks.forEach( ( task, i ) => {
      let taskID = task.id;
      this.setState( {
        saving: true
      } );

      let statusAction = this.state.status ? this.state.status.action : "";
      let assignedTo = (
        this.state.assignedTo.length > 0 ?
        lodash.union( this.state.assignedTo.map( ( item ) => item.id ), task.assignedTo.map( a => a.id ) ) :
        task.assignedTo.map( a => a.id )
      )
      if ( this.state.project && this.state.project.permissions ) {
        assignedTo = assignedTo.filter( ( user ) => this.state.project.permissions.some( ( perm ) => perm.user === user ) )
      }

      let body = {
        company: this.state.company ? this.state.company.id : task.company.id,
        requester: this.getAttributeID( 'requester', task ),
        assignedTo,
        status: this.getAttributeID( 'status', task ),
        project: this.getAttributeID( 'project', task ),
        pausal: this.state.pausal ? this.state.pausal.value : task.pausal,
        overtime: this.state.overtime.value,
        type: this.state.type ? this.state.type.id : task.type,
        repeat: this.state.repeat !== null ? taskID : task.repeat,
        milestone: this.getAttributeID( 'milestone', task ),
        attachments: this.state.attachments,
        deadline: this.state.deadline !== null ? this.state.deadline.unix() * 1000 : task.deadline,
        closeDate: ( this.state.closeDate !== null && ( statusAction === 'close' || statusAction === 'invoiced' || statusAction === 'invalid' ) ) ? this.state.closeDate.unix() * 1000 : task.closeDate,
        pendingDate: ( this.state.pendingDate !== null && statusAction === 'pending' ) ? this.state.pendingDate.unix() * 1000 : task.pendingDate,
        pendingChangable: this.state.pendingChangable ? this.state.pendingChangable : task.pendingChangable,

        title: task.title ? task.title : "",
        workHours: task.workHours ? task.workHours : null,
        description: task.description ? task.description : null,
        statusChange: task.statusChange ? task.statusChange : null,
        tags: task.tags ? task.tags : null,
        invoicedDate: task.invoicedDate ? task.invoicedDate : null,
        important: task.important ? task.important : false,
        checked: false,
      }
      allEdits.push( rebase.updateDoc( '/help-tasks/' + taskID, body ) );
      if ( this.state.repeat !== null ) {
        allEdits.push(
          rebase.addToCollection( '/help-repeats', {
            ...this.state.repeat,
            task: taskID,
            startAt: ( new Date( this.state.repeat.startAt )
              .getTime() ),
          }, taskID )
        );
      }
    } );
    Promise.all( allEdits )
      .then( ( responses ) => {
        this.setState( {
          saving: false
        }, () => this.props.close() );
        if ( failedTasks.length > 0 ) {
          window.alert( `${editedTasks.length} tasks afflicted. Some tasks couln't be edited. This includes: \n` + failedTasks.reduce( ( acc, task ) => acc + `${task.id} ${task.title} \n`, '' ) )
        }
      } )
  }

  //Renders
  render() {
    return (
      <div className={classnames("scrollable", { "p-20": this.state.layout === '1'}, { "row": this.state.layout === '2'})}>

        <div className={classnames({ "task-edit-left p-l-20 p-r-20 p-b-15 p-t-15": this.state.layout === '2'})}>

          <div className="p-t-20">

            { this.renderTitle() }

            <hr className="m-t-15 m-b-10"/>

            { this.state.layout === "1" && this.renderSelectsLayout1() }

            { this.renderAttachments() }

          </div>

          { this.renderComments() }

          <div className="row">
            <button
              className="btn-link"
              onClick={()=>{this.props.close()}}
              >  Cancel
            </button>

            <button
              className="btn ml-auto"
              onClick={()=>{this.submit()}}
              >  Save
            </button>
          </div>

        </div>
        { this.state.layout === "2" && this.renderSelectsLayout2() }
      </div>
    );
  }

  renderTitle() {
    return (
      <div className="row m-b-15">
        <span className="center-hor flex m-r-15">
          Edit tasks
        </span>
        <button
          type="button"
          className="btn-link ml-auto align-self-center"
          onClick={() => this.setState({layout: (this.state.layout === "1" ? "2" : "1")})}>
          Switch layout
        </button>
      </div>

    )
  }

  renderSelectsLayout1() {
    const USERS_WITH_PERMISSIONS = this.state.users.filter( ( user ) => this.state.project && this.state.project.permissions && this.state.project.permissions.some( ( permission ) => permission.user === user.id ) );
    const REQUESTERS = ( this.state.project && this.state.project.lockedRequester ? USERS_WITH_PERMISSIONS : this.state.users );

    return (
      <div className="row">

        <div className="col-lg-12">
          <div className="col-lg-12">{/*NUTNE !! INAK AK NIE JE ZOBRAZENY ASSIGNED SELECT TAK SA VZHLAD POSUVA*/}
            <div className="col-lg-4">
              <div className="row p-r-10">
                <Label className="col-3 col-form-label">Projekt</Label>
                <div className="col-9">
                  <Select
                    placeholder="Select required"
                    value={this.state.project}
                    onChange={(project)=>{
                      this.setState({
                        milestone: noMilestone,
                      }, () => this.setDefaults(project.id) )
                    }}
                    options={this.state.projects.filter((project)=>{
                      let curr = this.props.currentUser;
                      if(curr.userData.role.value===3){
                        return true;
                      }
                      if( !project.permissions ){
                        return false;
                      }
                      let permission = project.permissions.find((permission)=>permission.user===curr.id);
                      return permission && permission.read;
                    })}
                    styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                    />
                </div>
              </div>
            </div>

            { this.state.defaultFields.assignedTo.show &&
              <div className="col-lg-8">
                <div className="row p-r-10">
                  <Label className="col-1-5 col-form-label">Add assigned</Label>
                  <div className="col-10-5">
                    <Select
                      placeholder="Select required"
                      value={this.state.assignedTo}
                      isDisabled={this.state.defaultFields.assignedTo.fixed}
                      isMulti
                      onChange={(users)=>this.setState({assignedTo:users})}
                      options={USERS_WITH_PERMISSIONS}
                      styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                      />
                  </div>
                </div>
              </div>
            }
          </div>
          <div className="col-lg-4">
            { this.state.defaultFields.status.show &&
              <div className="row p-r-10">
                <Label className="col-3 col-form-label">Status</Label>
                <div className="col-9">
                  <Select
                    placeholder="Select required"
                    value={this.state.status}
                    isDisabled={this.state.defaultFields.status.fixed}
                    styles={pickSelectStyle( [ 'invisible', 'noArrow', 'colored', 'required', ] )}
                    onChange={(status)=>{
                      if(status.action==='pending'){
                        this.setState({
                          status,
                          pendingDate:  moment().add(1,'d'),
                        })
                      }else if(status.action==='close'||status.action==='invalid'){
                        this.setState({
                          status,
                          closeDate: moment(),
                        })
                      }
                      else{
                        this.setState({status})
                      }
                    }}
                    options={this.state.statuses.filter((status)=>status.action!=='invoiced').sort((item1,item2)=>{
                      if(item1.order &&item2.order){
                        return item1.order > item2.order? 1 :-1;
                      }
                      return -1;
                    })}
                    />
                </div>
              </div>
            }
            {this.state.defaultFields.type.show &&
              <div className="row p-r-10">
                <Label className="col-3 col-form-label">Typ</Label>
                <div className="col-9">
                  <Select
                    placeholder="Select required"
                    value={this.state.type}
                    isDisabled={this.state.defaultFields.type.fixed}
                    styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                    onChange={(type)=>this.setState({type})}
                    options={this.state.taskTypes}
                    />
                </div>
              </div>
            }
            <div className="row p-r-10">
              <Label className="col-3 col-form-label">Milestone</Label>
              <div className="col-9">
                <Select
                  placeholder="None"
                  value={this.state.milestone}
                  onChange={(milestone)=> {
                    if(this.state.status.action==='pending'){
                      if(milestone.startsAt!==null){
                        this.setState({milestone,pendingDate:moment(milestone.startsAt),pendingChangable:false});
                      }else{
                        this.setState({milestone, pendingChangable:true });
                      }
                    }else{
                      this.setState({milestone});
                    }
                  }}
                  options={this.state.milestones.filter((milestone)=>milestone.id===null || (this.state.project!== null && milestone.project===this.state.project.id))}
                  styles={pickSelectStyle( [ 'invisible', 'noArrow', ] )}
                  />
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {this.state.defaultFields.requester.show &&
              <div className="row p-r-10">
                <Label className="col-3 col-form-label">Zadal</Label>
                <div className="col-9">
                  <Select
                    value={this.state.requester}
                    placeholder="Select required"
                    onChange={(requester)=>this.setState({requester})}
                    isDisabled={this.state.defaultFields.requester.fixed}
                    options={REQUESTERS}
                    styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                    />
                </div>
              </div>
            }
            {this.state.defaultFields.company.show &&
              <div className="row p-r-10">
                <Label className="col-3 col-form-label">Firma</Label>
                <div className="col-9">
                  <Select
                    value={this.state.company}
                    placeholder="Select required"
                    isDisabled={this.state.defaultFields.company.fixed}
                    onChange={(company)=>this.setState({company, pausal:parseInt(company.workPausal)>0?booleanSelects[1]:booleanSelects[0]})}
                    options={this.state.companies}
                    styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                    />
                </div>
              </div>
            }
            {this.state.defaultFields.pausal.show &&
              <div className="row p-r-10">
                <Label className="col-3 col-form-label">Paušál</Label>
                <div className="col-9">
                  <Select
                    value={this.state.pausal}
                    placeholder="Select required"
                    isDisabled={!this.state.company || parseInt(this.state.company.workPausal)===0||this.state.defaultFields.pausal.fixed}
                    styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                    onChange={(pausal)=>this.setState({pausal})}
                    options={booleanSelects}
                    />
                </div>
              </div>
            }

          </div>

          <div className="col-lg-4">
            <div className="row p-r-10">
              <Label className="col-3 col-form-label">Deadline</Label>
              <div className="col-9">
                <DatePicker
                  className="form-control hidden-input"
                  selected={this.state.deadline}
                  disabled={false}
                  onChange={date => {
                    this.setState({ deadline: date });
                  }}
                  placeholderText="No deadline"
                  />
              </div>
            </div>
            { /*
              <Repeat
              taskID={null}
              repeat={this.state.repeat}
              disabled={false}
              submitRepeat={(repeat)=>{
              if(this.state.viewOnly){
              return;
              }
              this.setState({repeat:repeat})
              }}
              deleteRepeat={()=>{
              this.setState({repeat:null})
              }}
              columns={true}
              />
              */
            }

            <div className="row p-r-10">
              <Label className="col-3 col-form-label">Mimo PH</Label>
              <div className="col-9">
                <Select
                  placeholder="Select required"
                  value={this.state.overtime}
                  styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                  onChange={(overtime)=>this.setState({overtime})}
                  options={booleanSelects}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderSelectsLayout2() {
    const USERS_WITH_PERMISSIONS = this.state.users.filter( ( user ) => this.state.project && this.state.project.permissions.some( ( permission ) => permission.user === user.id ) );
    const REQUESTERS = ( this.state.project && this.state.project.lockedRequester ? USERS_WITH_PERMISSIONS : this.state.users );

    return (
      <div className={"task-edit-right" + (this.props.columns ? " width-250" : "")} >
        <div className="">
          <Label className="col-form-label-2">Projekt</Label>
          <div className="col-form-value-2">
            <Select
              placeholder="Select required"
              value={this.state.project}
              onChange={(project)=>{
                this.setState({
                  milestone: noMilestone,
                }, () => this.setDefaults(project.id) )
              }}
              options={this.state.projects.filter((project)=>{
                let curr = this.props.currentUser;
                if(curr.userData.role.value===3){
                  return true;
                }
                if( !project.permissions ){
                  return false;
                }
                let permission = project.permissions.find((permission)=>permission.user===curr.id);
                return permission && permission.read;
              })}
              styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
              />
          </div>
        </div>

        { this.state.defaultFields.assignedTo.show &&
          <div className="">
            <Label className="col-form-label-2">Add assigned</Label>
            <div className="col-form-value-2" style={{marginLeft: "-5px"}}>
              <Select
                placeholder="Select required"
                value={this.state.assignedTo}
                isDisabled={this.state.defaultFields.assignedTo.fixed}
                isMulti
                onChange={(users)=>this.setState({assignedTo:users})}
                options={USERS_WITH_PERMISSIONS}
                styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                />
            </div>
          </div>}


          { this.state.defaultFields.status.show &&
            <div className="">
              <Label className="col-form-label-2">Status</Label>
              <div className="col-form-value-2">
                <Select
                  placeholder="Select required"
                  value={this.state.status}
                  isDisabled={this.state.defaultFields.status.fixed}
                  styles={pickSelectStyle( [ 'invisible', 'noArrow', 'colored', 'required', ] )}
                  onChange={(status)=>{
                    if(status.action==='pending'){
                      this.setState({
                        status,
                        pendingDate:  moment().add(1,'d'),
                      })
                    }else if(status.action==='close'||status.action==='invalid'){
                      this.setState({
                        status,
                        closeDate: moment(),
                      })
                    }
                    else{
                      this.setState({status})
                    }
                  }}
                  options={this.state.statuses.filter((status)=>status.action!=='invoiced').sort((item1,item2)=>{
                    if(item1.order &&item2.order){
                      return item1.order > item2.order? 1 :-1;
                    }
                    return -1;
                  })}
                  />
              </div>
            </div>}



            { this.state.defaultFields.type.show &&
              <div className=""> {/*Type*/}
                <Label className="col-form-label-2">Typ</Label>
                <div className="col-form-value-2">
                  <Select
                    placeholder="Select required"
                    value={this.state.type}
                    isDisabled={this.state.defaultFields.type.fixed}
                    styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                    onChange={(type)=>this.setState({type})}
                    options={this.state.taskTypes}
                    />
                </div>
              </div>}

              <div className=""> {/*Milestone*/}
                <Label className="col-form-label-2">Milestone</Label>
                <div className="col-form-value-2">
                  <Select
                    placeholder="None"
                    value={this.state.milestone}
                    onChange={(milestone)=> {
                      if(this.state.status.action==='pending'){
                        if(milestone.startsAt!==null){
                          this.setState({milestone,pendingDate:moment(milestone.startsAt),pendingChangable:false});
                        }else{
                          this.setState({milestone, pendingChangable:true });
                        }
                      }else{
                        this.setState({milestone});
                      }
                    }}
                    options={this.state.milestones.filter((milestone)=>milestone.id===null || (this.state.project!== null && milestone.project===this.state.project.id))}
                    styles={pickSelectStyle( [ 'invisible', 'noArrow', ] )}
                    />
                </div>
              </div>

              { this.state.defaultFields.requester.show &&
                <div className=""> {/*Requester*/}
                  <Label className="col-form-label-2">Zadal</Label>
                  <div className="col-form-value-2">
                    <Select
                      value={this.state.requester}
                      placeholder="Select required"
                      onChange={(requester)=>this.setState({requester})}
                      isDisabled={this.state.defaultFields.requester.fixed}
                      options={REQUESTERS}
                      styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                      />
                  </div>
                </div> }

                { this.state.defaultFields.company.show &&
                  <div className=""> {/*Company*/}
                    <Label className="col-form-label-2">Firma</Label>
                    <div className="col-form-value-2">
                      <Select
                        value={this.state.company}
                        placeholder="Select required"
                        isDisabled={this.state.defaultFields.company.fixed}
                        onChange={(company)=>this.setState({company, pausal:parseInt(company.workPausal)>0?booleanSelects[1]:booleanSelects[0]})}
                        options={this.state.companies}
                        styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                        />
                    </div>
                  </div>}

                  {this.state.defaultFields.pausal.show &&
                    <div className=""> {/*Pausal*/}
                      <label className="col-form-label m-l-7">Paušál</label>
                      <div className="col-form-value-2">
                        <Select
                          value={this.state.pausal}
                          placeholder="Select required"
                          isDisabled={!this.state.company || parseInt(this.state.company.workPausal)===0||this.state.defaultFields.pausal.fixed}
                          styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                          onChange={(pausal)=>this.setState({pausal})}
                          options={booleanSelects}
                          />
                      </div>
                    </div>}

                    <div className=""> {/*Deadline*/}
                      <Label className="col-form-label m-l-7">Deadline</Label>
                      <div className="col-form-value-2" style={{marginLeft: "-1px"}}>
                        <DatePicker
                          className="form-control hidden-input"
                          selected={this.state.deadline}
                          disabled={false}
                          onChange={date => {
                            this.setState({ deadline: date });
                          }}
                          placeholderText="No deadline"
                          />
                      </div>
                    </div>
                    {/*
                      <Repeat
                      taskID={null}
                      repeat={this.state.repeat}
                      disabled={false}
                      submitRepeat={(repeat)=>{
                      if(this.state.viewOnly){
                      return;
                      }
                      this.setState({repeat:repeat})
                      }}
                      deleteRepeat={()=>{
                      this.setState({repeat:null})
                      }}
                      columns={true}
                      />
                      */}
                      {this.state.defaultFields.overtime.show &&
                        <div className=""> {/*Overtime*/}
                          <label className="col-form-label-2">Mimo PH</label>
                          <div className="col-form-value-2">
                            <Select
                              placeholder="Select required"
                              value={this.state.overtime}
                              styles={pickSelectStyle( [ 'invisible', 'noArrow', 'required', ] )}
                              onChange={(overtime)=>this.setState({overtime})}
                              options={booleanSelects}
                              />
                          </div>
                        </div>}
                      </div>
    )
  }

  renderAttachments() {
    return (
      <Attachments
                        taskID={null}
                        attachments={this.state.attachments}
                        addAttachments={(newAttachments)=>{
                          let time = (new Date()).getTime();
                          newAttachments=newAttachments.map((attachment)=>{
                            return {
                              title:attachment.name,
                              size:attachment.size,
                              time,
                              data:attachment
                            }
                          });
                          this.setState({attachments:[...this.state.attachments,...newAttachments]});
                        }}
                        removeAttachment={(attachment)=>{
                          let newAttachments = [...this.state.attachments];
                          newAttachments.splice(newAttachments.findIndex((item)=>item.title===attachment.title && item.size===attachment.size && item.time===attachment.time),1);
                          this.setState({attachments:newAttachments});
                        }}
                        />
    )
  }

  renderComments() {
    let permission = null;
    if ( this.state.project && this.state.project.permissions ) {
      permission = this.state.project.permissions.find( ( permission ) => permission.user === this.props.currentUser.id );
    }
    if ( !permission ) {
      permission = {
        user: this.props.currentUser.id,
        read: false,
        write: false,
        delete: false,
        internal: false,
        isAdmin: false
      };
    }

    return (
      <div className="comments">
                        <Nav tabs className="no-border m-b-22 m-l--10 m-t-15">
                          <NavItem>
                            <NavLink
                              className={classnames({ active: true}, "clickable", "")}
                              >
                              Komentáre
                            </NavLink>
                          </NavItem>
                        </Nav>

                        <TabContent activeTab={"1"}>
                          <TabPane tabId="1">
                            <Comments
                              id={this.state.tasks.map(task => task.id)}
                              isMulti={true}
                              showInternal={permission.internal || this.props.currentUser.userData.role.value > 1 }
                              users={this.state.users}
                              addToHistory={(internal)=>{
                                let time = (new Date()).getTime();
                                let mess = this.getHistoryMessage('comment');
                                this.state.tasks.forEach((task, i) => {
                                  let event = {
                                    message: mess,
                                    createdAt: time,
                                    task: task.id
                                  };
                                  this.addToHistory(event);
                                  this.addNotification(event,internal);
                                });
                              }}
                              />
                          </TabPane>
                        </TabContent>
                      </div>
    )
  }

}