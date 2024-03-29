import React from 'react';
import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Select from 'react-select';
import {
  pickSelectStyle
} from "configs/components/select";
import Switch from "react-switch";
import PriceEdit from "../pricelists/pricelistEdit";
import {
  useTranslation
} from "react-i18next";

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

  const {
    t
  } = useTranslation();

  return (
    <div>
      <div className="row">
        <h3 className="m-b-20 m-r-10">{t('pricelist')}</h3>
        <label>
          <Switch
            checked={ pricelist !== null && pricelist.def === true }
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
            checkedIcon={<span className="switchLabel">{t('default')}</span>}
            uncheckedIcon={<span className="switchLabel-right">{t('custom')}</span>}
            onColor={"#0078D4"}
            />
          <span className="m-l-10"></span>
        </label>
      </div>
      { pricelist !== null && !pricelist.def &&
        <FormGroup>
            <Label for="pricelist">{t('pricelist')}</Label>
            <Select
              id="pricelist"
              name="pricelist"
              styles={pickSelectStyle()}
              options={pricelists}
              value={pricelist}
              onChange={e => {
                setOldPricelist({...pricelist});
                setPricelist( e );
                setNewData(true);
              }}
              />
        </FormGroup>
      }
      { pricelist !== null &&
        !pricelist.def &&
        pricelist.value === "0" &&
        (
          priceName === "" ||
          newData
        ) &&
        <FormGroup className="row m-b-10">
          <div className="m-r-10 width-20-p">
            <Label for="priceName">{t('pricelistTitle')}</Label>
          </div>
          <div className="flex">
            <Input
              name="priceName"
              id="priceName"
              type="text"
              placeholder={t('pricelistTitlePlaceholder')}
              value={priceName}
              onChange={(e) => setPricelistName( e.target.value)}/>
          </div>
        </FormGroup>
      }
      { pricelist !== null &&
        pricelist.value !== "0" &&
        !pricelist.def &&
        <PriceEdit {...props}
          listId={pricelist.id}
          changedName={ (e) => setPricelist( {...pricelist, label: e} ) }
          deletedList={ () => setPricelist( {...pricelist, label: ""} )}/>
      }
      { pricelist !== null &&
        pricelist.value !== "0" &&
        pricelist.def &&
        <div>
          <button
            className="btn-link p-l-0"
            onClick={()=>{
              if (window.confirm(t('pricelistRedirect'))){
                cancel();
                history.push(`/helpdesk/settings/pricelists/${pricelist.id}`)
              }
            }}
            >
            {t('editDefaultPricelist')}
          </button>
        </div>
      }
    </div>
  );
}