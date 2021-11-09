import React from 'react';

import {
  timestampToString,
} from 'helperFunctions';

export default function AgentList( props ) {
  const {
    agents,
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
          { agents.map( (agent) => (
            <tr
              key={agent.user.id}
              className="clickable"
              onClick={() => setAgent(agent.user) }
              >
              <td>{`${agent.user.fullName} (${agent.user.email})`}</td>
              <td>{agent.works}</td>
              <td>{agent.trips}</td>
            </tr>
          )) }
          { agents.length === 0 &&
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