import React from 'react';
import {
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from "classnames";

import {
  FormGroup,
  Label,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import Switch from "react-switch";
import Loading from 'components/loading';
import SettingsInput from '../components/settingsInput';

import {
  useTranslation
} from "react-i18next";

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
  const {
    history
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: taskTypesData,
    loading: taskTypesLoading,
    refetch: taskTypesRefetch,
  } = useQuery( GET_TASK_TYPES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( TASK_TYPES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      taskTypesRefetch()
        .then( setData );
    }
  } );

  const {
    data: tripTypesData,
    loading: tripTypesLoading,
    refetch: tripTypesRefetch,
  } = useQuery( GET_TRIP_TYPES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( TRIP_TYPES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tripTypesRefetch()
        .then( setData );
    }
  } );

  const [ addPricelist ] = useMutation( ADD_PRICELIST );

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
  const [ openedTab, setOpenedTab ] = React.useState( "taskTypes" );
  const dataLoading = taskTypesLoading || tripTypesLoading;

  const taskTypes = ( taskTypesLoading ? [] : taskTypesData.taskTypes );
  const tripTypes = ( tripTypesLoading ? [] : tripTypesData.tripTypes );

  // sync
  React.useEffect( () => {
    if ( !dataLoading ) {
      setData();
    }
  }, [ dataLoading ] );

  //functions
  const setData = () => {
    if ( dataLoading ) {
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
        history.push( `/helpdesk/settings/pricelists/${response.data.addPricelist.id}` )
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
  }

  if ( dataLoading ) {
    return <Loading />
  }

  const cannotSave = () => {
    return saving || title.length === 0;
  }

  return (
    <div className="scroll-visible p-20 fit-with-header">
      <h2 className="m-b-20" >
        {`${t('add')} ${t('pricelist').toLowerCase()}`}
      </h2>

      <label className="m-b-20">
        <Switch
          checked={def}
          onChange={ () => setDef(!def) }
          height={22}
          checkedIcon={<span className="switchLabel">{t('yes')}</span>}
          uncheckedIcon={<span className="switchLabel">{t('no')}</span>}
          onColor={"#0078D4"} />
        <span className="m-l-10">{t('default')}</span>
      </label>

      <SettingsInput
        required
        id="title"
        label={t('pricelistTitle')}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        />

      <Nav tabs className="no-border m-b-25 m-t-20">
        <NavItem>
          <NavLink
            className={classnames({ active: openedTab === 'taskTypes'}, "clickable", "")}
            onClick={() => setOpenedTab('taskTypes') }
            >
            {t('taskTypes')}
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
            {t('tripTypes')}
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
            {t('surcharges')}
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={openedTab}>
        <TabPane tabId={'taskTypes'}>
          { taskTypes.map((item,index) => (
            <SettingsInput
              key={index}
              id={`taskTypes-${item.title}-${item.id}`}
              label={item.title}
              placeholder={t('pricePlaceholder')}
              value={
                taskTypePrices.find( (price) => price.id === item.id ) ?
                taskTypePrices.find( (price) => price.id === item.id ).price :
                ''
              }
              onChange={(e) => {
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
          ))}
        </TabPane>
        <TabPane tabId={'tripTypes'}>
          { tripTypes.map((item,index) => (
            <SettingsInput
              key={index}
              id={`tripTypes-${item.title}-${item.id}`}
              label={item.title}
              placeholder={t('pricePlaceholder')}
              value={tripTypePrices.find( (price) => price.id === item.id ) ? tripTypePrices.find( (price) => price.id === item.id ).price : undefined}
              onChange={(e) => {
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
          ))}
        </TabPane>
        <TabPane tabId={'extra'}>
          <SettingsInput
            id="afterHours"
            label={t('afterHoursPercentage')}
            value={afterHours}
            onChange={(e) => {
              setAfterHours(e.target.value.replace(",", "."));
            }}
            />

          <SettingsInput
            id="materialMargin"
            label={`${t('materialsMarginPercentage')} 50-`}
            placeholder={t('materialsMarginPercentagePlaceholder')}
            value={materialMargin}
            onChange={(e) => {
              setMaterialMargin(e.target.value.replace(",", "."));
            }}
            />

          <SettingsInput
            id="materialMarginExtra"
            label={`${t('materialsMarginPercentage')} 50+`}
            placeholder={t('materialsMarginPercentagePlaceholder')}
            value={materialMarginExtra}
            onChange={(e) => {
              setMaterialMarginExtra(e.target.value.replace(",", "."));
            }}
            />
        </TabPane>
      </TabContent>

      <div className="form-buttons-row">
        { cannotSave() &&
          <div className="message error-message ml-auto m-r-14">
            {t('fillAllRequiredInformation')}
          </div>
        }
        <button
          className={classnames(
            "btn",
            {"ml-auto": !cannotSave()}
          )}
          disabled={cannotSave()}
          onClick={addPricelistFunc}
          >
          { saving ? `${t('adding')}...` : `${t('add')} ${t('pricelist').toLowerCase()}` }
        </button>
      </div>
    </div>
  );
}