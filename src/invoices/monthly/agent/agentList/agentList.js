import React from 'react';

import {
  timestampToString,
} from 'helperFunctions';

import {
  useTranslation
} from "react-i18next";

export default function AgentList( props ) {
  const {
    agents,
    fromDate,
    toDate,
    setAgent,
  } = props;

  const {
    t
  } = useTranslation();

  return (
    <div className="m-t-10 m-b-20">
      <table className="table bkg-white row-highlight">
        <thead>
          <tr>
            <th>{t('agent')}</th>
            <th>{t('works')}</th>
            <th>{t('trips')}</th>
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
              <td colSpan="6">{`${t('noAgents')} ${t('inDateRange').toLowerCase()} ${timestampToString(fromDate.valueOf())} - ${timestampToString(toDate.valueOf())}`}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
}