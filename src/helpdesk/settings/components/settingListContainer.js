import React from 'react';

export default function UserListContainer( props ) {

  const {
    header,
    filter,
    setFilter,
    noAdd,
    history,
    addURL,
    addLabel,
    RightFilterComponent,
    RightSideComponent,
    children
  } = props;

  return (
    <div className="content">
      <div className="row m-0 p-0 taskList-container">
        <div className="col-lg-4">
          <div className="p-t-20 p-r-10 p-l-10 scroll-visible fit-with-header">
            <div className="row m-b-20">
              <h2>
                {header}
              </h2>
            </div>
            <div className="search-row p-b-10">
              <div className="search">
                <button className="search-btn" type="button">
                  <i className="fa fa-search" />
                </button>
                <input
                  type="text"
                  className="form-control search-text"
                  value={filter}
                  onChange={(e)=>setFilter(e.target.value)}
                  placeholder="Search"
                  />
              </div>
            </div>
            <div className="row p-b-10">
              { !noAdd &&
                <button
                  className="btn-link center-hor"
                  onClick={()=> history.push(addURL)}>
                  <i className="fa fa-plus p-l-5 p-r-5"/>
                  {addLabel}
                </button>
              }
              {RightFilterComponent && RightFilterComponent}
            </div>
            {children}
          </div>
        </div>
        <div className="col-lg-8">
          {RightSideComponent}
        </div>
      </div>
    </div>
  )
}