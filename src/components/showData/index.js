import React from 'react';
import ColumnList from './columnList';
import TableList from './tableList';
import {
  localFilterToValues
} from 'helperFunctions';

import moment from 'moment';

export default function ShowDataContainer( props ) {
  const {
    data,
    layout,
    orderByValues,
    orderBy,
    ascending,
    filterBy,
    generalSearch,
    itemID,
    Edit,
  } = props;

  const filterDataFunc = () => {
    return data.filter( ( item ) => {
        if ( generalSearch === "" ) {
          return true;
        }
        let filterString = "";
        filterBy.forEach( ( value ) => {
          if ( !item[ value.value ] ) {
            return;
          }
          if ( value.type === 'object' ) {
            if ( value.value === "statusX" ) {
              //status specific disabled
            } else {
              filterString += item[ value.value ].title + " ";
            }
          } else if ( value.type === 'text' ) {
            filterString += item[ value.value ] + " ";
          } else if ( value.type === 'int' ) {
            filterString += item[ value.value ] + " ";
          } else if ( value.type === 'list' ) {
            filterString += item[ value.value ].reduce( value.func, '' ) + " ";
          } else if ( value.type === 'date' ) {
            filterString += moment( item[ value.value ] ) + " ";
          } else if ( value.type === 'user' ) {
            filterString += item[ value.value ].email + ' ' + item[ value.value ].fullName + " ";
          }
        } );
        return filterString.toLowerCase()
          .includes( generalSearch.toLowerCase() );
      } )
      .sort( ( item1, item2 ) => {
        const val1 = getSortValue( item1 );
        const val2 = getSortValue( item2 );
        const returnVal = ascending ? -1 : 1;
        if ( val1 === null ) {
          return returnVal * -1;
        } else if ( val2 === null ) {
          return returnVal;
        }
        if ( val1 > val2 ) {
          return returnVal;
        } else if ( val1 < val2 ) {
          return returnVal * -1
        }
        if ( item1.important && !item2.important ) {
          return -1;
        } else if ( !item1.important && item2.important ) {
          return 1;
        }
        return 0;
      } );
  }

  const getSortValue = ( item ) => {
    let value = orderByValues.find( ( val ) => val.value === orderBy );
    if ( value.type === 'object' ) {
      if ( value.value === "status" ) {
        return item[ value.value ] ? ( 100 - item[ value.value ].order ) : null;
      }
      return item[ value.value ] ? item[ value.value ].title.toLowerCase() : null;
    } else if ( value.type === 'text' ) {
      return item[ value.value ].toLowerCase();
    } else if ( value.type === 'int' ) {
      return item[ value.value ];
    } else if ( value.type === 'list' ) {
      return item[ value.value ].reduce( value.func, '' )
        .toLowerCase();
    } else if ( value.type === 'date' ) {
      return parseInt( item[ value.value ] ? item[ value.value ] : null );
    } else if ( value.type === 'user' ) {
      return ( item[ value.value ].fullName )
        .toLowerCase();
    }
  }

  return (
    <div className="content-page">
      <div className="content" style={{ paddingTop: 0 }}>
        <div className="row m-0">
          { layout === 0 &&
            <div className='col-xl-12'>
              <ColumnList
                {...props}
                data={filterDataFunc()}
                />
            </div>
          }

          { layout === 1 &&
            <div className="flex" >
              {itemID && <Edit {...props} />}
              {!itemID &&
                <TableList
                  {...props}
                  data={filterDataFunc()}
                  />
              }
            </div>
          }
        </div>
      </div>
    </div>
  );
}