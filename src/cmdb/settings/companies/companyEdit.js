import React, { Component } from 'react';
import { FormGroup, Button, Label, Input } from 'reactstrap';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
//import {toSelArr, snapshotToArray} from '../../../helperFunctions';
import {rebase/*,database*/} from '../../../index';
//import Select from 'react-select';
//import {selectStyle} from "configs/components/select";
import Permits from "../../../components/permissions";

export default class CompanyEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      companyName: this.props.item.title,

      pricelists:[],
      pricelist:null,
      pausal:0,
      saving:false,
      opened:false
    }
  //  this.fetchData.bind(this);
  //  this.setData.bind(this);
//    this.fetchData();
  }

/*    fetchData(){
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
    }*/

  toggle(){
    this.setState({opened:!this.state.opened})
  }

  render(){
    return (
      <div>
          <Button
            block
            className='btn-link t-a-l '
            onClick={() => this.setState({opened:true})}
            >
           <i className="fa fa-cog sidebar-plus"/> Company settings
          </Button>

        <Modal isOpen={this.state.opened} >
            <ModalHeader>
              Edit company
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="name">Company name</Label>
                <Input name="name" id="name" type="text" placeholder="Enter company name" value={this.state.companyName} onChange={(e)=>this.setState({companyName:e.target.value})} />
              </FormGroup>
          {/*    <FormGroup>
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
              </FormGroup>*/}

              <Permits id={this.props.item.id} view={this.props.item.view} edit={this.props.item.edit} permissions={this.props.item.permissions} db="companies" />

            </ModalBody>
            <ModalFooter>

              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>
              <Button className="btn" disabled={this.state.saving||this.state.loading||this.state.pricelist===undefined||this.state.companyName===""} onClick={()=>{
                  this.setState({saving:true});
                  rebase.updateDoc(`/companies/${this.props.item.id}`, {title:this.state.companyName,})
                    .then(()=>{this.setState({companyName:'', pausal:this.state.pausal, pricelist:this.state.pricelists.length>0?this.state.pricelists[0]:null,saving:false, opened: false})});
                }}>{this.state.saving?'Saving...':'Save changes'}</Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}
