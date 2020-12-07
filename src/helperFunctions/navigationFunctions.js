import React from 'react';

export const getLocation = ( history ) => {
  let url = history.location.pathname;
  if ( url.includes( 'cmdb' ) ) {
    return '/cmdb';
  } else if ( url.includes( 'helpdesk' ) ) {
    return '/helpdesk';
  } else if ( url.includes( 'passmanager' ) ) {
    return '/passmanager';
  } else if ( url.includes( 'expenditures' ) ) {
    return '/expenditures';
  } else if ( url.includes( 'projects' ) ) {
    return '/projects';
  } else if ( url.includes( 'reports' ) ) {
    return '/reports';
  } else if ( url.includes( 'monitoring' ) ) {
    return '/monitoring';
  } else {
    return '/lanwiki';
  }
}