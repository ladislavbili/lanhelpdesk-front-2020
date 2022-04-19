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
    subpage = 1;
  }
  if ( window.location.pathname.includes( '/lanwiki' ) ) {
    subpage = 2;
  }
  if ( window.location.pathname.includes( '/cmdb' ) ) {
    subpage = 3;
  }
  if ( window.location.pathname.includes( '/lanpass' ) ) {
    subpage = 4;
  }

  const selectSubpageTitle = () => {
    let subpageTitle = t( 'lanhelpdesk' );
    if ( subpage === 2 ) {
      subpageTitle = t( 'lanwiki' );
    } else if ( subpage === 3 ) {
      subpageTitle = t( 'cmdb' );
    } else if ( subpage === 4 ) {
      subpageTitle = t( 'lanpass' );
    }
    return subpageTitle;
  }
  const selectSubpageLink = () => {
    let subpageLink = '/helpdesk/taskList/i/all';
    if ( subpage === 2 ) {
      subpageLink = '/lanwiki/i/all';
    } else if ( subpage === 3 ) {
      subpageLink = '/cmdb/i/all';
    } else if ( subpage === 4 ) {
      subpageLink = '/lanpass/i/all';
    }
    return subpageLink;
  }

  return (
    <div className="width-270 page-header row">
      { (accessRights.lanwiki || accessRights.pass || accessRights.cmdb) &&
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
              { t( 'lanhelpdesk' ) }
            </label>
            { accessRights.lanwiki &&
              <label className={classnames({'active':subpage === 2}, "btn btn-link text-left")}>
                <input type="radio" name="options" checked={subpage === 2} onChange={() => {history.push('/lanwiki/i/all'); setOpen(false); }}/>
                { t( 'lanwiki' ) }
              </label>
            }
            { accessRights.cmdb &&
              <label className={classnames({'active':subpage === 3}, "btn btn-link text-left")}>
                <input type="radio" name="options" checked={subpage === 3} onChange={() => {history.push('/cmdb/i/all'); setOpen(false); }}/>
                { t( 'cmdb' ) }
              </label>
            }
            {/* FIXME: true prec */ }
            { (true || accessRights.pass) &&
              <label className={classnames({'active':subpage === 4}, "btn btn-link text-left")}>
                <input type="radio" name="options" checked={subpage === 4} onChange={() => {history.push('/lanpass/i/all'); setOpen(false); }}/>
                { t( 'lanpass' ) }
              </label>
            }
          </div>
        </GeneralPopover>
      }
      <div className="lansystems-title">
        { (accessRights.lanwiki || accessRights.lanpass || accessRights.cmdb) &&
          <button className="btn btn-link color-white center-hor" id="page-select-popover" onClick={ () => setOpen(true) } >
            <i className="m-r-15 fa fa-th font-size-16-f"/>
          </button>
        }
        <h1 className="center-hor clickable noselect" onClick={() => history.push(selectSubpageLink()) }>{selectSubpageTitle()}</h1>
      </div>
    </div>
  );
}
