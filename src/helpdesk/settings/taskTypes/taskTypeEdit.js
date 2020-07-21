import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../../index';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import { connect } from "react-redux";
import {storageHelpTaskTypesStart} from '../../../redux/actions';

let typeOptions = [{label:'Z paušálu',value:'prepaid'},{label:'Samostatný projekt',value:'project'}]

class TaskTypeEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      type:typeOptions[0],
      loading:true,
      saving:false
    }
    this.setData.bind(this);
  }

  componentWillReceiveProps(props){
    if(props.taskTypesLoaded && !this.props.taskTypesLoaded){
      this.setData(props);
    }
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(props.taskTypesLoaded){
        this.setData(props);
      }
    }
  }

  componentWillMount(){
    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    if(this.props.taskTypesLoaded){
      this.setData(this.props);
    };
  }

  setData(props){
    let data = props.taskTypes.find((item)=>item.id===props.match.params.id);
    this.setState({title:data.title,type:data.type?typeOptions.find((item)=>item.value===data.type):typeOptions[0],loading:false})
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
          {
            this.state.loading &&
            <Alert color="success">
              Loading data...
            </Alert>
          }
            <FormGroup>
              <Label for="name">Task type name</Label>
              <Input type="text" name="name" id="name" placeholder="Enter task type name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </FormGroup>

            {false && <FormGroup>
              <Label for="actionIfSelected">Type of task</Label>
              <Select
                id="actionIfSelected"
                name="Action"
                styles={selectStyle}
                options={typeOptions}
                value={this.state.type}
                onChange={e =>{ this.setState({ type: e }); }}
                  />
            </FormGroup>}

          <div className="row">
            <Button className="btn" disabled={this.state.saving} onClick={()=>{
                this.setState({saving:true});
                rebase.updateDoc('/help-task_types/'+this.props.match.params.id, {title:this.state.title, type:this.state.type.value})
                  .then(()=>{this.setState({saving:false})});
              }}>{this.state.saving?'Saving task type...':'Save task type'}</Button>

            <Button className="btn-red m-l-5"  disabled={this.state.saving} onClick={()=>{
                  if(window.confirm("Are you sure?")){
                    rebase.removeDoc('/help-task_types/'+this.props.match.params.id).then(()=>{
                      this.props.history.goBack();
                    });
                  }
              }}>Delete</Button>
          </div>
      </div>
    );
  }
}


const mapStateToProps = ({ storageHelpTaskTypes}) => {
  const { taskTypesActive, taskTypes, taskTypesLoaded } = storageHelpTaskTypes;
  return { taskTypesActive, taskTypes, taskTypesLoaded };
};

export default connect(mapStateToProps, { storageHelpTaskTypesStart })(TaskTypeEdit);
