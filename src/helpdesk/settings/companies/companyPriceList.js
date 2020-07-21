import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";
import Switch from "react-switch";
import PriceEdit from "../prices/priceEdit";

export default class CompanyPriceList extends Component {

	render() {
		return (
			<div>
				<div className="row">
	        <h3 className="m-b-20 m-r-10">Cenník</h3>
	          <label>
	            <Switch
	              checked={this.props.pricelist.def}
	              onChange={(checked)=>{
	                if (checked){
										this.props.setData({oldPricelist: {...this.props.pricelist}, pricelist: this.props.pricelists.find(list => list.def)})
	                } else {
										this.props.setData({oldPricelist: {...this.props.pricelist}, pricelist: (this.props.pricelists.length > 1 ? this.props.pricelists.slice(1, this.props.pricelists.length).find(list => !list.def) : {})})
	                }
	              }}
	              height={22}
	              width={80}
	              checkedIcon={<span className="switchLabel">Default</span>}
	              uncheckedIcon={<span className="switchLabel-right">Vlastný</span>}
	              onColor={"#0078D4"} />
	            <span className="m-l-10"></span>
	          </label>
	      </div>
	      {!this.props.pricelist.def && this.props.pricelist !== null &&
	          <FormGroup className="row m-b-10">
	            <div className="m-r-10 w-20">
	            <Label for="pricelist">Pricelist</Label>
	            </div>
	              <div className="flex">
	            <Select
	              id="pricelist"
	              name="pricelist"
	              styles={selectStyle}
	              options={this.props.pricelists}
	              value={this.props.pricelist}
	              onChange={e =>this.props.setData({oldPricelist: {...this.props.pricelist}, pricelist: e, newData: true}) }
	              />
	          </div>
	          </FormGroup>
	        }
	          {!this.props.pricelist.def &&
	            this.props.pricelist.value === "0" &&
	            (this.props.priceName === "" ||
	            this.props.newData) &&
	            <FormGroup className="row m-b-10">
	              <div className="m-r-10 w-20">
	              <Label for="priceName">Price list name</Label>
	              </div>
	                <div className="flex">
	                  <Input
	                    name="priceName"
	                    id="priceName"
	                    type="text"
	                    placeholder="Enter price list nema"
	                    value={this.props.priceName}
	                    onChange={(e) => this.props.setData({priceName: e.target.value})}/>
	                </div>
	            </FormGroup>
	          }
	          { Object.keys(this.props.pricelist).length &&
	            this.props.pricelist !== {} &&
	            this.props.pricelist.value !== "0" &&
	            !this.props.pricelist.def &&
	            <PriceEdit {...this.props}
	              listId={this.props.pricelist.id}
	              changedName={ (e) => this.props.setData({pricelist: {...this.props.pricelist, label: e} })}
	              deletedList={ () => this.props.setData({pricelist: {}, priceName: ""})}/>
	          }
	          { Object.keys(this.props.pricelist).length &&
	            this.props.pricelist.value !== "0" &&
	            this.props.pricelist.def &&
	            <div>
	              <Button
	                className="btn-link-reversed p-l-0"
	                onClick={()=>{
	                  if (window.confirm("You will be redirected to a page where you can edit this pricelist. All unsaved progress will be lost, are you sure you want to proceed?")){
	                    this.props.cancel();
	                    this.props.history.push(`/helpdesk/settings/pricelists/${this.props.pricelist.id}`)
	                  }
	              }}>Edit default pricelist</Button>
	            </div>
	          }
				</div>
			);
		}
	}
