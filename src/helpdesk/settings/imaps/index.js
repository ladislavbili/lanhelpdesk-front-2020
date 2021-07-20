import React from 'react';
import {
  useQuery,
  useMutation,
} from "@apollo/client";
import classnames from 'classnames';

import Empty from 'components/Empty';
import SettingLoading from '../components/settingLoading';
import SettingListContainer from '../components/settingListContainer';
import ImapAdd from './imapAdd';
import ImapEdit from './imapEdit';

import {
  itemAttributesFullfillsString
} from '../components/helpers';

import {
  GET_IMAPS,
  TEST_IMAPS
} from './queries';

export default function IMAPsList( props ) {
  const {
    history,
    match
  } = props;

  const {
    data: imapsData,
    loading: imapsLoading,
    refetch: imapsRefetch
  } = useQuery( GET_IMAPS, {
    fetchPolicy: 'network-only'
  } );

  const [ testImaps ] = useMutation( TEST_IMAPS );

  // state
  const [ imapFilter, setImapFilter ] = React.useState( "" );
  const [ imapTesting, setImapTesting ] = React.useState( false );
  const [ wasRefetched, setWasRefetched ] = React.useState( false );

  if ( imapsLoading ) {
    return ( <SettingLoading match={match} /> );
  }

  const imaps = imapsData.imaps;

  const testIMAPs = () => {
    setImapTesting( true );
    testImaps();
  }

  const getStatusIcon = ( imap ) => {
    let color = 'red';
    let iconName = 'far fa-times-circle';
    if ( imap.active ) {
      if ( ( imapTesting && !wasRefetched ) || imap.currentlyTested ) {
        color = 'orange';
        iconName = 'fa fa-sync';
      } else if ( imap.working ) {
        color = 'green';
        iconName = 'far fa-check-circle';
      }
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
        <ImapAdd {...props} />
      }
      { match.params.id && match.params.id!=='add' && imaps.some((item)=>item.id===parseInt(match.params.id)) &&
        <ImapEdit {...{history, match}} />
      }
    </Empty>
  );

  const TestImapComponent = (
    <Empty>
      { !imapTesting &&
        <button
          disabled={ imapTesting }
          className="btn center-hor ml-auto"
          onClick={testIMAPs}
          >
          Test IMAPs
        </button>
      }
      { imapTesting &&
        <div className="center-hor ml-auto">
          Testing IMAPs...
        </div>
      }
      { imapTesting &&
        <button
          className="btn btn-primary center-hor ml-auto"
          onClick={() => {
            imapsRefetch().then(() => {
              setWasRefetched(true)
            });
          }}
          >
          Refetch
        </button>
      }
    </Empty>
  )

  return (
    <SettingListContainer
      header="IMAPs"
      filter={imapFilter}
      setFilter={setImapFilter}
      history={history}
      addURL="/helpdesk/settings/imaps/add"
      addLabel="IMAP"
      RightFilterComponent={TestImapComponent}
      RightSideComponent={RightSideComponent}
      >
      <table className="table table-hover">
        <thead>
          <tr className="clickable">
            <th>Title</th>
            <th>Host</th>
            <th>Username</th>
            <th>Order</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { imaps.filter((item) => itemAttributesFullfillsString(item, imapFilter, [ 'title', 'host', 'username', 'order' ])).map((imap) => (
            <tr
              key={imap.id}
              className={classnames (
                "clickable",
                {
                  "active": parseInt(match.params.id) === imap.id
                }
              )}
              onClick={()=>history.push(`/helpdesk/settings/imaps/${imap.id}`)}>
              <td style={{maxWidth: 100, overflow: 'hidden'}}>
                {imap.title}
              </td>
              <td style={{maxWidth: 100, overflow: 'hidden'}}>
                {imap.host}
              </td>
              <td style={{maxWidth: 100, overflow: 'hidden'}}>
                {imap.username}
              </td>
              <td>
                {imap.order}
              </td>
              <td>
                { getStatusIcon(imap) }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SettingListContainer>
  )
}