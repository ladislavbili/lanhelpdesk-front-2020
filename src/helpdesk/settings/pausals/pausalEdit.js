import React from 'react';
import {
  useQuery,
  useMutation,
  useSubscription
} from "@apollo/client";

import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Loading from 'components/loading';
import CompanyRents from '../companies/companyRents';
import SettingsInput from '../components/settingsInput';
import CompanyPriceList from '../companies/companyPriceList';

import {
  toSelArr
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  GET_PRICELISTS,
  ADD_PRICELIST,
  PRICELISTS_SUBSCRIPTION
} from '../pricelists/queries';
import {
  GET_COMPANY,
  UPDATE_COMPANY
} from '../companies/queries';

const newPricelist = {
  label: "Nový cenník",
  value: "0"
};

let fakeID = -1;
const getFakeID = () => {
  return fakeID--;
}
export default function PausalEdit( props ) {
  const {
    match
  } = props;

  const {
    data: companyData,
    loading: companyLoading,
    refetch: companyRefetch
  } = useQuery( GET_COMPANY, {
    variables: {
      id: parseInt( match.params.id )
    },
    notifyOnNetworkStatusChange: true,
  } );

  const {
    data: pricelistsData,
    loading: pricelistsLoading,
    refetch: pricelistsRefetch,
  } = useQuery( GET_PRICELISTS, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( PRICELISTS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      pricelistsRefetch();
    }
  } );

  const [ updateCompany ] = useMutation( UPDATE_COMPANY );
  const [ addPricelist ] = useMutation( ADD_PRICELIST );

  //state
  const [ monthlyPausal, setMonthlyPausal ] = React.useState( 0 );
  const [ taskWorkPausal, setTaskWorkPausal ] = React.useState( 0 );
  const [ taskTripPausal, setTaskTripPausal ] = React.useState( 0 );
  const [ pricelist, setPricelist ] = React.useState( null );
  const [ oldPricelist, setOldPricelist ] = React.useState( null );
  const [ pricelistName, setPricelistName ] = React.useState( "" );
  const [ rents, setRents ] = React.useState( [] );

  const [ clearCompanyRents, setClearCompanyRents ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );
  const [ dataChanged, setDataChanged ] = React.useState( false );

  const dataLoading = (
    companyLoading ||
    pricelistsLoading
  )

  //sync
  React.useEffect( () => {
    if ( !companyLoading ) {
      setData();
    }
  }, [ companyLoading ] );

  React.useEffect( () => {
    companyRefetch( {
        variables: {
          id: parseInt( match.params.id )
        }
      } )
      .then( setData );
  }, [ match.params.id ] );

  // functions
  const setData = () => {
    if ( companyLoading ) {
      return;
    }
    const company = companyData.company;
    setMonthlyPausal( company.monthlyPausal );
    setTaskWorkPausal( company.taskWorkPausal );
    setTaskTripPausal( company.taskTripPausal );
    const pricelist = {
      ...company.pricelist,
      value: company.pricelist.id,
      label: company.pricelist.title
    };
    setPricelist( pricelist );
    setOldPricelist( pricelist );
    const rents = company.companyRents.map( rent => {
      return {
        id: rent.id,
        title: rent.title,
        quantity: rent.quantity,
        unitPrice: rent.price,
        unitCost: rent.cost,
        totalPrice: parseInt( rent.quantity ) * parseFloat( rent.price ),
      }
    } )
    setRents( rents );

    setDataChanged( false );
  }

  const updateCompanyFunc = () => {
    setSaving( true );

    let newRents = rents.map( rent => {
      let newRent = {
        title: rent.title,
        quantity: isNaN( parseInt( rent.quantity ) ) ? 0 : parseInt( rent.quantity ),
        cost: isNaN( parseInt( rent.unitCost ) ) ? 0 : parseInt( rent.unitCost ),
        price: isNaN( parseInt( rent.unitPrice ) ) ? 0 : parseInt( rent.unitPrice )
      };
      if ( rent.id ) {
        newRent.id = rent.id;
      }
      return newRent;
    } );

    updateCompany( {
        variables: {
          id: parseInt( match.params.id ),
          pricelistId: pricelist.id,
          monthlyPausal: ( monthlyPausal === "" ? 0 : parseFloat( monthlyPausal ) ),
          taskWorkPausal: ( taskWorkPausal === "" ? 0 : parseFloat( taskWorkPausal ) ),
          taskTripPausal: ( taskTripPausal === "" ? 0 : parseFloat( taskTripPausal ) ),
          rents: newRents,
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
    setDataChanged( false );
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
        let newPricelist = response.data.addPricelist;
        setPricelist( newPricelist );
        updateCompanyFunc();
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
    setDataChanged( false );
  }

  const cancel = () => {
    setClearCompanyRents( true );
  }

  const cannotSave = () => ( saving || pricelist === null || ( pricelist.value === "0" && pricelistName === "" ) );

  if ( dataLoading ) {
    return <Loading />
  }

  const pricelists = [
    newPricelist,
    ...toSelArr( pricelistsData.pricelists )
  ];

  return (
    <div className="scroll-visible p-20 fit-with-header">

      <h2>Edit service level agreement - {companyData.company.title}</h2>

      <h3 className="m-t-10 m-b-10" >Paušál</h3>
        <SettingsInput
          id="taskWorkPausal"
          label="Paušál práce"
          type="number"
          value={taskWorkPausal}
          onChange={(e) => {
            setTaskWorkPausal(e.target.value);
            setDataChanged( true );
          }}
          />

        <SettingsInput
          id="taskTripPausal"
          label="Paušál výjazdy"
          type="number"
          value={taskTripPausal}
          onChange={(e)=> {
            setTaskTripPausal(e.target.value);
            setDataChanged( true );
          }}
          />

      <CompanyRents
        clearForm={clearCompanyRents}
        setClearForm={()=>{
          setClearCompanyRents(false);
          setDataChanged( true );
        }}
        data={rents}
        updateRent={(rent) => {
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

      <CompanyPriceList
        pricelists={pricelists}
        pricelist={pricelist}
        oldPricelist={oldPricelist}
        pricelistName={pricelistName}
        newData={false}
        cancel={() => {
          cancel();
          setDataChanged( true );
        }}
        setPricelist={(pricelist) => {
          setPricelist(pricelist);
          setDataChanged( true );
        }}
        setOldPricelist={(pricelist) => {
          setOldPricelist(pricelist);
          setDataChanged( true );
        }}
        setNewData={(e) => {}}
        setPricelistName={(pricelistName) => {
          setPricelistName(pricelistName);
          setDataChanged( true );
        }}
        match={match}
        />

      <div className="form-buttons-row">
        <div className="ml-auto message m-r-10">
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
        <button
          className="btn"
          disabled={ cannotSave() }
          onClick={ () => {
            if (pricelist.value === "0" && pricelistName !== ""){
              savePriceList();
            } else {
              updateCompanyFunc();
            }
          }}
          >
          { saving ? 'Saving...' : 'Save changes' }
        </button>
      </div>
    </div>
  );
}