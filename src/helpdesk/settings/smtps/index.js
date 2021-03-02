import React from 'react';
import {
  useQuery,
  useMutation
} from "@apollo/client";

import SMTPAdd from './smtpAdd';
import SMTPEdit from './smtpEdit';
import Loading from 'components/loading';
import classnames from 'classnames';
import {
  GET_SMTPS,
  TEST_SMTPS
} from './queries';

export default function SMTPsList( props ) {
  // state
  const [ SMTPFilter, setSMTPFilter ] = React.useState( "" );
  const [ smtpTesting, setSmtpTesting ] = React.useState( false );

  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading
  } = useQuery( GET_SMTPS );
  const SMTPS = ( loading || !data ? [] : data.smtps );
  const [ testSmtps ] = useMutation( TEST_SMTPS );
  const testSMTPs = () => {
    setSmtpTesting( true );
    testSmtps();
  }

  const getStatusIcon = ( smtp ) => {
    let color = 'red';
    let iconName = 'far fa-times-circle';
    if ( smtpTesting || smtp.currentlyTested ) {
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
                  value={SMTPFilter}
                  onChange={ (e) => setSMTPFilter(e.target.value) }
                  placeholder="Search"
                  />
              </div>
            </div>
            <button
              className="btn-link center-hor"
              onClick={()=>history.push('/helpdesk/settings/smtps/add')}>
              <i className="fa fa-plus p-l-5 p-r-5"/> SMTP
            </button>
          </div>
          <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
            <div className="row">
              <h2 className=" p-l-10 p-b-10">
                SMTPs
              </h2>
              { !smtpTesting &&
                <Button
                  disabled={ smtpTesting }
                  className="btn-primary center-hor ml-auto"
                  onClick={testSMTPs}
                  >
                  Test SMTPs
                </Button>
              }
              { smtpTesting &&
                <div className="center-hor ml-auto">
                  Testing SMTPs...
                </div>
              }
            </div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Host</th>
                  <th>Port</th>
                  <th>Username</th>
                  <th>Def</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {SMTPS.filter((item)=>
                  item.title.toLowerCase().includes(SMTPFilter.toLowerCase())||
                  item.host.toLowerCase().includes(SMTPFilter.toLowerCase())||
                  item.port.toString().toLowerCase().includes(SMTPFilter.toLowerCase())||
                  item.user.toLowerCase().includes(SMTPFilter.toLowerCase())
                ).map((smtp)=>
                  <tr
                    key={smtp.id}
                    className={classnames (
                      "clickable",
                      {
                        "active": parseInt(match.params.id) === smtp.id
                      }
                    )}
                    onClick={()=>history.push('/helpdesk/settings/smtps/'+smtp.id)}>
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
                      {smtp.def ? "Yes" : "No"}
                    </td>
                    <td>
                      {getStatusIcon(smtp)}
                    </td>
                  </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-8">
          {
            match.params.id && match.params.id==='add' && <SMTPAdd {...props} />
          }
          {
            loading && match.params.id && match.params.id!=='add' && <Loading />
          }
          {
            match.params.id && match.params.id!=='add' && SMTPS.some((item)=>item.id===parseInt(match.params.id)) && <SMTPEdit {...{history, match}} />
          }
          {
            !loading && !match.params.id && <div className="commandbar"></div>
          }
        </div>
      </div>
    </div>
  );
}