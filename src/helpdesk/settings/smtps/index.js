import React from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import {Button } from 'reactstrap';
import SMTPAdd from './smtpAdd';
import SMTPEdit from './smtpEdit';
import Loading from 'components/loading';

export const GET_SMTPS = gql`
query {
  smtps {
    title
    id
    order
    host
    port
    username
    def
  }
}
`;

export default function SMTPsList(props){
    // state
    const [ SMTPFilter, setSMTPFilter ] = React.useState("");
    const [ smtpTesting, setSmtpTesting ] = React.useState(false);

    //data
    const { history, match } = props;
    const { data, loading, error } = useQuery(GET_SMTPS);
    const SMTPS = (loading || !data ? [] : data.smtps);

  const testSMTPs = () => {
    setSmtpTesting(true);
    /*firebase.auth().currentUser.getIdToken(true).then((token)=>{
      fetch(`${REST_URL}/test-smtps`,{
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          token
        }),
      })
    })*/
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
            <Button
              className="btn-link center-hor"
              onClick={()=>history.push('/helpdesk/settings/smtps/add')}>
              <i className="fa fa-plus p-l-5 p-r-5"/> SMTP
            </Button>
          </div>
          <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
            <div className="row">
              <h2 className=" p-l-10 p-b-10">
                SMTPs
              </h2>
              { false && props.role === 3 && !smtpTesting &&
                <Button
                  disabled={ props.role !== 3 || smtpTesting }
                  className="btn-primary center-hor ml-auto"
                  onClick={testSMTPs}
                  >
                  Test SMTPs
                </Button>
              }
              { false && props.role === 3 && smtpTesting &&
                <div className="center-hor ml-auto">
                  Testing SMTPs...
                </div>
              }
            </div>
            <table className="table table-hover">
              <thead>
                <tr className="clickable">
                  <th>Title</th>
                  <th>Host</th>
                  <th>Port</th>
                  <th>Username</th>
                  <th>Default</th>
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
                    className={"clickable" + (parseInt(match.params.id) === smtp.id ? " active":"")}
                    onClick={()=>history.push('/helpdesk/settings/smtps/'+smtp.id)}>
                    <td>
                      {smtp.title}
                    </td>
                    <td>
                      {smtp.host}
                    </td>
                    <td>
                      {smtp.port}
                    </td>
                    <td>
                      {smtp.username}
                    </td>
                    <td>
                      {smtp.def ? "Yes" : "No"}
                    </td>
                    <td>
                      {
                        smtp.working === false ?
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
          <div className="commandbar"></div>
          {
            match.params.id && match.params.id==='add' && <SMTPAdd {...props} />
          }
          {
            loading && match.params.id && match.params.id!=='add' && <Loading />
          }
          {
            match.params.id && match.params.id!=='add' && SMTPS.some((item)=>item.id===parseInt(match.params.id)) && <SMTPEdit {...{history, match}} />
          }
        </div>
      </div>
    </div>
  );
}
