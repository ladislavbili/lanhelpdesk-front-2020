import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Loading from 'components/loading';
import TaskEdit from './taskEdit';

import { toSelArr } from 'helperFunctions';

import { GET_TASK_TYPES } from 'helpdesk/settings/taskTypes';
import { GET_TRIP_TYPES } from 'helpdesk/settings/tripTypes';


const GET_ALL_TASKS = gql`
query {
  allTasks{
    id
    title
    closeDate
		company {
			id
		}
  }
}
`;

const GET_STATUSES = gql`
query {
  statuses {
    title
    id
    order
    color
    action
  }
}
`;

const GET_TAGS = gql`
query {
  tags {
    title
    id
    order
    color
  }
}
`;

const GET_PROJECTS = gql`
query {
  projects {
    title
    id
    lockedRequester
    milestones{
      id
      title
    }
    projectRights {
			read
			write
			delete
			internal
			admin
			user {
				id
			}
		}
    def {
			assignedTo {
				def
				fixed
				show
				value {
					id
				}
			}
			company {
				def
				fixed
				show
				value {
					id
				}
			}
			overtime {
				def
				fixed
				show
				value
			}
			pausal {
				def
				fixed
				show
				value
			}
			requester {
				def
				fixed
				show
				value {
					id
				}
			}
			status {
				def
				fixed
				show
				value {
					id
				}
			}
			tag {
				def
				fixed
				show
				value {
					id
				}
			}
			taskType {
				def
				fixed
				show
				value {
					id
				}
			}
    }
  }
}
`;

const GET_COMPANIES = gql`
query {
  companies {
    title
    id
    dph
    taskWorkPausal
    pricelist {
      id
      title
      materialMargin
      prices {
        type
        price
        taskType {
          id
        }
        tripType {
          id
        }
      }
    }
  }
}
`;

const GET_USERS = gql`
query {
  users{
    id
    email
    role {
      level
    }
    company {
      id
    }
  }
}
`;

const GET_MY_DATA = gql`
query {
  getMyData{
    id
    role {
      accessRights {
        projects
      }
    }
  }
}
`;

export default function TaskEditContainer(props){
  //data & queries
	const { match, history } = props;
  const { data, loading: userLoading } = useQuery(GET_MY_DATA);
  const { data: statusesData, loading: statusesLoading } = useQuery(GET_STATUSES, { options: { fetchPolicy: 'network-only' }});
  const { data: companiesData, loading: companiesLoading } = useQuery(GET_COMPANIES, { options: { fetchPolicy: 'network-only' }});
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, { options: { fetchPolicy: 'network-only' }});
  const { data: taskTypesData, loading: taskTypesLoading } = useQuery(GET_TASK_TYPES, { options: { fetchPolicy: 'network-only' }});
  const { data: tripTypesData, loading: tripTypesLoading } = useQuery(GET_TRIP_TYPES, { options: { fetchPolicy: 'network-only' }});
  const { data: tagsData, loading: tagsLoading } = useQuery(GET_TAGS, { options: { fetchPolicy: 'network-only' }});
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS, { options: { fetchPolicy: 'network-only' }});
  const { data: tasksData, loading: tasksLoading } = useQuery(GET_ALL_TASKS, { options: { fetchPolicy: 'network-only' }});

  const currentUser = data ? data.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

	const loading = userLoading || statusesLoading || companiesLoading || usersLoading || taskTypesLoading || tripTypesLoading || tagsLoading || projectsLoading || tasksLoading ;

	if (loading) {
		return (<Loading />);
	}

	return (
		<TaskEdit
			{...props}
			currentUser={currentUser}
			accessRights={accessRights}
			statuses={toSelArr(statusesData.statuses)}
			companies={toSelArr(companiesData.companies)}
			users={toSelArr(usersData.users, 'email')}
			taskTypes={toSelArr(taskTypesData.taskTypes)}
			tripTypes={toSelArr(tripTypesData.tripTypes)}
			allTags={toSelArr(tagsData.tags)}
			projects={toSelArr(projectsData.projects)}
			tasks={tasksData.allTasks}
			inModal={false}
			 />
	 );

}
