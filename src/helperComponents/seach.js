import React from 'react';

export default ({ children }) => {
    console.log(children);
    return (
      <div className="search-row">
        <div className="search">
          <button className="search-btn" type="button">
            <i className="fa fa-search" />
          </button>
          {children}
        </div>
      </div>
    )
  }
