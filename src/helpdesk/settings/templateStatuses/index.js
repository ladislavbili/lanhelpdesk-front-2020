import React from 'react';
import {
  useQuery,
  useSubscription
} from "@apollo/client";
import classnames from 'classnames';

import Empty from 'components/Empty';
import SettingLoading from '../components/settingLoading';
import SettingListContainer from '../components/settingListContainer';
import StatusAdd from './statusAdd';
import StatusEdit from './statusEdit';

import {
  orderArr
} from 'helperFunctions';
import {
  itemAttributesFullfillsString
} from '../components/helpers';
import {
  useTranslation
} from "react-i18next";

import {
  GET_STATUS_TEMPLATES,
  STATUS_TEMPLATE_SUBSCRIPTION
} from './queries';

export default function StatusesList( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: statusTemplatesData,
    loading: statusTemplatesLoading,
    refetch: statusTemplatesRefetch,
  } = useQuery( GET_STATUS_TEMPLATES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( STATUS_TEMPLATE_SUBSCRIPTION, {
    onSubscriptionData: () => {
      statusTemplatesRefetch()
    }
  } );

  // state
  const [ statusFilter, setStatusFilter ] = React.useState( "" );

  if ( statusTemplatesLoading ) {
    return ( <SettingLoading match={match} /> );
  }

  const statuses = orderArr( statusTemplatesData.statusTemplates );

  const RightSideComponent = (
    <Empty>
      { match.params.id && match.params.id==='add' &&
        <StatusAdd  {...props}/>
      }
      { match.params.id && match.params.id!=='add' && statuses.some((item)=>item.id===parseInt(match.params.id)) &&
        <StatusEdit {...{history, match}} />
      }
    </Empty>
  );

  return (
    <SettingListContainer
      header={t('statusTemplates')}
      filter={statusFilter}
      setFilter={setStatusFilter}
      history={history}
      addURL="/helpdesk/settings/statuses/add"
      addLabel={t('statusTemplate')}
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
          { statuses.filter( (item) => itemAttributesFullfillsString(item, statusFilter, ['title']) )
            .map( (status) => (
              <tr key={status.id}
                className={classnames (
                  "clickable",
                  {
                    "active": parseInt(match.params.id) === status.id
                  }
                )}
                onClick={ () => history.push(`/helpdesk/settings/statuses/${status.id}`)}>
                <td>
                  {status.title}
                </td>
                <td>
                  {status.order ? status.order : 0}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </SettingListContainer>
  )
}