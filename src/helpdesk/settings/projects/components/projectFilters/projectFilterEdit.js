import React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import {
  updateArrayItem,
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";
import Empty from 'components/Empty';
import ProjectFilterForm from './projectFilterForm';

export default function ProjectFilterEdit( props ) {
  //props
  const {
    allGroups,
    allStatuses,
    allTaskTypes,
    allUsers,
    allCompanies,
    filter,
    updateFilter,
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
        {t('edit')}
      </button>
      <Modal isOpen={open}>
        <ModalHeader>
          {`${t('edit')} ${t('projectFilter').toLowerCase()}`}
        </ModalHeader>
        <ModalBody>
          <ProjectFilterForm
            allGroups={allGroups}
            allStatuses={allStatuses}
            allTaskTypes={allTaskTypes}
            allUsers={allUsers}
            allCompanies={allCompanies}
            edit
            isOpened={open}
            submit={(projectFilter) => updateFilter( projectFilter ) }
            filter={filter}
            closeModal={ () => setOpen(false) }
            />
        </ModalBody>
      </Modal>
    </Empty>
  );
}