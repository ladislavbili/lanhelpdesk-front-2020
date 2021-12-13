import React from 'react';

import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import {
  GET_PROJECT,
} from 'apollo/localSchema/queries';
import {
  useQuery
} from "@apollo/client";
import ProjectEdit from 'helpdesk/settings/projects/projectEdit';
import {
  useTranslation
} from "react-i18next";

export default function ProjectEditContainer( props ) {
  const {
    closeModal,
    projectDeleted
  } = props;

  const {
    t
  } = useTranslation();

  //state
  const [ opened, setOpened ] = React.useState( false );
  const {
    data: projectData,
    loading: projectLoading
  } = useQuery( GET_PROJECT );

  return (
    <div className='p-l-15 p-r-15'>
      <button
        className='btn-link p-0'
        onClick={() => setOpened(true)}
        >
        <i className="fa fa-cog"/>
        {t('project')}
      </button>
      <Modal isOpen={opened}>
        <ModalHeader>
          {`${t('edit')} ${t('project').toLowerCase()}`}
        </ModalHeader>
        <ModalBody>
          { !projectLoading &&
            <ProjectEdit
              projectID={ projectData.localProject.id }
              projectDeleted={projectDeleted}
              closeModal={(editedProject, rights) => {
                closeModal(editedProject, rights);
                setOpened(false);
              }}
              />
          }
        </ModalBody>
      </Modal>
    </div>
  );
}