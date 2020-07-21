import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../../index';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import { connect } from "react-redux";
import {storageHelpWorkTypesStart} from '../../../redux/actions';

let typeOptions = [{label:'Paušál hodín',value:'work'},{label:'Paušál výjazdov',value:'trip'}]

class WorkTypeEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      loading:true,
      saving:false,
      type:typeOptions[0],
    }
    this.setData.bind(this);
  }

  componentWillReceiveProps(props){
    if(props.workTypesLoaded && !this.props.workTypesLoaded){
      this.setData(props);
    }
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(props.workTypesLoaded){
        this.setData(props);
      }
    }
  }

  componentWillMount(){
    if(!this.props.workTypesActive){
      this.props.storageHelpWorkTypesStart();
    }
    if(this.props.workTypesLoaded){
      this.setData(this.props);
    };
  }

  setData(props){
    let data = props.workTypes.find((item)=>item.id===props.match.params.id);
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
            <Label for="name">WorkType name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter work type name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label for="actionIfSelected">Type of work</Label>
            <Select
              id="actionIfSelected"
              name="Action"
              styles={selectStyle}
              options={typeOptions}
              value={this.state.type}
              onChange={e =>{ this.setState({ type: e }); }}
                />
          </FormGroup>

          <div className="row">
            <Button className="btn " disabled={this.state.saving} onClick={()=>{
                this.setState({saving:true});
                rebase.updateDoc('/help-work_types/'+this.props.match.params.id, {title:this.state.title,type:this.state.type.value})
                  .then(()=>{this.setState({saving:false})});
              }}>{this.state.saving?'Saving work type...':'Save work type'}</Button>

            <Button className="btn-red m-l-5" disabled={this.state.saving} onClick={()=>{
                if(window.confirm("Are you sure?")){
                  rebase.removeDoc('/help-work_types/'+this.props.match.params.id).then(()=>{
                    this.props.history.goBack();
                  });
                }
            }}>Delete</Button>
         </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpWorkTypes}) => {
  const { workTypesActive, workTypes, workTypesLoaded } = storageHelpWorkTypes;
  return { workTypesActive, workTypes, workTypesLoaded };
};

export default connect(mapStateToProps, { storageHelpWorkTypesStart })(WorkTypeEdit);
