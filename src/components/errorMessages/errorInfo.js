import React from 'react';
import {
  Label
} from 'reactstrap';
import {
  timestampToString
} from 'helperFunctions';

export default function Attachments( props ) {
  const {
    history,
    errorMessage
  } = props;

  const getLocation = () => {
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

  const getEditURL = () => {
    switch ( errorMessage.type ) {
      case 'smtps': {
        return `${getLocation()}/settings/smtps/${errorMessage.sourceId}`
      }
      case 'imaps': {
        return `${getLocation()}/settings/imaps/${errorMessage.sourceId}`
      }
      default: {
        return getLocation();
      }
    }
  }

  const error = errorMessage;
  return (
    <div>
      <div className="commandbar"></div>
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        <div>
          <Label>Type:</Label>
          {` ${error.type}`}
        </div>
        <div>
          <Label>Created at:</Label>
          {` ${timestampToString(parseInt(error.createdAt))} ${error.user ? "by " + error.user.email : ""}`}
        </div>
        <div>
          <Label>Source of the error:</Label>
          {` ${error.source}`}
        </div>
        {
          error.sourceID !== null &&
          <div>
            <Label>Related ID:</Label>
            {` ${error.sourceId} `}
            <Label className="clickable" onClick={ ()=> history.push(getEditURL()) }>Open related item</Label>
          </div>
        }
        <div>
          <Label>Error message:</Label>
          {` ${error.errorMessage}`}
        </div>
      </div>
    </div>
  );
}