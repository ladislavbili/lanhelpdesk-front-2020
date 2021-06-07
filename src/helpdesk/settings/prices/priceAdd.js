import React from 'react';
import {
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";

import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Switch from "react-switch";
import Loading from 'components/loading';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  GET_TASK_TYPES,
  TASK_TYPES_SUBSCRIPTION,
} from '../taskTypes/queries';
import {
  GET_TRIP_TYPES,
  TRIP_TYPES_SUBSCRIPTION,
} from '../tripTypes/queries';
import {
  GET_PRICELISTS,
  ADD_PRICELIST,
} from './queries';



export default function PricelistAdd( props ) {
  //data
  const {
    history
  } = props;
  const {
    data: taskTypesData,
    loading: taskTypesLoading,
    refetch: taskTypesRefetch,
  } = useQuery( GET_TASK_TYPES, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: tripTypesData,
    loading: tripTypesLoading,
    refetch: tripTypesRefetch,
  } = useQuery( GET_TRIP_TYPES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( TASK_TYPES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      taskTypesRefetch()
        .then( setData );
    }
  } );

  useSubscription( TRIP_TYPES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tripTypesRefetch()
        .then( setData );
    }
  } );

  const [ addPricelist, {
    client
  } ] = useMutation( ADD_PRICELIST );

  const taskTypes = ( taskTypesLoading ? [] : taskTypesData.taskTypes );
  const tripTypes = ( tripTypesLoading ? [] : tripTypesData.tripTypes );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order ] = React.useState( 0 );
  const [ afterHours, setAfterHours ] = React.useState( 0 );
  const [ def, setDef ] = React.useState( false );
  const [ materialMargin, setMaterialMargin ] = React.useState( 0 );
  const [ materialMarginExtra, setMaterialMarginExtra ] = React.useState( 0 );

  const [ taskTypePrices, setTaskTypePrices ] = React.useState( [] );
  const [ tripTypePrices, setTripTypePrices ] = React.useState( [] );

  const [ saving, setSaving ] = React.useState( false );
  // sync
  React.useEffect( () => {
    if ( !taskTypesLoading && !tripTypesLoading ) {
      setData();
    }
  }, [ taskTypesLoading, tripTypesLoading ] );

  //functions
  const setData = () => {
    if ( taskTypesLoading || tripTypesLoading ) {
      return;
    };
    setTaskTypePrices(
      taskTypesData.taskTypes.map( ( type ) => {
        const existingPrice = taskTypePrices.find( ( price ) => price.id === type.id );
        if ( existingPrice ) {
          return existingPrice;
        }
        return {
          id: type.id
        }
      } )
    );
    setTripTypePrices(
      tripTypesData.tripTypes.map( ( type ) => {
        const existingPrice = tripTypePrices.find( ( price ) => price.id === type.id );
        if ( existingPrice ) {
          return existingPrice;
        }
        return {
          id: type.id
        }
      } )
    );
  }

  const addPricelistFunc = async () => {
    setSaving( true );
    let prices = [
      ...taskTypes,
      ...tripTypes
    ].map( ( type ) => {
      if ( type.__typename === "TripType" ) {
        const existingPrice = tripTypePrices.find( ( price ) => price.id === type.id );
        return {
          type: type.__typename,
          typeId: type.id,
          price: ( !existingPrice || existingPrice.price === "" || existingPrice.price === undefined || isNaN( parseFloat( existingPrice.price ) ) ? 0 : parseFloat( existingPrice.price ) )
        }
      } else {
        const existingPrice = taskTypePrices.find( ( price ) => price.id === type.id );
        return {
          type: type.__typename,
          typeId: type.id,
          price: ( !existingPrice || existingPrice.price === "" || existingPrice.price === undefined || isNaN( parseFloat( existingPrice.price ) ) ? 0 : parseFloat( existingPrice.price ) )
        }
      }
    } );

    addPricelist( {
        variables: {
          title,
          order: ( order !== '' ? parseFloat( order ) : 0 ),
          afterHours: ( afterHours !== '' ? parseFloat( afterHours ) : 0 ),
          def,
          materialMargin: ( materialMargin !== '' ? parseFloat( materialMargin ) : 0 ),
          materialMarginExtra: ( materialMarginExtra !== '' ? parseFloat( materialMarginExtra ) : 0 ),
          prices,
        }
      } )
      .then( ( response ) => {
        history.push( '/helpdesk/settings/pricelists/' + response.data.addPricelist.id )
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
  }

  if ( taskTypesLoading || tripTypesLoading ) {
    return <Loading />
  }

  const cannotSave = () => {
    return saving || title.length === 0;
  }

  return (
    <div>
        <div className="commandbar a-i-c p-l-20">
          { cannotSave() &&
            <div className="message error-message">
              Fill in all the required information!
            </div>
          }
        </div>
        <div className="p-t-10 p-l-20 p-r-20 p-b-20 scroll-visible fit-with-header-and-commandbar">
          <h2 className="m-b-20" >
            Add price list
          </h2>
          <label className="m-b-20">
            <Switch
              checked={def}
              onChange={ () => setDef(!def) }
              height={22}
              checkedIcon={<span className="switchLabel">YES</span>}
              uncheckedIcon={<span className="switchLabel">NO</span>}
              onColor={"#0078D4"} />
            <span className="m-l-10">Default</span>
          </label>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="name">Pricelist name <span className="warning-big">*</span></Label>
            </div>
            <div className="flex">
              <Input type="text" name="name" id="name" placeholder="Enter pricelist name" value={title} onChange={ (e) => setTitle(e.target.value) } />
            </div>
          </FormGroup>

          <h3>Ceny úloh</h3>
          <div className="p-t-10 p-b-10">
            {
              taskTypes.map((item,index)=>
              <FormGroup key={index} className="row m-b-10">
                <div className="m-r-10 w-20">
                  <Label for={item.title}>{item.title}</Label>
                </div>
                <div className="flex">
                  <Input
                    type="text"
                    name={item.title}
                    id={item.title}
                    placeholder="Enter price"
                    value={taskTypePrices.find( (price) => price.id === item.id ) ? taskTypePrices.find( (price) => price.id === item.id ).price : undefined}
                    onChange={(e)=>{
                      let newPrices = taskTypePrices.map(p => {
                        if (p.id === item.id){
                          return ({id: p.id, price: e.target.value.replace(",", ".")});
                        } else {
                          return p;
                        }
                      });
                      setTaskTypePrices(newPrices);
                    }}
                    />
                </div>
              </FormGroup>
            )
          }
        </div>

        <h3>Ceny Výjazdov</h3>
        <div className="p-t-10 p-b-10">
          {
            tripTypes.map((item,index)=>
            <FormGroup key={index} className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for={item.title}>{item.title}</Label>
              </div>
              <div className="flex">
                <Input
                  type="text"
                  name={item.title}
                  id={item.title}
                  placeholder="Enter price"
                  value={tripTypePrices.find( (price) => price.id === item.id ) ? tripTypePrices.find( (price) => price.id === item.id ).price : undefined}
                  onChange={(e)=>{
                    let newPrices = tripTypePrices.map(p => {
                      if (p.id === item.id){
                        return ({id: p.id, price: e.target.value.replace(",", ".")});
                      } else {
                        return p;
                      }
                    });
                    setTripTypePrices(newPrices);
                  }}
                  />
              </div>
            </FormGroup>
          )
        }
      </div>

      <h3>Všeobecné prirážky</h3>
      <div className="p-t-10 p-b-10">
        <FormGroup className="row m-b-10">
          <div className="m-r-10 w-20">
            <Label for="afterPer">After hours percentage</Label>
          </div>
          <div className="flex">
            <Input type="text" name="afterPer" id="afterPer" placeholder="Enter after hours percentage" value={afterHours} onChange={(e)=>setAfterHours(e.target.value.replace(",", "."))} />
          </div>
        </FormGroup>
        <FormGroup className="row m-b-10">
          <div className="m-r-10 w-20">
            <Label for="materMarg">Materials margin percentage 50-</Label>
          </div>
          <div className="flex">
            <Input type="text" name="materMarg" id="materMarg" placeholder="Enter materials margin percentage" value={materialMargin} onChange={(e)=>setMaterialMargin(e.target.value.replace(",", "."))} />
          </div>
        </FormGroup>
        <FormGroup className="row m-b-10">
          <div className="m-r-10 w-20">
            <Label for="materMarg+">Materials margin percentage 50+</Label>
          </div>
          <div className="flex">
            <Input type="text" name="materMarg+" id="materMarg+" placeholder="Enter materials margin percentage" value={materialMarginExtra} onChange={(e)=>setMaterialMarginExtra(e.target.value.replace(",", "."))}/>
          </div>
        </FormGroup>
      </div>

      <div className="form-buttons-row">
        <button className="btn ml-auto" disabled={cannotSave()} onClick={addPricelistFunc}>
          {saving?'Saving prices...':'Save prices'}
        </button>
      </div>
    </div>
  </div>
  );
}