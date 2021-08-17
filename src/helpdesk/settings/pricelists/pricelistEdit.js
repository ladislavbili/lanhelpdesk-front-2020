import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";
import classnames from 'classnames';

import {
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import Switch from "react-switch";
import Loading from 'components/loading';
import SettingsInput from '../components/settingsInput';
import Select from 'react-select';

import {
  pickSelectStyle
} from "configs/components/select";
import {
  toSelArr
} from 'helperFunctions';

import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  GET_PRICELISTS,
  GET_PRICELIST,
  UPDATE_PRICELIST,
  DELETE_PRICELIST,
} from './queries';

export default function PricelistEdit( props ) {
  const {
    history,
    listId
  } = props;
  const id = props.listId ? props.listId : parseInt( props.match.params.id );
  const client = useApolloClient();
  const allPricelists = toSelArr( client.readQuery( {
      query: GET_PRICELISTS
    } )
    .pricelists );
  const filteredPricelists = allPricelists.filter( pricelist => pricelist.id !== id );
  const theOnlyOneLeft = allPricelists.length === 1;

  const {
    data: pricelistData,
    loading: pricelistLoading,
    refetch: pricelistRefetch
  } = useQuery( GET_PRICELIST, {
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  } );

  const [ updatePricelist ] = useMutation( UPDATE_PRICELIST );
  const [ deletePricelist ] = useMutation( DELETE_PRICELIST );

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
  const [ openedTab, setOpenedTab ] = React.useState( "taskTypes" );

  // sync
  React.useEffect( () => {
    setData()
  }, [ pricelistLoading ] );

  React.useEffect( () => {
    pricelistRefetch( {
        variables: {
          id
        }
      } )
      .then( setData );
  }, [ id ] );

  // functions
  const setData = () => {
    if ( pricelistLoading ) {
      return;
    }
    const pricelist = pricelistData.pricelist;
    setTitle( pricelist.title );
    setOrder( pricelist.order );
    setAfterHours( pricelist.afterHours );
    setDef( pricelist.def );
    setMaterialMargin( pricelist.materialMargin );
    setMaterialMarginExtra( pricelist.materialMarginExtra );
    setPrices( pricelist.prices );
    setDataChanged( false );
  }

  const updatePricelistFunc = () => {
    setSaving( true );
    let newPrices = prices.map( price => {
      return {
        id: price.id,
        price: ( price.price === "" ? 0 : parseFloat( price.price ) )
      }
    } );
    updatePricelist( {
        variables: {
          id,
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
          afterHours: ( afterHours !== '' ? parseInt( afterHours ) : 0 ),
          def,
          materialMargin: ( materialMargin !== '' ? parseInt( materialMargin ) : 0 ),
          materialMarginExtra: ( materialMarginExtra !== '' ? parseInt( materialMarginExtra ) : 0 ),
          prices: newPrices,
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
    setDataChanged( false );
  }

  const deletePricelistFunc = () => {
    setChoosingNewPricelist( false );

    if ( window.confirm( "Are you sure?" ) ) {
      deletePricelist( {
          variables: {
            id,
            newDefId: ( newDefPricelist ? parseInt( newDefPricelist.id ) : null ),
            newId: ( newPricelist ? parseInt( newPricelist.id ) : null ),
          }
        } )
        .then( ( response ) => {
          history.push( '/helpdesk/settings/pricelists/add' );
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  };

  if ( pricelistLoading ) {
    return <Loading />
  }

  return (
    <div className="scroll-visible p-20 fit-with-header">
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

      <SettingsInput
        required
        id="title"
        label="Pricelist name"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setDataChanged( true );
        }}
        />

      <Nav tabs className="b-0 m-b-25 m-t-20">
        <NavItem>
          <NavLink
            className={classnames({ active: openedTab === 'taskTypes'}, "clickable", "")}
            onClick={() => setOpenedTab('taskTypes') }
            >
            Task Types
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink>
            |
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: openedTab === 'tripTypes' }, "clickable", "")}
            onClick={() => setOpenedTab('tripTypes') }
            >
            Trip Types
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink>
            |
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: openedTab === 'extra' }, "clickable", "")}
            onClick={() => setOpenedTab('extra') }
            >
            Prirážky
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={openedTab}>
        <TabPane tabId={'taskTypes'}>
          { prices.filter(item => item.type === "TaskType" )
            .map((item, index) => (
              <SettingsInput
                key={index}
                id={ item.taskType ? `taskTypes-${item.taskType.title}-${item.taskType.id}` : `unknown-${index}`}
                label={item.taskType ? item.taskType.title : "Unnamed"}
                placeholder="Enter price"
                value={item.price}
                onChange={(e) => {
                  let newPrices = prices.map(price => {
                    if (price.id === item.id){
                      return {...price, price: e.target.value.replace(",", ".")}
                    } else {
                      return {...price};
                    }
                  });
                  setPrices(newPrices);
                  setDataChanged( true );
                }}
                />
            ))
          }
        </TabPane>
        <TabPane tabId={'tripTypes'}>
          { prices.filter(item => item.type === "TripType" )
            .map((item, index) => (
              <SettingsInput
                key={index}
                id={ item.tripType ? `tripTypes-${item.tripType.title}-${item.tripType.id}` : `unknown-${index}`}
                label={item.tripType ? item.tripType.title : "Unnamed"}
                placeholder="Enter price"
                value={item.price}
                onChange={(e) => {
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
            ))
          }
        </TabPane>
        <TabPane tabId={'extra'}>
          <SettingsInput
            id="afterHours"
            label="After hours percentage"
            value={afterHours}
            onChange={(e) => {
              setAfterHours(e.target.value.replace(",", "."));
              setDataChanged( true );
            }}
            />

          <SettingsInput
            id="materialMargin"
            label="Materials margin percentage 50-"
            placeholder="Enter materials margin percentage"
            value={materialMargin}
            onChange={(e) => {
              setMaterialMargin(e.target.value.replace(",", "."));
              setDataChanged( true );
            }}
            />

          <SettingsInput
            id="materialMarginExtra"
            label="Materials margin percentage 50+"
            placeholder="Enter materials margin percentage"
            value={materialMarginExtra}
            onChange={(e) => {
              setMaterialMarginExtra(e.target.value.replace(",", "."));
              setDataChanged( true );
            }}
            />
        </TabPane>
      </TabContent>
      <Modal isOpen={choosingNewPricelist}>
        <ModalHeader>
          Please choose a pricelist to replace this one
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            { def && <Label>A replacement pricelist</Label> }
            <Select
              styles={pickSelectStyle()}
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
                styles={pickSelectStyle()}
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
          <button
            className="btn ml-auto"
            disabled={!newPricelist || (def ? !newDefPricelist : false)}
            onClick={deletePricelistFunc}>
            Complete deletion
          </button>
        </ModalFooter>
      </Modal>

      <div className="form-buttons-row m-b-20">
        <button
          className="btn-red" disabled={saving || theOnlyOneLeft}
          onClick={() => setChoosingNewPricelist(true)}
          >
          Delete
        </button>
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
          className="btn m-t-5"
          disabled={saving}
          onClick={updatePricelistFunc}
          >
          { saving ? 'Saving prices...' : 'Save prices' }
        </button>
      </div>
    </div>
  );
}