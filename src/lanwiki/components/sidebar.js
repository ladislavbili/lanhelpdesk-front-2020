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

import FolderAdd from 'lanwiki/folders/add/modalButton';
import FolderEdit from 'lanwiki/folders/edit/modalButton';
import TagAdd from 'lanwiki/tags/add';
import TagEdit from 'lanwiki/tags/edit/modalButton';
import AddLanwikiPage from 'lanwiki/pages/add';

import folderIcon from 'scss/icons/folder.svg';
import tagIcon from 'scss/icons/tag.svg';

import classnames from "classnames";

import {
  useTranslation
} from "react-i18next";

import {
  setLSidebarTag,
  setLSidebarFolder,
} from 'apollo/localSchema/actions';
import {
  L_SIDEBAR_TAG,
  L_SIDEBAR_FOLDER,
} from 'apollo/localSchema/queries';
import {
  GET_TAGS,
  TAGS_SUBSCRIPTION,
} from 'lanwiki/tags/queries';

import {
  GET_FOLDERS,
  FOLDERS_SUBSCRIPTION,
} from 'lanwiki/folders/queries';

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
    data: sidebarTagData,
  } = useQuery( L_SIDEBAR_TAG );
  const {
    data: sidebarFolderData,
  } = useQuery( L_SIDEBAR_FOLDER );

  const {
    data: tagsData,
    loading: tagsLoading,
    refetch: tagsRefetch,
  } = useQuery( GET_TAGS, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( TAGS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tagsRefetch();
    }
  } );

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

  const [ showTags, setShowTags ] = React.useState( true );
  const [ showFolders, setShowFolders ] = React.useState( true );
  const [ showArchived, setShowArchived ] = React.useState( false );

  const tagId = sidebarTagData.lSidebarTag === null ? null : sidebarTagData.lSidebarTag.id;
  const folderId = sidebarFolderData.lSidebarFolder === null ? null : sidebarFolderData.lSidebarFolder.id;

  React.useEffect( () => {
    if ( !foldersLoading && match.params.folderID !== undefined ) {
      setLSidebarFolder( match.params.folderID === 'all' ? null : foldersData.lanwikiFolders.find( ( folder ) => folder.id === parseInt( match.params.folderID ) ) );
    }
  }, [ match.params.folderID, foldersLoading ] );

  if ( tagsLoading || foldersLoading ) {
    return ( <Loading /> );
  }

  const tags = tagsData.lanwikiTags;
  const folders = foldersData.lanwikiFolders;

  return (
    <div className="sidebar">
      <div className="scrollable fit-with-header">
        <AddLanwikiPage folderId={folderId} tagId={tagId} />
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
              <NavItem className={classnames("row full-width sidebar-item", { "active": window.location.pathname.includes( '/lanwiki/i/all' ) }) }>
                <span
                  className={ classnames("clickable sidebar-menu-item link", { "active": window.location.pathname.includes( '/lanwiki/i/all' ) }) }
                  onClick={() => { history.push('/lanwiki/i/all') }}
                  >
                  {t('allFolders')}
                </span>
              </NavItem>
              { folders.filter((folder) => !folder.archived ).map((folder) => (
                <NavItem key={folder.id} className={classnames("row full-width sidebar-item", { "active": parseInt(match.params.folderID) === folder.id }) }>
                  <span
                    className={ classnames("clickable sidebar-menu-item link", { "active": parseInt(match.params.folderID) === folder.id }) }
                    onClick={() => { history.push(`/lanwiki/i/${folder.id}`) }}
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
                  onClick={() => { setLSidebarTag(null) }}
                  >
                  {t('allTags')}
                </span>
              </NavItem>
              { tags.map((tag) => (
                <NavItem key={tag.id} className={classnames("row full-width sidebar-item", { "active": tagId === tag.id }) }>
                  <span
                    className={ classnames("clickable sidebar-menu-item link", { "active": tagId === tag.id }) }
                    onClick={() => { setLSidebarTag(tag) }}
                    >
                    {tag.title}
                  </span>
                  { tagId === tag.id &&
                    <TagEdit id={tag.id} />
                  }
                </NavItem>
              ))}
            </Empty>
          }
        </Nav>
        { showTags &&
          <TagAdd />
        }
        <hr className="m-l-15 m-r-15 m-t-15" />
        <Nav vertical>
          <div className="sidebar-label row clickable noselect" onClick={() => setShowArchived( !showArchived )}>
            <div>
              <i
                className="m-r-5 fa fa-archive"
                style={{
                  color: "#212121",
                  height: "17px",
                  marginBottom: "3px"
                }}
                />
              <Label className="clickable">
                {t('archived')}
              </Label>
            </div>
            <div className="ml-auto m-r-3">
              { showArchived && <i className="fas fa-chevron-up" /> }
              { !showArchived && <i className="fas fa-chevron-down" /> }
            </div>
          </div>
          { showArchived &&
            <Empty>
              { folders.filter((folder) => folder.archived ).map((folder) => (
                <NavItem key={folder.id} className={classnames("row full-width sidebar-item", { "active": parseInt(match.params.folderID) === folder.id }) }>
                  <span
                    className={ classnames("clickable sidebar-menu-item link", { "active": parseInt(match.params.folderID) === folder.id }) }
                    onClick={() => { history.push(`/lanwiki/i/${folder.id}`) }}
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
      </div>
    </div>
  );
}