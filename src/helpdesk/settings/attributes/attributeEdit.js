import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, Alert } from 'reactstrap';

import { connect } from "react-redux";
import Select from 'react-select';
import {selectStyle} from 'configs/components/select';
import { toSelArr } from 'helperFunctions';
import { ATTRIBUTES, ROLES, TYPES } from './fakeData';
import {storageUsersStart, storageHelpStatusesStart, storageHelpProjectsStart, storageHelpTaskTypesStart} from '../../../redux/actions';

class AttributeEdit extends Component{
  constructor(props){
    super(props);
    this.state = {
      title: "",
      view: [],
      edit: [],
      created: null,
      type: null,

      selectValuesType: "",

      newValue: "",
      selectValues: [],

      defaultSelectValue: null,
      defaultMultiselectValue: [],
      defaultNumberValue: 0,

      loading: true,
      saving: false,
      deleting: false,

      users: [],
    }
    this.fakeID = 0;

    this.storageLoaded.bind(this);
    this.setData.bind(this);
    this.cantSaveAttribute.bind(this);
    this.deleteAttribute.bind(this);
    this.submit.bind(this);
  }

  storageLoaded(props){
    return props.usersLoaded &&
    props.statusesLoaded &&
    props.projectsLoaded &&
    props.taskTypesLoaded;
  }

  componentWillReceiveProps(props){
    if(this.storageLoaded(props) && !this.storageLoaded(this.props)){
      this.setData(props);
    }
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(this.storageLoaded(props)){
        this.setData(props);
      }
    }
  }

  componentWillMount(){
    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }
    if(!this.props.statusesActive){
      this.props.storageHelpStatusesStart();
    }
		if(!this.props.projectsActive){
			this.props.storageHelpProjectsStart();
		}
    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    };
  }

  setData(props){
    if( !this.storageLoaded(props) ){
      return;
    }

    let attribute = ATTRIBUTES.find(attr => attr.id === props.match.params.id);

    let selectValues = [];
    if (attribute.selectValues){
      selectValues = toSelArr(attribute.selectValues);
    } else if (attribute.selectValuesType === 'users') {
      selectValues = props.users.map((item)=>{return {...item, value: item.id, label: item.username}});
    } else if (attribute.selectValuesType === 'statuses') {
      selectValues = toSelArr(props.statuses);
    } else if (attribute.selectValuesType === 'projects') {
      selectValues = toSelArr(props.projects);
    } else if (attribute.selectValuesType === 'taskTypes') {
      selectValues = toSelArr(props.taskTypes);
    }

    this.setState({
      title: attribute.title ? attribute.title : "",
      view: attribute.view ? attribute.view : [],
      edit: attribute.edit ? attribute.edit : [],
      created: attribute.created ? attribute.created : null,
      type: attribute.type ? attribute.type : null,

      selectValues,

      defaultSelectValue: attribute.defaultSelectValue ? attribute.defaultSelectValue : null,
      defaultMultiselectValue: attribute.defaultMultiselectValue ? attribute.defaultMultiselectValue : [],
      defaultNumberValue: attribute.defaultNumberValue ? attribute.defaultNumberValue :  0,

      loading: false,

      users: props.users.map((item)=>{return {...item, value: item.id, label: item.username}}),
    });
  }

  cantSaveAttribute(){
    return this.state.saving || this.state.loading || this.state.title === ""
  }

  deleteAttribute(){
    if(window.confirm("Are you sure?")){
      this.setState({ deleting: true })
    }
  }

  submit(){
    this.setState({ saving: true })
  }



  render(){
    if( !this.storageLoaded(this.props) ){
      return <Alert color="success">
        Loading data...
      </Alert>
    }

    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        <FormGroup> {/* Title */}
          <Label for="attribute">Attribute name</Label>
          <Input
            name="name"
            id="attribute"
            type="text"
            placeholder="Enter attribute name"
            value={this.state.title}
            onChange={(e)=>{
              this.setState({title: e.target.value})
            }}
            />
        </FormGroup>

        <FormGroup>{/* View */}
          <Label className="form-label">View rights</Label>
          <Select
            placeholder="Choose roles"
            value={this.state.view}
            isMulti
            onChange={(view)=> {
              this.setState({ view });
            }}
            options={ROLES}
            styles={selectStyle}
            />

        </FormGroup>

        <div className="m-b-10">{/* Edit */}
          <Label className="form-label">Edit rights</Label>
          <Select
            placeholder="Choose roles"
            value={this.state.edit}
            isMulti
            onChange={(edit)=> {
              this.setState({ edit });
            }}
            options={ROLES}
            styles={selectStyle}
            />
        </div>

        <div className="m-b-10">{/* Created */}
          <Label className="form-label">Created</Label>
          <Select
            placeholder="Choose user"
            value={this.state.created}
            onChange={(created)=> {
              this.setState({ created });
            }}
            options={this.state.users}
            styles={selectStyle}
            />
        </div>

        <FormGroup>{/* Typ */}
          <Label className="form-label">Type</Label>
          <Select
            placeholder="Choose type"
            value={this.state.type}
            onChange={(type)=>{
              this.setState({type});
            }}
            options={TYPES}
            styles={selectStyle}
            />
        </FormGroup>

        { this.state.type && (this.state.type.title === "Select" || this.state.type.title === "Multiselect" ) &&
          <div>
            <hr className="m-t-10 m-b-10"/>

            <FormGroup> {/* New select value */}
              <Label for="newValue">New value</Label>
              <div className="row">
                <div className="w-95 m-r-5">
                  <Input
                    name="name"
                    id="newValue"
                    type="text"
                    placeholder="Enter new value"
                    value={this.state.newValue}
                    onChange={(e)=>{
                      this.setState({newValue: e.target.value})
                    }}
                    />
                </div>
                <div>
                  <Button
                    className="btn"
                    onClick={() => {
                      let value = {title: this.state.newValue, id: this.fakeID++}
                      let newSelectValues = [...this.state.selectValues, value];
                      this.setState({
                        selectValues: newSelectValues,
                        newValue: "",
                      })
                    } }>
                    Add
                  </Button>
                </div>
              </div>
            </FormGroup>
            {this.state.selectValues.length > 0 &&
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th width="95%"> Title </th>
                    <th >  </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.selectValues.map((value)=>
                    <tr
                      key={value.id}
                      style={{whiteSpace: "nowrap",  overflow: "hidden"}}>
                      <td
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {value.title ? value.title : value.username}
                      </td>
                      <td
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        <i
                          className="far fa-trash-alt clickable"
                          onClick={() => {
                            let newSelectValues = this.state.selectValues.filter(val => val.id !== value.id);
                            let newDefaultMultiselectValue = this.state.defaultMultiselectValue.filter(val => val.id !== value.id);
                            this.setState({
                              selectValues: newSelectValues,
                              defaultMultiselectValue: newDefaultMultiselectValue,
                              defaultSelectValue: ((this.state.defaultSelectValue && this.state.defaultSelectValue.id === value.id) ? null : this.state.defaultSelectValue),
                            })
                          }}
                          />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            }
            {this.state.type.title === 'Select' &&
              <FormGroup>{/* Default value */}
                <label htmlFor="example-input-small">Default Value</label>
                <Select
                  options={this.state.selectValues}
                  onChange={(defaultSelectValue) => this.setState({defaultSelectValue})}
                  value={this.state.defaultSelectValue}
                  styles={selectStyle} />
              </FormGroup>
            }
            {this.state.type.title === 'Multiselect' &&
              <FormGroup>{/* Default values */}
                <label htmlFor="example-input-small">Default Values</label>
                <Select
                  options={this.state.selectValues}
                  isMulti
                  onChange={(defaultMultiselectValue) => this.setState({defaultMultiselectValue})}
                  value={this.state.defaultMultiselectValue}
                  styles={selectStyle} />
              </FormGroup>
            }
          </div>
        }

        {this.state.type && this.state.type.title === "Number" &&
          <div>
            <hr className="m-t-10 m-b-10"/>
            <FormGroup> {/* Default number value */}
              <Label for="newValue">Default value</Label>
              <Input
                name="name"
                id="newValue"
                type="number"
                placeholder="Enter new value"
                value={this.state.defaultNumberValue}
                onChange={(e)=>{
                  this.setState({defaultNumberValue: e.target.value})
                }}
                />
            </FormGroup>
          </div>
        }

        <div className="row">
          <Button className="btn" disabled={this.cantSaveAttribute()} onClick={this.submit.bind(this)}>{this.state.saving?'Saving...':'Save attribute'}</Button>
          <Button className="btn btn-red m-l-5" disabled={this.state.deleting} onClick={this.deleteAttribute.bind(this)}>{this.state.deleting ? 'Deleting...':'Delete attribute'}</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageUsers, storageHelpStatuses, storageHelpProjects, storageHelpTaskTypes}) => {
  const { usersActive, users, usersLoaded } = storageUsers;
    const { statusesActive, statuses, statusesLoaded } = storageHelpStatuses;
  	const { projectsActive, projects, projectsLoaded } = storageHelpProjects;
      const { taskTypesActive, taskTypes, taskTypesLoaded } = storageHelpTaskTypes;
  return { usersActive, users, usersLoaded,
    statusesActive, statuses, statusesLoaded,
    projectsActive, projects, projectsLoaded,
    taskTypesActive, taskTypes, taskTypesLoaded};
};

export default connect(mapStateToProps, { storageUsersStart, storageHelpStatusesStart, storageHelpProjectsStart, storageHelpTaskTypesStart})(AttributeEdit);
