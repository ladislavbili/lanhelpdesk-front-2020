import React from 'react';
import {
  useQuery,
  useMutation,
} from "@apollo/client";

import {
  Button
} from 'reactstrap';
import {
  GET_IMAPS,
  TEST_IMAPS
} from './querries';
import ImapAdd from './imapAdd';
import ImapEdit from './imapEdit';
import Loading from 'components/loading';



export default function IMAPsList( props ) {
  // state
  const [ imapFilter, setImapFilter ] = React.useState( "" );
  const [ imapTesting, setImapTesting ] = React.useState( false );

  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading
  } = useQuery( GET_IMAPS );
  const IMAPS = ( loading || !data ? [] : data.imaps );
  const [ testImaps ] = useMutation( TEST_IMAPS );

  const testIMAPs = () => {
    setImapTesting( true );
    testImaps();
  }

  const getStatusIcon = ( imap ) => {
    let color = 'red';
    let iconName = 'far fa-times-circle';
    if ( imap.active ) {
      if ( imapTesting || imap.currentlyTested ) {
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

  return (
    <div className="content">
      <div className="row m-0 p-0 taskList-container">
        <div className="col-lg-4">
          <div className="commandbar">
            <div className="search-row">
              <div className="search">
                <button className="search-btn" type="button">
                  <i className="fa fa-search" />
                </button>
                <input
                  type="text"
                  className="form-control search-text"
                  value={imapFilter}
                  onChange={ (e) => setImapFilter(e.target.value) }
                  placeholder="Search"
                  />
              </div>
            </div>
            <Button
              className="btn-link center-hor"
              onClick={()=>history.push('/helpdesk/settings/imaps/add')}>
              <i className="fa fa-plus p-l-5 p-r-5"/> IMAP
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <div className="row">
                <h2 className=" p-l-10 p-b-10 ">
                  IMAPs
                </h2>
                { !imapTesting &&
                  <Button
                    disabled={ imapTesting }
                    className="btn-primary center-hor ml-auto"
                    onClick={testIMAPs}
                    >
                    Test IMAPs
                  </Button>
                }
                { imapTesting &&
                  <div className="center-hor ml-auto">
                    Testing IMAPs...
                  </div>
                }
              </div>
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
                  {IMAPS.filter((item)=>
                    item.title.toLowerCase().includes(imapFilter.toLowerCase())||
                    item.host.toLowerCase().includes(imapFilter.toLowerCase())||
                    item.port.toString().toLowerCase().includes(imapFilter.toLowerCase())||
                    item.user.toLowerCase().includes(imapFilter.toLowerCase())
                  ).map((imap)=>
                  <tr
                    key={imap.id}
                    className={"clickable" + (match.params.id === imap.id ? " active":"")}
                    onClick={()=>history.push('/helpdesk/settings/imaps/'+imap.id)}>
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
                      {
                        getStatusIcon(imap)
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="commandbar">
          </div>
          {
            match.params.id && match.params.id==='add' && <ImapAdd {...props} />
        }
        {
          loading && match.params.id && match.params.id!=='add' && <Loading />
      }
      {
        match.params.id && match.params.id!=='add' && IMAPS.some((item)=>item.id===parseInt(match.params.id)) && <ImapEdit {...{history, match}} />
    }
  </div>
</div>
</div>
  );
}