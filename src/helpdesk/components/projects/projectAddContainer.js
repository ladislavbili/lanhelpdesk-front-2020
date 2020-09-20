import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import ProjectAdd from 'helpdesk/settings/projects/projectAdd';

export default function ProjecAddContainer(props){
  //props
  const { open } = props;

return (
  <div>
      <Modal isOpen={open}  >
        <ModalHeader>Add project</ModalHeader>
        <ModalBody>
          <ProjectAdd {...props}/>
        </ModalBody>
    </Modal>
  </div>
  );
}
