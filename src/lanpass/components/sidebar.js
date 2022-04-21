import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import {
  Button,
  NavItem,
  Nav,
  Label,
} from 'reactstrap';
import Empty from 'components/Empty';
import Loading from 'components/loading';
import FolderAdd from 'lanpass/folders/add/modalButton';
import FolderEdit from 'lanpass/folders/edit/modalButton';
import AddPassword from 'lanpass/passwords/add';

import folderIcon from 'scss/icons/folder.svg';

import classnames from "classnames";

import {
  useTranslation
} from "react-i18next";

import {
  setPSidebarFolder,
} from 'apollo/localSchema/actions';

import {
  P_SIDEBAR_FOLDER,
} from 'apollo/localSchema/queries';

import {
  GET_FOLDERS,
  FOLDERS_SUBSCRIPTION,
} from 'lanpass/folders/queries';


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
    data: sidebarFolderData,
  } = useQuery( P_SIDEBAR_FOLDER );

  const {
    data: foldersData,
    loading: foldersLoading,
    refetch: foldersRefetch,
  } = useQuery( GET_FOLDERS, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( FOLDERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      foldersRefetch();
    }
  } );

  const [ showFolders, setShowFolders ] = React.useState( true );
  const [ showArchived, setShowArchived ] = React.useState( false );

  const folderId = sidebarFolderData.pSidebarFolder === null ? null : sidebarFolderData.pSidebarFolder.id;

  React.useEffect( () => {
    if ( !foldersLoading && match.params.folderID !== undefined ) {
      setPSidebarFolder( match.params.folderID === 'all' ? null : foldersData.passFolders.find( ( folder ) => folder.id === parseInt( match.params.folderID ) ) );
    }
  }, [ match.params.folderID, foldersLoading ] );

  if ( foldersLoading ) {
    return ( <Loading /> );
  }

  const folders = foldersData.passFolders;
  
  return (
    <div className="sidebar">
      <div className="scrollable fit-with-header">
    <AddPassword folderId={folderId} />
        <hr className="m-l-15 m-r-15 m-t-15" />
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
              <NavItem className={classnames("row full-width sidebar-item", { "active": window.location.pathname.includes( '/lanpass/i/all' ) }) }>
                <span
                  className={ classnames("clickable sidebar-menu-item link", { "active": window.location.pathname.includes( '/lanpass/i/all' ) }) }
                  onClick={() => { history.push('/lanpass/i/all'); setPSidebarFolder(null);}}
                  >
                  {t('allFolders')}
                </span>
              </NavItem>
              { folders.map((folder) => (
                <NavItem key={folder.id} className={classnames("row full-width sidebar-item", { "active": parseInt(match.params.folderID) === folder.id }) }>
                  <span
                    className={ classnames("clickable sidebar-menu-item link", { "active": parseInt(match.params.folderID) === folder.id }) }
                    onClick={() => { history.push(`/lanpass/i/${folder.id}`); setPSidebarFolder(folder)}}
                    >
                    {folder.title}
                  </span>
                  { folder.myRights.manage && parseInt(match.params.folderID) === folder.id &&
                    <FolderEdit id={folder.id} folders={folders} history={history} />
                 }
                </NavItem>
              ))}
            </Empty>
          }
        </Nav>
        { showFolders &&
          <FolderAdd />
        }
        <hr className="m-l-15 m-r-15 m-t-15" />

      </div>
    </div>
  );
}
