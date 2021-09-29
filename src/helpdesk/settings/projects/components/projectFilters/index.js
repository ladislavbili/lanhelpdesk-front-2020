import React from 'react';
import {
  useQuery,
} from "@apollo/client";
import {
  updateArrayItem,
  sortBy,
} from 'helperFunctions';
import ProjectFilterEdit from './projectFilterEdit';
import ProjectFilterAdd from './projectFilterAdd';
import {
  getGroupsProblematicAttributes,
} from '../../helpers';
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
    filters,
    addFilter,
    deleteFilter,
    updateFilter,
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
            <th>Order</th>
            <th width="100">Action</th>
          </tr>
        </thead>
        <tbody>
          { sortBy(filters,[{ asc: true, key: 'order' }]).map((projectFilter) => (
            <tr key={projectFilter.id}>
              <td>
                {projectFilter.title}
              </td>
              <td>
                {projectFilter.description}
              </td>
              <td>
                { getGroupsProblematicAttributes( groups, projectFilter ).length !== 0 && <i className="text-danger font-size-16 m-l-10 m-t-10 fa fa-exclamation-circle" /> }
                { groups.filter((group) => projectFilter.groups.some((groupId) => group.id === groupId )).map((group) => group.title ).join(', ') }
              </td>
              <td>
                { projectFilter.order }
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
                  updateFilter={ (updatedFilter) => updateFilter( updatedFilter ) }
                  />
                <button
                  className="btn btn-link-red"
                  onClick={() => deleteFilter(projectFilter.id)}
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
        addProjectFilter={ addFilter }
        />
    </div>
  );
}