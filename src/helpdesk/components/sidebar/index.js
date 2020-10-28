import React from 'react';
import {
  useQuery,
  //  useApolloClient
} from "@apollo/client";

import SettingsSidebar from './settingsSidebar';
import TasksSidebar from './tasksSidebar';
import settings from 'configs/constants/settings';
import {
  GET_MY_DATA
} from './querries';

export default function Sidebar( props ) {
  //data & queries
  const {
    history
  } = props;
  const {
    data
  } = useQuery( GET_MY_DATA );

  let currentUser = {};

  if ( data ) {
    currentUser = data.getMyData;
  }

  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  const canSeeSettings = settings.some( s => accessRights[ s.value ] );
  const showSettings = history.location.pathname.includes( 'settings' ) && canSeeSettings;

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