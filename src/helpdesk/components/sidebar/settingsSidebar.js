import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {Nav, NavItem} from 'reactstrap';
import {Link} from 'react-router-dom';
import classnames from 'classnames';
import {testing} from 'helperFunctions';
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

export default function SettingsSidebar(props) {
  //data & queries
  const { history, match, location } = props;
  const { data, loading } = useQuery(GET_MY_DATA);

  const currentUser = data ? data.getMyData : {};
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
