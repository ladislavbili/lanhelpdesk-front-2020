import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase, database} from '../../../index';
import {snapshotToArray} from '../../../helperFunctions';

export default class PriceEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelistName:'',
      afterHours:0,
      margin:0,
      marginExtra:0,
      loading:true,
      saving:false,
      def:false,
      workTypes:[],
    }
    this.setData.bind(this);
    this.loadData.bind(this);
    this.loadData();
  }

  loadData(){
    Promise.all(
      [
        database.collection('help-work_types').get(),
        database.collection('help-prices').get()
    ]).then(([ workTypes,prices])=>{
      this.setData(snapshotToArray(prices),snapshotToArray(workTypes));
    });
  }

  setData(prices,workTypes){
    let types= workTypes.map((type)=>{
      let newType={...type};
      newType.price={price:0};
      return newType;
    });

    this.setState({
      workTypes:types,
      loading:false
    });
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
          <FormGroup check style={{marginBottom: 5}}>
            <Input type="checkbox" checked={this.state.def} onChange={(e)=>this.setState({def:!this.state.def})}/>
            <Label check>
              Default
            </Label>
          </FormGroup>

          <FormGroup>
            <Label for="name">Pricelist name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter pricelist name" value={this.state.pricelistName} onChange={(e)=>this.setState({pricelistName:e.target.value})} />
          </FormGroup>

          {
            this.state.workTypes.map((item,index)=>
            <FormGroup key={index}>
              <Label for={index}>{item.title}</Label>
              <Input type="text" name={index} id={index} placeholder="Enter price" value={item.price.price} onChange={(e)=>{
                  let newWorkTypes=[...this.state.workTypes];
                  let newWorkType = {...newWorkTypes[index]};
                  newWorkType.price.price=e.target.value;
                  newWorkTypes[index] = newWorkType;
                  this.setState({workTypes:newWorkTypes});
                }} />
            </FormGroup>
            )
          }

          <FormGroup>
            <Label for="afterPer">After hours percentage</Label>
            <Input type="text" name="afterPer" id="afterPer" placeholder="Enter after hours percentage" value={this.state.afterHours} onChange={(e)=>this.setState({afterHours:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label for="materMarg">Materials margin percentage 50-</Label>
            <Input type="text" name="materMarg" id="materMarg" placeholder="Enter materials margin percentage" value={this.state.margin} onChange={(e)=>this.setState({margin:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="materMarg">Materials margin percentage 50+</Label>
            <Input type="text" name="materMarg" id="materMarg" placeholder="Enter materials margin percentage" value={this.state.marginExtra} onChange={(e)=>this.setState({marginExtra:e.target.value})} />
          </FormGroup>
          <Button className="btn" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              rebase.addToCollection('/help-pricelists',
              {
                title:this.state.pricelistName,
                afterHours:parseFloat(this.state.afterHours===''?'0':this.state.afterHours),
                materialMargin:parseFloat(this.state.margin===''?'0':this.state.margin),
                materialMarginExtra:parseFloat(this.state.marginExtra===''?'0':this.state.marginExtra)
              })
                .then((listResponse)=>{
                  if(this.state.def){
                    rebase.updateDoc('/metadata/0',{defaultPricelist:listResponse.id})
                  }
                  this.state.workTypes.map((workType,index)=>
                    rebase.addToCollection('/help-prices', {pricelist:listResponse.id,workType:workType.id,price:parseFloat(workType.price.price === "" ? "0": workType.price.price)})
                  );
                  this.setState({saving:false,
                    pricelistName:'',
                    afterHours:0,
                    margin:0,
                  });
                  this.loadData();
                });
            }}>{this.state.saving?'Saving prices...':'Save prices'}</Button>
          </div>
      </div>
    );
  }
}
