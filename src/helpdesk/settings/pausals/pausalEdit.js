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
import {
  addLocalError,
} from 'apollo/localSchema/actions';

import CompanyRents from '../companies/companyRents';
import CompanyPriceList from '../companies/companyPriceList';

import {
  toSelArr
} from 'helperFunctions';
import Loading from 'components/loading';

import {
  GET_PRICELISTS,
  ADD_PRICELIST,
  PRICELISTS_SUBSCRIPTION
} from '../prices/queries';
import {
  GET_COMPANY,
  UPDATE_COMPANY
} from '../companies/queries';
const newPricelist = {
  label: "Nový cenník",
  value: "0"
};

export default function PausalEdit( props ) {
  //data
  const {
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
      pricelistsRefetch();
    }
  } );

  //state
  const [ monthlyPausal, setMonthlyPausal ] = React.useState( 0 );
  const [ taskWorkPausal, setTaskWorkPausal ] = React.useState( 0 );
  const [ taskTripPausal, setTaskTripPausal ] = React.useState( 0 );
  const [ pricelist, setPricelist ] = React.useState( {} );
  const [ oldPricelist, setOldPricelist ] = React.useState( {} );
  const [ pricelistName, setPricelistName ] = React.useState( "" );

  const [ rents, setRents ] = React.useState( [] );
  const [ clearCompanyRents, setClearCompanyRents ] = React.useState( false );

  const [ fakeID, setFakeID ] = React.useState( 0 );

  const [ saving, setSaving ] = React.useState( false );

  const [ dataChanged, setDataChanged ] = React.useState( false );

  const getFakeID = () => {
    let fake = fakeID;
    setFakeID( fakeID + 1 );
    return fake;
  }

  //sync
  React.useEffect( () => {
    if ( !loading ) {
      setData();
    }
  }, [ loading ] );

  React.useEffect( () => {
    refetch( {
        variables: {
          id: parseInt( match.params.id )
        }
      } )
      .then( setData );
  }, [ match.params.id ] );

  // functions
  const setData = () => {
    if ( loading ) {
      return;
    }
    setMonthlyPausal( data.company.monthlyPausal );
    setTaskWorkPausal( data.company.taskWorkPausal );
    setTaskTripPausal( data.company.taskTripPausal );
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

  const updateCompanyFunc = () => {
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

  const cannotSave = saving || ( pricelist.value === "0" && pricelistName === "" );

  if ( loading ) {
    return <Loading />
  }

  const pricelists = [
    newPricelist,
    ...toSelArr( pricelistsData.pricelists )
  ];

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
    <div className="fit-with-header-and-commandbar scroll-visible">

      <h2 className="p-t-10 p-l-20">Edit service level agreement - {data.company.title}</h2>

      <div className="p-20">

        <h3>Paušál</h3>
        <FormGroup>
          <Label for="pausal">Paušál práce</Label>
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
        </FormGroup>
        <FormGroup className="m-b-10">
          <Label for="pausal">Paušál výjazdy</Label>
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
        </FormGroup>

        <CompanyRents
          clearForm={clearCompanyRents}
          setClearForm={()=>{
            setClearCompanyRents(false);
            setDataChanged( true );
          }}
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
        setPricelist={(pl) => {
          setPricelist(pl);
          setDataChanged( true );
        }}
        setOldPricelist={(pl) => {
          setOldPricelist(pl);
          setDataChanged( true );
        }}
        setNewData={(e) => {}}
        setPricelistName={(n) => {
          setPricelistName(n);
          setDataChanged( true );
        }}
        match={match}
         />

       <div className="form-buttons-row">
         <button
           className="btn ml-auto m-r-5"
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
         </button>
         </div>

      </div>
    </div>
  </div>
  );
}