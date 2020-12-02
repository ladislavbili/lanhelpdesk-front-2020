import React from 'react';
import {
  Label
} from 'reactstrap';
import {
  timestampToString,
  getLocation,
} from 'helperFunctions';

export default function Attachments( props ) {
  const {
    history,
    errorMessage
  } = props;

  const getEditURL = () => {
    switch ( errorMessage.type ) {
      case 'smtp_email': {
        return `${getLocation(history)}/settings/smtps/${errorMessage.sourceId}`
      }
      default: {
        return getLocation( history );
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