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
    <Modal isOpen={isOpen} className="repeat-form-container" >
      <ModalBody style={{ overflowY: 'visible' }}>
        { isOpen &&
          <RepeatLoader
            { ...props }
          />
        }
      </ModalBody>
    </Modal>
  );
}