import React from 'react';

import {
  NavItem,
  Nav
} from 'reactstrap';

import {
  NavLink as Link
} from 'react-router-dom';

import settings from 'configs/constants/settings'

export default function Sidebar( props ) {
  //data
  const {
    history,
    canSeeVykazy
  } = props;

  const showSettings = history.location.pathname.includes( 'settings' );

  return (
    <div className="sidebar">
      <div className="scrollable fit-with-header">
        {
          !showSettings &&
          canSeeVykazy &&
          <div>
            <div>
              <Nav vertical>
                <NavItem>
                  <Link
                    className="sidebar-menu-item"
                    to={{ pathname: `/reports/monthly/companies` }}>Firmy
                  </Link>
                </NavItem>
                <NavItem>
                  <Link
                    className=" sidebar-menu-item"
                    to={{ pathname: `/reports/monthly/requester` }}>Agenti
                  </Link>
                </NavItem>
              </Nav>
              <hr className="m-b-10 m-t-10"/>
              <Nav vertical>
                <NavItem>
                  <Link
                    className="sidebar-menu-item"
                    to={{ pathname: `/reports/company_invoices` }}>Uložené firmy
                  </Link>
                </NavItem>
              </Nav>
            </div>
          </div>
        }
        {
          showSettings &&
          <Nav vertical>
            {settings.map((setting)=>
              <NavItem key={setting.link}>
                <Link className="sidebar-menu-item"
                  to={{ pathname:'/reports/settings/'+setting.link }}>{setting.title}
                </Link>
              </NavItem>
            )}
          </Nav>
        }
      </div>
    </div>
  );
}