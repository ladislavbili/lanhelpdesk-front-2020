import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from 'classnames';

import Empty from 'components/Empty';
import SettingLoading from '../components/settingLoading';
import SettingListContainer from '../components/settingListContainer';
import {
  itemAttributesFullfillsString
} from '../components/helpers';

import PriceAdd from './priceAdd';
import PriceEdit from './priceEdit';
import {
  GET_PRICELISTS,
  PRICELISTS_SUBSCRIPTION
} from './queries';

export default function PricelistsList( props ) {
  const {
    history,
    match
  } = props;

  const {
    data: pricelistsData,
    loading: pricelistsLoading,
    refetch: pricelistsRefetch
  } = useQuery( GET_PRICELISTS, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( PRICELISTS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      pricelistsRefetch();
    }
  } );

  // state
  const [ pricelistFilter, setPricelistFilter ] = React.useState( "" );

  if ( pricelistsLoading ) {
    return ( <SettingLoading match={match} /> );
  }

  const pricelists = pricelistsData.pricelists;

  const RightSideComponent = (
    <Empty>
      { match.params.id && match.params.id === 'add' &&
        <PriceAdd {...props} />
      }
      { pricelistsLoading && match.params.id && match.params.id !== 'add' &&
        <Loading />
      }
      { match.params.id && match.params.id!=='add' && pricelists.some( (item) => item.id === parseInt(match.params.id) ) &&
        <PriceEdit {...{history, match}} />
      }
    </Empty>
  )

  return (
    <SettingListContainer
      header="Price lists"
      filter={pricelistFilter}
      setFilter={setPricelistFilter}
      history={history}
      addURL="/helpdesk/settings/pricelists/add"
      addLabel="Price list"
      RightSideComponent={RightSideComponent}
      >
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Default</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
          { pricelists.filter((item) => itemAttributesFullfillsString( item, pricelistFilter, ['title'] ) )
            .map((pricelist) => (
              <tr key={pricelist.id}
                className={classnames (
                  "clickable",
                  {
                    "active": parseInt(match.params.id) === pricelist.id
                  }
                )}
                onClick={() => { history.push(`/helpdesk/settings/pricelists/${pricelist.id}`) }}>
                <td>
                  {pricelist.title}
                </td>
                <td width="10%">
                  {pricelist.def ? "Default" : ""}
                </td>
                <td>
                  {pricelist.order}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </SettingListContainer>
  )
}