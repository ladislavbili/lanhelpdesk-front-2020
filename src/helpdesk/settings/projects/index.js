import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from 'classnames';

import Empty from 'components/Empty';
import SettingLoading from '../components/settingLoading';
import SettingListContainer from '../components/settingListContainer';
import {
  itemAttributesFullfillsString
} from '../components/helpers';

import ProjectAdd from './projectAdd';
import ProjectEdit from './projectEdit';
import {
  useTranslation
} from "react-i18next";
import {
  GET_PROJECTS,
  PROJECTS_SUBSCRIPTION,
} from './queries';

export default function ProjectsList( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: projectsData,
    loading: projectsLoading,
    refetch: projectsRefetch,
  } = useQuery( GET_PROJECTS, {
    fetchPolicy: 'network-only'
  } );

  // state
  const [ projectFilter, setProjectFilter ] = React.useState( "" );

  useSubscription( PROJECTS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      projectsRefetch();
    }
  } );

  if ( projectsLoading ) {
    return ( <SettingLoading match={match} /> );
  }

  const projects = projectsData.projects;

  const getProjectStat = ( project ) => {
    let color = 'red';
    let text = t( 'no' );
    let iconName = 'far fa-times-circle';
    if ( project.right && project.right.projectWrite ) {
      color = 'green';
      text = t( 'yes' );
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

  const RightSideComponent = (
    <Empty>
      { match.params.id && match.params.id==='add' &&
        <ProjectAdd {...props}/>
      }
      { projectsLoading && match.params.id && match.params.id!=='add' &&
        <Loading />
      }
      { match.params.id && match.params.id!=='add' && projects.some((item) => item.id === parseInt(match.params.id)) &&
        <ProjectEdit {...{history, match}} setting />
      }
    </Empty>
  );

  return (
    <SettingListContainer
      header={t('projects')}
      filter={projectFilter}
      setFilter={setProjectFilter}
      history={history}
      addURL="/helpdesk/settings/projects/add"
      addLabel={t('project')}
      RightSideComponent={RightSideComponent}
      >
      <table className="table table-hover">
        <thead>
          <tr>
            <th>
              {t('title')}
            </th>
            <th>
              {t('access')}
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.filter((item) => itemAttributesFullfillsString(item, projectFilter, ['title']) )
            .map( (project) => (
              <tr key={project.id}
                className={classnames (
                  "clickable",
                  {
                    "active": parseInt(match.params.id) === project.id
                  }
                )}
                onClick={() => history.push(`/helpdesk/settings/projects/${project.id}`)}>
                <td>
                  { project.title }
                </td>
                <td>
                  { getProjectStat(project) }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </SettingListContainer>
  );
}