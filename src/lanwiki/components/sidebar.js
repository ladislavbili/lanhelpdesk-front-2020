import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import {
  Button,
  NavItem,
  Nav,
  Modal,
  Label,
} from 'reactstrap';
import {
  NavLink as Link
} from 'react-router-dom';
import Empty from 'components/Empty';

import TagAdd from 'lanwiki/tags/add';
import TagEdit from 'lanwiki/tags/edit';
import folderIcon from 'scss/icons/folder.svg';
import tagIcon from 'scss/icons/tag.svg';

import classnames from "classnames";

import {
  useTranslation
} from "react-i18next";

import {
  tags,
} from 'lanwiki/constants';
import {
  setLSidebarTagId,
  setLSidebarFolderId,
} from 'apollo/localSchema/actions';
import {
  L_SIDEBAR_TAG_ID,
  L_SIDEBAR_FOLDER_ID,
} from 'apollo/localSchema/queries';

export default function Sidebar( props ) {

  const {
    history,
    location,
    match
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: sidebarTagIdData,
  } = useQuery( L_SIDEBAR_TAG_ID );
  const {
    data: sidebarFolderIdData,
  } = useQuery( L_SIDEBAR_FOLDER_ID );

  const [ showTags, setShowTags ] = React.useState( true );
  const [ showFolders, setShowFolders ] = React.useState( true );
  //OLD
  const [ tagEdit, setTagEdit ] = React.useState( null );
  const [ openAdd, setOpenAdd ] = React.useState( false );
  const [ openEdit, setOpenEdit ] = React.useState( false );

  const tagId = sidebarTagIdData.lSidebarTagId;
  const folderId = sidebarFolderIdData.lSidebarFolderId;

  React.useEffect( () => {
    setLSidebarFolderId( match.params.filterID === 'all' ? null : parseInt( match.params.filterID ) );
  }, [ match.params.filterID ] );

  const toggleAdd = () => {
    setOpenAdd( !openAdd );
  }

  const toggleEdit = () => {
    setOpenEdit( !openEdit );
  }

  const createNewNote = () => {
    let start = window.location.pathname.indexOf( "/i/" ) + 3;
    let id = window.location.pathname.substring( start );
    let end = id.indexOf( "/" );
    if ( end !== -1 ) {
      id = id.substring( 0, end );
    }
  }

  return (
    <div className="sidebar">
      <div className="scrollable fit-with-header">
        <Nav vertical>
          <div className="sidebar-label row clickable noselect" onClick={() => setShowFolders( !showFolders )}>
            <div>
              <img
                className="m-r-5"
                style={{
                  color: "#212121",
                  height: "17px",
                  marginBottom: "3px"
                }}
                src={folderIcon}
                alt="Filter icon not found"
                />
              <Label className="clickable">
                {t('folders')}
              </Label>
            </div>
            <div className="ml-auto m-r-3">
              { showFolders && <i className="fas fa-chevron-up" /> }
              { !showFolders && <i className="fas fa-chevron-down" /> }
            </div>
          </div>
          { showFolders &&
            <Empty>
              <NavItem className={classnames("row full-width sidebar-item", { "active": window.location.pathname.includes( '/lanwiki/i/all' ) }) }>
                <span
                  className={ classnames("clickable sidebar-menu-item link", { "active": window.location.pathname.includes( '/lanwiki/i/all' ) }) }
                  onClick={() => { history.push('/lanwiki/i/all') }}
                  >
                  {t('allFolders')}
                </span>
              </NavItem>
            </Empty>
          }
        </Nav>
        { showFolders &&
          <button
            className='btn-link p-l-15'
            onClick={() => {
            }}
            >
            <i className="fa fa-plus"/>
            {t('folder')}
          </button>
        }
        <hr className="m-l-15 m-r-15 m-t-15" />

        <Nav vertical>
          <div className="sidebar-label row clickable noselect" onClick={() => setShowTags( !showTags )}>
            <div>
              <img
                className="m-r-5"
                style={{
                  color: "#212121",
                  height: "17px",
                  marginBottom: "3px"
                }}
                src={tagIcon}
                alt="Tag icon not found"
                />
              <Label className="clickable">
                {t('tags')}
              </Label>
            </div>
            <div className="ml-auto m-r-3">
              { showTags && <i className="fas fa-chevron-up" /> }
              { !showTags && <i className="fas fa-chevron-down" /> }
            </div>
          </div>
          { showTags &&
            <Empty>
              <NavItem className={classnames("row full-width sidebar-item", { "active": tagId === null }) }>
                <span
                  className={ classnames("clickable sidebar-menu-item link", { "active": tagId === null }) }
                  onClick={() => { setLSidebarTagId(null) }}
                  >
                  {t('allTags')}
                </span>
              </NavItem>
            </Empty>
          }
        </Nav>
        { showTags &&
          <button
            className='btn-link p-l-15'
            onClick={() => {
            }}
            >
            <i className="fa fa-plus"/>
            {t('tag')}
          </button>
        }
        <hr className="m-l-15 m-r-15 m-t-15 m-b-15" />
        <Nav>
          <NavItem className={classnames("row full-width sidebar-item", { "active": window.location.pathname.includes( '/lanwiki/archive' ) }) }>
            <span
              className={ classnames("clickable sidebar-menu-item link", { "active": window.location.pathname.includes( '/lanwiki/archive' ) }) }
              onClick={() => { history.push('/lanwiki/archive') }}
              >
              {t('archived')}
            </span>
          </NavItem>
        </Nav>
      </div>
    </div>
  );
}