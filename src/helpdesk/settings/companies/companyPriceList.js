import React from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Select from 'react-select';
import {
  selectStyle
} from "configs/components/select";
import Switch from "react-switch";
import PriceEdit from "../prices/priceEdit";

export default function CompanyPriceList( props ) {
  //data
  const {
    pricelist,
    pricelists,
    newData,
    priceName,
    cancel,
    history,
    setPricelist,
    setOldPricelist,
    setNewData,
    setPricelistName
  } = props;

  return (
    <div>
			<div className="row">
        <h3 className="m-b-20 m-r-10">Cenník</h3>
          <label>
            <Switch
              checked={pricelist.def}
              onChange={(checked)=>{
                if (checked){
									setOldPricelist({...pricelist});
									setPricelist( pricelists.find(list => list.def) );
                } else {
									setOldPricelist({...pricelist});
									setPricelist( (pricelists.length > 1 ? pricelists.slice(1, pricelists.length).find(list => !list.def) : {}) );
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
      {!pricelist.def && pricelist !== null &&
          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
            <Label for="pricelist">Pricelist</Label>
            </div>
              <div className="flex">
            <Select
              id="pricelist"
              name="pricelist"
              styles={selectStyle}
              options={pricelists}
              value={pricelist}
              onChange={e => {
									setOldPricelist({...pricelist});
									setPricelist( e );
									setNewData(true);
								}}
              />
          </div>
          </FormGroup>
        }
          {!pricelist.def &&
            pricelist.value === "0" &&
            (priceName === "" ||
            newData) &&
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
                    value={priceName}
                    onChange={(e) => setPricelistName( e.target.value)}/>
                </div>
            </FormGroup>
          }
          { Object.keys(pricelist).length &&
            pricelist !== {} &&
            pricelist.value !== "0" &&
            !pricelist.def &&
            <PriceEdit {...props}
              listId={pricelist.id}
              changedName={ (e) => setPricelist( {...pricelist, label: e} ) }
              deletedList={ () => setPricelist( {...pricelist, label: ""} )}/>
          }
          { Object.keys(pricelist).length &&
            pricelist.value !== "0" &&
            pricelist.def &&
            <div>
              <Button
                className="btn-link-reversed p-l-0"
                onClick={()=>{
                  if (window.confirm("You will be redirected to a page where you can edit this pricelist. All unsaved progress will be lost, are you sure you want to proceed?")){
                    cancel();
                    history.push(`/helpdesk/settings/pricelists/${pricelist.id}`)
                  }
              }}>Edit default pricelist</Button>
            </div>
          }
			</div>
  );
}