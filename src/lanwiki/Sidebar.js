import React from 'react';
import {
  Button,
  NavItem,
  Nav,
  Modal
} from 'reactstrap';
import {
  NavLink as Link
} from 'react-router-dom';

import TagAdd from './Tags/TagAdd';
import TagEdit from './Tags/TagEdit';
import filterIcon from 'scss/icons/filter.svg';

import classnames from "classnames";

import {
  tags,
} from './constants';

export default function Sidebar( props ) {

  const {
    history,
    location,
    match
  } = props;

  const [ tagEdit, setTagEdit ] = React.useState( null );
  const [ openAdd, setOpenAdd ] = React.useState( false );
  const [ openEdit, setOpenEdit ] = React.useState( false );

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

        <div className="sidebar-label">
          <img
            className="m-r-5"
            style={{
              color: "#212121",
              height: "17px",
              marginBottom: "3px"
            }}
            src={filterIcon}
            alt="Filter icon not found"
            />
          Filters
        </div>

        <Nav vertical>
          <NavItem className={classnames("row full-width sidebar-item", { "active": 'all' === match.params.listID }) }>
            <span
              className={ classnames("clickable sidebar-menu-item link", { "active": 'all' === match.params.listID }) }
              onClick={() => {
                history.push(`/lanwiki/i/all`)
              }}>
              ALL
            </span>
          </NavItem>

          {
            tags
            .sort((item1,item2) => item1.title.toLowerCase() > item2.title.toLowerCase() ? 1 : -1)
            .map((item)=>
            <NavItem key={item.id} className={classnames("row full-width sidebar-item", { "active": item.id === parseInt(match.params.listID) }) }>
              <span
                className={ classnames("clickable sidebar-menu-item link", { "active": item.id === parseInt(match.params.listID) }) }
                onClick={() => {
                  history.push(`/lanwiki/i/${item.id}`)
                }}>
                {item.title}
              </span>
              {
                 item.id === parseInt(match.params.listID)  &&
                <div
                  className={classnames("sidebar-icon", "clickable", {"active" : item.id === parseInt(match.params.listID)})}
                  onClick={() => {
                    setTagEdit(item);
                    setOpenEdit(true);
                  }}
                  >
                  <i className="fa fa-cog"/>
                </div>
              }
            </NavItem>
          )
        }

      </Nav>

      <hr className='m-t-10 m-b-5 m-l-15 m-r-15'/>

      <button
        className="btn sidebar-btn"
        disabled={false}
        onClick={(e) => {
          e.preventDefault();
          createNewNote();
        }}
        >
        <i className="fa fa-plus"/>
        Note
      </button>

      <div className='p-l-15 p-r-15'>

        <NavItem className="row full-width">
          <Button
            className='btn-link'
            onClick={ () => history.push(`/lanwiki/tag-add`) }
            >
            <i className="fa fa-plus" />
            Tag
          </Button>
        </NavItem>

        {
          match.params.listID &&
          match.params.listID !== 'all' &&

          <NavItem className="row full-width">
            <Button
              className='btn-link'
              onClick={ () => history.push(`/lanwiki/tag-edit/${match.params.listID}`) }
              >
              <i className="fa fa-cog" />
              Tag
            </Button>
          </NavItem>
        }
      </div>
    </div>
  </div>
  );
}