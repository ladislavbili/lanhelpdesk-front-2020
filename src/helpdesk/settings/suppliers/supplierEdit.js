import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../../index';

import { connect } from "react-redux";
import {storageHelpSuppliersStart} from '../../../redux/actions';

class SupplierEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
  }

  componentWillReceiveProps(props){
    if(props.suppliersLoaded && !this.props.suppliersLoaded){
      this.setData(props);
    }
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(props.suppliersLoaded){
        this.setData(props);
      }
    }
  }

  componentWillMount(){
    if(!this.props.suppliersActive){
      this.props.storageHelpSuppliersStart();
    }
    if(this.props.suppliersLoaded){
      this.setData(this.props);
    };
  }

  setData(props){
    let data = props.suppliers.find((item)=>item.id===props.match.params.id);
    this.setState({title:data.title,loading:false})
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
          <Label for="name">Supplier name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter supplier name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>

        <div className="row">
          <Button className="btn" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              rebase.updateDoc('/help-suppliers/'+this.props.match.params.id, {title:this.state.title})
                .then(()=>{this.setState({saving:false})});
            }}>{this.state.saving?'Saving supplier...':'Save supplier'}</Button>

          <Button className="btn-red m-l-5" disabled={this.state.saving} onClick={()=>{
                if(window.confirm("Are you sure?")){
                  rebase.removeDoc('/help-suppliers/'+this.props.match.params.id).then(()=>{
                    this.props.history.goBack();
                  });
                }
              }}>Delete</Button>
        </div>

      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpSuppliers}) => {
  const { suppliersActive, suppliers, suppliersLoaded } = storageHelpSuppliers;
  return { suppliersActive, suppliers, suppliersLoaded };
};

export default connect(mapStateToProps, { storageHelpSuppliersStart })(SupplierEdit);
