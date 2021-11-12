import React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import TaskLoader from './index';

export default function TaskModalEdit( props ) {
  const {
    opened,
    closeModal,
    taskID,
    fromInvoice,
  } = props;

  if ( !opened ) {
    return null;
  }

  return (
    <Modal isOpen={opened} className="task-add-container">
      <ModalBody>
        <TaskLoader
          closeModal={closeModal}
          inModal
          taskID={taskID}
          fromInvoice={fromInvoice === true}
          />
      </ModalBody>
    </Modal>
  )
}