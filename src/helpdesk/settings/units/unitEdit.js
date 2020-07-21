import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../../index';
import Checkbox from '../../../components/checkbox';

import { connect } from "react-redux";
import {storageHelpUnitsStart, storageMetadataStart} from '../../../redux/actions';

class UnitEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      defaultUnit:null,
      def:false,
      loading:true,
      saving:false
    }
    this.setData.bind(this);
  }

  storageLoaded(props){
    return props.unitsLoaded && props.metadataLoaded
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
    if(!this.props.unitsActive){
      this.props.storageHelpUnitsStart();
    }
    if(!this.props.metadataActive){
      this.props.storageMetadataStart();
    }
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    };
  }

  setData(props){
    let data = props.units.find((item)=>item.id===props.match.params.id) ;
    let id = props.metadata.defaultUnit;
    this.setState({title:data.title,loading:false,def: props.match.params.id===id, defaultUnit:id})
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

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { this.state.def }
          onChange={ () => this.setState({def:!this.state.def}) }
          label = "Default"
          />

        <FormGroup>
          <Label for="name">Unit name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter unit name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>

        <div className="row">
            <Button className="btn" disabled={this.state.saving} onClick={()=>{
                this.setState({saving:true});
                if(!this.state.def && this.state.defaultUnit===this.props.match.params.id){
                  this.setState({defaultUnit:null});
                  rebase.updateDoc('/metadata/0',{defaultUnit:null});
                }else if(this.state.def){
                  this.setState({defaultUnit:this.props.match.params.id});
                  rebase.updateDoc('/metadata/0',{defaultUnit:this.props.match.params.id});
                }
                rebase.updateDoc('/help-units/'+this.props.match.params.id, {title:this.state.title})
                  .then(()=>{this.setState({saving:false})});
              }}>{this.state.saving?'Saving unit...':'Save unit'}</Button>

            <Button className="btn-red m-l-5" disabled={this.state.saving} onClick={()=>{
                  if(window.confirm("Are you sure?")){
                    rebase.removeDoc('/help-units/'+this.props.match.params.id).then(()=>{
                      this.props.history.goBack();
                    });
                  }
              }}>Delete</Button>
          </div>
        </div>
    );
  }
}

const mapStateToProps = ({ storageHelpUnits,storageMetadata}) => {
  const { unitsActive, units, unitsLoaded } = storageHelpUnits;
	const { metadataLoaded, metadataActive, metadata } = storageMetadata;
  return { unitsActive, units, unitsLoaded, metadataLoaded, metadataActive, metadata };
};

export default connect(mapStateToProps, { storageHelpUnitsStart, storageMetadataStart })(UnitEdit);
