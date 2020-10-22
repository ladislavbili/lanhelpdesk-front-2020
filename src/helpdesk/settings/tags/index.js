import React from 'react';
import {
  useQuery
} from "@apollo/react-hooks";

import {
  Button
} from 'reactstrap';
import TagAdd from './tagAdd';
import TagEdit from './tagEdit';
import Loading from 'components/loading';
import {
  orderArr
} from 'helperFunctions';

import {
  GET_TAGS
} from './querries';

export default function TagsList( props ) {
  // state
  const [ tagFilter, setTagFilter ] = React.useState( "" );

  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading
  } = useQuery( GET_TAGS );
  const TAGS = ( loading || !data ? [] : orderArr( data.tags ) );

  return (
    <div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <div className="commandbar">
              <div className="search-row">
                <div className="search">
                  <button className="search-btn" type="button">
                    <i className="fa fa-search" />
                  </button>
                  <input
                    type="text"
                    className="form-control search-text"
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=>history.push('/helpdesk/settings/tags/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Tag
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10 ">
  							Tags
  						</h2>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th></th>
                    <th> Order </th>
                  </tr>
                </thead>
                <tbody>
                  {TAGS.filter((item)=>item.title.toLowerCase().includes(tagFilter.toLowerCase())).map((tag)=>
                    <tr
                      key={tag.id}
                      className={"clickable" + (parseInt(match.params.id) === tag.id ? " active":"")}
                      onClick={()=>history.push('/helpdesk/settings/tags/'+tag.id)}>
                      <td>
                        {tag.title}
                      </td>
                      <td>
                        {tag.order}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="commandbar"></div>
            {
              match.params.id && match.params.id==='add' && <TagAdd {...props} />
            }
            {
              loading && match.params.id && match.params.id!=='add' && <Loading />
            }
            {
              match.params.id && match.params.id!=='add' && TAGS.some((item)=>item.id===parseInt(match.params.id)) && <TagEdit  {...{history, match}} />
            }
          </div>
        </div>
      </div>
  )
}