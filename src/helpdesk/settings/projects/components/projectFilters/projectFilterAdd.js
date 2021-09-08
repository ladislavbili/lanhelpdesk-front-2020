import React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import Empty from 'components/Empty';
import ProjectFilterForm from './projectFilterForm';

let fakeID = -1;
export default function ProjectFilterAdd( props ) {
  //props
  const {
    allGroups,
    allStatuses,
    allTaskTypes,
    allUsers,
    allCompanies,
    setProjectFilters,
    projectFilters,
  } = props;

  const [ open, setOpen ] = React.useState( false );

  return (
    <Empty>
      <button
        className="btn btn-link btn-distance"
        onClick={ () => setOpen(true) }
        >
        <i className="fa fa-plus" />
        Project filter
      </button>
      <Modal isOpen={open}>
        <ModalHeader>
          Add project filter
        </ModalHeader>
        <ModalBody>
          <ProjectFilterForm
            submit={(projectFilter) => setProjectFilters([ ...projectFilters, { id: fakeID--, ...projectFilter } ]) }
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