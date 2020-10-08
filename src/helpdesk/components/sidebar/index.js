import React from 'react';
import { useQuery, useApolloClient  } from "@apollo/react-hooks";
import gql from "graphql-tag";

import SettingsSidebar from './settingsSidebar';
import TasksSidebar from './tasksSidebar';
import settings from 'configs/constants/settings';

const GET_MY_DATA = gql`
query {
  getMyData{
    id
    role {
      accessRights {
        publicFilters
        users
        companies
        pausals
        projects
        statuses
        units
        prices
        suppliers
        tags
        invoices
        roles
        taskTypes
        tripTypes
        imaps
        smtps
      }
    }
  }
}
`;

export default function Sidebar(props) {
  //data & queries
  const { history } = props;
  const { data } = useQuery(GET_MY_DATA);

  let currentUser = {};

  if (data) {
    currentUser = data.getMyData;
  }

  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  const canSeeSettings = settings.some(s => accessRights[s.value]);
  const showSettings = history.location.pathname.includes('settings') && canSeeSettings;

    return (
     <div className="sidebar">
       <div className="scrollable fit-with-header">
         {!showSettings &&
           <TasksSidebar {...props}/>
         }
         {showSettings &&
           <SettingsSidebar {...props}/>
         }
       </div>
     </div>
    );
  }
