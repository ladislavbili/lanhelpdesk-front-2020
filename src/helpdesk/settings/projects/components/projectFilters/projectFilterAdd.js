import React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import Empty from 'components/Empty';
import ProjectFilterForm from './projectFilterForm';
import {
  useTranslation
} from "react-i18next";

export default function ProjectFilterAdd( props ) {
  //props
  const {
    allGroups,
    allStatuses,
    allTaskTypes,
    allUsers,
    allCompanies,
    addProjectFilter
  } = props;

  const {
    t
  } = useTranslation();

  const [ open, setOpen ] = React.useState( false );

  return (
    <Empty>
      <button
        className="btn btn-link btn-distance"
        onClick={ () => setOpen(true) }
        >
        <i className="fa fa-plus" />
        {t('projectFilter')}
      </button>
      <Modal isOpen={open}>
        <ModalHeader>
          {`${t('add')} ${t('projectFilter').toLowerCase()}`}
        </ModalHeader>
        <ModalBody>
          <ProjectFilterForm
            submit={(projectFilter) => addProjectFilter(projectFilter) }
            closeModal={ () => setOpen(false) }
            allGroups={allGroups}
            allStatuses={allStatuses}
            allTaskTypes={allTaskTypes}
            allUsers={allUsers}
            allCompanies={allCompanies}
            />
        </ModalBody>
      </Modal>
    </Empty>
  );
}