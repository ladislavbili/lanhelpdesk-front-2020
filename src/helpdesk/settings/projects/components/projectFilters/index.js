import React from 'react';
import {
  useQuery,
} from "@apollo/client";
import {
  updateArrayItem,
} from 'helperFunctions';
import ProjectFilterEdit from './projectFilterEdit';
import ProjectFilterAdd from './projectFilterAdd';
import {
  GET_TASK_TYPES,
} from 'helpdesk/settings/taskTypes/queries';
import {
  GET_BASIC_USERS,
} from 'helpdesk/settings/users/queries';
import {
  GET_BASIC_COMPANIES,
} from 'helpdesk/settings/companies/queries';

let fakeID = -1;

export default function ProjectFilters( props ) {
  //data
  const {
    groups,
    statuses,
    projectFilters,
    setProjectFilters,
  } = props;

  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES );

  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_BASIC_USERS );

  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES );

  const [ addOpen, setsetAddOpen ] = React.useState( false );

  const dataLoading = (
    taskTypesLoading ||
    usersLoading ||
    companiesLoading
  );

  return (
    <div>
      <table className="table bkg-white m-t-5 m-b-30">
        <thead>
          <tr>
            <th>Project filter name</th>
            <th>Description</th>
            <th>Groups</th>
            <th width="100">Action</th>
          </tr>
        </thead>
        <tbody>
          { projectFilters.map((projectFilter) => (
            <tr key={projectFilter.id}>
              <td>
                {projectFilter.title}
              </td>
              <td>
                {projectFilter.description}
              </td>
              <td>
                {groups.filter((group) => projectFilter.groups.some((groupId) => group.id === groupId )).map((group) => group.title ).join(', ')}
              </td>
              <td>
                <ProjectFilterEdit
                  allGroups={ groups }
                  allStatuses={ statuses }
                  allTaskTypes={ dataLoading ? [] : taskTypesData.taskTypes }
                  allUsers={ dataLoading ? [] : usersData.basicUsers }
                  allCompanies={ dataLoading ? [] : companiesData.basicCompanies }
                  disabled={ dataLoading }
                  filter={ projectFilter }
                  updateFilter={ (updatedFilter) => setProjectFilters( updateArrayItem(projectFilters, updatedFilter ) ) }
                  />
                <button
                  className="btn btn-link-red"
                  onClick={() => setProjectFilters(projectFilters.filter((projectFilter1) => projectFilter1.id !== projectFilter.id ))}
                  >
                  <i className="fa fa-times" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProjectFilterAdd
        allGroups={ groups }
        allStatuses={ statuses }
        allTaskTypes={ dataLoading ? [] : taskTypesData.taskTypes }
        allUsers={ dataLoading ? [] : usersData.basicUsers }
        allCompanies={ dataLoading ? [] : companiesData.basicCompanies }
        disabled={ dataLoading }
        setProjectFilters={ setProjectFilters }
        projectFilters={ projectFilters }
        />
    </div>
  );
}