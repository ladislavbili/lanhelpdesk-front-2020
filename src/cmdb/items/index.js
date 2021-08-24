import React from 'react';
import {
  Button
} from 'reactstrap';
import classnames from "classnames";

import {
  items
} from '../constants';

export default function ItemList( props ) {

  const {
    match,
    history
  } = props;

  const [ orderBy, setOrderBy ] = React.useState( 'title' );
  const [ ascending, setAscending ] = React.useState( true );

  const [ filterData, setFilterData ] = React.useState( [ "", "", "", "", "", "", "" ] );
  const [ search, setSearch ] = React.useState( '' );

  const getSortValue = ( item ) => {
    switch ( orderBy ) {
      case 'IP':
        return item.IP.reduce( ( ( ac, item ) => ac += item + ' ' ), '' );
      case 'company':
        return item.status ? item.status.title : null;
      case 'title':
        return item.title;
      case 'status':
        return item.status ? item.status.title : null;
      default:

    }
  }

  const clearFilter = () => {
    if ( window.confirm( "Are you sure you want to clear the filter?" ) ) {
      setFilterData( [] );
    }
  }

  return (
    <div className="content-page row">
      <div className="content" style={{width: "100%"}}>

      <div className="task-list-commandbar p-l-30 p-r-19">
        <div className="center-hor">
          <h2>{'ALL'}</h2>
        </div>
      </div>

      <div className="full-width scroll-visible fit-with-header-and-commandbar task-container">

        <div className="d-flex h-60 flex-row m-l-30">
        <div className="search-row">
          <div className="search btn-distance">
            <input
              type="text"
              className="form-control search-text"
              value={search}
              onChange={(e)=> setSearch(e.target.value)}
              placeholder="Search"
              />
            <button className="search-btn" type="button">
              <i className="fa fa-search" />
            </button>
          </div>
          <button
            className="btn-link center-hor"
            >
            Global
          </button>
        </div>


        <div className="ml-auto m-r-30">
          <div className="align-items-center flex-row">
          <div className="btn-distance">
            Sort by
          </div>

          <select
            value={orderBy}
            className="invisible-select font-bold text-highlight"
            onChange={(e)=>setOrderBy(e.target.value)}>
            {
              [{value:'title',label:'Title'},{value:'company',label:'Company'},{value:'IP',label:'IP'},{value:'status',label:'Status'}].map((item,index) => (
                <option value={item.value} key={index}>{item.label}</option>
              ))
            }
          </select>
          {
            !ascending &&
            <button type="button" className="btn-link center-hor" onClick={()=>{}}>
              <i className="fas fa-arrow-up" />
            </button>
          }
          {
            ascending &&
            <button type="button" className="btn-link center-hor" onClick={()=>{}}>
              <i className="fas fa-arrow-down" />
            </button>
          }
        </div>
        </div>

      </div>


        <table className="table">
          <thead>
            <tr>
              <th width="5%">ID</th>
              <th>Type</th>
              <th>Title</th>
              <th>Function</th>
              <th>IP Address</th>
              <th>Location</th>
              <th>Status</th>
              <th width="2%"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                filterData.map( (filter, i) => (
                  <th key={i}>
                    <input
                      type="text"
                      value={filterData[i]}
                      className="form-control"
                      style={{fontSize: "12px", marginRight: "10px"}}
                      onChange={(e) => {}}
                      />
                  </th>
                ))
              }
              <th key="action" width="30px">
                <button type="button" className="btn-link" onClick={() => {}}>
                  <i
                    className="fas fa-times commandbar-command-icon m-l-8 text-highlight"
                    />
                </button>
              </th>
            </tr>
            {
              items.map((item)=> (
                <tr key={item.id} className="clickable" onClick={()=>history.push('/cmdb/i/'+match.params.itemCategoryID+'/'+item.id)}>
                  <td>{item.id}</td>
                  <td>{item.type}</td>
                  <td>{item.title}</td>
                  <td>{item.func}</td>
                  <td className="ips">{item.ip.map((item2)=><span key={item2}>{item2}  </span>)}</td>
                  <td>{item.location}</td>
                  <td className="status"><span>{item.status}</span></td>
                  <td></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  	</div>
  );
}