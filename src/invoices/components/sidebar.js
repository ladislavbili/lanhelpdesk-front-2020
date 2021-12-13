import React from 'react';

import {
  NavItem,
  Nav
} from 'reactstrap';

import {
  NavLink as Link
} from 'react-router-dom';
import {
  useTranslation
} from "react-i18next";

export default function Sidebar( props ) {
  //data
  const {
    history,
  } = props;

  const {
    t
  } = useTranslation();

  return (
    <div className="sidebar">
      <div className="scrollable fit-with-header">
        <div>
          <div>
            <Nav vertical>
              <NavItem>
                <Link
                  className="sidebar-menu-item"
                  to={{ pathname: `/helpdesk` }}
                  >
                  <i className="fa fa-chevron-left m-r-5" />
                  {t('backToTasks')}
                </Link>
              </NavItem>
              <NavItem>
                <Link
                  className="sidebar-menu-item"
                  to={{ pathname: `/invoices/monthly/companies` }}>
                  {t('companies')}
                </Link>
              </NavItem>
              <NavItem>
                <Link
                  className=" sidebar-menu-item"
                  to={{ pathname: `/invoices/monthly/agents` }}>
                  {t('agents')}
                </Link>
              </NavItem>
            </Nav>
            <hr className="m-b-10 m-t-10"/>
             <Nav vertical>
               <NavItem>
                 <Link
                   className="sidebar-menu-item"
                   to={{ pathname: `/invoices/invoices` }}>
                   {t('invoices')}
                 </Link>
               </NavItem>
             </Nav>
          </div>
        </div>
      </div>
    </div>
  );
}