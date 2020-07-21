import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../../index';
import { SketchPicker } from "react-color";
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import { connect } from "react-redux";
import {storageHelpStatusesStart} from '../../../redux/actions';
import { actions } from 'configs/constants/statuses';

class StatusEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      color:'FFF',
      icon: '',
      order: 0,
      loading:true,
      saving:false,
      action:actions[0]
    }
    this.setData.bind(this);
  }

  componentWillReceiveProps(props){
    if(props.statusesLoaded && !this.props.statusesLoaded){
      this.setData(props);
    }
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(props.statusesLoaded){
        this.setData(props);
      }
    }
  }

  componentWillMount(){
    if(!this.props.statusesActive){
      this.props.storageHelpStatusesStart();
    }
    if(this.props.statusesLoaded){
      this.setData(this.props);
    };
  }

  setData(props){
    let data = props.statuses.find((status)=>status.id===props.match.params.id);
    let action = actions.concat([{label:'Invoiced (only one needed, but necessary)',value:'invoiced'}]).find((action)=>action.value===data.action);
    if(!action){
      action = actions[0];
    }
    this.setState({
      title:data.title,
      color:data.color?data.color:'FFF',
      icon:data.icon?data.icon:'',
      loading:false,
      order:data.order?data.order:0,
      action
    })
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
          <Label for="name">Status name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter status name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="name">Icon</Label>
          <Input type="text" name="name" id="name" placeholder="fas fa-arrow-left" value={this.state.icon} onChange={(e)=>this.setState({icon:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="order">Order</Label>
          <Input type="number" name="order" id="order" placeholder="Lower means first" value={this.state.order} onChange={(e)=>this.setState({order:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="actionIfSelected">Action if selected</Label>
          <Select
            id="actionIfSelected"
            name="Action"
            styles={selectStyle}
            isDisabled={this.state.action.value==='invoiced'}
            options={this.state.action.value==='invoiced'?actions.concat([{label:'Invoiced (only one needed, but necessary)',value:'invoiced'}]):actions}
            value={this.state.action}
            onChange={e =>{ this.setState({ action: e }); }}
              />
        </FormGroup>
        <SketchPicker
          id="color"
          color={this.state.color}
          onChangeComplete={value => this.setState({ color: value.hex })}
          />

        <div className="row">
          <Button className="btn m-t-5" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              let order = this.state.order!==''?parseInt(this.state.order):0;
              if(isNaN(order)){
                order=0;
              }
              rebase.updateDoc('/help-statuses/'+this.props.match.params.id, {
                title:this.state.title,
              color:this.state.color,
              icon:this.state.icon,
              order,
              action:this.state.action.value
            })
                .then(()=>{this.setState({saving:false})});
            }}>{this.state.saving?'Saving status...':'Save status'}</Button>

          {this.state.action.value!=='invoiced' && <Button className="btn-red m-l-5 m-t-5" disabled={this.state.saving} onClick={()=>{
              if(window.confirm("Are you sure?")){
                rebase.removeDoc('/help-statuses/'+this.props.match.params.id).then(()=>{
                  this.props.history.goBack();
                });
              }
              }}>Delete</Button>}
          </div>
        </div>
    );
  }
}

const mapStateToProps = ({ storageHelpStatuses}) => {
  const { statusesActive, statuses, statusesLoaded } = storageHelpStatuses;
  return { statusesActive, statuses, statusesLoaded };
};

export default connect(mapStateToProps, { storageHelpStatusesStart })(StatusEdit);
