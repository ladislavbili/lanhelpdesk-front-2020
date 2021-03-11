import React, {
  Component
} from 'react';
import {
  Button
} from 'reactstrap';
import classnames from "classnames";

export default function Search( props ) {
  const {
    link,
    generalSearch,
    setGeneralSearch,
  } = props;

  const [ search, setSearch ] = React.useState( generalSearch );

  return (
    <div
      className={classnames(
        {"m-l-30": !link.includes("settings")},
        "search-row"
      )}
      >
      <div className="search">
        <input
          type="text"
          className="form-control search-text"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          onKeyPress={(e)=>{
            if( e.key === 'Enter' ){
              setGeneralSearch(search)
            }
          }}
          placeholder="Search in id and task title"
          />
        <button className="search-btn" type="button">
          <i className="fa fa-search flip" />
        </button>
      </div>
    </div>
  );
}