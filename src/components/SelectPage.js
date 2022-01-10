import React from 'react';
import GeneralPopover from 'components/generalPopover';
import Empty from 'components/Empty';

import classnames from 'classnames';
import {
  useTranslation
} from "react-i18next";
import {
  getLocation,
  getMyData,
} from 'helperFunctions';

export default function PageHeader( props ) {

  const {
    history,
  } = props;
  const currentUser = getMyData();
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};
  const {
    t
  } = useTranslation();

  const [ open, setOpen ] = React.useState( false );
  let subpage = 0;

  if ( window.location.pathname.includes( '/helpdesk' ) ) {
    let subpage = 1;
  }
  if ( window.location.pathname.includes( '/lanwiki' ) ) {
    let subpage = 2;
  }

  return (
    <div className="width-270 page-header row">
      <GeneralPopover
        placement="bottom-start"
        className="overflow-auto max-height-200 min-width-0"
        target="page-select-popover"
        useLegacy
        reset={() => {}}
        submit={() => {}}
        open={ open }
        close={() => setOpen(false)}
        hideButtons
        >
        <div className="btn-group-vertical" data-toggle="buttons">
          <label className={classnames({'active':subpage === 1 || subpage === 0}, "btn btn-link text-left")}>
            <input type="radio" name="options" checked={ subpage === 1 } onChange={() => {history.push('/helpdesk/taskList/i/all'); setOpen(false); }}/>
            { t( 'tasks' ) }
          </label>
          <label className={classnames({'active':subpage === 2}, "btn btn-link text-left")}>
            <input type="radio" name="options" checked={subpage === 2} onChange={() => {history.push('/lanwiki/i/all'); setOpen(false); }}/>
            { t( 'lanwiki' ) }
          </label>
        </div>
      </GeneralPopover>
      <div className="lansystems-title">
        <button className="btn btn-link color-white center-hor" id="page-select-popover" onClick={ () => setOpen(true) } >
          <i className="m-r-15 fa fa-bars font-size-16-f"/>
        </button>
        <h1 className="center-hor clickable noselect" onClick={() => history.push('/helpdesk/taskList/i/all') }>LanHelpdesk</h1>
      </div>
    </div>
  );
}