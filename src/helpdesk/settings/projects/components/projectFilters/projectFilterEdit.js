import React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import {
  updateArrayItem,
} from 'helperFunctions';
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

  const [ open, setOpen ] = React.useState( false );

  return (
    <Empty>
      <button
        className="btn btn-link btn-distance"
        onClick={ () => setOpen(true) }
        >
        EDIT
      </button>
      <Modal isOpen={open}>
        <ModalHeader>
          Edit project filter
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