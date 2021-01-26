import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";

import {
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Switch from "react-switch";
import {
  toSelArr
} from '../../../helperFunctions';

import {
  isEmail
} from '../../../helperFunctions';
import CompanyRents from './companyRents';
import CompanyPriceList from './companyPriceList';
import DeleteReplacement from 'components/deleteReplacement';
import Loading from 'components/loading';
import classnames from 'classnames';

import {
  GET_PRICELISTS,
  ADD_PRICELIST
} from '../prices/queries';

import {
  GET_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
  GET_COMPANIES,
} from './queries';

export default function CompanyEdit( props ) {
  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading,
    refetch
  } = useQuery( GET_COMPANY, {
    variables: {
      id: parseInt( match.params.id )
    },
    notifyOnNetworkStatusChange: true,
  } );
  const [ updateCompany ] = useMutation( UPDATE_COMPANY );
  const [ deleteCompany, {
    client
  } ] = useMutation( DELETE_COMPANY );

  const [ addPricelist ] = useMutation( ADD_PRICELIST );
  const {
    data: pricelistsData,
    loading: pricelistsLoading
  } = useQuery( GET_PRICELISTS );
  let pl = ( pricelistsLoading || !pricelistsData ? [] : pricelistsData.pricelists );
  pl = [ {
    label: "Nový cenník",
    value: "0"
  }, ...toSelArr( pl ) ];
  const [ pricelists, setPricelists ] = React.useState( pl );

  const allCompanies = toSelArr( client.readQuery( {
      query: GET_COMPANIES
    } )
    .companies );
  const filteredCompanies = allCompanies.filter( comp => comp.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allCompanies.length === 0;

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ oldTitle, setOldTitle ] = React.useState( "" );

  const [ dph, setDph ] = React.useState( 0 );
  const [ oldDph, setOldDph ] = React.useState( 0 );

  const [ ico, setIco ] = React.useState( "" );
  const [ oldIco, setOldIco ] = React.useState( "" );

  const [ dic, setDic ] = React.useState( "" );
  const [ oldDic, setOldDic ] = React.useState( "" );

  const [ ic_dph, setIcDph ] = React.useState( "" );
  const [ oldIcDph, setOldIcDph ] = React.useState( "" );

  const [ country, setCountry ] = React.useState( "" );
  const [ oldCountry, setOldCountry ] = React.useState( "" );

  const [ city, setCity ] = React.useState( "" );
  const [ oldCity, setOldCity ] = React.useState( "" );

  const [ street, setStreet ] = React.useState( "" );
  const [ oldStreet, setOldStreet ] = React.useState( "" );

  const [ zip, setZip ] = React.useState( "" );
  const [ oldZip, setOldZip ] = React.useState( "" );

  const [ email, setEmail ] = React.useState( "" );
  const [ oldEmail, setOldEmail ] = React.useState( "" );

  const [ phone, setPhone ] = React.useState( "" );
  const [ oldPhone, setOldPhone ] = React.useState( "" );

  const [ description, setDescription ] = React.useState( "" );
  const [ oldDescription, setOldDescription ] = React.useState( "" );

  const [ monthly, setMonthly ] = React.useState( false );
  const [ oldMonthly, setOldMonthly ] = React.useState( false );

  const [ monthlyPausal, setMonthlyPausal ] = React.useState( 0 );
  const [ oldMonthlyPausal, setOldMonthlyPausal ] = React.useState( 0 );

  const [ taskWorkPausal, setTaskWorkPausal ] = React.useState( 0 );
  const [ oldTaskWorkPausal, setOldTaskWorkPausal ] = React.useState( 0 );

  const [ taskTripPausal, setTaskTripPausal ] = React.useState( 0 );
  const [ oldTaskTripPausal, setOldTaskTripPausal ] = React.useState( 0 );

  const [ pricelist, setPricelist ] = React.useState( {} );
  const [ oldPricelist, setOldPricelist ] = React.useState( {} );
  const [ pricelistName, setPricelistName ] = React.useState( "" );

  const [ saving, setSaving ] = React.useState( false );
  const [ deleting ] = React.useState( false );
  const [ dataChanged, setDataChanged ] = React.useState( false );
  const [ clearCompanyRents, setClearCompanyRents ] = React.useState( false );
  const [ fakeID, setFakeID ] = React.useState( 0 );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );

  const [ rents, setRents ] = React.useState( [] );


  const getFakeID = () => {
    let fake = fakeID;
    setFakeID( fakeID + 1 );
    return fake;
  }

  //sync
  React.useEffect( () => {
    if ( !pricelistsLoading ) {
      let pl = [ {
        label: "Nový cenník",
        value: "0"
      }, ...toSelArr( pricelistsData.pricelists ) ];
      setPricelists( pl );
    }
  }, [ pricelistsLoading ] );

  React.useEffect( () => {
    if ( !loading ) {
      setTitle( data.company.title );
      setOldTitle( data.company.title );
      setDph( data.company.dph );
      setOldDph( data.company.dph );
      setIco( data.company.ico );
      setOldIco( data.company.ico );
      setDic( data.company.dic );
      setOldDic( data.company.dic );
      setIcDph( data.company.ic_dph );
      setOldIcDph( data.company.ic_dph );
      setCountry( data.company.country );
      setOldCountry( data.company.country );
      setCity( data.company.city );
      setOldCity( data.company.city );
      setStreet( data.company.street );
      setOldStreet( data.company.street );
      setZip( data.company.zip );
      setOldZip( data.company.zip );
      setEmail( data.company.email );
      setOldEmail( data.company.email );
      setPhone( data.company.phone );
      setOldPhone( data.company.phone );
      setDescription( data.company.description );
      setOldDescription( data.company.description );
      setMonthly( data.company.monthly );
      setOldMonthly( data.company.monthly );
      setMonthlyPausal( data.company.monthlyPausal );
      setOldMonthlyPausal( data.company.monthlyPausal );
      setTaskWorkPausal( data.company.taskWorkPausal );
      setOldTaskWorkPausal( data.company.taskWorkPausal );
      setTaskTripPausal( data.company.taskTripPausal );
      setOldTaskTripPausal( data.company.taskTripPausal );
      let pl = {
        ...data.company.pricelist,
        value: data.company.pricelist.id,
        label: data.company.pricelist.title
      };
      setPricelist( pl );
      setOldPricelist( pl );
      let r = data.company.companyRents.map( re => {
        return {
          id: re.id,
          title: re.title,
          quantity: re.quantity,
          unitPrice: re.price,
          unitCost: re.cost,
          totalPrice: parseInt( re.quantity ) * parseFloat( re.price ),
        }
      } )
      setRents( r );

      setDataChanged( false );
    }
  }, [ loading ] );

  React.useEffect( () => {
    refetch( {
      variables: {
        id: parseInt( match.params.id )
      }
    } );
  }, [ match.params.id ] );

  // functions
  const updateCompanyFunc = ( pricelistId = null ) => {
    setSaving( true );

    let newRents = rents.map( r => {
      let newRent = {
        title: r.title,
        quantity: isNaN( parseInt( r.quantity ) ) ? 0 : parseInt( r.quantity ),
        cost: isNaN( parseInt( r.unitCost ) ) ? 0 : parseInt( r.unitCost ),
        price: isNaN( parseInt( r.unitPrice ) ) ? 0 : parseInt( r.unitPrice )
      };
      if ( r.id ) {
        newRent.id = r.id;
      }
      return newRent;
    } );

    updateCompany( {
        variables: {
          id: parseInt( match.params.id ),
          title,
          dph: ( dph === "" ? 0 : parseInt( dph ) ),
          ico,
          dic,
          ic_dph,
          country,
          city,
          street,
          zip,
          email,
          phone,
          description,
          pricelistId: pricelistId ? pricelistId : pricelist.id,
          monthly,
          monthlyPausal: ( monthlyPausal === "" ? 0 : parseFloat( monthlyPausal ) ),
          taskWorkPausal: ( taskWorkPausal === "" ? 0 : parseFloat( taskWorkPausal ) ),
          taskTripPausal: ( taskTripPausal === "" ? 0 : parseFloat( taskTripPausal ) ),
          rents: newRents,
        }
      } )
      .then( ( response ) => {
        //TODO update company list
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
    setDataChanged( false );
  };

  const deleteCompanyFunc = ( replacement ) => {
    setDeleteOpen( false );

    if ( window.confirm( "Are you sure?" ) ) {
      deleteCompany( {
          variables: {
            id: parseInt( match.params.id ),
            newId: parseInt( replacement.id ),
          }
        } )
        .then( ( response ) => {
          client.writeQuery( {
            query: GET_COMPANIES,
            data: {
              companies: filteredCompanies
            }
          } );
          history.push( '/helpdesk/settings/companies/add' );
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
    }
  };

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
        }
      } )
      .then( ( response ) => {
        const newPricelist = {
          ...response.data.addPricelist,
          __typename: "Pricelist"
        };
        setPricelist( newPricelist );
        const newPricelists = pricelists.concat( [ newPricelist ] );
        setPricelists( newPricelists );
        setPricelistName( "" );

        client.writeQuery( {
          query: GET_PRICELISTS,
          data: {
            pricelists: [ ...pricelistsData.pricelists, newPricelist ]
          }
        } );

        updateCompanyFunc( newPricelist.id );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
    setSaving( false );
  }

  const cancel = () => {
    setTitle( oldTitle );
    setIco( oldIco );
    setDic( oldDic );
    setDph( oldDph );
    setIcDph( oldIcDph );
    setCountry( oldCountry );
    setCity( oldCity );
    setStreet( oldStreet );
    setZip( oldZip );
    setEmail( oldEmail );
    setPhone( oldPhone );
    setDescription( oldDescription );
    setMonthly( oldMonthly );
    setMonthlyPausal( oldMonthlyPausal );
    setTaskWorkPausal( oldTaskWorkPausal );
    setTaskTripPausal( oldTaskTripPausal );
    setPricelist( oldPricelist );

    setClearCompanyRents( true );
    setDataChanged( false );
    setPricelistName( "" );
  }

  const attributes = [ title, ico, email ];
  const cannotSave = saving || attributes.some( attr => attr === "" ) || ( pricelist.value === "0" && pricelistName === "" );

  if ( loading ) {
    return <Loading />
  }

  return (
    <div>
      <div className="commandbar a-i-c p-l-20">
        { dataChanged &&
          <div className="message error-message">
            Save changes before leaving!
          </div>
        }
        { !dataChanged &&
          <div className="message success-message">
            Saved
          </div>
        }
      </div>
      <div className="fit-with-header-and-commandbar">
        {dataChanged &&
          <div style={{position: "fixed", zIndex: "999", backgroundColor: "rgba(255,255,255,0.5)", top: "0", left: "0", width: "100%", height: "100vh"}}></div>
        }

        <h2 className={ classnames(
            "p-t-10",
            "p-l-20",
            "p-b-5",
            {
              "bring-to-front": dataChanged
            },
          )}
          >
          Edit company
        </h2>

        <hr className={ classnames(
            {
              "bring-to-front": dataChanged
            },
          )}
          />

        <div
          className={ classnames(
            "form-body-highlighted",
            "scroll-visible",
            {
              "bring-to-front": dataChanged
            },
          )}
          >
          <div className="p-20">
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="name">Company name<span className="warning-big">*</span></Label>
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
                    setDataChanged( true );
                  }}
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
                  value={dph}
                  onChange={(e)=>{
                    setDph(e.target.value);
                    setDataChanged( true );
                  }}
                  />
              </div>
            </FormGroup>

            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="ico">ICO<span className="warning-big">*</span></Label>
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
                    setDataChanged( true );
                  }}
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
                  value={dic}
                  onChange={(e)=>{
                    setDic(e.target.value);
                    setDataChanged( true );
                  }}
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
                  value={ic_dph}
                  onChange={(e)=>{
                    setIcDph(e.target.value);
                    setDataChanged( true );
                  }}
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
                  value={country}
                  onChange={(e)=>{
                    setCountry(e.target.value);
                    setDataChanged( true );
                  }}
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
                  value={city}
                  onChange={(e)=>{
                    setCity(e.target.value);
                    setDataChanged( true );
                  }}
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
                  value={street}
                  onChange={(e)=>{
                    setStreet(e.target.value);
                    setDataChanged( true );
                  }}
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
                  value={zip}
                  onChange={(e)=>{
                    setZip(e.target.value);
                    setDataChanged( true );
                  }}
                  />
              </div>
            </FormGroup>

            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="mail">E-mail<span className="warning-big">*</span></Label>
              </div>
              <div className="flex">
                <Input
                  name="mail"
                  id="mail"
                  className={(email.length > 0 && !isEmail(email)) ? "form-control-warning" : ""}
                  type="text"
                  placeholder="Enter e-mail"
                  value={email}
                  onChange={(e)=>{
                    setEmail(e.target.value);
                    setDataChanged( true );
                  }}
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
                  value={phone}
                  onChange={(e)=>{
                    setPhone(e.target.value);
                    setDataChanged( true );
                  }}
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
                  value={description}
                  onChange={(e)=>{
                    setDescription(e.target.value);
                    setDataChanged( true );
                  }}
                  />
              </div>
            </FormGroup>

          </div>

          <div className="p-20 table-highlight-background">
            <div className="row">
              <span className="m-r-5">
                <h3>Mesačný paušál</h3>
              </span>
              <label>
                <Switch
                  checked={monthly}
                  onChange={()=> {
                    setMonthly(!monthly);
                    setDataChanged( true );
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
                      setDataChanged( true );
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
                      setDataChanged( true );
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
                      setDataChanged( true );
                    }}
                    />
                </div>
              </FormGroup>

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
                    setDataChanged( true );
                  }}
                  addRent={(rent)=>{
                    let newRents=[...rents];
                    newRents.push({...rent, id: getFakeID()})
                    setRents( newRents );
                    setDataChanged( true );
                  }}
                  removeRent={(rent)=>{
                    let newRents=[...rents];
                    newRents.splice(newRents.findIndex((item)=>item.id===rent.id),1);
                    setRents( newRents );
                    setDataChanged( true );
                  }}
                  />
              </div>

            </div>}

            <CompanyPriceList
              pricelists={pricelists}
              pricelist={pricelist}
              oldPricelist={oldPricelist}
              pricelistName={pricelistName}
              newData={dataChanged}
              cancel={() => cancel()}
              setPricelist={(pl) => setPricelist(pl)}
              setOldPricelist={(pl) => setOldPricelist(pl)}
              setNewData={(e) => setDataChanged(e)}
              setPricelistName={(n) => setPricelistName(n)}
              match={match}
              />
          </div>
        </div>

        <div
          className={ classnames(
            "form-footer row",
            {
              "bring-to-front": dataChanged
            }
          )}
          >

          {dataChanged &&
            <Button
              className="btn-link"
              disabled={saving}
              onClick={cancel}>Cancel changes</Button>
          }
          <Button className="btn-red" disabled={saving || deleting || theOnlyOneLeft} onClick={() => setDeleteOpen(true)}>Delete</Button>
          {dataChanged &&
            <Button
              className="btn m-r-5 ml-auto"
              disabled={ cannotSave }
              onClick={()=>{
                if (pricelist.value === "0" && pricelistName !== ""){
                  savePriceList();
                } else {
                  updateCompanyFunc();
                }
              }}
              >
              {saving?'Saving...':'Save changes'}
            </Button>
          }

        </div>
        <DeleteReplacement
          isOpen={deleteOpen}
          label="company"
          options={filteredCompanies}
          close={()=>setDeleteOpen(false)}
          finishDelete={deleteCompanyFunc}
          />

      </div>
    </div>
  );
}