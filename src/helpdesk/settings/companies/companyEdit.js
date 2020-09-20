import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label, Input, Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap';
import Switch from "react-switch";
import {toSelArr} from '../../../helperFunctions';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import { isEmail } from '../../../helperFunctions';
import CompanyRents from './companyRents';
import CompanyPriceList from './companyPriceList';
import Loading from 'components/loading';

import {  GET_COMPANIES } from './index';
import {  GET_PRICELISTS } from '../prices/index';
import {  ADD_PRICELIST } from '../prices/priceAdd';

const GET_COMPANY = gql`
query company($id: Int!) {
  company (
    id: $id
  ) {
      title
      dph
      ico
      dic
      ic_dph
      country
      city
      street
      zip
      email
      phone
      description
      pricelist {
        id
        title
        order
        afterHours
        def
        materialMargin
        materialMarginExtra
        prices {
          id
          type
          price
          taskType {
            id
            title
          }
          tripType {
            id
            title
          }
        }
      }
      monthly
      monthlyPausal
      taskWorkPausal
      taskTripPausal
      companyRents {
        id
        title
        quantity
        cost
        price
      }
    }
}
`;
const UPDATE_COMPANY = gql`
mutation updateCompany($id: Int!, $title: String, $dph: Int, $ico: String, $dic: String, $ic_dph: String, $country: String, $city: String, $street: String, $zip: String, $email: String, $phone: String, $description: String, $pricelistId: Int!, $monthly: Boolean, $monthlyPausal: Float, $taskWorkPausal: Float, $taskTripPausal: Float, $rents: [CompanyRentUpdateInput]) {
  updateCompany(
    id: $id,
    title: $title,
    dph: $dph,
    ico: $ico,
    dic: $dic,
    ic_dph: $ic_dph,
    country: $country,
    city: $city,
    street: $street,
    zip: $zip,
    email: $email,
    phone: $phone,
    description: $description,
    pricelistId: $pricelistId,
    monthly: $monthly,
    monthlyPausal: $monthlyPausal,
    taskWorkPausal: $taskWorkPausal,
    taskTripPausal: $taskTripPausal,
    rents: $rents,
  ){
    id
    title
    monthlyPausal
    taskWorkPausal
    taskTripPausal
  }
}
`;

export const DELETE_COMPANY = gql`
mutation deleteCompany($id: Int!, $newId: Int!) {
  deleteCompany(
    id: $id,
    newId: $newId,
  ){
    id
  }
}
`;

export default function CompanyEdit(props){
  //data
  const { history, match } = props;
  const { data, loading, refetch } = useQuery(GET_COMPANY, { variables: {id: parseInt(match.params.id)} });
  const [updateCompany] = useMutation(UPDATE_COMPANY);
  const [deleteCompany, {client}] = useMutation(DELETE_COMPANY);

  const [ addPricelist ] = useMutation(ADD_PRICELIST);
  const { data: pricelistsData, loading: pricelistsLoading } = useQuery(GET_PRICELISTS);
  let pl = (pricelistsLoading || !pricelistsData ? [] : pricelistsData.pricelists);
  pl = [{label: "Nový cenník", value: "0"}, ...toSelArr(pl)];
  const [ pricelists, setPricelists ] = React.useState(pl);

  const allCompanies = toSelArr(client.readQuery({query: GET_COMPANIES}).companies);
  const filteredCompanies = allCompanies.filter( comp => comp.id !== parseInt(match.params.id) );
  const theOnlyOneLeft = allCompanies.length === 0;

  //state
  const [ title, setTitle ] = React.useState("");
  const [ oldTitle, setOldTitle ] = React.useState("");

    const [ dph, setDph ] = React.useState(0);
    const [ oldDph, setOldDph ] = React.useState(0);

  const [ ico, setIco ] = React.useState("");
  const [ oldIco, setOldIco ] = React.useState("");

  const [ dic, setDic ] = React.useState("");
  const [ oldDic, setOldDic ] = React.useState("");

  const [ ic_dph, setIcDph ] = React.useState("");
  const [ oldIcDph, setOldIcDph ] = React.useState("");

  const [ country, setCountry ] = React.useState("");
  const [ oldCountry, setOldCountry ] = React.useState("");

  const [ city, setCity ] = React.useState("");
  const [ oldCity, setOldCity ] = React.useState("");

  const [ street, setStreet ] = React.useState("");
  const [ oldStreet, setOldStreet ] = React.useState("");

  const [ zip, setZip ] = React.useState("");
  const [ oldZip, setOldZip ] = React.useState("");

  const [ email, setEmail ] = React.useState("");
  const [ oldEmail, setOldEmail ] = React.useState("");

  const [ phone, setPhone ] = React.useState("");
  const [ oldPhone, setOldPhone ] = React.useState("");

  const [ description, setDescription ] = React.useState("");
  const [ oldDescription, setOldDescription ] = React.useState("");

  const [ monthly, setMonthly ] = React.useState(false);
  const [ oldMonthly, setOldMonthly ] = React.useState(false);

  const [ monthlyPausal, setMonthlyPausal ] = React.useState(0);
  const [ oldMonthlyPausal, setOldMonthlyPausal ] = React.useState(0);

  const [ taskWorkPausal, setTaskWorkPausal ] = React.useState(0);
  const [ oldTaskWorkPausal, setOldTaskWorkPausal ] = React.useState(0);

  const [ taskTripPausal, setTaskTripPausal ] = React.useState(0);
  const [ oldTaskTripPausal, setOldTaskTripPausal ] = React.useState(0);

  const [ pricelist, setPricelist ] = React.useState({});
  const [ oldPricelist, setOldPricelist ] = React.useState({});
  const [ pricelistName, setPricelistName ] = React.useState("");

  const [ saving, setSaving ] = React.useState(false);
  const [ deleting ] = React.useState(false);
  const [ newData, setNewData ] = React.useState(false);
  const [ clearCompanyRents, setClearCompanyRents ] = React.useState(false);
  const [ fakeID, setFakeID ] = React.useState(0);

  const [ newCompany, setNewCompany ] = React.useState(null);
  const [ choosingNewCompany, setChooseingNewCompany ] = React.useState(false);

  const [ rents, setRents ] = React.useState([]);

  const getFakeID = () => {
    let fake = fakeID;
    setFakeID(fakeID+1);
    return fake;
  }

  //sync
  React.useEffect( () => {
      if (!pricelistsLoading){
        let pl = [{label: "Nový cenník", value: "0"}, ...toSelArr(pricelistsData.pricelists)];
        setPricelists(pl);
      }
  }, [pricelistsLoading]);

  React.useEffect( () => {
      if (!loading){
        setTitle(data.company.title);
        setOldTitle(data.company.title);
        setDph(data.company.dph);
        setOldDph(data.company.dph);
        setIco(data.company.ico);
        setOldIco(data.company.ico);
        setDic(data.company.dic);
        setOldDic(data.company.dic);
        setIcDph(data.company.ic_dph);
        setOldIcDph(data.company.ic_dph);
        setCountry(data.company.country);
        setOldCountry(data.company.country);
        setCity(data.company.city);
        setOldCity(data.company.city);
        setStreet(data.company.street);
        setOldStreet(data.company.street);
        setZip(data.company.zip);
        setOldZip(data.company.zip);
        setEmail(data.company.email);
        setOldEmail(data.company.email);
        setPhone(data.company.phone);
        setOldPhone(data.company.phone);
        setDescription(data.company.description);
        setOldDescription(data.company.description);
        setMonthly(data.company.monthly);
        setOldMonthly(data.company.monthly);
        setMonthlyPausal(data.company.monthlyPausal);
        setOldMonthlyPausal(data.company.monthlyPausal);
        setTaskWorkPausal(data.company.taskWorkPausal);
        setOldTaskWorkPausal(data.company.taskWorkPausal);
        setTaskTripPausal(data.company.taskTripPausal);
        setOldTaskTripPausal(data.company.taskTripPausal);
        let pl = {...data.company.pricelist, value: data.company.pricelist.id, label: data.company.pricelist.title};
        setPricelist(pl);
        setOldPricelist(pl);
        let r = data.company.companyRents.map(re => {
          return {
            id: re.id,
            title: re.title,
            quantity: re.quantity,
            unitPrice: re.price,
            unitCost: re.cost,
            totalPrice: parseInt(re.quantity)*parseFloat(re.price),
          }
        })
        setRents(r);
      }
  }, [loading]);

  React.useEffect( () => {
      refetch({ variables: {id: parseInt(match.params.id)} });
  }, [match.params.id]);

    // functions
    const updateCompanyFunc = (pricelistId = null) => {
      setSaving( true );

      let newRents = rents.map(r => {
        let newRent = {
          title: r.title,
          quantity: isNaN(parseInt(r.quantity)) ? 0 : parseInt(r.quantity),
          cost: isNaN(parseInt(r.unitCost)) ? 0 : parseInt(r.unitCost),
          price: isNaN(parseInt(r.unitPrice)) ? 0 : parseInt(r.unitPrice)
        };
        if (r.id){
          newRent.id = r.id;
        }
        return newRent;
      });

      updateCompany({ variables: {
        id: parseInt(match.params.id),
        title,
        dph: (dph === "" ? 0 : parseInt(dph)),
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
        monthlyPausal: (monthlyPausal === "" ? 0 : parseFloat(monthlyPausal)),
        taskWorkPausal: (taskWorkPausal === "" ? 0 : parseFloat(taskWorkPausal)),
        taskTripPausal: (taskTripPausal === "" ? 0 : parseFloat(taskTripPausal)),
        rents: newRents,
      } }).then( ( response ) => {
      }).catch( (err) => {
        console.log(err.message);
      });

       setSaving( false );
       setNewData( false );
    };

    const deleteCompanyFunc = () => {
      setChooseingNewCompany(false);

      if(window.confirm("Are you sure?")){
        deleteCompany({ variables: {
          id: parseInt(match.params.id),
          newId: parseInt(newCompany.id),
        } }).then( ( response ) => {
          client.writeQuery({ query: GET_COMPANIES, data: {companies: filteredCompanies} });
          history.push('/helpdesk/settings/companies/add');
        }).catch( (err) => {
          console.log(err.message);
          console.log(err);
        });
      }
    };

    const savePriceList = () => {
      setSaving( true );

      addPricelist({ variables: {
        title: pricelistName,
        order: 0,
        afterHours: 0,
        def: false,
        materialMargin: 0,
        materialMarginExtra: 0,
        prices: [],
      } }).then( ( response ) => {
        const newPricelist = {...response.data.addPricelist, __typename: "Pricelist"};
        setPricelist(newPricelist);
        const newPricelists = pricelists.concat([newPricelist]);
        setPricelists(newPricelists);
        setPricelistName("");

        client.writeQuery({ query: GET_PRICELISTS, data: {pricelists: [...pricelistsData.pricelists, newPricelist] } });

        updateCompanyFunc(newPricelist.id);
      }).catch( (err) => {
        console.log(err.message);
      });
      setSaving( false );
    }

    const cancel = () => {
      setTitle(oldTitle);
      setIco(oldIco);
      setDic(oldDic);
      setDph(oldDph);
      setIcDph(oldIcDph);
      setCountry(oldCountry);
      setCity(oldCity);
      setStreet(oldStreet);
      setZip(oldZip);
      setEmail(oldEmail);
      setPhone(oldPhone);
      setDescription(oldDescription);
      setMonthly(oldMonthly);
      setMonthlyPausal(oldMonthlyPausal);
      setTaskWorkPausal(oldTaskWorkPausal);
      setTaskTripPausal(oldTaskTripPausal);
      setPricelist(oldPricelist);

      setClearCompanyRents(true);
      setNewData(false);
      setPricelistName("");
    }

  const attributes = [title, ico, email];
  const cannotSave = saving || attributes.some(attr => attr === "") || (pricelist.value === "0" && pricelistName === "");

  if (loading) {
    return <Loading />
  }

    return (
      <div className="fit-with-header-and-commandbar">
        {newData &&
          <div style={{position: "fixed", zIndex: "999", backgroundColor: "rgba(255,255,255,0.5)", top: "0", left: "0", width: "100%", height: "100vh"}}></div>
        }

      <h2 className="p-t-10 p-l-20 p-b-5" style={(newData ? {position: "relative", zIndex: "99999"} : {})}>Edit company</h2>
      <hr style={(newData ? {position: "relative", zIndex: "99999"} : {})}/>

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
                  value={title}
                  onChange={(e)=> {
                    setTitle(e.target.value);
                    setNewData( true );
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
                  setNewData( true );
                }}
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
                value={ico}
                onChange={(e)=>{
                  setIco(e.target.value);
                  setNewData( true );
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
                  setNewData( true );
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
                  setNewData( true );
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
                  setNewData( true );
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
                  setNewData( true );
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
                  setNewData( true );
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
                  setNewData( true );
                }}
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
                className={(email.length > 0 && !isEmail(email)) ? "form-control-warning" : ""}
                type="text"
                placeholder="Enter e-mail"
                value={email}
                onChange={(e)=>{
                  setEmail(e.target.value);
                  setNewData( true );
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
                   setNewData( true );
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
                  setNewData( true );
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
      </div>

        <div
          className="form-footer row"
          style={(newData ? {zIndex: "99999"} : {})}>

          {newData &&
            <Button
              className="btn m-r-5"
              disabled={ cannotSave }
              onClick={()=>{
                if (pricelist.value === "0" && pricelistName !== ""){
                  savePriceList();
                } else {
                  updateCompanyFunc();
                }
            }}>{saving?'Saving...':'Save changes'}</Button>
          }
           <Button className="btn-red" disabled={saving || deleting || theOnlyOneLeft} onClick={() => setChooseingNewCompany(true)}>Delete</Button>

          {newData &&
            <Button
              className="btn-link"
              disabled={saving}
              onClick={cancel}>Cancel changes</Button>
          }
        </div>

        <Modal isOpen={choosingNewCompany}>
          <ModalHeader>
            Please choose a company to replace this one
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Select
                styles={selectStyle}
                options={filteredCompanies}
                value={newCompany}
                onChange={role => setNewCompany(role)}
                />
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button className="btn-link mr-auto"onClick={() => setChooseingNewCompany(false)}>
              Cancel
            </Button>
            <Button className="btn ml-auto" disabled={!newCompany} onClick={deleteCompanyFunc}>
              Complete deletion
            </Button>
          </ModalFooter>
        </Modal>

      </div>
    );
  }
