import React, { Component } from 'react';
import Select from 'react-select';
import { Button, FormGroup, Label, Input,Modal, ModalBody, ModalFooter } from 'reactstrap';
import { storageHelpProjectsStart, storageHelpFiltersStart } from '../../redux/actions';
import { toSelArr, sameStringForms } from '../../helperFunctions';
import Checkbox from '../../components/checkbox';
import {selectStyle} from 'configs/components/select';
import {rebase} from '../../index';
import { connect } from "react-redux";

class FilterAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      public:false,
      global:false,
      dashboard:false,
      project:null,
      order:0,
      filters:[],

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
    if(!this.props.filtersLoaded && props.filtersLoaded || !sameStringForms(this.props.filters, props.filters)){
      this.setState({filters:props.filters});
    }
  }

  toggle(){
    if(!this.state.opened){
      if(this.props.filterID){
        this.setState({
          title:this.props.filterData.title,
          public:this.props.filterData.public,
          global:this.props.filterData.global?this.props.filterData.global:false,
          dashboard:this.props.filterData.dashboard?this.props.filterData.dashboard:false,
          project:this.props.filterData.project?toSelArr(this.props.projects).find((project)=>project.id===this.props.filterData.project):null,
          order:this.props.filterData.public?this.props.filterData.order: this.props.filters.filter((filter)=>filter.public).length,
        });
      }else{
        this.setState({order:this.props.filters.filter((filter)=>filter.public).length})
      }
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
    if(this.props.filtersLoaded){
      this.setState({filters:this.props.filters})
    }
  }

  submitFilter(){
    this.setState({saving:true});
    let body = {
      title: this.state.title,
      filter:this.props.filter,
      public:this.state.public,
      global:this.state.global,
      dashboard:this.state.dashboard,
      project:this.state.project!==null?this.state.project.id:null,
      order:this.state.order,
    }

    if(this.props.filterID!==null){
      //update
      if(!this.state.public){
        if(this.props.filterData.public){
          //posun vsetky s vacsim orderom o jeden hore
          this.props.filters.filter((filter)=> filter.public && filter.order > this.props.filterData.order).forEach((filter)=>rebase.updateDoc('/help-filters/'+filter.id, {order:filter.order - 1} ))
        }
        //uloz zmeny
        rebase.updateDoc('/help-filters/'+this.props.filterID, body ).then(() => {
          this.setState({title:'',public:false,saving:false});
          this.toggle();
        });
      }else{

      }
    }else{
      //add
      rebase.addToCollection('/help-filters', { ...body, createdBy:this.props.currentUser.id })
      .then(()=> {
        this.setState({title:'',public:false,global:false,dashboard:false,project:null,saving:false});
        this.toggle();
      });
    }
  }

  render(){
    let publicFilters = this.state.filters.filter((filter)=>filter.public).concat(this.props.filterID !== null && this.props.filterData.public ? [] : [{
      title: this.state.title,
      createdBy:this.props.currentUser.id,
      filter: this.props.filter,
      public:this.state.public,
      global:this.state.global,
      dashboard:this.state.dashboard,
      project:this.state.project!==null?this.state.project.id:null,
      order: this.state.order,
    }]).sort((item1,item2)=> item1.order > item2.order ? 1 : -1 );

    return (
      <div>
        <Button className="btn-link-reversed m-2" onClick={this.toggle.bind(this)}>
          <i className="far fa-save icon-M"/>
        </Button>

        <Modal style={{width: "800px"}} isOpen={this.state.opened} toggle={this.toggle.bind(this)} >
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
            {
              this.props.currentUser.userData.role.value > 1 && this.state.public &&
              <div>
                <h3>Public filter order</h3>
                <table className="table flex">
                  <tbody>
                    { publicFilters.map((filter, index )=>
                      <tr key={filter.id}>
                        <td className="flex">
                          { filter.id === this.props.filterID ? this.state.title : filter.title }
                        </td>
                        <td width="150" className='row'>
                          <button
                            className="btn waves-effect"
                            disabled={filter.order === 0}
                            onClick={()=>{
                              let filters = [...this.state.filters];
                              let currentIndex = filters.findIndex((item)=> item.id === filter.id );
                              let targetIndex = filters.findIndex((item)=> item.order === filter.order - 1 );
                              if(currentIndex === -1){
                                this.setState({order:filters[targetIndex].order })
                                filters[targetIndex].order++;
                              }
                              else if(targetIndex === - 1){
                                this.setState({order:filters[currentIndex].order })
                                filters[currentIndex].order--;
                              }else{
                                filters[targetIndex].order++;
                                filters[currentIndex].order--;
                                let item = {...filters[currentIndex]};
                                filters[currentIndex] = filters[targetIndex];
                                filters[targetIndex] = item;
                              }
                              this.setState({filters})
                            }}
                            >
                            <i className="fa fa-arrow-up"  />
                          </button>
                          <button
                            className="btn waves-effect"
                            disabled={filter.order === publicFilters.length - 1}
                            onClick={()=>{
                              let filters = [...this.state.filters];
                              let currentIndex = filters.findIndex((item)=> item.id === filter.id );
                              let targetIndex = filters.findIndex((item)=> item.order === filter.order + 1 );
                              if(currentIndex === -1){
                                this.setState({order: filters[targetIndex].order })
                                filters[targetIndex].order--;
                              }
                              else if(targetIndex === - 1){
                                this.setState({order: filters[currentIndex].order })
                                filters[currentIndex].order++;
                              }else{
                                filters[targetIndex].order--;
                                filters[currentIndex].order++;
                                let item = {...filters[currentIndex]};
                                filters[currentIndex] = filters[targetIndex];
                                filters[targetIndex] = item;
                              }
                              this.setState({filters})
                            }}
                            >
                            <i className="fa fa-arrow-down"  />
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
              disabled={this.state.saving||this.state.title===""||(!this.state.global && this.state.project===null)||!this.props.filtersLoaded}
              onClick={this.submitFilter.bind(this)}>{this.props.filterID!==null?(this.state.saving?'Saving...':'Save filter'):(this.state.saving?'Adding...':'Add filter')}</Button>

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

      filtersActive,filters, filtersLoaded,
      projectsActive, projects, projectsLoaded
    };
  };

  export default connect(mapStateToProps, { storageHelpProjectsStart, storageHelpFiltersStart })(FilterAdd);
