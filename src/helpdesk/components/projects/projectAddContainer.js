import React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader
} from 'reactstrap';
import ProjectAdd from 'helpdesk/settings/projects/projectAdd';
import {
  setProject,
} from 'apollo/localSchema/actions';

export default function ProjecAddContainer( props ) {
  //props
  const {
    open,
    closeModal
  } = props;

  return (
    <div>
      <Modal isOpen={open}  >
        <ModalHeader><i className="fa fa-plus" />Project</ModalHeader>
        <ModalBody>
          <ProjectAdd
            closeModal = {closeModal}
            />
        </ModalBody>
    </Modal>
  </div>
  );
}