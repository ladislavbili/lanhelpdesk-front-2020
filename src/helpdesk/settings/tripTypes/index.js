import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from 'classnames';

import Empty from 'components/Empty';
import SettingLoading from '../components/settingLoading';
import SettingListContainer from '../components/settingListContainer';
import TripTypeAdd from './tripTypeAdd';
import TripTypeEdit from './tripTypeEdit';

import {
  useTranslation
} from "react-i18next";
import {
  orderArr
} from 'helperFunctions';
import {
  itemAttributesFullfillsString
} from '../components/helpers';

import {
  GET_TRIP_TYPES,
  TRIP_TYPES_SUBSCRIPTION,
} from './queries';

export default function TripTypeListContainer( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: tripTypesData,
    loading: tripTypesLoading,
    refetch: tripTypesRefetch,
  } = useQuery( GET_TRIP_TYPES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( TRIP_TYPES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tripTypesRefetch();
    }
  } );

  // state
  const [ tripTypeFilter, setTripTypeFilter ] = React.useState( "" );

  if ( tripTypesLoading ) {
    return ( <SettingLoading match={match} /> );
  }

  const tripTypes = orderArr( tripTypesData.tripTypes );

  const RightSideComponent = (
    <Empty>
      { match.params.id && match.params.id==='add' &&
        <TripTypeAdd history={history} />
      }
      { tripTypesLoading && match.params.id && match.params.id!=='add' &&
        <Loading />
      }
      { match.params.id && match.params.id!=='add' && tripTypes.some( (item) => item.id.toString() === match.params.id ) &&
        <TripTypeEdit {...{history, match}} />
      }
    </Empty>
  );

  return (
    <SettingListContainer
      header={t('tripTypes')}
      filter={tripTypeFilter}
      setFilter={setTripTypeFilter}
      history={history}
      addURL="/helpdesk/settings/tripTypes/add"
      addLabel={t('tripType')}
      RightSideComponent={RightSideComponent}
      >
      <table className="table table-hover">
        <thead>
          <tr>
            <th>{t('title')}</th>
            <th>{t('order')}</th>
          </tr>
        </thead>
        <tbody>
          { tripTypes.filter((item) => itemAttributesFullfillsString(item, tripTypeFilter, ['title']))
            .map( ( tripType ) => (
              <tr key={tripType.id}
                className={classnames (
                  "clickable",
                  {
                    "active": parseInt(match.params.id) === tripType.id
                  }
                )}
                onClick={()=>history.push(`/helpdesk/settings/tripTypes/${tripType.id}`)}>
                <td>
                  { tripType.title }
                </td>
                <td>
                  { tripType.order ? tripType.order : 0 }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </SettingListContainer>
  )
}