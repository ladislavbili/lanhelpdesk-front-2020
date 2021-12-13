import React from 'react';
import {
  useMutation,
  useQuery,
  useSubscription,
  useApolloClient,
} from "@apollo/client";
import classnames from 'classnames';

import {
  Label,
  NavLink,
  NavItem,
  Nav,
  TabContent,
  TabPane,
  FormGroup,
} from 'reactstrap';
import {
  pickSelectStyle
} from "configs/components/select";
import Select from 'react-select';
import Switch from "react-switch";
import Empty from 'components/Empty';
import Loading from 'components/loading';
import SettingsInput from '../components/settingsInput';
import CompanyRents from './companyRents';
import DeleteReplacement from 'components/deleteReplacement';

import {
  toSelArr,
  isEmail,
  getMyData,
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";
import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  GET_PRICELISTS,
  ADD_PRICELIST,
  PRICELISTS_SUBSCRIPTION,
} from '../pricelists/queries';

import {
  GET_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
  GET_COMPANIES,
  GET_COMPANY_DEFAULTS,
  UPDATE_COMPANY_DEFAULTS,
} from './queries';

const newPricelist = {
  label: "Nový cenník",
  value: "0"
};
let fakeID = -1;
const getFakeID = () => {
  return fakeID--;
}


export default function CompanyEdit( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();

  const client = useApolloClient();

  const {
    data: companyData,
    loading: companyLoading,
    refetch: companyRefetch
  } = useQuery( GET_COMPANY, {
    variables: {
      id: parseInt( match.params.id )
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  } );

  const {
    data: pricelistsData,
    loading: pricelistsLoading,
    refetch: pricelistsRefetch,
  } = useQuery( GET_PRICELISTS, {
    fetchPolicy: 'network-only'
  } );

  const {
    data: companiesData,
    loading: companiesLoading,
  } = useQuery( GET_COMPANIES, {
    fetchPolicy: 'network-only'
  } );

  const {
    data: companyDefaultsData,
    loading: companyDefaultsLoading,
  } = useQuery( GET_COMPANY_DEFAULTS, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( PRICELISTS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      pricelistsRefetch()
        .then( () => setData() );
    }
  } );

  const [ updateCompany ] = useMutation( UPDATE_COMPANY );
  const [ deleteCompany ] = useMutation( DELETE_COMPANY );
  const [ updateCompanyDefaults ] = useMutation( UPDATE_COMPANY_DEFAULTS );
  const [ addPricelist ] = useMutation( ADD_PRICELIST );

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

  const [ rents, setRents ] = React.useState( [] );

  const [ pricelist, setPricelist ] = React.useState( null );
  const [ oldPricelist, setOldPricelist ] = React.useState( null );
  const [ pricelistName, setPricelistName ] = React.useState( "" );

  const [ saving, setSaving ] = React.useState( false );
  const [ deleting ] = React.useState( false );
  const [ dataChanged, setDataChanged ] = React.useState( false );
  const [ clearCompanyRents, setClearCompanyRents ] = React.useState( false );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );
  const [ openedTab, setOpenedTab ] = React.useState( "company" );

  const [ defDph, setDefDph ] = React.useState( 0 );
  const [ defChanged, setDefChanged ] = React.useState( false );

  const myRights = getMyData()
    .role.accessRights;

  const dataLoading = (
    companyLoading ||
    pricelistsLoading ||
    companyDefaultsLoading ||
    companiesLoading
  )

  //sync
  React.useEffect( () => {
    setData()
  }, [ companyLoading ] );

  React.useEffect( () => {
    if ( !companyDefaultsLoading ) {
      setDefDph( companyDefaultsData.companyDefaults.dph );
    }
  }, [ companyDefaultsLoading ] );

  React.useEffect( () => {
    companyRefetch( {
        variables: {
          id: parseInt( match.params.id )
        }
      } )
      .then( setData );
    setDefChanged( false );
  }, [ match.params.id ] );

  // functions
  const setData = () => {
    if ( companyLoading ) {
      return;
    }

    const company = companyData.company;
    setTitle( company.title );
    setOldTitle( company.title );
    setDph( company.dph );
    setOldDph( company.dph );
    setIco( company.ico );
    setOldIco( company.ico );
    setDic( company.dic );
    setOldDic( company.dic );
    setIcDph( company.ic_dph );
    setOldIcDph( company.ic_dph );
    setCountry( company.country );
    setOldCountry( company.country );
    setCity( company.city );
    setOldCity( company.city );
    setStreet( company.street );
    setOldStreet( company.street );
    setZip( company.zip );
    setOldZip( company.zip );
    setEmail( company.email ? company.email : '' );
    setOldEmail( company.email );
    setPhone( company.phone );
    setOldPhone( company.phone );
    setDescription( company.description );
    setOldDescription( company.description );
    setMonthly( company.monthly === true );
    setOldMonthly( company.monthly === true );
    setMonthlyPausal( company.monthlyPausal );
    setOldMonthlyPausal( company.monthlyPausal );
    setTaskWorkPausal( company.taskWorkPausal );
    setOldTaskWorkPausal( company.taskWorkPausal );
    setTaskTripPausal( company.taskTripPausal );
    setOldTaskTripPausal( company.taskTripPausal );
    let newPricelist = {
      ...company.pricelist,
      value: company.pricelist.id,
      label: company.pricelist.title
    };
    setPricelist( newPricelist );
    setOldPricelist( newPricelist );
    let r = company.companyRents.map( rent => {
      return {
        id: rent.id,
        title: rent.title,
        quantity: rent.quantity,
        unitPrice: rent.price,
        unitCost: rent.cost,
        totalPrice: parseInt( rent.quantity ) * parseFloat( rent.price ),
      }
    } )
    setRents( r );
    setDefChanged( false );
    setDataChanged( false );
  }

  const updateCompanyFunc = ( pricelistId = null ) => {
    setSaving( true );

    let newRents = rents.map( r => {
      let newRent = {
        id: r.id,
        title: r.title,
        quantity: isNaN( parseInt( r.quantity ) ) ? 0 : parseInt( r.quantity ),
        cost: isNaN( parseInt( r.unitCost ) ) ? 0 : parseInt( r.unitCost ),
        price: isNaN( parseInt( r.unitPrice ) ) ? 0 : parseInt( r.unitPrice )
      };
      return newRent;
    } );

    if ( defChanged ) {
      updateCompanyDefaults( {
        variables: {
          dph: isNaN( parseInt( defDph ) ) ? 0 : parseInt( defDph )
        }
      } );
      if ( isNaN( parseInt( defDph ) ) ) {
        setDefDph( 0 );
      }
    }

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
          email: email.length > 0 ? email : null,
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
        if ( newRents.some( ( rent ) => rent.id < 1 ) ) {
          companyRefetch( {
            variables: {
              id: parseInt( match.params.id )
            }
          } );
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
    setDataChanged( false );
  };

  const deleteCompanyFunc = ( replacement ) => {
    setDeleteOpen( false );

    if ( window.confirm( t( 'generalConfirmation' ) ) ) {
      deleteCompany( {
          variables: {
            id: parseInt( match.params.id ),
            newId: parseInt( replacement.id ),
          }
        } )
        .then( ( response ) => {
          history.push( '/helpdesk/settings/companies' );
        } )
        .catch( ( err ) => {
          addLocalError( err );
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
        setPricelistName( "" );

        updateCompanyFunc( newPricelist.id );
      } )
      .catch( ( err ) => {
        addLocalError( err );
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

  const attributes = [ title, ico ];
  const cannotSave = () => (
    saving ||
    attributes.some( attr => attr === "" ) ||
    (
      pricelist.value === "0" &&
      pricelistName === "" ||
      ( email.length !== 0 && isEmail( email ) )
    )
  );

  if ( dataLoading ) {
    return <Loading />
  }

  const filteredCompanies = companiesData.companies.filter( comp => comp.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = companiesData.companies.length < 2;


  const pricelists = [
    newPricelist,
    ...toSelArr( pricelistsData.pricelists )
  ];

  return (
    <div className="scroll-visible p-20 fit-with-header">
      {dataChanged &&
        <div style={{position: "fixed", zIndex: "999", backgroundColor: "rgba(255,255,255,0.5)", top: "0", left: "0", width: "100%", height: "100vh"}}></div>
      }
      <div
        className={ classnames(
          {
            "bring-to-front": dataChanged
          },
        )}
        >

        <h2 className="m-b-20" >
          {companyData.company.def ? `${t('edit')} Helpdesk ${t('company2')}` : `${t('edit')} ${t('company2').toLowerCase()}`}
        </h2>

        <Nav tabs className="no-border m-b-25">
          <NavItem>
            <NavLink
              className={classnames({ active: openedTab === 'company'}, "clickable", "")}
              onClick={() => setOpenedTab('company') }
              >
              {t('billingInformation')}
            </NavLink>
          </NavItem>
          { myRights.pausals &&
            <Empty>
              <NavItem>
                <NavLink>
                  |
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: openedTab === 'contract' }, "clickable", "")}
                  onClick={() => setOpenedTab('contract') }
                  >
                  {t('contract')}
                </NavLink>
              </NavItem>
            </Empty>
          }
        </Nav>
        <TabContent activeTab={openedTab}>
          <TabPane tabId={'company'}>
            <SettingsInput
              required
              id="name"
              label={t('companyTitle')}
              value={title}
              onChange={(e)=> {
                setTitle(e.target.value);
                setDataChanged( true );
              }}
              />

            <SettingsInput
              id="dph"
              label={t('tax')}
              value={dph}
              onChange={(e)=>{
                setDph(e.target.value);
                setDataChanged( true );
              }}
              />

            <SettingsInput
              required
              id="ico"
              label={t('ico')}
              value={ico}
              onChange={(e)=>{
                setIco(e.target.value);
                setDataChanged( true );
              }}
              />

            <SettingsInput
              id="dic"
              label={t('dic')}
              value={dic}
              onChange={(e)=>{
                setDic(e.target.value);
                setDataChanged( true );
              }}
              />

            <SettingsInput
              id="ic_dph"
              label={t('icDph')}
              value={ic_dph}
              onChange={(e)=>{
                setIcDph(e.target.value);
                setDataChanged( true );
              }}
              />

            <SettingsInput
              id="country"
              label={t('country')}
              value={country}
              onChange={(e)=>{
                setCountry(e.target.value);
                setDataChanged( true );
              }}
              />

            <SettingsInput
              id="city"
              label={t('city')}
              value={city}
              onChange={(e)=>{
                setCity(e.target.value);
                setDataChanged( true );
              }}
              />


            <SettingsInput
              id="street"
              label={t('street')}
              value={street}
              onChange={(e)=>{
                setStreet(e.target.value);
                setDataChanged( true );
              }}
              />

            <SettingsInput
              id="psc"
              label={t('postCode')}
              value={zip}
              onChange={(e)=>{
                setZip(e.target.value);
                setDataChanged( true );
              }}
              />

            <SettingsInput
              id="mail"
              label={t('email')}
              placeholder={t('emailPlaceholderChecked')}
              value={email}
              onChange={(e)=>{
                setEmail(e.target.value);
                setDataChanged( true );
              }}
              inputClassName={(email.length > 0 && !isEmail(email)) ? "form-control-warning" : ""}
              />

            <SettingsInput
              id="phone"
              label={t('phone')}
              value={phone}
              onChange={(e)=>{
                setPhone(e.target.value);
                setDataChanged( true );
              }}
              />

            <SettingsInput
              id="description"
              label={t('description')}
              type="textarea"
              value={description}
              onChange={(e)=>{
                setDescription(e.target.value);
                setDataChanged( true );
              }}
              />
          </TabPane>
          { myRights.pausals &&
            <TabPane tabId={'contract'}>
              <FormGroup>
                <Label for="pricelist">{t('pricelist')}</Label>
                <Select
                  id="pricelist"
                  name="pricelist"
                  styles={pickSelectStyle()}
                  options={pricelists}
                  value={pricelist}
                  disabled={!monthly}
                  onChange={e => {
                    setOldPricelist({...pricelist});
                    setPricelist( e );
                    setDataChanged(true);
                  }}
                  />
              </FormGroup>
              <div className="row m-t-20 m-b-20">
                <label>
                  <Switch
                    checked={monthly}
                    onChange={()=> {
                      setMonthly(!monthly);
                      setDataChanged( true );
                    }}
                    height={22}
                    checkedIcon={<span className="switchLabel">{t('yes')}</span>}
                    uncheckedIcon={<span className="switchLabel">{t('no')}</span>}
                    onColor={"#0078D4"}
                    />
                  <span className="m-l-10"></span>
                </label>
                <span className="m-r-5">
                  {t('monthlyPausal')}
                </span>
              </div>
              <SettingsInput
                id="monthlyPausal"
                label="Mesačná"
                type="number"
                value={monthlyPausal}
                disabled={!monthly}
                onChange={(e) => {
                  setMonthlyPausal(e.target.value);
                  setDataChanged( true );
                }}
                >
                <div className="m-l-10">
                  <Label for="monthlyPausal">{t('euroWithoutTaxMonth')}</Label>
                </div>
              </SettingsInput>

              <SettingsInput
                id="taskWorkPausal"
                label={`${t('pausal')} ${t('works').toLowerCase()}`}
                type="number"
                value={taskWorkPausal}
                disabled={!monthly}
                onChange={(e) => {
                  setTaskWorkPausal(e.target.value);
                  setDataChanged( true );
                }}
                />

              <SettingsInput
                id="taskTripPausal"
                label={`${t('pausal')} ${t('trips').toLowerCase()}`}
                type="number"
                value={taskTripPausal}
                disabled={!monthly}
                onChange={(e)=> {
                  setTaskTripPausal(e.target.value);
                  setDataChanged( true );
                }}
                />

              <CompanyRents
                clearForm={clearCompanyRents}
                setClearForm={()=>setClearCompanyRents(false)}
                data={rents}
                disabled={!monthly}
                updateRent={(rent)=>{
                  let newRents=[...rents];
                  newRents[newRents.findIndex( (item) => item.id === rent.id )] = { ...newRents.find( (item) => item.id === rent.id ), ...rent };
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
                  newRents.splice( newRents.findIndex( (item) => item.id === rent.id ) ,1 );
                  setRents( newRents );
                  setDataChanged( true );
                }}
                />
            </TabPane>
          }
        </TabContent>

        { companyData.company.def &&
          <SettingsInput
            id="description"
            className="m-t-20"
            label={t('defaultTax')}
            labelClassName="color-danger"
            type="number"
            value={defDph}
            onChange={(e) => {
              setDefDph(e.target.value);
              setDefChanged(true);
              setDataChanged( true );
            }}
            />
        }

      </div>

      <div className={classnames(
          "form-buttons-row p-b-20", {
            "bring-to-front": dataChanged
          }
        )}
        >

        { dataChanged &&
          <button
            className="btn-link-cancel btn-distance"
            disabled={saving}
            onClick={cancel}
            >
            {t('cancelChanges')}
          </button>
        }
        { !dataLoading && !companyData.company.def &&
          <button
            className="btn-red btn-distance"
            disabled={saving || deleting || theOnlyOneLeft}
            onClick={() => setDeleteOpen(true)}
            >
            {t('delete')}
          </button>
        }

        <div className = "ml-auto message m-r-10">
          { dataChanged &&
            <div className="message error-message">
              {t('saveBeforeLeaving')}
            </div>
          }
          { !dataChanged &&
            <div className="message success-message">
              {t('saved')}
            </div>
          }
        </div>

        <button className="btn"
          disabled={ cannotSave() && !dataChanged }
          onClick = { () => {
            if ( pricelist.value === "0" && pricelistName !== "" ) {
              savePriceList();
            } else {
              updateCompanyFunc();
            }
          }}
          >
          { saving ? `${t('saving')}...` : t('saveChanges') }
        </button>


      </div>
      <DeleteReplacement
        isOpen = { deleteOpen }
        label = {t('company')}
        options = { toSelArr(filteredCompanies) }
        close = { () => setDeleteOpen( false ) }
        finishDelete = { deleteCompanyFunc }
        />
    </div>
  );
}