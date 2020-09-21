import React from 'react';
import { useQuery } from "@apollo/react-hooks";
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
    monthly
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

const GET_EMAILS = gql`
query emails($task: Int!){
	emails(
		task: $task
	)  {
		id
		createdAt
    subject
    message
    user {
      id
      fullName
    }
    toEmails
  }
}
`;

const GET_MY_DATA = gql`
query {
  getMyData{
    id
    role {
      level
      accessRights {
        projects
        mailViaComment
        viewInternal
      }
    }
  }
}
`;

export default function TaskEditContainer(props){
  //data & queries
	const { match } = props;
  const { data, loading: userLoading } = useQuery(GET_MY_DATA);
  const { data: statusesData, loading: statusesLoading } = useQuery(GET_STATUSES);
  const { data: companiesData, loading: companiesLoading } = useQuery(GET_COMPANIES);
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: taskTypesData, loading: taskTypesLoading } = useQuery(GET_TASK_TYPES);
  const { data: tripTypesData, loading: tripTypesLoading } = useQuery(GET_TRIP_TYPES);
  const { data: tagsData, loading: tagsLoading } = useQuery(GET_TAGS);
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS);
  const { data: tasksData, loading: tasksLoading } = useQuery(GET_ALL_TASKS);
//  const { data: emailsData, loading: emailsLoading } = useQuery(GET_EMAILS, { variables: {task: parseInt(match.params.taskID)}, options: { fetchPolicy: 'network-only' }});

  const currentUser = data ? data.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

	const loading = userLoading || statusesLoading || companiesLoading || usersLoading || taskTypesLoading || tripTypesLoading || tagsLoading || projectsLoading || tasksLoading/* || emailsLoading*/ ;

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
      emails={/*emailsData && emailsData.emails ? emailsData.emails : */[]}
			inModal={false}
			 />
	 );

}
