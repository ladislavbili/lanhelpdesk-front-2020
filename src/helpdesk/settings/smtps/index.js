import React from 'react';
import {
  useQuery,
  useMutation
} from "@apollo/client";
import classnames from 'classnames';

import Empty from 'components/Empty';
import SettingLoading from '../components/settingLoading';
import SettingListContainer from '../components/settingListContainer';
import {
  itemAttributesFullfillsString
} from '../components/helpers';
import {
  useTranslation
} from "react-i18next";

import SMTPAdd from './smtpAdd';
import SMTPEdit from './smtpEdit';
import {
  GET_SMTPS,
  TEST_SMTPS
} from './queries';

export default function SMTPsList( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: smtpsData,
    loading: smtpsLoading,
    refetch: smtpsRefetch
  } = useQuery( GET_SMTPS, {
    fetchPolicy: 'network-only'
  } );

  const [ testSmtps ] = useMutation( TEST_SMTPS );

  // state
  const [ SMTPFilter, setSMTPFilter ] = React.useState( "" );
  const [ smtpTesting, setSmtpTesting ] = React.useState( false );
  const [ wasRefetched, setWasRefetched ] = React.useState( false );

  if ( smtpsLoading ) {
    return ( <SettingLoading match={match} /> );
  }

  const smtps = smtpsData.smtps;

  const testSMTPs = () => {
    setSmtpTesting( true );
    testSmtps();
  }

  const getStatusIcon = ( smtp ) => {
    let color = 'red';
    let iconName = 'far fa-times-circle';
    if ( ( smtpTesting && !wasRefetched ) || smtp.currentlyTested ) {
      color = 'orange';
      iconName = 'fa fa-sync';
    } else if ( smtp.working ) {
      color = 'green';
      iconName = 'far fa-check-circle';
    }
    return (
      <i
        style={{color}}
        className={iconName}
        />
    )
  }

  const RightSideComponent = (
    <Empty>
      { match.params.id && match.params.id==='add' &&
        <SMTPAdd {...props} />
      }
      { match.params.id && match.params.id!=='add' && smtps.some( (item) => item.id === parseInt(match.params.id) ) &&
        <SMTPEdit {...{history, match}} />
      }
    </Empty>
  );

  const TestSmtpComponent = (
    <Empty>
      { !smtpTesting &&
        <button
          disabled={ smtpTesting }
          className="btn btn-primary center-hor ml-auto"
          onClick={testSMTPs}
          >
          {t('testSmtps')}
        </button>
      }
      { smtpTesting &&
        <div className="center-hor ml-auto">
          {t('testingSmtps')}
        </div>
      }
      { smtpTesting &&
        <button
          className="btn btn-primary center-hor ml-auto"
          onClick={() =>{
            smtpsRefetch().then(() => {
              setWasRefetched(true)
            });
          }}
          >
          {t('Refetch')}
        </button>
      }
    </Empty>
  )

  return (
    <SettingListContainer
      header={t('smtps')}
      filter={SMTPFilter}
      setFilter={setSMTPFilter}
      history={history}
      addURL="/helpdesk/settings/smtps/add"
      addLabel={t('smtp')}
      RightFilterComponent={TestSmtpComponent}
      RightSideComponent={RightSideComponent}
      >
      <table className="table table-hover">
        <thead>
          <tr>
            <th>{t('title')}</th>
            <th>{t('host')}</th>
            <th>{t('port')}</th>
            <th>{t('username')}</th>
            <th>{t('default')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { smtps.filter((item) => itemAttributesFullfillsString( item, SMTPFilter,[ 'title', 'host', 'port', 'username' ]) )
            .map((smtp) => (
              <tr
                key={smtp.id}
                className={classnames (
                  {
                    "active": parseInt(match.params.id) === smtp.id
                  },
                  "clickable",
                )}
                onClick={() => history.push(`/helpdesk/settings/smtps/${smtp.id}`)}
                >
                <td style={{maxWidth: 100, overflow: 'hidden'}}>
                  {smtp.title}
                </td>
                <td style={{maxWidth: 100, overflow: 'hidden'}}>
                  {smtp.host}
                </td>
                <td>
                  {smtp.port}
                </td>
                <td style={{maxWidth: 100, overflow: 'hidden'}}>
                  {smtp.username}
                </td>
                <td>
                  {smtp.def ? t('yes') : t('no')}
                </td>
                <td>
                  {getStatusIcon(smtp)}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </SettingListContainer>
  );
}