import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button, FormGroup, Label,Input, Alert, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import Switch from "react-switch";
//import Checkbox from '../../../components/checkbox';

import { rebase, database } from '../../../index';
import { snapshotToArray, toSelArr } from '../../../helperFunctions';
import { selectStyle } from "configs/components/select";
import {storageHelpPricelistsStart,storageHelpPricesStart,storageHelpTaskTypesStart, storageHelpTripTypesStart} from '../../../redux/actions';

class PriceEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      id: "",
      pricelistName:'',
      afterHours:0,
      margin:0,
      marginExtra:0,
      def:false,
      loading:true,
      saving:false,
      taskTypes:[],
      tripTypes:[],

      wasDef:false,

      companies:[],
      openEditCompanies:false,

    }
    this.setData.bind(this);
    this.assignDefRandomly.bind(this);
    this.deletePricelist.bind(this);
  }

  storageLoaded(props){
    return props.pricesLoaded && props.taskTypesLoaded && props.pricelistsLoaded && props.tripTypesLoaded
  }

  componentWillReceiveProps(props){
    if(this.storageLoaded(props) && !this.storageLoaded(this.props)){
      this.setData(props);
    }
    if((this.props.match && props.match && this.props.match.params.id !== props.match.params.id) ||
      (this.props.listId !== props.listId) ){
      this.setState({loading:true})
      if(this.storageLoaded(props)){
        this.setData(props);
      }
    }
  }

  componentWillMount(){

    if(!this.props.pricelistsActive){
      this.props.storageHelpPricelistsStart();
    }
    if(!this.props.pricesActive){
      this.props.storageHelpPricesStart();
    }
    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    if(!this.props.tripTypesActive){
      this.props.storageHelpTripTypesStart();
    }
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    };
  }

  setData(props){
    let id = (props.listId ? props.listId : props.match.params.id);
    let pricelist = props.pricelists.find((pricelist)=>pricelist.id===id);
    let prices = props.prices;
    let taskTypes = props.taskTypes;
    let tripTypes = props.tripTypes;

    taskTypes = taskTypes.map((type)=>{
      let newType={...type};
      newType.price= prices.find((item)=>item.pricelist===id && item.type === newType.id);
      if(newType.price===undefined){
          newType.price={price:0};
      }
      return newType;
    });

    tripTypes = tripTypes.map((type)=>{
      let newType={...type};
      newType.price= prices.find((item)=>item.pricelist===id && item.type === newType.id);
      if(newType.price===undefined){
          newType.price={price:0};
      }
      return newType;
    });

    this.setState({
      id,
      pricelistName:pricelist.title,
      afterHours:pricelist.afterHours,
      margin: pricelist.materialMargin,
      marginExtra: pricelist.materialMarginExtra,
      taskTypes,
      tripTypes,
      loading:false,
      def: pricelist.def === true,
      wasDef: pricelist.def === true,
    });
  }

  deletePricelistPopup(){
    if(window.confirm("Are you sure you want to delete this pricelist?")){
      database.collection('companies').where("pricelist", "==", (this.props.match ? this.props.match.params.id : this.props.listId)).get()
			.then((data)=>{
        let companies = snapshotToArray(data);
        if(companies.length === 0){
          this.deletePricelist();
        }else{
          this.setState({ companies:companies.map((company)=>({...company,pricelist:null})), openEditCompanies:true })
        }
			});
    }
  }

  deletePricelist(){
    rebase.removeDoc('/help-pricelists/'+(this.props.match ? this.props.match.params.id : this.props.listId));
    if(this.state.wasDef){
      this.assignDefRandomly();
    }
    this.state.taskTypes.filter((item)=>item.price.id!==undefined).map((taskType)=>
      rebase.removeDoc('/help-prices/'+taskType.price.id)
    );
    if (this.props.listId) {
      this.props.deletedList();
    } else {
      this.props.history.goBack();
    }
  }

  assignDefRandomly(){
    let newDefPricelist = this.props.pricelists.find((pricelist)=>pricelist.id !== (this.props.match ? this.props.match.params.id : this.props.listId));
    if(newDefPricelist){
      rebase.updateDoc('/help-pricelists/'+newDefPricelist.id,{def:true});
    }
  }

  render(){
    return (
      <div>
          {
            this.state.loading &&
            <Alert color="success">
              Loading data...
            </Alert>
          }

          <label>
            <Switch
              checked={this.state.def}
              onChange={()=>{
                this.setState({def:!this.state.def})
              }}
              height={22}
              checkedIcon={<span className="switchLabel">YES</span>}
              uncheckedIcon={<span className="switchLabel">NO</span>}
              onColor={"#0078D4"} />
            <span className="m-l-10">Default</span>
          </label>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="name">Pricelist name</Label>
            </div>
            <div className="flex">
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter pricelist name"
                value={this.state.pricelistName}
                onChange={(e) => this.setState({pricelistName:e.target.value})} />
            </div>
          </FormGroup>

          <h3>Ceny úloh</h3>
          <div className="p-t-10 p-b-10">
            {
              this.state.taskTypes.map((item,index)=>
              <FormGroup key={index} className="row m-b-10">
                <div className="m-r-10 w-20">
                  <Label for={item.title}>{item.title}</Label>
                </div>
                <div className="flex">
                  <Input type="text" name={item.title} id={item.title} placeholder="Enter price" value={item.price.price} onChange={(e)=>{
                      let newTaskTypes=[...this.state.taskTypes];
                      let newTaskType = {...newTaskTypes[index]};
                      newTaskType.price.price=e.target.value;
                      newTaskTypes[index] = newTaskType;
                      this.setState({taskTypes:newTaskTypes});
                    }} />
                </div>
              </FormGroup>
              )
            }
          </div>

          <h3>Ceny Výjazdov</h3>
          <div className="p-t-10 p-b-10">
            {
              this.state.tripTypes.map((item,index)=>
              <FormGroup key={index} className="row m-b-10">
                <div className="m-r-10 w-20">
                  <Label for={item.title}>{item.title}</Label>
                </div>
                <div className="flex">
                  <Input type="text" name={item.title} id={item.title} placeholder="Enter price" value={item.price.price} onChange={(e)=>{
                      let newTripTypes=[...this.state.tripTypes];
                      let newTripType = {...newTripTypes[index]};
                      newTripType.price.price=e.target.value;
                      newTripTypes[index] = newTripType;
                      this.setState({tripTypes:newTripTypes});
                    }} />
                </div>
              </FormGroup>
              )
            }
          </div>

          <h3>Všeobecné prirážky</h3>
          <div className="p-t-10 p-b-10">
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="afterPer">After hours percentage</Label>
              </div>
              <div className="flex">
                <Input type="text" name="afterPer" id="afterPer" placeholder="Enter after hours percentage" value={this.state.afterHours} onChange={(e)=>this.setState({afterHours:e.target.value})} />
              </div>
            </FormGroup>
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="materMarg">Materials margin percentage 50-</Label>
              </div>
              <div className="flex">
                <Input type="text" name="materMarg" id="materMarg" placeholder="Enter materials margin percentage" value={this.state.margin} onChange={(e)=>this.setState({margin:e.target.value})} />
              </div>
            </FormGroup>
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="materMarg+">Materials margin percentage 50+</Label>
              </div>
              <div className="flex">
                <Input type="text" name="materMarg+" id="materMarg+" placeholder="Enter materials margin percentage" value={this.state.marginExtra} onChange={(e)=>this.setState({marginExtra:e.target.value})} />
              </div>
            </FormGroup>
          </div>
          <div className="row">
              <Button className="btn" disabled={this.state.saving} onClick={()=>{
                  this.setState({saving:true});
                  if(!this.state.def && this.state.wasDef){
                    this.setState({wasDef:false});
                    this.assignDefRandomly();
                  }else if(this.state.def && !this.state.wasDef){
                    this.setState({wasDef: true});
                    let prevDef = this.props.pricelists.find((pricelist)=>pricelist.def);
                    if(prevDef){
                      rebase.updateDoc('/help-pricelists/'+prevDef.id,{def:false});
                    }
                  }

                  this.state.taskTypes.concat(this.state.tripTypes).filter((item)=>item.price.id!==undefined).map((type)=>
                    rebase.updateDoc('/help-prices/'+type.price.id, {price:parseFloat(type.price.price === "" ? "0": type.price.price)})
                  );
                  this.state.taskTypes.filter((item)=>item.price.id===undefined).map((type)=>
                    rebase.addToCollection('/help-prices', {pricelist:(this.props.match ? this.props.match.params.id : this.props.listId),type:type.id,price:parseFloat(type.price.price === "" ? "0": type.price.price)}).then((response)=>{
                      let index = this.state.taskTypes.findIndex((item)=>item.id===type.id);
                      let newTaskTypes=[...this.state.taskTypes];
                      let newTaskType = {...newTaskTypes[index]};
                      newTaskType.price={pricelist:(this.props.match ? this.props.match.params.id : this.props.listId),type:type.id,price:parseFloat(type.price.price === "" ? "0": type.price.price), id:response.id};
                      newTaskTypes[index] = newTaskType;
                      this.setState({taskTypes:newTaskTypes});
                    })
                  )

                  this.state.tripTypes.filter((item)=>item.price.id===undefined).map((type)=>
                    rebase.addToCollection('/help-prices', {pricelist:(this.props.match ? this.props.match.params.id : this.props.listId),type:type.id,price:parseFloat(type.price.price === "" ? "0": type.price.price)}).then((response)=>{
                      let index = this.state.tripTypes.findIndex((item)=>item.id===type.id);
                      let newTripTypes=[...this.state.tripTypes];
                      let newTripType = {...newTripTypes[index]};
                      newTripType.price={pricelist:(this.props.match ? this.props.match.params.id : this.props.listId),type:type.id,price:parseFloat(type.price.price === "" ? "0": type.price.price), id:response.id};
                      newTripTypes[index] = newTripType;
                      this.setState({tripTypes:newTripTypes});
                    })
                  )


                  rebase.updateDoc('/help-pricelists/'+(this.props.listId ? this.props.listId : this.props.match.params.id),
                  {
                    title:this.state.pricelistName,
                    def:this.state.def,
                    afterHours:parseFloat(this.state.afterHours===''?'0':this.state.afterHours),
                    materialMargin:parseFloat(this.state.margin===''?'0':this.state.margin),
                    materialMarginExtra:parseFloat(this.state.marginExtra===''?'0':this.state.marginExtra)
                  })
                    .then(()=>
                      this.setState({saving:false}, () => {if (this.props.changedName) this.props.changedName(this.state.pricelistName)})
                    );
                }}>{this.state.saving?'Saving prices...':'Save prices'}</Button>

              <Button className="btn-red m-l-5" disabled={this.state.saving || this.props.deletedList} onClick={this.deletePricelistPopup.bind(this)}>Delete price list</Button>
          </div>
          <Modal isOpen={this.state.openEditCompanies} >
            <ModalHeader>Edit companies</ModalHeader>
            <ModalBody>
              <h4 style={{color:'#FF4500'}}>Please update these companies, they use this pricelist</h4>
              <table className="table">
								<thead>
									<tr>
                    <th>Company name</th>
                    <th>Pricelist</th>
									</tr>
								</thead>
								<tbody>
                  { this.state.companies.map((company)=>
                    <tr key={company.id}>
                      <td>
                        {company.title}
                      </td>
                      <td>
                        <Select
                          id="pricelist"
                          name="pricelist"
                          styles={selectStyle}
                          options={toSelArr(this.props.pricelists).filter((pricelist)=>pricelist.id !== (this.props.match ? this.props.match.params.id : this.props.listId) )}
                          value={company.pricelist}
                          onChange={ pricelist =>{
                            let newCompanies = [...this.state.companies];
                            newCompanies.find((item)=>item.id===company.id).pricelist = pricelist;
                            this.setState({companies: newCompanies })
                          }}
                          />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ModalBody>
            <ModalFooter>
              <Button
                className="mr-auto"
                disabled={this.state.companies.some((company)=>company.pricelist===null)}
                onClick={()=>{
                  Promise.all(this.state.companies.map((company)=>rebase.updateDoc('/companies/'+company.id, {pricelist:company.pricelist.id}))).then(()=>{
                    this.setState({openEditCompanies:false})
                    this.deletePricelist();
                  });
                }}>
                Save companies and delete pricelist
              </Button>
              <Button className="btn-link" onClick={()=>this.setState({openEditCompanies:false})}>Cancel</Button>
            </ModalFooter>
          </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpPricelists,storageHelpPrices, storageHelpTaskTypes, storageHelpTripTypes}) => {
  const { pricelistsActive, pricelists, pricelistsLoaded } = storageHelpPricelists;
  const { pricesActive, prices, pricesLoaded } = storageHelpPrices;
	const { taskTypesLoaded, taskTypesActive, taskTypes } = storageHelpTaskTypes;
  const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;

  return {
    pricelistsActive, pricelists, pricelistsLoaded,
    pricesActive, prices, pricesLoaded,
    taskTypesLoaded, taskTypesActive, taskTypes,
		tripTypesActive, tripTypes, tripTypesLoaded,
  };
};

export default connect(mapStateToProps, { storageHelpPricelistsStart,storageHelpPricesStart,storageHelpTaskTypesStart, storageHelpTripTypesStart })(PriceEdit);
