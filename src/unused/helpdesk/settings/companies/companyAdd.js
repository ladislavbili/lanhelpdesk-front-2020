import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Select from 'react-select';
import {toSelArr, snapshotToArray} from '../../../helperFunctions';
import {rebase,database} from '../../../index';
import {selectStyle} from "configs/components/select";

export default class CompanyAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelists:[],
      pricelist:null,
      companyName:'',
      pausal:0,
      loading:true,
      saving:false
    }
    this.fetchData.bind(this);
    this.setData.bind(this);
    this.fetchData();
  }

  fetchData(){
    Promise.all(
      [
        database.collection('help-pricelists').get(),
        rebase.get('metadata/0', {
          context: this,
        })
      ]).then(([pricelists,meta])=>{
      this.setData(toSelArr(snapshotToArray(pricelists)),meta);
    });
  }

  setData(pricelists,meta){
    let pricelist = null;
      if(pricelists.length>0){
        if(meta.defaultPricelist!==null){
          pricelist=pricelists.find((item)=>item.id===meta.defaultPricelist);
        }else{
          pricelist=pricelists[0];
        }
      }
      this.setState({pricelists,pricelist,loading:false})
  }

  render(){
    return (
      <div className="full-height card-box scrollable fit-with-header-and-commandbar">
        <div className="m-t-20">
          {
            this.state.loading &&
            <Alert color="success">
              Loading data...
            </Alert>
          }
          <FormGroup>
            <Label for="name">Company name</Label>
            <Input name="name" id="name" type="text" placeholder="Enter company name" value={this.state.companyName} onChange={(e)=>this.setState({companyName:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="pausal">Paušál</Label>
            <Input name="pausal" id="pausal" type="number" placeholder="Enter pausal" value={this.state.pausal} onChange={(e)=>this.setState({pausal:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="pricelist">Pricelist</Label>
            <Select
              id="pricelist"
              name="pausal"
              styles={selectStyle}
              options={this.state.pricelists}
              value={this.state.pricelist}
              onChange={e =>{ this.setState({ pricelist: e }); }}
                />
          </FormGroup>
          <Button className="btn" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              rebase.addToCollection('/companies', {title:this.state.companyName,pricelist:this.state.pricelist.id})
                .then(()=>{this.setState({companyName:'',pausal:this.state.pausal,pricelist:this.state.pricelists.length>0?this.state.pricelists[0]:null,saving:false})});
            }}>{this.state.saving?'Adding...':'Add company'}</Button>
          </div>
      </div>
    );
  }
}
