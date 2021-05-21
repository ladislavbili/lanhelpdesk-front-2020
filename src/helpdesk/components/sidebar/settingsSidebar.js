import React from 'react';
import {
  useQuery
} from "@apollo/client";
import {
  Nav,
  NavItem
} from 'reactstrap';
import {
  Link
} from 'react-router-dom';
import classnames from 'classnames';
import settings from 'configs/constants/settings';
import {
  getMyData,
} from 'helperFunctions';

export default function SettingsSidebar( props ) {
  //data & queries
  const {
    location
  } = props;

  const currentUser = getMyData();
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  return (
    <Nav vertical>
				{settings.filter((setting) => accessRights[setting.value]).map((setting)=>
					<NavItem key={setting.link}>
						<Link className={classnames("sidebar-align", "sidebar-menu-item" , {"active" : location.pathname.includes(setting.link)})}
							to={{ pathname:'/helpdesk/settings/'+setting.link }}>{setting.title}</Link>
					</NavItem>
				)}
			</Nav>
  );
}