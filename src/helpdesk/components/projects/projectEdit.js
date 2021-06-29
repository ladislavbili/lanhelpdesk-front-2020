import React from 'react';

import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import {
  useQuery
} from "@apollo/client";
import Loading from 'components/loading';
import ProjectEdit from 'helpdesk/settings/projects/projectEdit';
import AccessDenied from 'components/accessDenied';
import {
  setProject,
} from 'apollo/localSchema/actions';
import {
  toSelArr,
} from 'helperFunctions';
import {
  dashboard,
} from 'configs/constants/sidebar';
import {
  GET_MY_PROJECTS,
} from 'helpdesk/settings/projects/queries';

export default function ProjectEditFull( props ) {
  const {
    match
  } = props;

  const {
    data: myProjectsData,
    loading: myProjectsLoading,
    refetch: refetchMyProjects,
  } = useQuery( GET_MY_PROJECTS );

  const [ opened, setOpened ] = React.useState( false );

  if ( myProjectsLoading ) {
    return <Loading />
  }

  const currentProject = toSelArr( myProjectsData.myProjects.map( ( project ) => ( {
      ...project,
      id: project.project.id,
      title: project.project.title
    } ) ) )
    .find( ( projectData ) => projectData.id === parseInt( match.params.projectID ) )
  //state

  if ( !currentProject ) {
    return ( <AccessDenied /> );
  }

  return (
    <ProjectEdit
      projectID={ currentProject.id }
      projectDeleted={() => {
        setProject(dashboard);
        refetchMyProjects();
      }}
      closeModal={(editedProject, rights) => {
        history.back();
      }}
      />
  );
}