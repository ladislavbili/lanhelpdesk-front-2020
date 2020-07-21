import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../../index';

import { connect } from "react-redux";
import {
storageCompaniesStart,
storageHelpPricelistsStart,
storageMetadataStart,
storageHelpTaskTypesStart,
storageHelpTripTypesStart
} from '../../../redux/actions';
import CompanyRents from '../companies/companyRents';
import CompanyPriceList from '../companies/companyPriceList';

import {toSelArr, sameStringForms} from '../../../helperFunctions';

class PausalEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      drivePausal:0,
      pausal:0,
      rented:[],

      fakeID:0,
      loading:true,
      saving:false,


      taskTypes: [],
      tripTypes: [],
      pricelists:[{label: "Nový cenník", value: "0"}],
      pricelist:{},
      oldPricelist: {},
    }
    this.savePriceList.bind(this);
    this.setData.bind(this);
    this.submit.bind(this);
  }

  getFakeID(){
    let fakeID = this.state.fakeID;
    this.setState({fakeID:fakeID+1})
    return fakeID;
  }

  storageLoaded(props){
    return props.pricelistsLoaded &&
    props.metadataLoaded &&
    props.tripTypesLoaded &&
    props.taskTypesLoaded &&
    props.companiesLoaded
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.pricelists, this.props.pricelists)){
      this.setState({pricelists: [{label: "Nový cenník", value: "0"}, ...toSelArr(props.pricelists)]})
    }
    if(!this.storageLoaded(this.props) && this.storageLoaded(props)){
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
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    }
    if(!this.props.metadataActive){
      this.props.storageMetadataStart();
    }
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
    if(!this.props.pricelistsActive){
      this.props.storageHelpPricelistsStart();
    }
    if(!this.props.tripTypesActive){
      this.props.storageHelpTripTypesStart();
    }
    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
  }

  setData(props){
    let company = props.companies.find((company)=>company.id===props.match.params.id);
    let rented = company.rented||[];
    let fakeID = 0;
    if(rented.length!==0){
      fakeID = rented.sort((item1,item2)=>item1.id < item2.id?1:-1)[0].id+1;
    }

    let pricelists = [{label: "Nový cenník", value: "0"}, ...toSelArr(props.pricelists)];
    let pricelist=pricelists.find((item)=>item.id===company.pricelist);
    let meta = props.metadata;
    if(pricelist===undefined){
      pricelist=pricelists.find((item)=>item.id===meta.defaultPricelist);
      if(pricelist===undefined && pricelists.length>0){
        pricelist=pricelists[0];
      }
    }

    let taskTypes = props.taskTypes.map((type)=>{
      let newType={...type};
      newType.price={price:0};
      return newType;
    });

    let tripTypes = props.tripTypes.map((type)=>{
      let newType={...type};
      newType.price={price:0};
      return newType;
    });

    this.setState({
      title: company.title,
      workPausal: company.workPausal || 0,
      drivePausal: company.drivePausal || 0,
      rented,

      priceName: "",
      pricelists,
      pricelist,
      taskTypes,
      tripTypes,

      fakeID,
      loading:false,
      newData: false,
    })
  }

  savePriceList(){
    this.setState({saving:true});
    rebase.addToCollection('/help-pricelists',
    {
      title: this.state.priceName,
      afterHours:'0',
      materialMargin:'0',
      materialMarginExtra:'0'
    })
      .then((listResponse)=>{
        this.state.taskTypes.map((taskType,index)=>
          rebase.addToCollection('/help-prices', {pricelist:listResponse.id,type:taskType.id,price:"0"})
        );
        this.state.tripTypes.map((tripType,index)=>
          rebase.addToCollection('/help-prices', {pricelist:listResponse.id,type:tripType.id,price:"0"})
        );
        this.setState({
          saving:false,
          pricelist: {label: this.state.priceName, value: listResponse.id, id: listResponse.id},
          newData: false,
        }, () => this.submit());
      });
  }

  submit(){
      this.setState({saving:true});
      rebase.updateDoc('/companies/'+this.props.match.params.id,
      {
        workPausal:this.state.workPausal,
        drivePausal:this.state.drivePausal,
        pricelist: this.state.pricelist.id,
        rented:this.state.rented.map((rent)=>{
          return{
            id:rent.id,
            title:rent.title,
            quantity:isNaN(parseInt(rent.quantity))?0:rent.quantity,
            unitCost:isNaN(parseFloat(rent.unitCost))?0:rent.unitCost,
            unitPrice:isNaN(parseFloat(rent.unitPrice))?0:rent.unitPrice,
            totalPrice:isNaN(parseFloat(rent.totalPrice))?0:rent.totalPrice,
          }
        }),
      })
        .then(()=>this.setState({
          saving:false,
        }));
  }

  render(){
    return (
      <div className="fit-with-header-and-commandbar-2 scroll-visible">

      <h2 className="p-t-10 p-l-20 p-b-5">{this.state.title}</h2>

      <div className="p-20">

        <h3>Paušál</h3>
        <FormGroup>
          <Label for="pausal">Paušál práce</Label>
          <Input
            name="pausal"
            id="pausal"
            type="number"
            placeholder="Enter work pausal"
            value={this.state.workPausal}
            onChange={(e)=>this.setState({workPausal:e.target.value,})}
            />
        </FormGroup>
        <FormGroup className="m-b-10">
          <Label for="pausal">Paušál výjazdy</Label>
          <Input
            name="pausal"
            id="pausal"
            type="number"
            placeholder="Enter drive pausal"
            value={this.state.drivePausal}
            onChange={(e)=>this.setState({drivePausal:e.target.value,})}
            />
        </FormGroup>
        <CompanyRents
          clearForm={this.state.clearCompanyRents}
          setClearForm={()=>this.setState({clearCompanyRents:false})}
          data={this.state.rented}
          updateRent={(rent)=>{
            let newRents=[...this.state.rented];
            newRents[newRents.findIndex((item)=>item.id===rent.id)]={...newRents.find((item)=>item.id===rent.id),...rent};
            this.setState({rented:newRents });
          }}
          addRent={(rent)=>{
            let newRents=[...this.state.rented];
            newRents.push({...rent,id:this.getFakeID()})
            this.setState({rented:newRents });
          }}
          removeRent={(rent)=>{
            let newRents=[...this.state.rented];
            newRents.splice(newRents.findIndex((item)=>item.id===rent.id),1);
            this.setState({rented:newRents });
          }}
        />

        <CompanyPriceList
          pricelists={this.state.pricelists}
          pricelist={this.state.pricelist}
          oldPricelist={this.state.oldPricelist}
          priceName={this.state.priceName}
          newData={this.state.newData}
          cancel={() => {}}
          setData={(data) => {
            let newState = {...this.state};
            Object.keys(data).forEach((key, i) => {
              newState[key] = data[key];
            });
            newState.newData = true;
            this.setState({
              ...newState
            })}} />

        <Button
          className="btn m-t-20"
          disabled={this.state.saving || this.state.title.length === 0 }
          onClick={()=>{
            if (this.state.pricelist.value === "0" && this.state.priceName !== ""){
              this.savePriceList();
            } else {
              this.submit()
            }
          }}>{this.state.saving?'Saving...':'Save changes'}</Button>
      </div>
    </div>
    );
  }
}


const mapStateToProps = ({
  storageMetadata,
  storageHelpPricelists,
  storageCompanies,
  storageHelpTaskTypes,
  storageHelpTripTypes
}) => {
  const { pricelistsActive, pricelists, pricelistsLoaded } = storageHelpPricelists;
  const { companiesActive, companies, companiesLoaded } = storageCompanies;
  const { taskTypesLoaded, taskTypesActive, taskTypes } = storageHelpTaskTypes;
  const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;
  const { metadataActive, metadata, metadataLoaded } = storageMetadata;
  return { metadataActive, metadata, metadataLoaded,
    pricelistsActive, pricelists, pricelistsLoaded,
    companiesActive, companies, companiesLoaded,
    taskTypesLoaded, taskTypesActive, taskTypes,
    tripTypesActive, tripTypes, tripTypesLoaded };
};

export default connect(mapStateToProps, {
  storageHelpPricelistsStart,
  storageMetadataStart,
  storageCompaniesStart,
  storageHelpTaskTypesStart,
  storageHelpTripTypesStart
 })(PausalEdit);
