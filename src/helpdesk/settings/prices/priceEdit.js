import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";

import {
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from 'reactstrap';

import {
  toSelArr
} from 'helperFunctions';
import Select from 'react-select';
import {
  selectStyle
} from "configs/components/select";
import Loading from 'components/loading';
import Switch from "react-switch";

import {
  GET_PRICELISTS,
  GET_PRICELIST,
  UPDATE_PRICELIST,
  DELETE_PRICELIST,
} from './queries';



export default function PricelistEdit( props ) {
  //data
  const {
    history
  } = props;
  const {
    data,
    loading,
    refetch
  } = useQuery( GET_PRICELIST, {
    variables: {
      id: ( props.listId ? props.listId : parseInt( props.match.params.id ) )
    },
    notifyOnNetworkStatusChange: true,
  } );
  const [ updatePricelist ] = useMutation( UPDATE_PRICELIST );
  const [ deletePricelist, {
    client
  } ] = useMutation( DELETE_PRICELIST );
  const allPricelists = toSelArr( client.readQuery( {
      query: GET_PRICELISTS
    } )
    .pricelists );
  const filteredPricelists = allPricelists.filter( pricelist => pricelist.id !== ( props.listId ? props.listId : parseInt( props.match.params.id ) ) );
  const theOnlyOneLeft = allPricelists.length === 0;

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ afterHours, setAfterHours ] = React.useState( 0 );
  const [ def, setDef ] = React.useState( false );
  const [ materialMargin, setMaterialMargin ] = React.useState( 0 );
  const [ materialMarginExtra, setMaterialMarginExtra ] = React.useState( 0 );
  const [ prices, setPrices ] = React.useState( [] );

  const [ newPricelist, setNewPricelist ] = React.useState( null );
  const [ newDefPricelist, setNewDefPricelist ] = React.useState( null );
  const [ choosingNewPricelist, setChoosingNewPricelist ] = React.useState( false );

  const [ saving, setSaving ] = React.useState( false );
  const [ dataChanged, setDataChanged ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !loading ) {
      setTitle( data.pricelist.title );
      setOrder( data.pricelist.order );
      setAfterHours( data.pricelist.afterHours );
      setDef( data.pricelist.def );
      setMaterialMargin( data.pricelist.materialMargin );
      setMaterialMarginExtra( data.pricelist.materialMarginExtra );
      setPrices( data.pricelist.prices );
      setDataChanged( false );
    }
  }, [ loading ] );

  React.useEffect( () => {
    refetch( {
      variables: {
        id: ( props.listId ? props.listId : parseInt( props.match.params.id ) )
      }
    } );
  }, [ ( props.listId ? props.listId : parseInt( props.match.params.id ) ) ] );


  // functions
  const updatePricelistFunc = () => {
    setSaving( true );
    let newPrices = prices.map( p => {
      return {
        id: p.id,
        price: ( p.price === "" ? 0 : parseFloat( p.price ) )
      }
    } );
    updatePricelist( {
        variables: {
          id: ( props.listId ? props.listId : parseInt( props.match.params.id ) ),
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
          afterHours: ( afterHours !== '' ? parseInt( afterHours ) : 0 ),
          def,
          materialMargin: ( materialMargin !== '' ? parseInt( materialMargin ) : 0 ),
          materialMarginExtra: ( materialMarginExtra !== '' ? parseInt( materialMarginExtra ) : 0 ),
          prices: newPrices,
        }
      } )
      .then( ( response ) => {
        let updatedPricelist = {
          ...response.data.updatePricelist,
          __typename: "Pricelist"
        };
        let newPL = filteredPricelists;
        if ( def ) {
          newPL = newPL.map( pl => ( {
            ...pl,
            def: false
          } ) );
        }
        client.writeQuery( {
          query: GET_PRICELISTS,
          data: {
            pricelists: [ ...newPL, updatedPricelist ]
          }
        } );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
    setDataChanged( false );
  }

  const deletePricelistFunc = () => {
    setChoosingNewPricelist( false );

    if ( window.confirm( "Are you sure?" ) ) {
      deletePricelist( {
          variables: {
            id: ( props.listId ? props.listId : parseInt( props.match.params.id ) ),
            newDefId: ( newDefPricelist ? parseInt( newDefPricelist.id ) : null ),
            newId: ( newPricelist ? parseInt( newPricelist.id ) : null ),
          }
        } )
        .then( ( response ) => {
          if ( def ) {
            client.writeQuery( {
              query: GET_PRICELISTS,
              data: {
                pricelists: filteredPricelists.map( pl => {
                  return {
                    ...pl,
                    def: ( pl.id === parseInt( newDefPricelist.id ) )
                  }
                } )
              }
            } );
          } else {
            client.writeQuery( {
              query: GET_PRICELISTS,
              data: {
                pricelists: filteredPricelists
              }
            } );
          }
          history.push( '/helpdesk/settings/pricelists/add' );
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
    }
  };

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
      <div className="scroll-visible p-t-10 p-l-20 p-r-20 fit-with-header-and-commandbar">
        <h2 className="m-b-20" >
          Edit price list
        </h2>
        <label className="m-b-20">
          <Switch
            checked={def}
            onChange={ () => {
              setDef(!def);
              setDataChanged( true );
            } }
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
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter pricelist name"
              value={title}
              onChange={ (e) => {
                setTitle(e.target.value);
                setDataChanged( true );
              } }
              />
          </div>
        </FormGroup>

        <h3>Ceny úloh</h3>
        <div className="p-t-10 p-b-10">
          {
            prices.filter(item => item.type === "TaskType" )
            .map((item, i) =>
            <FormGroup key={i} className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for={item.type}>{item.taskType ? item.taskType.title : "Unnamed"}</Label>
              </div>
              <div className="flex">
                <Input
                  type="text"
                  name={item.type}
                  id={item.type}
                  placeholder="Enter price"
                  value={item.price}
                  onChange={(e)=>{
                    let newPrices = prices.map(p => {
                      if (p.id === item.id){
                        return {...p, price: e.target.value.replace(",", ".")}
                      } else {
                        return {...p};
                      }
                    });
                    setPrices(newPrices);
                    setDataChanged( true );
                  }}
                  />
              </div>
            </FormGroup>
          )}
        </div>

        <h3>Ceny Výjazdov</h3>
        <div className="p-t-10 p-b-10">
          {
            prices.filter(item => item.type === "TripType" )
            .map((item, i) =>
            <FormGroup key={i} className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for={item.type}>{item.tripType ? item.tripType.title : "Unnamed"}</Label>
              </div>
              <div className="flex">
                <Input
                  type="text"
                  name={item.type}
                  id={item.type}
                  placeholder="Enter price"
                  value={item.price}
                  onChange={(e)=>{
                    let newPrices = prices.map(p => {
                      if (p.id === item.id){
                        return {...p, price: e.target.value.replace(",", ".")}
                      } else {
                        return {...p};
                      }
                    });
                    setPrices(newPrices);
                    setDataChanged( true );
                  }}
                  />
              </div>
            </FormGroup>
          )}
        </div>

        <h3>Všeobecné prirážky</h3>
        <div className="p-t-10">
          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="afterPer">After hours percentage</Label>
            </div>
            <div className="flex">
              <Input
                type="text"
                name="afterPer"
                id="afterPer"
                placeholder="Enter after hours percentage"
                value={afterHours}
                onChange={(e)=>{
                  setAfterHours(e.target.value.replace(",", "."));
                  setDataChanged( true );
                }}
                />
            </div>
          </FormGroup>
          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="materMarg">Materials margin percentage 50-</Label>
            </div>
            <div className="flex">
              <Input
                type="text"
                name="materMarg"
                id="materMarg"
                placeholder="Enter materials margin percentage"
                value={materialMargin}
                onChange={(e)=>{
                  setMaterialMargin(e.target.value.replace(",", "."));
                  setDataChanged( true );
                }}
                />
            </div>
          </FormGroup>
          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="materMarg+">Materials margin percentage 50+</Label>
            </div>
            <div className="flex">
              <Input
                type="text"
                name="materMarg+"
                id="materMarg+"
                placeholder="Enter materials margin percentage"
                value={materialMarginExtra}
                onChange={(e)=>{
                  setMaterialMarginExtra(e.target.value.replace(",", "."));
                  setDataChanged( true );
                }}
                />
            </div>
          </FormGroup>
        </div>

        <Modal isOpen={choosingNewPricelist}>
          <ModalHeader>
            Please choose a pricelist to replace this one
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              { def && <Label>A replacement pricelist</Label> }
              <Select
                styles={selectStyle}
                options={filteredPricelists}
                value={newPricelist}
                onChange={s => {
                  setNewPricelist(s);
                  setDataChanged( true );
                }}
                />
            </FormGroup>

            {def &&
              <FormGroup>
                <Label>New default pricelist</Label>
                <Select
                  styles={selectStyle}
                  options={filteredPricelists}
                  value={newDefPricelist}
                  onChange={s => {
                    setNewDefPricelist(s);
                    setDataChanged( true );
                  }}
                  />
              </FormGroup>
            }
          </ModalBody>
          <ModalFooter>
            <button className="btn-link-cancel mr-auto"onClick={() => setChoosingNewPricelist(false)}>
              Cancel
            </button>
            <button className="btn ml-auto" disabled={!newPricelist || (def ? !newDefPricelist : false)} onClick={deletePricelistFunc}>
              Complete deletion
            </button>
          </ModalFooter>
        </Modal>

        <div className="form-buttons-row m-b-20">
          <button className="btn-red" disabled={saving || theOnlyOneLeft} onClick={() => setChoosingNewPricelist(true)}>Delete</button>
          <button
            className="btn ml-auto"
            disabled={saving}
            onClick={updatePricelistFunc}
            >
            {saving?'Saving prices...':'Save prices'}
          </button>
        </div>
      </div>
    </div>
  );
}