import React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';

import RepeatLoader from './repeatFormLoader';

export default function RepeatFormModal( props ) {
  const {
    isOpen
  } = props;

  return (
    <Modal isOpen={isOpen} className="task-add-container" >
      <ModalBody>
        { isOpen &&
          <RepeatLoader
            { ...props }
          />
        }
      </ModalBody>
    </Modal>
  );
}