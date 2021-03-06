import React from 'react';
import {
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Switch from "react-switch";
import {
  toSelArr,
  toSelItem,
  isEmail
} from 'helperFunctions';
import Loading from 'components/loading';

import CompanyRents from './companyRents';
import CompanyPriceList from './companyPriceList';

import classnames from "classnames";

import {
  GET_PRICELISTS,
  ADD_PRICELIST,
  PRICELISTS_SUBSCRIPTION,
} from '../prices/queries';

import {
  ADD_COMPANY,
} from './queries';
const newPricelist = {
  label: "Nový cenník",
  value: "0"
};

export default function CompanyAdd( props ) {
  //data
  const {
    history,
    match,
    addCompanyToList,
    closeModal
  } = props;
  const [ addCompany, {
    client
  } ] = useMutation( ADD_COMPANY );
  const [ addPricelist ] = useMutation( ADD_PRICELIST );
  const {
    data: pricelistsData,
    loading: pricelistsLoading,
    refetch: pricelistsRefetch,
  } = useQuery( GET_PRICELISTS, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( PRICELISTS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      pricelistsRefetch()
        .then( () => setData( false ) );
    }
  } );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ dph, setDph ] = React.useState( 0 );
  const [ ico, setIco ] = React.useState( "" );
  const [ dic, setDic ] = React.useState( "" );
  const [ ic_dph, setIcDph ] = React.useState( "" );
  const [ country, setCountry ] = React.useState( "" );
  const [ city, setCity ] = React.useState( "" );
  const [ street, setStreet ] = React.useState( "" );
  const [ zip, setZip ] = React.useState( "" );
  const [ email, setEmail ] = React.useState( "" );
  const [ phone, setPhone ] = React.useState( "" );
  const [ description, setDescription ] = React.useState( "" );
  const [ monthly, setMonthly ] = React.useState( false );
  const [ monthlyPausal, setMonthlyPausal ] = React.useState( 0 );
  const [ taskWorkPausal, setTaskWorkPausal ] = React.useState( 0 );
  const [ taskTripPausal, setTaskTripPausal ] = React.useState( 0 );
  const [ pricelist, setPricelist ] = React.useState( {} );
  const [ oldPricelist, setOldPricelist ] = React.useState( {} );
  const [ pricelistName, setPricelistName ] = React.useState( "" );

  const [ saving, setSaving ] = React.useState( false );
  const [ newData, setNewData ] = React.useState( false );
  const [ clearCompanyRents, setClearCompanyRents ] = React.useState( false );
  const [ fakeID, setFakeID ] = React.useState( 0 );

  const [ rents, setRents ] = React.useState( [] );

  const getFakeID = () => {
    let fake = fakeID;
    setFakeID( fakeID + 1 );
    return fake;
  }

  //sync
  React.useEffect( () => {
    setData( true );
  }, [ pricelistsLoading ] );

  //functions
  const setData = ( initial ) => {
    if ( pricelistsLoading ) {
      return;
    }
    let pl = [ newPricelist, ...toSelArr( pricelistsData.pricelists ) ];
    let def = pl.find( ( p ) => p.def );
    if ( initial ) {
      setPricelist( def );
    }
    setOldPricelist( def );
  }

  const addCompanyFunc = () => {
    setSaving( true );

    let newRents = rents.map( r => ( {
      title: r.title,
      quantity: isNaN( parseFloat( r.quantity ) ) ? 0 : parseFloat( r.quantity ),
      cost: isNaN( parseFloat( r.unitCost ) ) ? 0 : parseFloat( r.unitCost ),
      price: isNaN( parseFloat( r.unitPrice ) ) ? 0 : parseFloat( r.unitPrice )
    } ) );

    addCompany( {
        variables: {
          title,
          dph: ( dph === "" ? 0 : parseInt( dph ) ),
          ico,
          dic,
          ic_dph,
          country,
          city,
          street,
          zip,
          email: email.length > 0 ? email : null,
          phone,
          description,
          pricelistId: pricelist.id,
          monthly,
          monthlyPausal: ( monthlyPausal === "" ? 0 : parseFloat( monthlyPausal ) ),
          taskWorkPausal: ( taskWorkPausal === "" ? 0 : parseFloat( taskWorkPausal ) ),
          taskTripPausal: ( taskTripPausal === "" ? 0 : parseFloat( taskTripPausal ) ),
          rents: newRents,
        }
      } )
      .then( ( response ) => {
        if ( closeModal ) {
          addCompanyToList( toSelItem( {
            ...response.data.addCompany,
            __typename: "BasicCompany"
          } ) );
          closeModal();
        } else {
          history.push( '/helpdesk/settings/companies/' + response.data.addCompany.id );
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
  }

  const savePriceList = () => {
    setSaving( true );

    addPricelist( {
        variables: {
          title: pricelistName,
          order: 0,
          afterHours: 0,
          def: false,
          materialMargin: 0,
          materialMarginExtra: 0,
          prices: [],
        },
      }, )
      .then( ( response ) => {
        let newPricelist = response.data.addPricelist;
        setPricelist( newPricelist );
        addCompanyFunc();
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
  }

  const cancel = () => {
    setPricelist( oldPricelist );
    setNewData( false );
    setPricelistName( "" );
  }

  const attributes = [ title, ico ];
  const cannotSave = saving || attributes.some( attr => attr === "" ) || ( pricelist.value === "0" && pricelistName === "" ) || ( !isEmail( email ) && email.length !== 0 );

  if ( pricelistsLoading ) {
    return <Loading />
  }

  const pricelists = [
  newPricelist,
  ...toSelArr( pricelistsData.pricelists )
];

  return (
    <div>
      {!closeModal &&
        <div className="commandbar a-i-c p-l-20">
          { cannotSave &&
            <div className="message error-message">
              Fill in all the required information!
            </div>
          }
        </div>
      }
      {
        newData &&
        !closeModal &&
        <div style={{position: "fixed", zIndex: "999", backgroundColor: "rgba(255,255,255,0.5)", top: "0", left: "0", width: "100%", height: "100vh"}}></div>
      }
      <div
        className={
          classnames(
            "p-t-10 p-b-20",
            {"scroll-visible fit-with-header-and-commandbar": !closeModal},
            {
              "bring-to-front": newData
            },
          )
        }
        >
        <h2 className="m-b-20 p-l-20 p-r-20" >
          Add company
        </h2>
        <FormGroup className="row m-b-10 p-l-20 p-r-20">
          <div className="m-r-10 w-20">
            <Label for="name">Company name <span className="warning-big">*</span></Label>
          </div>
          <div className="flex">
            <Input
              name="name"
              id="name"
              type="text"
              placeholder="Enter company name"
              value={title}
              onChange={(e)=> {
                setTitle(e.target.value);
                setNewData( true );
              }}
              />
          </div>
        </FormGroup>

        <FormGroup className="row m-b-10 p-l-20 p-r-20">
          <div className="m-r-10 w-20">
            <Label for="dph">DPH</Label>
          </div>
          <div className="flex">
            <Input
              name="dph"
              id="dph"
              type="number"
              placeholder="Enter DPH"
              value={dph}
              onChange={(e)=>{
                setDph(e.target.value);
                setNewData( true );
              }}
              />
          </div>
        </FormGroup>

        <FormGroup className="row m-b-10 p-l-20 p-r-20">
          <div className="m-r-10 w-20">
            <Label for="ico">ICO <span className="warning-big">*</span></Label>
          </div>
          <div className="flex">
            <Input
              name="ico"
              id="ico"
              type="text"
              placeholder="Enter ICO"
              value={ico}
              onChange={(e)=>{
                setIco(e.target.value);
                setNewData( true );
              }}
              />
          </div>
        </FormGroup>

        <FormGroup className="row m-b-10 p-l-20 p-r-20">
          <div className="m-r-10 w-20">
            <Label for="dic">DIC</Label>
          </div>
          <div className="flex">
            <Input
              name="dic"
              id="dic"
              type="text"
              placeholder="Enter DIC"
              value={dic}
              onChange={(e)=>{
                setDic(e.target.value);
                setNewData( true );
              }}
              />
          </div>
        </FormGroup>

        <FormGroup className="row m-b-10 p-l-20 p-r-20">
          <div className="m-r-10 w-20">
            <Label for="ic_dph">IC DPH</Label>
          </div>
          <div className="flex">
            <Input
              name="ic_dph"
              id="ic_dph"
              type="text"
              placeholder="Enter IC DPH"
              value={ic_dph}
              onChange={(e)=>{
                setIcDph(e.target.value);
                setNewData( true );
              }}
              />
          </div>
        </FormGroup>

        <FormGroup className="row m-b-10 p-l-20 p-r-20">
          <div className="m-r-10 w-20">
            <Label for="country">Country</Label>
          </div>
          <div className="flex">
            <Input
              name="country"
              id="country"
              type="text"
              placeholder="Enter country"
              value={country}
              onChange={(e)=>{
                setCountry(e.target.value);
                setNewData( true );
              }}
              />
          </div>
        </FormGroup>

        <FormGroup className="row m-b-10 p-l-20 p-r-20">
          <div className="m-r-10 w-20">
            <Label for="city">City</Label>
          </div>
          <div className="flex">
            <Input
              name="city"
              id="city"
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e)=>{
                setCity(e.target.value);
                setNewData( true );
              }}
              />
          </div>
        </FormGroup>

        <FormGroup className="row m-b-10 p-l-20 p-r-20">
          <div className="m-r-10 w-20">
            <Label for="street">Street</Label>
          </div>
          <div className="flex">
            <Input
              name="street"
              id="street"
              type="text"
              placeholder="Enter street"
              value={street}
              onChange={(e)=>{
                setStreet(e.target.value);
                setNewData( true );
              }}
              />
          </div>
        </FormGroup>

        <FormGroup className="row m-b-10 p-l-20 p-r-20">
          <div className="m-r-10 w-20">
            <Label for="psc">PSČ</Label>
          </div>
          <div className="flex">
            <Input
              name="psc"
              id="psc"
              type="text"
              placeholder="Enter PSČ"
              value={zip}
              onChange={(e)=>{
                setZip(e.target.value);
                setNewData( true );
              }}
              />
          </div>
        </FormGroup>

        <FormGroup className="row m-b-10 p-l-20 p-r-20">
          <div className="m-r-10 w-20">
            <Label for="mail">E-mail</Label>
          </div>
          <div className="flex">
            <Input
              name="mail"
              id="mail"
              className={(email.length > 0 && !isEmail(email)) ? "form-control-warning" : ""}
              type="text"
              placeholder="Enter e-mail (must be email or empty)"
              value={email}
              onChange={(e)=>{
                setEmail(e.target.value);
                setNewData( true );
              }}
              />
          </div>
        </FormGroup>

        <FormGroup className="row m-b-10 p-l-20 p-r-20">
          <div className="m-r-10 w-20">
            <Label for="phone">Phone</Label>
          </div>
          <div className="flex">
            <Input
              name="phone"
              id="phone"
              type="text"
              placeholder="Enter phone"
              value={phone}
              onChange={(e)=>{
                setPhone(e.target.value);
                setNewData( true );
              }}
              />
          </div>
        </FormGroup>

        <FormGroup className="row p-l-20 p-r-20">
          <div className="m-r-10 w-20">
            <Label for="description">Description</Label>
          </div>
          <div className="flex">
            <Input
              name="description"
              id="description"
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e)=>{
                setDescription(e.target.value);
                setNewData( true );
              }}
              />
          </div>
        </FormGroup>

        <div className="p-20 m-t-15 table-highlight-background">
          <div className="row">
            <span className="m-r-5">
              <h3>Mesačný paušál</h3>
            </span>
            <label>
              <Switch
                checked={monthly}
                onChange={()=> {
                  setMonthly(!monthly);
                  setNewData( true );
                }}
                height={22}
                checkedIcon={<span className="switchLabel">YES</span>}
                uncheckedIcon={<span className="switchLabel">NO</span>}
                onColor={"#0078D4"} />
              <span className="m-l-10"></span>
            </label>
          </div>
          { monthly && <div>
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
                  value={monthlyPausal}
                  onChange={(e)=>{
                    setMonthlyPausal(e.target.value);
                    setNewData( true );
                  }}
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
                  value={taskWorkPausal}
                  onChange={(e) => {
                    setTaskWorkPausal(e.target.value);
                    setNewData( true );
                  }}
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
                  value={taskTripPausal}
                  onChange={(e)=> {
                    setTaskTripPausal(e.target.value);
                    setNewData( true );
                  }}
                  />
              </div>
            </FormGroup>

            {!props.addCompany &&
              <div className="p-20">
                <h3 className="m-b-15">Mesačný prenájom licencií a hardware</h3>
                <CompanyRents
                  clearForm={clearCompanyRents}
                  setClearForm={()=>setClearCompanyRents(false)}
                  data={rents}
                  updateRent={(rent)=>{
                    let newRents=[...rents];
                    newRents[newRents.findIndex((item)=>item.id===rent.id)]={...newRents.find((item)=>item.id===rent.id),...rent};
                    setRents( newRents );
                    setNewData( true );
                  }}
                  addRent={(rent)=>{
                    let newRents=[...rents];
                    newRents.push({...rent, id: getFakeID()})
                    setRents( newRents );
                    setNewData( true );
                  }}
                  removeRent={(rent)=>{
                    let newRents=[...rents];
                    newRents.splice(newRents.findIndex((item)=>item.id===rent.id),1);
                    setRents( newRents );
                    setNewData( true );
                  }}
                  />
              </div>
            }
          </div>}

          <CompanyPriceList
            pricelists={pricelists}
            pricelist={pricelist}
            oldPricelist={oldPricelist}
            pricelistName={pricelistName}
            newData={newData}
            cancel={() => cancel()}
            setPricelist={(pl) => setPricelist(pl)}
            setOldPricelist={(pl) => setOldPricelist(pl)}
            setNewData={(e) => setNewData(e)}
            setPricelistName={(n) => setPricelistName(n)}
            match={match}
            />
        </div>

        <div className="form-buttons-row p-l-20 p-r-20">
          { closeModal &&
            <button
              className="btn-link-cancel mr-auto"
              disabled={saving}
              onClick={closeModal}
              >
              Cancel
            </button>
          }
          { !closeModal && newData &&
            <button
              className="btn-link-cancel mr-auto"
              disabled={saving}
              onClick={cancel}
              >
              Cancel
            </button>
          }

            { closeModal && cannotSave &&
              <div className="message error-message">
                Fill in all the required information!
              </div>
            }

            <button
              className={classnames(
                  "btn",
                  {"ml-auto": !closeModal}
                )}
              disabled={cannotSave && !newData}
              onClick={()=>{
                if (pricelist.value === "0" && pricelistName !== ""){
                  savePriceList();
                } else {
                  addCompanyFunc();
                }
              }}
              >
              {(pricelist.value === "0" && pricelistName !== "" ? "Save changes" : (saving?'Adding...':'Add company'))}
            </button>

          </div>
        </div>
      </div>
  );
}