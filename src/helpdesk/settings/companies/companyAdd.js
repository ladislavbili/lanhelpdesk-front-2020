import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Switch from "react-switch";
import {toSelArr} from '../../../helperFunctions';
import {rebase} from '../../../index';

import { connect } from "react-redux";
import {storageHelpPricelistsStart } from '../../../redux/actions';
import {sameStringForms, isEmail} from '../../../helperFunctions';
import CompanyRents from './companyRents';
import CompanyPriceList from './companyPriceList';

import classnames from "classnames";

class CompanyAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelists:[{label: "Nový cenník", value: "0"}],
      pricelist: {},
      oldPricelist: {},
      priceName: "",
      title:'',
      oldTitle: "",
      ICO: "",
      oldICO: "",
      DIC: "",
      oldDIC: "",
      IC_DPH: "",
      oldIC_DPH: "",
      country: "",
      oldCountry: "",
      city: "",
      oldCity: "",
      street: "",
      oldStreet: "",
      PSC: "",
      oldPSC: "",
      mail: "",
      oldMail: "",
      phone: "",
      oldPhone: "",
      description: "",
      oldDescription: "",
      workPausal:0,
      oldWorkPausal:0,
      pausalPrice:0,
      oldPausalPrice:0,
      drivePausal:0,
      oldDrivePausal:0,
      pausal:0,
      oldPausal: 0,
      rented:[],
      oldRented:[],
      dph:20,
      oldDph:20,
      monthlyPausal:false,
      oldMonthlyPausal:false,
      fakeID:0,
      newData: false,
      loading:false,
      saving:false,
      clearCompanyRents:false,
    }
    this.savePriceList.bind(this);
    this.getFakeID.bind(this);
    this.setData.bind(this);
    this.submit.bind(this);
    this.cancel.bind(this);
  }

  getFakeID(){
    let fakeID = this.state.fakeID;
    this.setState({fakeID:fakeID+1})
    return fakeID;
  }

  storageLoaded(props){
    return props.pricelistsLoaded;
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.pricelists,this.props.pricelists) && this.storageLoaded(this.props) ){
      this.setState({pricelists: [{label: "Nový cenník", value: "0"}, ...toSelArr(props.pricelists)]})
    }
    if(!this.storageLoaded(this.props) && this.storageLoaded(props)){
      this.setData(props);
    }
  }

  componentWillMount(){
    if(!this.props.pricelistsActive){
      this.props.storageHelpPricelistsStart();
    }
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    }
  }

  setData(props){
    let pricelists = [{label: "Nový cenník", value: "0"}, ...toSelArr(props.pricelists)];
    //  let meta = props.metadata;
    let pricelist = pricelists.find((pricelist)=>pricelist.def);
    if(pricelist === undefined){
      if(pricelists.length>1){
        pricelist = pricelists[1];
      }else{
        pricelist = null;
      }
    }

    this.setState({
      pricelists,
      pricelist,
      loading:false})
    }

  submit(){
      if (this.state.title === "") {
        return;
      }
      this.setState({saving:true});
      let newCompany = {
        title:this.state.title,
        pausal:this.state.pausal,
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
        workPausal:this.state.workPausal,
        pausalPrice:this.state.pausalPrice,
        drivePausal:this.state.drivePausal,
        monthlyPausal:this.state.monthlyPausal,
        pricelist:this.state.pricelist.id,
        ICO: this.state.ICO,
        DIC: this.state.DIC,
        IC_DPH: this.state.IC_DPH,
        country: this.state.country,
        city: this.state.city,
        street: this.state.street,
        PSC: this.state.PSC,
        mail: this.state.mail,
        phone: this.state.phone,
        description: this.state.description,
        dph:isNaN(parseInt(this.state.dph))?0:parseInt(this.state.dph),
      };
      rebase.addToCollection('/companies', newCompany)
      .then((comp)=>{
        this.setState({
          title:'',
          pricelist:this.state.pricelists.length>0?this.state.pricelists[0]:null,
          ICO: "",
          DIC: "",
          IC_DPH: "",
          country: "",
          city: "",
          street: "",
          PSC: "",
          mail: "",
          phone: "",
          description: "",
          rented:[],
          dph:20,
          newData: false,
          priceName: "",
          monthlyPausal: false,
          saving:false}, () => {
            if (this.props.addCompany){
              this.props.addCompany({...newCompany, id: comp.id, label: newCompany.title, value: comp.id});
              this.props.close();
            } else {
              this.props.history.push(`/helpdesk/settings/companies/${comp.id}`)
            }
          }
        )
      });
    }

  savePriceList(){
      this.setState({saving:true});
      rebase.addToCollection('/help-pricelists',{
        title: this.state.priceName,
        afterHours:'0',
        materialMargin:'0',
        materialMarginExtra:'0'
      })
      .then((listResponse)=>{
      this.setState({
        saving:false,
        pricelist: {label: this.state.priceName, value: listResponse.id, id: listResponse.id},
        newData: false,
      }, () => this.submit());
    });
  }

  cancel(){
    this.setState({
      pricelist: this.state.oldPricelist,
      oldPricelist: this.state.oldPricelist,
      title: this.state.oldTitle,
      ICO: this.state.oldICO,
      DIC: this.state.oldDIC,
      IC_DPH: this.state.oldIC_DPH,
      country: this.state.oldCountry,
      city: this.state.oldCity,
      street: this.state.oldStreet,
      PSC: this.state.oldPSC,
      mail: this.state.oldMail,
      phone: this.state.oldPhone,
      description: this.state.oldDescription,
      pausal: this.state.oldPausal,
      workPausal: this.state.oldWorkPausal,
      pausalPrice: this.state.oldPausalPrice,
      drivePausal: this.state.oldDrivePausal,
      rented:this.state.oldRented,
      dph:this.state.oldDph,
      monthlyPausal:this.state.oldMonthlyPausal,

      clearCompanyRents:true,
      newData: false,
      priceName: "",
    })
  }

  render(){
  return (
    <div className="fit-with-header-and-commandbar">
      {this.state.newData &&
        <div style={{position: "fixed", zIndex: "999", backgroundColor: "rgba(255,255,255,0.5)", top: "0", left: "0", width: "100%", height: "100vh"}}></div>
      }

      <h2 className="p-t-10 p-l-20" style={(this.state.newData ? {position: "relative", zIndex: "99999"} : {})}>Add new company</h2>
      <hr style={(this.state.newData ? {position: "relative", zIndex: "99999"} : {})}/>

      {
        this.state.loading &&
        <Alert color="success">
          Loading data...
        </Alert>
      }
      <div className="form-body-highlighted scroll-visible">
        <div className="p-20">
          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="name">Company name</Label>
            </div>
            <div className="flex">
              <Input
                name="name"
                id="name"
                type="text"
                placeholder="Enter company name"
                value={this.state.title}
                onChange={(e)=>this.setState({title: e.target.value, newData: true, })}
                />
            </div>
          </FormGroup>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="dph">DPH</Label>
            </div>
            <div className="flex">
              <Input
                name="dph"
                id="dph"
                type="number"
                placeholder="Enter DPH"
                value={this.state.dph}
                onChange={(e)=>this.setState({dph: e.target.value, newData: true })  }
                />
            </div>
          </FormGroup>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="ico">ICO</Label>
            </div>
            <div className="flex">
              <Input
                name="ico"
                id="ico"
                type="text"
                placeholder="Enter ICO"
                value={this.state.ICO}
                onChange={(e)=>this.setState({ICO: e.target.value, newData: true })  }
                />
            </div>
          </FormGroup>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="dic">DIC</Label>
            </div>
            <div className="flex">
              <Input
                name="dic"
                id="dic"
                type="text"
                placeholder="Enter DIC"
                value={this.state.DIC}
                onChange={(e)=>this.setState({DIC: e.target.value, newData: true }) }
                />
            </div>
          </FormGroup>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="ic_dph">IC DPH</Label>
            </div>
            <div className="flex">
              <Input
                name="ic_dph"
                id="ic_dph"
                type="text"
                placeholder="Enter IC DPH"
                value={this.state.IC_DPH}
                onChange={(e)=>this.setState({IC_DPH: e.target.value, newData: true }) }
                />
            </div>
          </FormGroup>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="country">Country</Label>
            </div>
            <div className="flex">
              <Input
                name="country"
                id="country"
                type="text"
                placeholder="Enter country"
                value={this.state.country}
                onChange={(e)=>this.setState({country: e.target.value, newData: true })}
                />
            </div>
          </FormGroup>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="city">City</Label>
            </div>
            <div className="flex">
              <Input
                name="city"
                id="city"
                type="text"
                placeholder="Enter city"
                value={this.state.city}
                onChange={(e)=>this.setState({city: e.target.value, newData: true})}
                />
            </div>
          </FormGroup>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="street">Street</Label>
            </div>
            <div className="flex">
              <Input
                name="street"
                id="street"
                type="text"
                placeholder="Enter street"
                value={this.state.street}
                onChange={(e)=>this.setState({street: e.target.value, newData: true})}
                />
            </div>
          </FormGroup>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="psc">PSČ</Label>
            </div>
            <div className="flex">
              <Input
                name="psc"
                id="psc"
                type="text"
                placeholder="Enter PSČ"
                value={this.state.PSC}
                onChange={(e)=>this.setState({PSC: e.target.value, newData: true})}
                />
            </div>
          </FormGroup>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="mail">E-mail</Label>
            </div>
            <div className="flex">
              <Input
                name="mail"
                id="mail"
                className={(this.state.mail.length > 0 && !isEmail(this.state.mail)) ? "form-control-warning" : ""}
                type="text"
                placeholder="Enter e-mail"
                value={this.state.mail}
                onChange={(e)=>this.setState({mail: e.target.value, newData: true})}
                />
            </div>
          </FormGroup>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="phone">Phone</Label>
            </div>
            <div className="flex">
              <Input
                name="phone"
                id="phone"
                type="text"
                placeholder="Enter phone"
                value={this.state.phone}
                onChange={(e)=>this.setState({phone: e.target.value, newData: true})}
                />
            </div>
          </FormGroup>

          <FormGroup className="row">
            <div className="m-r-10 w-20">
              <Label for="description">Description</Label>
            </div>
            <div className="flex">
              <Input
                name="description"
                id="description"
                type="text"
                placeholder="Enter description"
                value={this.state.description}
                onChange={(e)=>this.setState({description: e.target.value, newData: true})}
                />
            </div>
          </FormGroup>

        </div>
        {this.props.role > 1 && <div className="p-20 table-highlight-background">
          <div className="row">
            <span className="m-r-5">
              <h3>Mesačný paušál</h3>
            </span>
            <label>
              <Switch
                checked={this.state.monthlyPausal}
                onChange={()=>{
                  this.setState({monthlyPausal:!this.state.monthlyPausal })
                }}
                height={22}
                checkedIcon={<span className="switchLabel">YES</span>}
                uncheckedIcon={<span className="switchLabel">NO</span>}
                onColor={"#0078D4"} />
              <span className="m-l-10"></span>
            </label>
          </div>
            { this.state.monthlyPausal && <div>
              <FormGroup className="row m-b-10 m-t-20">
                <div className="m-r-10 w-20">
                  <Label for="pausal">Mesačná</Label>
                </div>
                <div className="flex">
                  <Input
                    name="pausal"
                    id="pausal"
                    type="number"
                    placeholder="Enter work pausal"
                    value={this.state.pausalPrice}
                    onChange={(e)=>this.setState({pausalPrice:e.target.value, newData: true,})}
                    />
                </div>
                <div className="m-l-10">
                  <Label for="pausal">EUR bez DPH/mesiac</Label>
                </div>
              </FormGroup>
              <FormGroup className="row m-b-10">
                <div className="m-r-10 w-20">
                  <Label for="pausal">Paušál práce</Label>
                </div>
                <div className="flex">
                  <Input
                    name="pausal"
                    id="pausal"
                    type="number"
                    placeholder="Enter work pausal"
                    value={this.state.workPausal}
                    onChange={(e)=>this.setState({workPausal:e.target.value, newData: true,})}
                    />
                </div>
              </FormGroup>
              <FormGroup className="row m-b-10">
                <div className="m-r-10 w-20">
                  <Label for="pausal">Paušál výjazdy</Label>
                </div>
                <div className="flex">
                  <Input
                    name="pausal"
                    id="pausal"
                    type="number"
                    placeholder="Enter drive pausal"
                    value={this.state.drivePausal}
                    onChange={(e)=>this.setState({drivePausal:e.target.value, newData: true,})}
                    />
                </div>
              </FormGroup>

              {!this.props.addCompany &&
                <div className="p-20">
                  <h3 className="m-b-15">Mesačný prenájom licencií a hardware</h3>
                  <CompanyRents
                    clearForm={this.state.clearCompanyRents}
                    setClearForm={()=>this.setState({clearCompanyRents:false})}
                    data={this.state.rented}
                    updateRent={(rent)=>{
                      let newRents=[...this.state.rented];
                      newRents[newRents.findIndex((item)=>item.id===rent.id)]={...newRents.find((item)=>item.id===rent.id),...rent};
                      this.setState({rented:newRents, newData:true });
                    }}
                    addRent={(rent)=>{
                      let newRents=[...this.state.rented];
                      newRents.push({...rent,id:this.getFakeID()})
                      this.setState({rented:newRents, newData:true });
                    }}
                    removeRent={(rent)=>{
                      let newRents=[...this.state.rented];
                      newRents.splice(newRents.findIndex((item)=>item.id===rent.id),1);
                      this.setState({rented:newRents, newData:true });
                    }}
                    />
                </div>
              }
            </div>}
            <CompanyPriceList
              pricelists={this.state.pricelists}
              pricelist={this.state.pricelist}
              oldPricelist={this.state.oldPricelist}
              priceName={this.state.priceName}
              newData={this.state.newData}
              cancel={() => this.cancel()}
              setData={(data) => {
                let newState = {...this.state};
                Object.keys(data).forEach((key, i) => {
                  newState[key] = data[key];
                });
                newState.newData = true;
                this.setState({
                  ...newState
                })}} />
          </div>}
        </div>

        <div
          className={classnames({ "form-footer": this.state.newData || this.props.addCompany}, "row")}
          style={(this.state.newData ? {zIndex: "99999"} : {})}>
          {(this.state.newData  || this.props.addCompany) &&
            <Button
              className="btn"
              disabled={this.state.saving || this.state.title.length === 0 || (this.state.pricelist.value === "0" && this.state.priceName === "") }
              onClick={()=>{
                if (this.state.pricelist.value === "0" && this.state.priceName !== ""){
                  this.savePriceList();
                } else {
                  this.submit()
                }
              }}>{(this.state.pricelist.value === "0" && this.state.priceName !== "" ? "Save changes" : (this.state.saving?'Adding...':'Add company'))}</Button>
            }

          { (this.state.newData  || this.props.addCompany) &&
            <Button
              className="btn-link"
              disabled={this.state.saving}
              onClick={() => this.cancel()}>Cancel changes</Button>
          }

        </div>

      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpPricelists, userReducer}) => {
  const { pricelistsActive, pricelists, pricelistsLoaded } = storageHelpPricelists;
  const role = userReducer.userData ? userReducer.userData.role.value : 0;
  return { pricelistsActive, pricelists, pricelistsLoaded, role };
};

export default connect(mapStateToProps, { storageHelpPricelistsStart  })(CompanyAdd);
