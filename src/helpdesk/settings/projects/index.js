import React from 'react';
import {
  useQuery
} from "@apollo/client";

import {
  Button
} from 'reactstrap';
import ProjectAdd from './projectAdd';
import ProjectEdit from './projectEdit';
import Loading from 'components/loading';
import {
  GET_PROJECTS,
  GET_MY_DATA
} from './querries';

export default function ProjectsList( props ) {
  // state
  const [ projectFilter, setProjectFilter ] = React.useState( "" );

  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading
  } = useQuery( GET_PROJECTS );
  const {
    data: myData,
    loading: myDataLoading
  } = useQuery( GET_MY_DATA );

  const PROJECTS = ( loading ? [] : data.projects );
  const currentUser = myDataLoading ? {
    id: null
  } : myData.getMyData;

  const getProjectStat = ( project ) => {
    let color = 'red';
    let text = 'No';
    let iconName = 'far fa-times-circle';
    if ( project.projectRights.some( ( right ) => right.user.id === currentUser.id ) ) {
      color = 'green';
      text = 'Yes';
      iconName = 'far fa-check-circle';
    }
    return (
      <span style={{color}}>
        <i
          className={iconName}
          />
        {` ${text}`}
      </span>
    )
  }

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
                  value={projectFilter}
                  onChange={(e)=>setProjectFilter(e.target.value)}
                  placeholder="Search"
                  />
              </div>
            </div>
            <Button
              className="btn-link center-hor"
              onClick={()=>history.push('/helpdesk/settings/projects/add')}>
              <i className="fa fa-plus p-l-5 p-r-5"/> Project
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible scrollable fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10 ">
                Project names
              </h2>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>
                      Title
                    </th>
                    <th>
                      ACL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PROJECTS.filter((item)=>item.title.toLowerCase().includes(projectFilter.toLowerCase())).map((project)=>
                    <tr key={project.id}
                      className={"clickable" + (parseInt(match.params.id) === project.id ? " active":"")}
                      onClick={()=>history.push('/helpdesk/settings/projects/'+project.id)}>
                      <td>
                        {project.title}
                      </td>
                      <td>
                        { getProjectStat(project) }
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
              match.params.id && match.params.id==='add' && <ProjectAdd {...props}/>
          }
          {
            loading && match.params.id && match.params.id!=='add' && <Loading />
        }
        {
          match.params.id && match.params.id!=='add' && PROJECTS.some((item)=>item.id===parseInt(match.params.id)) && <ProjectEdit {...{history, match}} />
      }
    </div>
  </div>
</div>
  );
}