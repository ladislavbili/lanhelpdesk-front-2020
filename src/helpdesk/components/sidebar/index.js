import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import SettingsSidebar from './settingsSidebar';
import TasksSidebar from './tasksSidebar';
import settings from 'configs/constants/settings';
import classnames from 'classnames';
import {
  getMyData
} from 'helperFunctions';

export default function Sidebar( props ) {
  //data & queries
  const {
    history,
    sidebarOpen,
    setSidebarOpen
  } = props;


  const currentUser = getMyData();

  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  const canSeeSettings = settings.some( s => accessRights[ s.value ] );
  const showSettings = history.location.pathname.includes( 'settings' ) && canSeeSettings;

  return (
    <div className={classnames({"sidebar": sidebarOpen || showSettings, "sidebar-compressed": !sidebarOpen && !showSettings})}>
       <div className="scrollable fit-with-header">
         {!showSettings &&
           <TasksSidebar {...props} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen}/>
         }
         {showSettings &&
           <SettingsSidebar {...props}/>
         }
       </div>
     </div>
  );
}