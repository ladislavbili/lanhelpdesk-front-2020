import React, { Component } from 'react';
import Select from 'react-select';
import { Button, FormGroup, Label, Input,Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { storageHelpProjectsStart, storageHelpFiltersStart } from 'redux/actions';
import {toSelArr} from 'helperFunctions';
import Checkbox from 'components/checkbox';
import {selectStyle} from 'configs/components/select';
import {rebase} from 'index';
import { connect } from "react-redux";
import { roles } from 'configs/constants/roles';

class FilterAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      public:false,
      global:false,
      dashboard:false,
      project:null,
      roles: [],

      saving:false,
      opened:false
    }
  }

  componentWillReceiveProps(props){
    if(!this.props.projectsLoaded && props.projectsLoaded){
      this.setState({
        project: this.state.opened && props.filterID && props.filterData.project ? toSelArr(props.projects).find((project)=>project.id===props.filterData.project):null,
      })
    }
  }

  toggle(){
    if(!this.state.opened && this.props.filterID){
      const filterData = this.props.filterData;
      this.setState({
        title: filterData.title,
        public: filterData.public,
        global: filterData.global ? filterData.global : false,
        dashboard: filterData.dashboard ? filterData.dashboard : false,
        project: filterData.project ? toSelArr(this.props.projects).find((project) => project.id === filterData.project) : null,
        roles: toSelArr(roles).filter( (role) => filterData.roles.includes( role.id ) )
      });
    }
    this.setState({opened:!this.state.opened})
  }

  componentWillMount(){
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }
    if(!this.props.filtersActive){
      this.props.storageHelpFiltersStart();
    }
  }

  render(){
    return (
      <div>
        <Button className="btn-link-reversed m-2" onClick={this.toggle.bind(this)}>
          <i className="far fa-save icon-M"/>
        </Button>

        <Modal style={{width: "800px"}} isOpen={this.state.opened}>
          <ModalHeader>
            Add filter
          </ModalHeader>
          <ModalBody>
            <FormGroup className="m-t-15">
              <Label>Filter name</Label>
              <Input type="text" className="from-control" placeholder="Enter filter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </FormGroup>

            { this.props.currentUser.userData.role.value > 1 &&
              <Checkbox
                className = "m-l-5 m-r-5"
                label = "Public (everyone see this filter)"
                value = { this.state.public }
                onChange={(e)=>this.setState({public:!this.state.public })}
                />
            }

            { this.props.currentUser.userData.role.value > 1 && this.state.public &&
              <FormGroup>{/* Roles */}
                <Label className="">Roles</Label>
                <Select
                  placeholder="Choose roles"
                  value={this.state.roles}
                  isMulti
                  onChange={(newRoles)=>{
                    if(newRoles.some((role) => role.id === 'all' )){
                      if( this.state.roles.length === roles.length ){
                        this.setState({ roles: [] })
                      }else{
                        this.setState({ roles: toSelArr(roles) })
                      }
                    }else{
                      this.setState({roles: newRoles})
                    }
                  }}
                  options={toSelArr([{id: 'all', title: this.state.roles.length === roles.length ? 'Clear' : 'All' }].concat(roles))}
                  styles={selectStyle}
                  />
              </FormGroup>
            }

            <Checkbox
              className = "m-l-5 m-r-5"
              label = "Global (shown in all projects)"
              value = { this.state.global }
              onChange={(e)=>this.setState({global:!this.state.global })}
              />

            <div className="m-b-10">
              <Label className="form-label">Projekt</Label>
              <Select
                placeholder="Vyberte projekt"
                value={this.state.project}
                isDisabled={this.state.global}
                onChange={(project)=> {
                  this.setState({project});
                }}
                options={toSelArr(this.props.projects).filter((project)=>{
                  let curr = this.props.currentUser;
                  if(curr.userData && curr.userData.role.value===3){
                    return true;
                  }
                  if( project.permissions === undefined ) return false;
                  let permission = project.permissions.find((permission)=>permission.user===curr.id);
                  return permission && permission.read;
                })}
                styles={selectStyle}
                />
            </div>

            <Checkbox
              className = "m-l-5 m-r-5"
              label = "Dashboard (shown in dashboard)"
              value = { this.state.dashboard }
              onChange={(e)=>this.setState({dashboard:!this.state.dashboard })}
              />

          </ModalBody>
          <ModalFooter>
            <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
              Close
            </Button>


            <Button
              className="btn"
              disabled={this.state.saving||this.state.title===""||(!this.state.global && this.state.project===null)}
              onClick={()=>{
                this.setState({saving:true});
                if(this.props.filterID!==null){
                  rebase.updateDoc('/help-filters/'+this.props.filterID, {
                    title: this.state.title,
                    filter:this.props.filter,
                    public:this.state.public,
                    global:this.state.global,
                    dashboard:this.state.dashboard,
                    project:this.state.project!==null?this.state.project.id:null,
                    roles: this.state.roles.map( (role) => role.id ),
                  })
                  .then(()=> {
                    this.setState({title:'',public:false,saving:false});
                    this.toggle();
                  });
                }else{
                  rebase.addToCollection('/help-filters', {
                    title: this.state.title,
                    createdBy:this.props.currentUser.id,
                    order:this.state.public ? this.props.filters.filter((filter)=>filter.public).length : null,
                    filter: this.props.filter,
                    public:this.state.public,
                    global:this.state.global,
                    dashboard:this.state.dashboard,
                    project:this.state.project!==null?this.state.project.id:null,
                    roles: this.state.roles.map( (role) => role.id ),
                  })
                  .then((resp) => {
                    this.setState({title:'',public:false,global:false,dashboard:false,project:null,saving:false});
                    this.toggle();
                  });
                }
              }}>{this.props.filterID!==null?(this.state.saving?'Saving...':'Save filter'):(this.state.saving?'Adding...':'Add filter')}</Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    }
  }

  const mapStateToProps = ({ userReducer, storageHelpProjects, storageHelpFilters }) => {
    const { projectsActive, projects, projectsLoaded } = storageHelpProjects;
    const { filtersActive, filters, filtersLoaded } = storageHelpFilters;

    return {
      currentUser:userReducer,
      projectsActive, projects, projectsLoaded,
      filtersActive, filters, filtersLoaded
    };
  };

  export default connect(mapStateToProps, { storageHelpProjectsStart, storageHelpFiltersStart })(FilterAdd);
