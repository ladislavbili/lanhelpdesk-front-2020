import React from 'react';
import {
  useQuery
} from "@apollo/react-hooks";
import gql from "graphql-tag";

import {
  Button
} from 'reactstrap';
import ImapAdd from './imapAdd';
import ImapEdit from './imapEdit';
import Loading from 'components/loading';

export const GET_IMAPS = gql `
query {
  imaps {
    title
    id
    order
    host
    port
    def
    username
  }
}
`;

export default function IMAPsList( props ) {
  // state
  const [ imapFilter, setImapFilter ] = React.useState( "" );

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
                <h2 className=" p-l-10 p-b-10 ">
    							IMAPs
    						</h2>
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
                        <td>
                          {imap.title}
                        </td>
                        <td>
                          {imap.host}
                        </td>
                        <td>
                          {imap.username}
                        </td>
                        <td>
                          {imap.order}
                        </td>
                        <td>
                          {
                            imap.working === false ?
                            <i style={{color:'red'}}
                              className="far fa-times-circle"
                              />
                            :
                            <i style={{color:'green'}}
                              className="far fa-check-circle"
                              />
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