import React from 'react';

export function ListenToProp(props){
	//data
	const { prop } = props;

  React.useEffect( () => {
      console.log(prop);
  }, [prop]);

		return null;
}

const Search = ({ children }) => {
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
