import React from 'react';

import Loading from 'components/loading';

import {
  timestampToString,
} from 'helperFunctions';

export default function CompanyList( props ) {
  const {
    users,
    fromDate,
    toDate,
    setAgent,
  } = props;


  return (
    <div className="m-t-10 m-b-20">
      <table className="table bkg-white row-highlight">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Works</th>
            <th>Trips</th>
          </tr>
        </thead>
        <tbody>
          { users.slice(0,30).map( (user) => (
            <tr
              key={user.id}
              className="clickable"
              onClick={() => setAgent(user) }
              >
              <td>{`${user.fullName} (${user.email})`}</td>
              <td>{(Math.random()*100).toFixed(1)}</td>
              <td>{(Math.random()*100).toFixed(1)}</td>
            </tr>
          )) }
          { users.length !== 0 &&
            <tr
              key="no-items"
              >
              <td colSpan="6">{`No agents in date range ${timestampToString(fromDate.valueOf())} - ${timestampToString(toDate.valueOf())}`}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
}